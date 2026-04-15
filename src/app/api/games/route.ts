// Обрабатывает запросы к /api/games
// GET — получить все игры пользователя
// POST — создать новую игру

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/games?sessionId=xxx — все игры текущей сессии
export async function GET(request: NextRequest) {
	try {
		// Получаем sessionId из URL-параметров
		// Например: /api/games?sessionId=sess_abc123
		const sessionId = request.nextUrl.searchParams.get('sessionId')

		if (!sessionId) {
			return NextResponse.json(
				{ error: 'sessionId required' },
				{ status: 400 } // 400 = плохой запрос
			)
		}

		// Ищем все игры с этим sessionId
		const games = await prisma.game.findMany({
			where: { sessionId },
			include: {
				// include — загружаем связанные данные
				teams: {
					include: { players: { orderBy: { order: 'asc' } } },
					orderBy: { order: 'asc' },
				},
				gameCategories: { include: { category: true } },
			},
			orderBy: { createdAt: 'desc' }, // Сначала новые
		})

		return NextResponse.json(games)
	} catch (error) {
		console.error('GET /api/games error:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}

// POST /api/games — создать новую игру
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { sessionId, settings, teams } = body

		if (!sessionId || !settings || !teams || teams.length < 2) {
			return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
		}

		// Валидация настроек
		if (typeof settings.roundTime !== 'number' || settings.roundTime < 10 || settings.roundTime > 300) {
			return NextResponse.json({ error: 'roundTime must be between 10 and 300' }, { status: 400 })
		}

		if (typeof settings.winScore !== 'number' || settings.winScore < 0 || settings.winScore > 1000) {
			return NextResponse.json({ error: 'winScore must be between 0 and 1000' }, { status: 400 })
		}

		if (typeof settings.penaltySkip !== 'boolean') {
			return NextResponse.json({ error: 'penaltySkip must be boolean' }, { status: 400 })
		}

		if (!Array.isArray(settings.categoryIds) || settings.categoryIds.length === 0) {
			return NextResponse.json({ error: 'At least one category required' }, { status: 400 })
		}

		// Валидация команд
		if (teams.length > 4) {
			return NextResponse.json({ error: 'Maximum 4 teams allowed' }, { status: 400 })
		}

		for (const team of teams) {
			if (!team.name || typeof team.name !== 'string' || team.name.trim().length === 0) {
				return NextResponse.json({ error: 'Team name is required' }, { status: 400 })
			}

			if (team.name.length > 50) {
				return NextResponse.json({ error: 'Team name too long (max 50 characters)' }, { status: 400 })
			}

			if (!Array.isArray(team.players) || team.players.length < 2 || team.players.length > 6) {
				return NextResponse.json({ error: 'Each team must have 2-6 players' }, { status: 400 })
			}

			for (const player of team.players) {
				if (!player.name || typeof player.name !== 'string' || player.name.trim().length === 0) {
					return NextResponse.json({ error: 'Player name is required' }, { status: 400 })
				}

				if (player.name.length > 50) {
					return NextResponse.json({ error: 'Player name too long (max 50 characters)' }, { status: 400 })
				}
			}
		}

		const game = await prisma.game.create({
			data: {
				sessionId,
				roundTime: settings.roundTime,
				winScore: settings.winScore,
				penaltySkip: settings.penaltySkip,
				// Создаём связи с категориями
				gameCategories: {
					create: settings.categoryIds.map((categoryId: number) => ({
						categoryId,
					})),
				},
				// Создаём команды
				teams: {
					create: teams.map((team: { name: string; players: { name: string }[] }, index: number) => ({
						name: team.name,
						order: index, // Порядковый номер: 0, 1, 2, 3
						// Создаём игроков внутри каждой команды
						players: {
							create: team.players.map((player: { name: string }, pIndex: number) => ({
								name: player.name,
								order: pIndex,
							})),
						},
					})),
				},
			},
			// Возвращаем созданную игру со всеми связями
			include: {
				teams: {
					include: { players: { orderBy: { order: 'asc' } } },
					orderBy: { order: 'asc' },
				},
				gameCategories: { include: { category: true } },
			},
		})

		return NextResponse.json(game, { status: 201 }) // 201 = создано
	} catch (error) {
		console.error('POST /api/games error:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
