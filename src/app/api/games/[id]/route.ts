import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const startTime = Date.now()
	try {
		const { id } = await params
		const { searchParams } = new URL(request.url)
		const includeRounds = searchParams.get('includeRounds') === 'true'

		console.log(`[GET /api/games/${id}] includeRounds=${includeRounds}`)

		const game = await prisma.game.findUnique({
			where: { id },
			select: {
				id: true,
				status: true,
				roundTime: true,
				winScore: true,
				penaltySkip: true,
				currentTeamIndex: true,
				currentRoundNumber: true,
				teams: {
					select: {
						id: true,
						name: true,
						score: true,
						order: true,
						currentPlayerIndex: true,
						players: {
							select: { id: true, name: true, order: true },
							orderBy: { order: 'asc' }
						}
					},
					orderBy: { order: 'asc' }
				},
				gameCategories: {
					select: {
						categoryId: true,
						category: { select: { id: true, name: true, slug: true } }
					}
				},
				rounds: includeRounds ? {
					include: { words: { include: { word: true } } },
					orderBy: { createdAt: 'asc' }
				} : false
			}
		})

		if (!game) {
			return NextResponse.json({ error: 'Game not found' }, { status: 404 })
		}

		const duration = Date.now() - startTime
		console.log(`[GET /api/games/${id}] completed in ${duration}ms`)

		return NextResponse.json(game)
	} catch (error) {
		const duration = Date.now() - startTime
		console.error(`[GET /api/games/${id}] error after ${duration}ms:`, error)
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
