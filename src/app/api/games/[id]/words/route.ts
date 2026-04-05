import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { shuffleArray } from '@/lib/utils'
import { WORDS_BATCH_SIZE } from '@/constants'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params // Достаем id правильно

		const game = await prisma.game.findUnique({
			where: { id },
			include: { gameCategories: true },
		})

		if (!game) {
			return NextResponse.json({ error: 'Game not found' }, { status: 404 })
		}

		const categoryIds = game.gameCategories.map(gc => gc.categoryId)

		const words = await prisma.word.findMany({
			where: {
				categories: {
					some: { categoryId: { in: categoryIds } },
				},
				id: { notIn: game.usedWordIds },
			},
			select: { id: true, text: true },
		})

		const shuffled = shuffleArray(words).slice(0, WORDS_BATCH_SIZE)

		return NextResponse.json(shuffled)
	} catch (error) {
		console.error('GET /api/games/[id]/words error:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
