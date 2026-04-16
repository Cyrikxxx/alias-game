'use client'
import { GameFromAPI } from '@/types'
import { formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { Gamepad2, Users, Trophy, Clock, Eye, Trash2, Play } from 'lucide-react'

interface GameHistoryProps {
	games: GameFromAPI[]
	onDelete: (id: string) => void
}

// Список истории игр на главной странице
export default function GameHistory({ games, onDelete }: GameHistoryProps) {
	// Если игр нет — показываем заглушку
	if (games.length === 0) {
		return (
			<div className='text-center py-12'>
				<div className='bg-muted rounded-2xl p-6 inline-block mb-4'>
					<Gamepad2 className='w-16 h-16 text-muted-foreground' />
				</div>
				<p className='text-muted-foreground text-lg'>Игр пока нет</p>
				<p className='text-muted-foreground text-sm mt-1'>Создайте новую игру, чтобы начать!</p>
			</div>
		)
	}

	return (
		<div className='space-y-3'>
			{/* Проходим по каждой игре и рендерим карточку */}
			{games.map(game => {
				// Сортируем команды по счёту (от большего к меньшему)
				const sortedTeams = [...game.teams].sort((a, b) => b.score - a.score)
				const isFinished = game.status === 'FINISHED'

				return (
					<Card
						key={game.id}
						className='p-4 hover:border-primary hover:bg-primary/5 transition-colors'
					>
						<div className='flex justify-between items-start mb-3'>
							<div>
								{/* Бейджик статуса */}
								<Badge variant={isFinished ? 'default' : 'accent'}>
									{isFinished ? 'Завершена' : 'В процессе'}
								</Badge>
								<p className='text-muted-foreground text-xs mt-2 flex items-center gap-1'>
									<Clock className='w-3 h-3' />
									{formatDate(game.createdAt)}
								</p>
							</div>
							<div className='flex gap-2'>
								{/* Кнопка "Продолжить" — только для незавершённых игр */}
								{!isFinished && (
									<Link href={`/game/${game.id}/turn`}>
										<Button
											size='sm'
											variant='default'
										>
											<Play className='w-4 h-4' />
											Продолжить
										</Button>
									</Link>
								)}
								<Button
									size='sm'
									variant='ghost'
									onClick={() => onDelete(game.id)}
									aria-label='Удалить игру'
									className='text-destructive hover:text-destructive'
								>
									<Trash2 className='w-4 h-4' />
								</Button>
							</div>
						</div>
						{/* Счёт команд */}
						<div className='flex flex-wrap gap-3 mt-2'>
							{sortedTeams.map((team, i) => (
								<span
									key={team.id}
									className='text-sm text-foreground flex items-center gap-1'
								>
									{i === 0 && isFinished && <Trophy className='w-4 h-4 text-accent' />}
									<span className='text-muted-foreground'>{team.name}:</span>{' '}
									<span className='font-bold font-mono'>{team.score}</span>
								</span>
							))}
						</div>
					</Card>
				)
			})}
		</div>
	)
}
