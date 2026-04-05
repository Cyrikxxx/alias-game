'use client'
import { GameFromAPI } from '@/types'
import { formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Link from 'next/link'

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
				<p className='text-6xl mb-4'>🎮</p>
				<p className='text-text-secondary text-lg'>Игр пока нет</p>
				<p className='text-text-secondary/60 text-sm mt-1'>Создайте новую игру, чтобы начать!</p>
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
					<div
						key={game.id}
						className='bg-surface rounded-xl p-4 border border-surface-light'
					>
						<div className='flex justify-between items-start mb-2'>
							<div>
								{/* Бейджик статуса */}
								<span
									className={`text-xs px-2 py-0.5 rounded-full ${
										isFinished ? 'bg-success/20 text-success' : 'bg-amber-500/20 text-amber-400'
									}`}
								>
									{isFinished ? 'Завершена' : 'В процессе'}
								</span>
								<p className='text-text-secondary text-xs mt-1'>{formatDate(game.createdAt)}</p>
							</div>
							<div className='flex gap-2'>
								{/* Кнопка "Продолжить" — только для незавершённых игр */}
								{!isFinished && (
									<Link href={`/game/${game.id}/turn`}>
										<Button
											size='sm'
											variant='primary'
										>
											Продолжить
										</Button>
									</Link>
								)}
								<Button
									size='sm'
									variant='ghost'
									onClick={() => onDelete(game.id)}
									aria-label='Удалить игру'
								>
									🗑️
								</Button>
							</div>
						</div>
						{/* Счёт команд */}
						<div className='flex flex-wrap gap-3 mt-2'>
							{sortedTeams.map((team, i) => (
								<span
									key={team.id}
									className='text-sm text-text-primary'
								>
									{i === 0 && isFinished ? '🏆 ' : ''}
									<span className='text-text-secondary'>{team.name}:</span>{' '}
									<span className='font-bold'>{team.score}</span>
								</span>
							))}
						</div>
					</div>
				)
			})}
		</div>
	)
}
