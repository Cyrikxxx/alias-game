'use client'
import { TeamSetup } from '@/types'
import { MIN_PLAYERS_PER_TEAM, MAX_PLAYERS_PER_TEAM, MAX_TEAMS, TEAM_COLORS } from '@/constants'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { Plus, X, Users } from 'lucide-react'

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
			const colorIndex = ti % TEAM_COLORS.length
			const colors = TEAM_COLORS[colorIndex]
			
			// Для команд 2, 3 и 4 используем inline стили
			const useInlineStyles = colorIndex >= 1
			const inlineStyles = useInlineStyles ? {
				backgroundColor: `color-mix(in srgb, ${colors.cssVar} 10%, transparent)`,
				borderColor: colors.cssVar,
				color: colors.cssVar
			} : {}
			
			return (
			<Card
				key={ti}
				className={cn(
					'p-6 animate-fade-in rounded-xl border-2 shadow-sm',
					!useInlineStyles && colors.bg,
					!useInlineStyles && colors.border
				)}
				style={useInlineStyles ? inlineStyles : undefined}
			>
					{/* Заголовок команды */}
					<div className='flex items-center justify-between mb-6'>
						<div className='flex items-center gap-3 flex-1'>
						<Input
							value={team.name}
							onChange={e => updateTeamName(ti, e.target.value)}
							placeholder='Название команды'
							error={errors[`team_${ti}_name`]}
							className={cn('!bg-transparent !border-0 !p-0 text-2xl font-semibold !rounded-none tracking-tight focus-visible:!ring-0 focus-visible:!ring-offset-0 !outline-none', !useInlineStyles && colors.text)}
							style={useInlineStyles ? { color: colors.cssVar } : undefined}
						/>
							<Badge variant='secondary' className='text-xs'>
								<Users className='w-3 h-3' />
								{team.players.length}/{MAX_PLAYERS_PER_TEAM}
							</Badge>
						</div>
						{teams.length > 2 && (
							<Button
								variant='ghost'
								size='sm'
								onClick={() => removeTeam(ti)}
								className='text-muted-foreground'
								aria-label='Удалить команду'
							>
								<X className='w-4 h-4' />
							</Button>
						)}
					</div>

					{/* Список игроков */}
					<div className='space-y-3'>
						{team.players.map((player, pi) => (
							<div
								key={pi}
								className='flex gap-2 items-start'
							>
							<Input
								value={player.name}
								onChange={e => updatePlayerName(ti, pi, e.target.value)}
								placeholder={`Игрок ${pi + 1}`}
								error={errors[`team_${ti}_player_${pi}`]}
								className='flex-1 focus-visible:!ring-2 focus-visible:!ring-offset-0 !outline-none'
								style={{
									'--tw-ring-color': colors.cssVar
								} as React.CSSProperties}
							/>
								{team.players.length > MIN_PLAYERS_PER_TEAM && (
									<Button
										variant='ghost'
										size='sm'
										onClick={() => removePlayer(ti, pi)}
										className='text-muted-foreground shrink-0 hover:text-destructive'
										aria-label='Удалить игрока'
									>
										<X className='w-4 h-4' />
									</Button>
								)}
							</div>
						))}
					</div>

					{team.players.length < MAX_PLAYERS_PER_TEAM && (
						<Button
							variant='outline'
							size='md'
							onClick={() => addPlayer(ti)}
							className='mt-4 w-full border-dashed hover:border-primary hover:bg-primary/5'
						>
							<Plus className='w-4 h-4' />
							Добавить игрока
						</Button>
					)}
					</Card>
				)
			})}

		{teams.length < MAX_TEAMS && (
			<Card className='border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer'>
				<button
					onClick={addTeam}
					className='w-full p-8 flex flex-col items-center gap-3'
				>
					<div className='w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center'>
						<Plus className='w-7 h-7 text-primary' />
					</div>
					<div className='text-center'>
						<p className='font-semibold text-lg'>Добавить команду</p>
						<p className='text-sm text-muted-foreground'>Создайте новую команду</p>
					</div>
				</button>
			</Card>
		)}
		</div>
	)
}
