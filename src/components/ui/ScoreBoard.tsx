'use client'
import { TeamFromAPI } from '@/types'
import { TEAM_COLORS } from '@/constants'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { Crown, Users } from 'lucide-react'

interface ScoreBoardProps {
	teams: TeamFromAPI[]
	currentTeamIndex?: number // Подсвечиваем текущую команду
	compact?: boolean // Компактный режим (в строку)
	showPlayers?: boolean // Показывать список игроков
	currentPlayerId?: number // ID текущего объясняющего игрока
	hostPlayerId?: number // ID хоста игры
}

// ScoreBoard — таблица счёта всех команд
export default function ScoreBoard({ teams, currentTeamIndex, compact = false, showPlayers = false, currentPlayerId, hostPlayerId }: ScoreBoardProps) {
	// Сортируем по порядковому номеру
	const sorted = [...teams].sort((a, b) => a.order - b.order)

	return (
		<div className={cn(
			'grid gap-4',
			compact ? 'grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto' : 'grid-cols-1'
		)}>
			{sorted.map(team => {
				const color = TEAM_COLORS[team.order % TEAM_COLORS.length]
				const isCurrent = team.order === currentTeamIndex
				
				// Для команд 3 и 4 используем inline стили
				const useInlineStyles = team.order >= 2
				const inlineStyles = useInlineStyles ? {
					backgroundColor: `color-mix(in srgb, ${color.cssVar} 10%, transparent)`,
					borderColor: isCurrent ? color.cssVar : 'transparent'
				} : {}

				return (
					<div
						key={team.id}
						className={cn(
							'rounded-xl px-6 py-6 border-2 transition-all shadow-sm',
							!useInlineStyles && color.bg,
							isCurrent && !useInlineStyles ? cn(color.border, 'ring-4 ring-primary/20') : !isCurrent && 'border-transparent',
							isCurrent && useInlineStyles && 'ring-4',
							'hover:shadow-md'
						)}
						style={useInlineStyles ? {
							...inlineStyles,
							'--tw-ring-color': isCurrent ? color.cssVar : undefined
						} as React.CSSProperties : undefined}
					>
					<div className='flex justify-between items-start mb-2'>
						<div className='flex items-center gap-2'>
							<span 
								className={cn('font-semibold text-2xl tracking-tight', !useInlineStyles && color.text)}
								style={useInlineStyles ? { color: color.cssVar } : undefined}
							>
								{team.name}
							</span>
								{showPlayers && (
									<Badge variant='secondary' className='text-xs'>
										<Users className='w-3 h-3' />
										{team.players.length}
									</Badge>
								)}
							</div>
							<span className='text-foreground font-bold text-4xl ml-4'>{team.score}</span>
						</div>
						
						{/* Список игроков */}
						{showPlayers && team.players.length > 0 && (
							<div className='mt-4 space-y-2'>
								{team.players.sort((a, b) => a.order - b.order).map(player => {
									const isCurrentPlayer = player.id === currentPlayerId
									const isHost = player.id === hostPlayerId
									
									return (
										<div
											key={player.id}
											className={cn(
												'flex items-center gap-3 p-2 rounded-lg transition-colors',
												isCurrentPlayer && 'bg-primary/10'
											)}
										>
											<span className={cn(
												'text-base flex-1',
												isCurrentPlayer ? cn('font-semibold', !useInlineStyles && color.text) : 'text-muted-foreground'
											)}
											style={isCurrentPlayer && useInlineStyles ? { color: color.cssVar } : undefined}
											>
												{player.name}
											</span>
											{isHost && (
												<Crown className='w-4 h-4 text-accent' />
											)}
											{isCurrentPlayer && (
												<span className='text-lg'>⭐</span>
											)}
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
