'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { GameSettings, CategoryFromAPI, TeamSetup } from '@/types'
import { getSessionId } from '@/lib/session'
import Container from '@/components/layout/Container'
import SettingsForm from '@/components/game/SettingsForm'
import Button from '@/components/ui/Button'

export default function SettingsPage() {
	const router = useRouter()
	const [categories, setCategories] = useState<CategoryFromAPI[]>([])
	const [loading, setLoading] = useState(true)
	const [creating, setCreating] = useState(false)

	const [settings, setSettings] = useState<GameSettings>({
		roundTime: 60,
		winScore: 50,
		penaltySkip: false,
		categoryIds: [],
	})

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await fetch('/api/categories')
				const data = await res.json()
				setCategories(data)
				setSettings(s => ({
					...s,
					categoryIds: data.map((c: CategoryFromAPI) => c.id),
				}))
			} catch (error) {
				console.error('Failed to fetch categories:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchCategories()
	}, [])

	const handleStartGame = async () => {
		const teamsJson = localStorage.getItem('alias_setup_teams')
		if (!teamsJson) {
			router.push('/game/new')
			return
		}

		const teams: TeamSetup[] = JSON.parse(teamsJson)
		const sessionId = getSessionId()

		setCreating(true)
		try {
			const res = await fetch('/api/games', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId, settings, teams }),
			})

			if (res.ok) {
				const game = await res.json()
				localStorage.removeItem('alias_setup_teams')
				router.push(`/game/${game.id}/turn`)
			}
		} catch (error) {
			console.error('Failed to create game:', error)
		} finally {
			setCreating(false)
		}
	}

	if (loading) {
		return (
			<Container>
				<div className='text-center py-12'>
					<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
				</div>
			</Container>
		)
	}

	return (
		<Container>
			<h1 className='text-2xl font-bold text-text-primary mb-1'>Настройки игры</h1>
			<p className='text-text-secondary mb-6 text-sm'>Настройте параметры игры</p>

			<SettingsForm
				settings={settings}
				setSettings={setSettings}
				categories={categories}
			/>

			<div className='mt-8 flex gap-3'>
				<Button
					variant='ghost'
					onClick={() => router.push('/game/new')}
					className='flex-1'
				>
					Назад
				</Button>
				<Button
					onClick={handleStartGame}
					disabled={settings.categoryIds.length === 0 || creating}
					className='flex-[2]'
					size='lg'
				>
					{creating ? 'Создаём...' : '🎮 Начать игру'}
				</Button>
			</div>
		</Container>
	)
}
