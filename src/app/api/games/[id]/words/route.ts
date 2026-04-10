import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { shuffleArray } from '@/lib/utils'
import { WORDS_BATCH_SIZE } from '@/constants'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const startTime = Date.now()
	let id: string = ''
	try {
		id = (await params).id

		console.log(`[GET /api/games/${id}/words] started`)

		// Оптимизированный запрос: получаем categoryIds и используем подзапрос вместо notIn
		const game = await prisma.game.findUnique({
			where: { id },
			select: {
				gameCategories: {
					select: { categoryId: true },
				},
			},
		})

		if (!game) {
			return NextResponse.json({ error: 'Game not found' }, { status: 404 })
		}

		const categoryIds = game.gameCategories.map(gc => gc.categoryId)

		// Используем NOT EXISTS вместо notIn для лучшей производительности
		const words = await prisma.word.findMany({
			where: {
				categories: {
					some: { categoryId: { in: categoryIds } },
				},
				NOT: {
					roundWords: {
						some: {
							round: { gameId: id },
						},
					},
				},
			},
			select: { id: true, text: true },
		})

		const shuffled = shuffleArray(words).slice(0, WORDS_BATCH_SIZE)

		const duration = Date.now() - startTime
		console.log(`[GET /api/games/${id}/words] completed in ${duration}ms, returned ${shuffled.length} words`)

		return NextResponse.json(shuffled)
	} catch (error) {
		const duration = Date.now() - startTime
		console.error(`[GET /api/games/${id || 'unknown'}/words] error after ${duration}ms:`, error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
