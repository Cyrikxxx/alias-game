'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { GameFromAPI } from '@/types'
import { TEAM_COLORS } from '@/constants'
import Container from '@/components/layout/Container'
import ScoreBoard from '@/components/ui/ScoreBoard'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function TurnPage() {
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
					const data = await res.json()
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

	const currentTeam = useMemo(() => 
		game?.teams.find(t => t.order === game.currentTeamIndex),
		[game]
	)

	if (loading || !game) {
		return (
			<Container>
				<div className='text-center py-12'>
					<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
				</div>
			</Container>
		)
	}
	
	if (!currentTeam) {
		return (
			<Container>
				<div className='text-center py-12'>
					<p className='text-danger'>Ошибка: команда не найдена</p>
				</div>
			</Container>
		)
	}

	const currentPlayer = currentTeam.players[currentTeam.currentPlayerIndex]
	const color = TEAM_COLORS[currentTeam.order % TEAM_COLORS.length]

	return (
		<Container>
			<div className='flex flex-col items-center min-h-[calc(100vh-120px)] justify-start pt-5 pb-8 px-4'>
				<div className='w-full max-w-4xl mb-8'>
					<h3 className='text-lg text-text-secondary mb-4 text-center font-medium'>Раунд {game.currentRoundNumber}</h3>
					<ScoreBoard
						teams={game.teams}
						currentTeamIndex={game.currentTeamIndex}
						showPlayers={true}
						currentPlayerId={currentPlayer.id}
						compact
					/>
				</div>

				<div className='text-center mb-8 w-full max-w-xl'>
					<div className='bg-surface-light/50 rounded-xl px-6 py-4'>
						<p className='text-text-secondary text-base leading-relaxed'>
							📱 Передайте устройство игроку{' '}
							<span className='text-text-primary font-semibold text-lg'>{currentPlayer.name}</span> из команды{' '}
							<span className={cn('font-semibold text-lg', color.text)}>{currentTeam.name}</span>
						</p>
					</div>
				</div>

				<div className='w-full max-w-lg mt-auto'>
					<Button
						fullWidth
						size='xl'
						onClick={() => router.push(`/game/${gameId}/round`)}
						className='!py-5 !text-xl'
					>
						🚀 Старт
					</Button>
				</div>
			</div>
		</Container>
	)
}
