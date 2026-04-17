'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { GameFromAPI } from '@/types'
import { TEAM_COLORS } from '@/constants'
import Container from '@/components/layout/Container'
import ScoreBoard from '@/components/ui/ScoreBoard'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Play, Loader2 } from 'lucide-react'

export default function TurnPage() {
	const router = useRouter()
	const params = useParams()
	const gameId = params.id as string

	const [game, setGame] = useState<GameFromAPI | null>(null)
	const [loading, setLoading] = useState(true)
	const [hostPlayerId, setHostPlayerId] = useState<number | undefined>()

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
					
					// Получить ID хоста из localStorage
					const storedHostId = localStorage.getItem(`game_${gameId}_hostId`)
					if (storedHostId) {
						setHostPlayerId(parseInt(storedHostId))
					}
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
				<div className='flex items-center justify-center py-12'>
					<Loader2 className='w-8 h-8 text-primary animate-spin' />
				</div>
			</Container>
		)
	}
	
	if (!currentTeam) {
		return (
			<Container>
				<div className='text-center py-12'>
					<p className='text-destructive' role='alert'>Ошибка: команда не найдена</p>
				</div>
			</Container>
		)
	}

	const currentPlayer = currentTeam.players[currentTeam.currentPlayerIndex]
	const color = TEAM_COLORS[currentTeam.order % TEAM_COLORS.length]

	return (
		<Container>
			<div className='flex flex-col items-center justify-start'>
				<div className='w-full max-w-4xl mb-8'>
					<h3 className='text-xl text-foreground mb-6 text-center font-semibold'>
						Раунд <span className='font-mono'>{game.currentRoundNumber}</span>
					</h3>
					<ScoreBoard
						teams={game.teams}
						currentTeamIndex={game.currentTeamIndex}
						showPlayers={true}
						currentPlayerId={currentPlayer.id}
						hostPlayerId={hostPlayerId}
						compact
					/>
				</div>

			<div className='text-center mb-8 w-full max-w-lg'>
				<Card className='px-6 py-4 shadow-md'>
					<p className='text-muted-foreground text-base mb-2'>
						Передайте устройство игроку
					</p>
					<div>
						<span className='text-foreground font-semibold text-lg block'>{currentPlayer.name}</span>
					</div>
				</Card>
			</div>

				<div className='w-full max-w-lg'>
					<Button
						fullWidth
						size='xl'
						onClick={() => router.push(`/game/${gameId}/round`)}
					>
						<Play className='w-6 h-6' />
						Старт
					</Button>
				</div>
			</div>
		</Container>
	)
}
