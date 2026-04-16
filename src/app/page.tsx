'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GameFromAPI } from '@/types'
import { getSessionId } from '@/lib/session'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'
import GameHistory from '@/components/game/GameHistory'
import { Gamepad2, Plus, Loader2 } from 'lucide-react'

export default function HomePage() {
	const router = useRouter()

	const [games, setGames] = useState<GameFromAPI[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchGames = async () => {
			try {
				const sessionId = getSessionId()
				const res = await fetch(`/api/games?sessionId=${sessionId}`)
				if (res.ok) {
					const data = await res.json()
					setGames(data)
				}
			} catch (error) {
				console.error('Failed to fetch games:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchGames()
	}, [])

	const handleDelete = async (id: string) => {
		if (!confirm('Удалить эту игру?')) return
		try {
			const sessionId = getSessionId()
			await fetch(`/api/games/${id}?sessionId=${sessionId}`, { method: 'DELETE' })
			setGames(prev => prev.filter(g => g.id !== id))
		} catch (error) {
			console.error('Failed to delete game:', error)
		}
	}

	return (
		<Container>
			<div className='flex flex-col items-center text-center mb-8 gap-6'>
				<div className='bg-primary/10 rounded-2xl p-4'>
					<Gamepad2 className='w-12 h-12 text-primary' />
				</div>
				<div>
					<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2 tracking-tight text-balance'>
						Alias Online
					</h1>
					<p className='text-lg md:text-xl text-muted-foreground'>
						Объясняй слова, угадывай, побеждай!
					</p>
				</div>
			</div>

			<Button
				fullWidth
				size='lg'
				onClick={() => router.push('/game/new')}
				className='mb-8'
			>
				<Plus className='w-5 h-5' />
				Новая игра
			</Button>

			<div>
				<h2 className='text-2xl md:text-3xl font-bold text-foreground mb-4'>История игр</h2>
				{loading ? (
					<div className='flex items-center justify-center py-8'>
						<Loader2 className='w-8 h-8 text-primary animate-spin' />
					</div>
				) : (
					<GameHistory
						games={games}
						onDelete={handleDelete}
					/>
				)}
			</div>
		</Container>
	)
}
