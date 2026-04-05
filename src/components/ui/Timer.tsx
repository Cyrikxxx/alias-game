'use client'
import { cn } from '@/lib/utils'
import { TIMER_WARNING_SECONDS } from '@/constants'

interface TimerProps {
	timeLeft: number // Оставшееся время
	totalTime: number // Общее время (для прогресс-бара)
}

export default function Timer({ timeLeft, totalTime }: TimerProps) {
	// Переводим секунды в минуты:секунды
	const minutes = Math.floor(timeLeft / 60)
	const seconds = timeLeft % 60

	// Мигает красным когда мало времени
	const isWarning = timeLeft <= TIMER_WARNING_SECONDS

	// Процент для прогресс-бара (100% → 0%)
	const progress = (timeLeft / totalTime) * 100

	return (
		<div className='flex flex-col items-center gap-2'>
			{/* Крупные цифры таймера */}
			<div
				className={cn(
					'text-6xl md:text-7xl font-mono font-bold tabular-nums',
					isWarning ? 'text-danger animate-pulse-fast' : 'text-text-primary'
				)}
			>
				{/* padStart(2, "0") — добавляет ноль перед однозначным числом: 5 → "05" */}
				{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
			</div>

			{/* Прогресс-бар */}
			<div className='w-full max-w-xs h-2 bg-surface-light rounded-full overflow-hidden'>
				<div
					className={cn(
						'h-full rounded-full transition-all duration-1000 ease-linear',
						isWarning ? 'bg-danger' : progress > 50 ? 'bg-success' : 'bg-amber-500'
					)}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	)
}
