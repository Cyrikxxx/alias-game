'use client'
import { TeamFromAPI } from '@/types'
import { TEAM_COLORS } from '@/constants'
import { cn } from '@/lib/utils'

interface ScoreBoardProps {
	teams: TeamFromAPI[]
	currentTeamIndex?: number // Подсвечиваем текущую команду
	compact?: boolean // Компактный режим (в строку)
	showPlayers?: boolean // Показывать список игроков
	currentPlayerId?: number // ID текущего объясняющего игрока
}

// ScoreBoard — таблица счёта всех команд
export default function ScoreBoard({ teams, currentTeamIndex, compact = false, showPlayers = false, currentPlayerId }: ScoreBoardProps) {
	// Сортируем по порядковому номеру
	const sorted = [...teams].sort((a, b) => a.order - b.order)

	return (
		<div className={cn(
			'grid gap-4',
			compact ? 'grid-cols-2 max-w-5xl mx-auto' : 'grid-cols-1'
		)}>
			{sorted.map(team => {
				const color = TEAM_COLORS[team.order % TEAM_COLORS.length]
				const isCurrent = team.order === currentTeamIndex

				return (
					<div
						key={team.id}
						className={cn(
							'rounded-2xl px-8 py-6 border-2 transition-all min-h-[140px]',
							color.bg,
							isCurrent ? color.border : 'border-transparent',
							isCurrent && 'ring-2 ring-primary/30'
						)}
					>
						<div className='flex justify-between items-center mb-1'>
							<span className={cn('font-semibold text-xl truncate', color.text)}>{team.name}</span>
							<span className='text-text-primary font-bold text-3xl ml-4'>{team.score}</span>
						</div>
						
						{/* Список игроков */}
						{showPlayers && team.players.length > 0 && (
							<div className='mt-4 space-y-2'>
								{team.players.sort((a, b) => a.order - b.order).map(player => {
									const isCurrentPlayer = player.id === currentPlayerId
									return (
										<div
											key={player.id}
											className={cn(
												'text-base flex items-center gap-2',
												isCurrentPlayer ? cn('font-semibold', color.text) : 'text-text-secondary'
											)}
										>
											<span>{isCurrentPlayer ? '⭐' : '•'}</span>
											<span>{player.name}</span>
										</div>
									)
								})}
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}
