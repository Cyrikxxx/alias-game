import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const startTime = Date.now()
	try {
		const { id } = await params

		const body = await request.json()
		const { teamId, playerName, words } = body

		console.log(`[POST /api/games/${id}/rounds] started, teamId=${teamId}, words=${words.length}`)

		if (!teamId || !playerName || !words) {
			return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
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

	const guessedCount = words.filter((w: { guessed: boolean }) => w.guessed).length
	const skippedCount = words.filter((w: { guessed: boolean }) => !w.guessed).length
	const scoreEarned = guessedCount - (game.penaltySkip ? skippedCount : 0)

	// Диагностика: проверяем расчет очков
	console.log('Round scoring:', {
		guessedCount,
		skippedCount,
		penaltySkip: game.penaltySkip,
		scoreEarned,
	})

	const team = game.teams.find(t => t.id === teamId)!
	const newTeamScore = Math.max(0, team.score + scoreEarned)

	const numTeams = game.teams.length
	const nextTeamIndex = (game.currentTeamIndex + 1) % numTeams
	const nextRoundNumber = nextTeamIndex === 0 ? game.currentRoundNumber + 1 : game.currentRoundNumber

	const newUsedWordIds = words.map((w: { wordId: number }) => w.wordId)

	let gameFinished = false
	let winnerId: number | undefined

	if (game.winScore > 0) {
		const updatedTeams = game.teams.map(t => 
			t.id === teamId 
				? { ...t, score: newTeamScore }
				: t
		)

		const currentTeamUpdated = updatedTeams.find(t => t.id === teamId)!
		if (currentTeamUpdated.score >= game.winScore) {
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
	}

	const result = await prisma.$transaction(async (tx) => {
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
	console.log(`[POST /api/games/${id}/rounds] completed in ${duration}ms, gameFinished=${gameFinished}`)

	return NextResponse.json(result)
	} catch (error) {
		const duration = Date.now() - startTime
		console.error(`[POST /api/games/${id}/rounds] error after ${duration}ms:`, error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
