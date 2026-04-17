'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TeamSetup } from '@/types'
import { MIN_PLAYERS_PER_TEAM } from '@/constants'
import Container from '@/components/layout/Container'
import TeamForm from '@/components/game/TeamForm'
import Button from '@/components/ui/Button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

// Начальные данные — 2 команды по 2 пустых игрока
const defaultTeams: TeamSetup[] = [
	{ name: 'Команда 1', players: [{ name: '' }, { name: '' }] },
	{ name: 'Команда 2', players: [{ name: '' }, { name: '' }] },
]

export default function NewGamePage() {
	const router = useRouter()
	const [teams, setTeams] = useState<TeamSetup[]>(defaultTeams)
	const [errors, setErrors] = useState<Record<string, string>>({})

	// Проверка правильности заполнения формы
	const validate = (): boolean => {
		const newErrors: Record<string, string> = {}

		teams.forEach((team, ti) => {
			if (!team.name.trim()) {
				newErrors[`team_${ti}_name`] = 'Введите название'
			}
			team.players.forEach((player, pi) => {
				if (!player.name.trim()) {
					newErrors[`team_${ti}_player_${pi}`] = 'Введите имя'
				}
			})
		})

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleContinue = () => {
		if (!validate()) return
		// Сохраняем команды в localStorage, чтобы прочитать на следующей странице
		localStorage.setItem('alias_setup_teams', JSON.stringify(teams))
		router.push('/game/settings')
	}

	// Кнопка активна только если всё заполнено правильно
	const isValid =
		teams.length >= 2 &&
		teams.every(t => t.name.trim() && t.players.length >= MIN_PLAYERS_PER_TEAM && t.players.every(p => p.name.trim()))

	return (
		<Container>
			<h1 className='text-2xl md:text-3xl font-bold text-foreground mb-1'>Создание команд</h1>
			<p className='text-sm text-muted-foreground mb-6'>Добавьте команды и игроков (минимум 2 команды по 2 игрока)</p>

			<TeamForm
				teams={teams}
				setTeams={setTeams}
				errors={errors}
			/>

		<div className='mt-8 flex gap-3'>
			<Button
				variant='ghost'
				onClick={() => router.push('/')}
				className='flex-1'
				size='xl'
			>
				<ArrowLeft className='w-4 h-4' />
				Назад
			</Button>
			<Button
				onClick={handleContinue}
				disabled={!isValid}
				className='flex-[2]'
				size='xl'
			>
				Продолжить
				<ArrowRight className='w-4 h-4' />
			</Button>
		</div>
		</Container>
	)
}
