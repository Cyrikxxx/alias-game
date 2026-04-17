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
export default function ScoreBoard({
	teams,
	currentTeamIndex,
	compact = false,
	showPlayers = false,
	currentPlayerId,
	hostPlayerId,
}: ScoreBoardProps) {
	// Сортируем по порядковому номеру
	const sorted = [...teams].sort((a, b) => a.order - b.order)

	return (
		<div className={cn('grid gap-4', compact ? 'grid-cols-2 max-w-[608px] mx-auto' : 'grid-cols-1')}>
			{sorted.map(team => {
				const color = TEAM_COLORS[team.order % TEAM_COLORS.length]
				const isCurrent = team.order === currentTeamIndex

			// Для команд 3 и 4 используем inline стили
			const useInlineStyles = team.order >= 2
			const inlineStyles = useInlineStyles
				? {
						backgroundColor: `color-mix(in srgb, ${color.cssVar} 10%, transparent)`,
						borderColor: isCurrent ? color.cssVar : 'transparent',
					}
				: {}

			return (
				<div
					key={team.id}
					className={cn(
						'rounded-xl px-4 py-4 border-2 transition-all shadow-sm w-full',
						!useInlineStyles && color.bg,
						isCurrent && !useInlineStyles
							? cn(color.border)
							: !isCurrent && 'border-transparent',
						useInlineStyles && !isCurrent && 'border-transparent',
						'hover:shadow-md'
					)}
					style={
						useInlineStyles
							? ({
									...inlineStyles,
								} as React.CSSProperties)
							: undefined
					}
				>
					<div className='flex justify-between items-start mb-2'>
						<div className='flex items-center gap-1.5'>
							<span
								className={cn('font-semibold text-lg tracking-tight', !useInlineStyles && color.text)}
								style={useInlineStyles ? { color: color.cssVar } : undefined}
							>
								{team.name}
							</span>
							{showPlayers && (
								<Badge
									variant='secondary'
									className='text-[10px] px-1.5 py-0.5'
								>
									<Users className='w-2.5 h-2.5' />
									{team.players.length}
								</Badge>
							)}
						</div>
						<span className='text-foreground font-bold text-3xl ml-2'>{team.score}</span>
					</div>

					{/* Список игроков */}
					{showPlayers && team.players.length > 0 && (
						<div className='mt-2 space-y-1'>
								{team.players
									.sort((a, b) => a.order - b.order)
									.map(player => {
										const isCurrentPlayer = player.id === currentPlayerId
										const isHost = player.id === hostPlayerId

										return (
											<div
												key={player.id}
												className={cn(
													'flex items-center gap-2 p-1 rounded-md transition-colors',
													isCurrentPlayer && 'bg-primary/10'
												)}
											>
												<span
													className={cn(
														'text-sm flex-1',
														isCurrentPlayer
															? cn('font-semibold', !useInlineStyles && color.text)
															: 'text-muted-foreground'
													)}
													style={isCurrentPlayer && useInlineStyles ? { color: color.cssVar } : undefined}
												>
													{player.name}
												</span>
												{isHost && <Crown className='w-3 h-3 text-accent' />}
												{isCurrentPlayer && <span className='text-base'>⭐</span>}
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
