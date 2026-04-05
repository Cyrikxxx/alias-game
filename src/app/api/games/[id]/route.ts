import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> } // <-- Изменение здесь
) {
	try {
		const { id } = await params // <-- И здесь мы ждем (await) получения id

		const game = await prisma.game.findUnique({
			where: { id },
			include: {
				teams: {
					include: { players: { orderBy: { order: 'asc' } } },
					orderBy: { order: 'asc' },
				},
				rounds: {
					include: { words: { include: { word: true } } },
					orderBy: { createdAt: 'asc' },
				},
				gameCategories: { include: { category: true } },
			},
		})

		if (!game) {
			return NextResponse.json({ error: 'Game not found' }, { status: 404 })
		}

		return NextResponse.json(game)
	} catch (error) {
		console.error('GET /api/games/[id] error:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params
		const body = await request.json()

		const game = await prisma.game.update({
			where: { id },
			data: body,
			include: {
				teams: {
					include: { players: { orderBy: { order: 'asc' } } },
					orderBy: { order: 'asc' },
				},
			},
		})
		return NextResponse.json(game)
	} catch (error) {
		console.error('PATCH /api/games/[id] error:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params
		await prisma.game.delete({ where: { id } })
		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('DELETE /api/games/[id] error:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
