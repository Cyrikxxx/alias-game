'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { GameFromAPI } from '@/types'
import { getSessionId } from '@/lib/session'
import Container from '@/components/layout/Container'
import WinnerBanner from '@/components/game/WinnerBanner'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { RotateCcw, Home, Loader2, Crown } from 'lucide-react'

export default function ResultsPage() {
	const router = useRouter()
	const params = useParams()
	const gameId = params.id as string

	const [game, setGame] = useState<GameFromAPI | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchGame = async () => {
			try {
				const res = await fetch(`/api/games/${gameId}?includeRounds=true`)
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
				<div className='flex items-center justify-center py-12'>
					<Loader2 className='w-8 h-8 text-primary animate-spin' />
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
				<h2 className='text-2xl md:text-3xl font-bold text-foreground mb-4 text-center'>Финальный счёт</h2>
				<div className='space-y-2'>
					{sortedTeams.map((team, i) => (
						<Card
							key={team.id}
							className={`px-6 py-4 flex justify-between items-center ${i === 0 ? 'border-primary bg-primary/10' : ''}`}
						>
							<div className='flex items-center gap-3'>
								{i === 0 && <Crown className='w-6 h-6 text-accent' />}
								{i === 1 && <span className='text-2xl'>🥈</span>}
								{i === 2 && <span className='text-2xl'>🥉</span>}
								<span className='text-foreground font-semibold text-lg'>{team.name}</span>
							</div>
							<span className='text-2xl font-bold font-mono text-foreground'>{team.score}</span>
						</Card>
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
					<RotateCcw className='w-5 h-5' />
					Играть снова
				</Button>
				<Button
					fullWidth
					size='lg'
					variant='outline'
					onClick={() => router.push('/')}
				>
					<Home className='w-5 h-5' />
					На главную
				</Button>
			</div>
		</Container>
	)
}
