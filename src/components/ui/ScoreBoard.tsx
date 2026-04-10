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
		<div className={cn('grid gap-2', compact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1')}>
			{sorted.map(team => {
				const color = TEAM_COLORS[team.order % TEAM_COLORS.length]
				const isCurrent = team.order === currentTeamIndex

				return (
					<div
						key={team.id}
						className={cn(
							'rounded-xl px-4 py-2 border-2 transition-all',
							color.bg,
							isCurrent ? color.border : 'border-transparent',
							isCurrent && 'ring-2 ring-primary/30'
						)}
					>
						<div className='flex justify-between items-center'>
							<span className={cn('font-medium text-sm truncate', color.text)}>{team.name}</span>
							<span className='text-text-primary font-bold text-lg ml-2'>{team.score}</span>
						</div>
						
						{/* Список игроков */}
						{showPlayers && team.players.length > 0 && (
							<div className='mt-2 space-y-1'>
								{team.players.sort((a, b) => a.order - b.order).map(player => {
									const isCurrentPlayer = player.id === currentPlayerId
									return (
										<div
											key={player.id}
											className={cn(
												'text-xs flex items-center gap-1',
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
