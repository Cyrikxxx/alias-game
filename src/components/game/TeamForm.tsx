'use client'
import { TeamSetup } from '@/types'
import { MIN_PLAYERS_PER_TEAM, MAX_PLAYERS_PER_TEAM, MAX_TEAMS, TEAM_COLORS } from '@/constants'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface TeamFormProps {
	teams: TeamSetup[]
	setTeams: (teams: TeamSetup[]) => void
	errors: Record<string, string>
}

// Форма для создания команд и добавления игроков
export default function TeamForm({ teams, setTeams, errors }: TeamFormProps) {
	// Изменение названия команды
	const updateTeamName = (index: number, name: string) => {
		const updated = [...teams]
		updated[index] = { ...updated[index], name }
		setTeams(updated)
	}

	// Изменение имени игрока
	const updatePlayerName = (teamIndex: number, playerIndex: number, name: string) => {
		const updated = [...teams]
		const players = [...updated[teamIndex].players]
		players[playerIndex] = { name }
		updated[teamIndex] = { ...updated[teamIndex], players }
		setTeams(updated)
	}

	// Добавление игрока в команду
	const addPlayer = (teamIndex: number) => {
		const updated = [...teams]
		// Проверяем, не достигнут ли максимум игроков
		if (updated[teamIndex].players.length >= MAX_PLAYERS_PER_TEAM) return
		updated[teamIndex] = {
			...updated[teamIndex],
			players: [...updated[teamIndex].players, { name: '' }],
		}
		setTeams(updated)
	}

	// Удаление игрока (нельзя если осталось 2)
	const removePlayer = (teamIndex: number, playerIndex: number) => {
		const updated = [...teams]
		if (updated[teamIndex].players.length <= MIN_PLAYERS_PER_TEAM) return
		updated[teamIndex] = {
			...updated[teamIndex],
			players: updated[teamIndex].players.filter((_, i) => i !== playerIndex),
		}
		setTeams(updated)
	}

	// Удаление команды (нельзя если осталось 2)
	const removeTeam = (index: number) => {
		if (teams.length <= 2) return
		setTeams(teams.filter((_, i) => i !== index))
	}

	// Добавление команды (максимум 4)
	const addTeam = () => {
		if (teams.length >= MAX_TEAMS) return
		setTeams([
			...teams,
			{
				name: `Команда ${teams.length + 1}`,
				players: [{ name: '' }, { name: '' }],
			},
		])
	}

	return (
		<div className='space-y-6'>
			{teams.map((team, ti) => {
				const color = TEAM_COLORS[ti % TEAM_COLORS.length]
				return (
					<div
						key={ti}
						className={cn('rounded-2xl p-4 border-2 animate-fade-in', color.bg, color.border)}
					>
						{/* Заголовок команды */}
						<div className='flex items-center justify-between mb-3'>
							<Input
								value={team.name}
								onChange={e => updateTeamName(ti, e.target.value)}
								placeholder='Название команды'
								error={errors[`team_${ti}_name`]}
								className='!bg-transparent !border-0 !p-0 text-lg font-bold !rounded-none'
							/>
							{teams.length > 2 && (
								<Button
									variant='ghost'
									size='sm'
									onClick={() => removeTeam(ti)}
								>
									✕
								</Button>
							)}
						</div>

						{/* Список игроков */}
						<div className='space-y-2'>
							{team.players.map((player, pi) => (
								<div
									key={pi}
									className='flex gap-2 items-center'
								>
									<Input
										value={player.name}
										onChange={e => updatePlayerName(ti, pi, e.target.value)}
										placeholder={`Игрок ${pi + 1}`}
										error={errors[`team_${ti}_player_${pi}`]}
									/>
									{team.players.length > MIN_PLAYERS_PER_TEAM && (
										<Button
											variant='ghost'
											size='sm'
											onClick={() => removePlayer(ti, pi)}
										>
											✕
										</Button>
									)}
								</div>
							))}
						</div>

						{team.players.length < MAX_PLAYERS_PER_TEAM && (
							<Button
								variant='ghost'
								size='sm'
								onClick={() => addPlayer(ti)}
								className='mt-2'
							>
								+ Добавить игрока
							</Button>
						)}
					</div>
				)
			})}

			{teams.length < MAX_TEAMS && (
				<Button
					variant='outline'
					fullWidth
					onClick={addTeam}
				>
					+ Добавить команду
				</Button>
			)}
		</div>
	)
}
