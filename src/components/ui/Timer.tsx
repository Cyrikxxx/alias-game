'use client'
import { cn } from '@/lib/utils'
import { TIMER_WARNING_SECONDS } from '@/constants'
import { Clock } from 'lucide-react'

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
		<div className='flex flex-col items-center gap-3'>
			{/* Иконка часов */}
			<Clock className={cn('w-8 h-8', isWarning ? 'text-destructive' : 'text-primary')} />
			
			{/* Крупные цифры таймера */}
			<div
				className={cn(
					'text-5xl md:text-6xl font-mono font-bold tabular-nums',
					isWarning ? 'text-destructive animate-pulse-fast' : 'text-primary'
				)}
			>
				{/* padStart(2, "0") — добавляет ноль перед однозначным числом: 5 → "05" */}
				{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
			</div>

			{/* Прогресс-бар */}
			<div className='w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden'>
				<div
					className={cn(
						'h-full rounded-full transition-all duration-1000 ease-linear',
						isWarning ? 'bg-destructive' : progress > 50 ? 'bg-primary' : 'bg-accent'
					)}
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	)
}
