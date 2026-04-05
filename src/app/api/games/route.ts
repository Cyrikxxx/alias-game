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
		// Читаем тело запроса (JSON от клиента)
		const body = await request.json()
		const { sessionId, settings, teams } = body

		// Проверяем что данные корректные
		if (!sessionId || !settings || !teams || teams.length < 2) {
			return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
		}

		// Создаём игру в БД одним запросом (вместе с командами и игроками)
		// Prisma поддерживает вложенное создание — очень удобно!
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
