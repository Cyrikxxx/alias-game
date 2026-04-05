'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { GameFromAPI } from '@/types'
import { getSessionId } from '@/lib/session'
import Container from '@/components/layout/Container'
import WinnerBanner from '@/components/game/WinnerBanner'
import Button from '@/components/ui/Button'

export default function ResultsPage() {
	const router = useRouter()
	const params = useParams()
	const gameId = params.id as string

	const [game, setGame] = useState<GameFromAPI | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchGame = async () => {
			try {
				const res = await fetch(`/api/games/${gameId}`)
				if (res.ok) {
					setGame(await res.json())
				}
			} catch (error) {
				console.error('Failed to fetch game:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchGame()
	}, [gameId])

	// "Играть снова" — создаёт новую игру с теми же командами
	const handlePlayAgain = async () => {
		if (!game) return

		const sessionId = getSessionId()
		const teams = game.teams.map(t => ({
			name: t.name,
			players: t.players.map(p => ({ name: p.name })),
		}))

		const settings = {
			roundTime: game.roundTime,
			winScore: game.winScore,
			penaltySkip: game.penaltySkip,
			categoryIds: game.gameCategories.map(gc => gc.categoryId),
		}

		try {
			const res = await fetch('/api/games', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId, settings, teams }),
			})

			if (res.ok) {
				const newGame = await res.json()
				router.push(`/game/${newGame.id}/turn`)
			}
		} catch (error) {
			console.error('Failed to create new game:', error)
		}
	}

	if (loading || !game) {
		return (
			<Container>
				<div className='text-center py-12'>
					<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
				</div>
			</Container>
		)
	}

	// Сортируем команды по счёту
	const sortedTeams = [...game.teams].sort((a, b) => b.score - a.score)
	const winner = sortedTeams[0]

	return (
		<Container>
			{/* Баннер победителя с конфетти */}
			<WinnerBanner winner={winner} />

			{/* Финальная таблица */}
			<div className='mt-8'>
				<h2 className='text-lg font-semibold text-text-primary mb-3 text-center'>Финальный счёт</h2>
				<div className='space-y-2'>
					{sortedTeams.map((team, i) => (
						<div
							key={team.id}
							className='bg-surface rounded-xl px-4 py-3 flex justify-between items-center border border-surface-light'
						>
							<div className='flex items-center gap-3'>
								<span className='text-2xl'>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : ''}</span>
								<span className='text-text-primary font-medium'>{team.name}</span>
							</div>
							<span className='text-2xl font-bold text-text-primary'>{team.score}</span>
						</div>
					))}
				</div>
			</div>

			{/* Кнопки */}
			<div className='mt-8 flex flex-col gap-3'>
				<Button
					fullWidth
					size='lg'
					onClick={handlePlayAgain}
				>
					🔄 Играть снова
				</Button>
				<Button
					fullWidth
					size='lg'
					variant='ghost'
					onClick={() => router.push('/')}
				>
					🏠 На главную
				</Button>
			</div>
		</Container>
	)
}
