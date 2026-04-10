'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { GameFromAPI } from '@/types'
import { TEAM_COLORS } from '@/constants'
import Container from '@/components/layout/Container'
import ScoreBoard from '@/components/ui/ScoreBoard'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function TurnPage() {
	const router = useRouter()
	// useParams — получает параметры из URL (/game/[id]/turn → id)
	const params = useParams()
	const gameId = params.id as string

	const [game, setGame] = useState<GameFromAPI | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchGame = async () => {
			try {
				const res = await fetch(`/api/games/${gameId}`)
				if (res.ok) {
					const data = await res.json()
					// Если игра уже завершена — показываем результаты
					if (data.status === 'FINISHED') {
						router.replace(`/game/${gameId}/results`)
						return
					}
					setGame(data)
				} else {
					router.replace('/')
				}
			} catch (error) {
				console.error('Failed to fetch game:', error)
				router.replace('/')
			} finally {
				setLoading(false)
			}
		}
		fetchGame()
	}, [gameId, router])

	if (loading || !game) {
		return (
			<Container>
				<div className='text-center py-12'>
					<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
				</div>
			</Container>
		)
	}

	// Находим текущую команду и текущего игрока
	const currentTeam = game.teams.find(t => t.order === game.currentTeamIndex)!
	const currentPlayer = currentTeam.players[currentTeam.currentPlayerIndex]
	const color = TEAM_COLORS[currentTeam.order % TEAM_COLORS.length]

	return (
		<Container>
			<div className='flex flex-col items-center min-h-[calc(100vh-180px)] justify-between py-4'>
				{/* Таблица счёта */}
				<div className='w-full mb-6'>
					<h3 className='text-sm text-text-secondary mb-2 text-center'>Раунд {game.currentRoundNumber}</h3>
					<ScoreBoard
						teams={game.teams}
						currentTeamIndex={game.currentTeamIndex}
						showPlayers={true}
						currentPlayerId={currentPlayer.id}
						compact
					/>
				</div>

				{/* Информация о текущем ходе */}
				<div className='text-center flex-1 flex flex-col justify-center'>
					<div className='bg-surface-light/50 rounded-xl px-4 py-3 max-w-sm mx-auto'>
						<p className='text-text-secondary text-sm'>
							📱 Передайте устройство игроку{' '}
							<span className='text-text-primary font-semibold'>{currentPlayer.name}</span> из команды{' '}
							<span className={cn('font-semibold', color.text)}>{currentTeam.name}</span>
						</p>
					</div>
				</div>

				{/* Кнопка старт */}
				<div className='w-full mt-6'>
					<Button
						fullWidth
						size='xl'
						onClick={() => router.push(`/game/${gameId}/round`)}
					>
						🚀 Старт
					</Button>
				</div>
			</div>
		</Container>
	)
}
