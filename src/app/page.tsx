'use client'
// "use client" — эта страница работает в браузере (нужно для useState, useEffect)

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GameFromAPI } from '@/types'
import { getSessionId } from '@/lib/session'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'
import GameHistory from '@/components/game/GameHistory'

export default function HomePage() {
	// useRouter — для программной навигации (router.push переходит на другую страницу)
	const router = useRouter()

	// useState — хранит данные, которые могут меняться
	const [games, setGames] = useState<GameFromAPI[]>([])
	const [loading, setLoading] = useState(true)

	// useEffect с [] — выполняется ОДИН раз при загрузке страницы
	useEffect(() => {
		const fetchGames = async () => {
			try {
				const sessionId = getSessionId()
				// fetch — делает HTTP-запрос к нашему API
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

	// Удаление игры
	const handleDelete = async (id: string) => {
		if (!confirm('Удалить эту игру?')) return
		try {
			await fetch(`/api/games/${id}`, { method: 'DELETE' })
			// Убираем игру из списка (без перезагрузки страницы)
			setGames(prev => prev.filter(g => g.id !== id))
		} catch (error) {
			console.error('Failed to delete game:', error)
		}
	}

	return (
		<Container>
			{/* Заголовок */}
			<div className='text-center mb-8'>
				<h1 className='text-4xl md:text-5xl font-bold text-text-primary mb-2'>🎯 Alias Online</h1>
				<p className='text-text-secondary'>Объясняй слова, угадывай, побеждай!</p>
			</div>

			{/* Кнопка новой игры */}
			<Button
				fullWidth
				size='lg'
				onClick={() => router.push('/game/new')}
				className='mb-8'
			>
				🎮 Новая игра
			</Button>

			{/* История игр */}
			<div>
				<h2 className='text-lg font-semibold text-text-primary mb-4'>📋 История игр</h2>
				{loading ? (
					// Индикатор загрузки
					<div className='text-center py-8'>
						<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
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
