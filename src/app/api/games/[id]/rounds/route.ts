import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const startTime = Date.now()
	let id: string = ''
	try {
		id = (await params).id

		const body = await request.json()
		const { teamId, playerName, words, sessionId } = body

		if (!teamId || !playerName || !words || !sessionId) {
			return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
		}

		// Валидация данных
		if (typeof teamId !== 'number') {
			return NextResponse.json({ error: 'teamId must be a number' }, { status: 400 })
		}

		if (typeof playerName !== 'string' || playerName.trim().length === 0) {
			return NextResponse.json({ error: 'playerName is required' }, { status: 400 })
		}

		if (!Array.isArray(words) || words.length === 0) {
			return NextResponse.json({ error: 'words array is required' }, { status: 400 })
		}

		for (const word of words) {
			if (typeof word.wordId !== 'number' || typeof word.guessed !== 'boolean') {
				return NextResponse.json({ error: 'Invalid word format' }, { status: 400 })
			}
		}

		const game = await prisma.game.findUnique({
			where: { id },
			include: {
				teams: {
					include: { players: { orderBy: { order: 'asc' } } },
					orderBy: { order: 'asc' },
				},
			},
		})

		if (!game) {
			return NextResponse.json({ error: 'Game not found' }, { status: 404 })
		}

		if (game.sessionId !== sessionId) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const guessedCount = words.filter((w: { guessed: boolean }) => w.guessed).length
		const skippedCount = words.filter((w: { guessed: boolean }) => !w.guessed).length
		const scoreEarned = guessedCount - (game.penaltySkip ? skippedCount : 0)

		const team = game.teams.find(t => t.id === teamId)
		
		if (!team) {
			return NextResponse.json({ error: 'Team not found' }, { status: 404 })
		}

		const newTeamScore = Math.max(0, team.score + scoreEarned)

		const numTeams = game.teams.length
		const nextTeamIndex = (game.currentTeamIndex + 1) % numTeams
		const nextRoundNumber = nextTeamIndex === 0 ? game.currentRoundNumber + 1 : game.currentRoundNumber

		const newUsedWordIds = words.map((w: { wordId: number }) => w.wordId)

		let gameFinished = false
		let winnerId: number | undefined

		if (game.winScore > 0) {
			const updatedTeams = game.teams.map(t => (t.id === teamId ? { ...t, score: newTeamScore } : t))
			const isEndOfCycle = nextTeamIndex === 0

			if (isEndOfCycle) {
				const qualifiedTeams = updatedTeams.filter(t => t.score >= game.winScore)

				if (qualifiedTeams.length > 0) {
					const winner = qualifiedTeams.reduce((best, t) => (t.score > best.score ? t : best))
					gameFinished = true
					winnerId = winner.id
				}
			}
		}

		const result = await prisma.$transaction(async tx => {
			// 1. Создать раунд с словами
			const round = await tx.round.create({
				data: {
					roundNumber: game.currentRoundNumber,
					teamId,
					gameId: id,
					playerName,
					scoreEarned,
					words: {
						create: words.map((w: { wordId: number; guessed: boolean }) => ({
							wordId: w.wordId,
							guessed: w.guessed,
						})),
					},
				},
				select: { id: true, roundNumber: true, scoreEarned: true },
			})

			// 2. Обновить счет команды
			await tx.team.update({
				where: { id: teamId },
				data: {
					score: newTeamScore,
					currentPlayerIndex: (team.currentPlayerIndex + 1) % team.players.length,
				},
			})

			// 3. Обновить состояние игры
			await tx.game.update({
				where: { id },
				data: {
					currentTeamIndex: gameFinished ? game.currentTeamIndex : nextTeamIndex,
					currentRoundNumber: gameFinished ? game.currentRoundNumber : nextRoundNumber,
					status: gameFinished ? 'FINISHED' : 'IN_PROGRESS',
					usedWordIds: { push: newUsedWordIds },
				},
			})

			return { round, teamScore: newTeamScore, gameFinished, winnerId, nextTeamIndex, nextRoundNumber }
		})

		const duration = Date.now() - startTime
		return NextResponse.json(result)
	} catch (error) {
		const duration = Date.now() - startTime
		console.error(`[POST /api/games/${id || 'unknown'}/rounds] error after ${duration}ms:`, error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
