'use client'
import { TeamFromAPI } from '@/types'
import { TEAM_COLORS } from '@/constants'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface WinnerBannerProps {
	winner: TeamFromAPI
}

// Баннер победителя с эффектом конфетти
export default function WinnerBanner({ winner }: WinnerBannerProps) {
	const color = TEAM_COLORS[winner.order % TEAM_COLORS.length]
	const [confetti, setConfetti] = useState<{ id: number; x: number; delay: number; color: string }[]>([])

	// Создаём случайные конфетти при первом рендере
	useEffect(() => {
		const colors = ['#6366F1', '#22C55E', '#EF4444', '#F59E0B', '#EC4899', '#06B6D4']
		const items = Array.from({ length: 50 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			delay: Math.random() * 2,
			color: colors[Math.floor(Math.random() * colors.length)],
		}))
		setConfetti(items)
	}, [])

	return (
		<div className='relative text-center py-8'>
			{/* Падающие конфетти */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				{confetti.map(c => (
					<div
						key={c.id}
						className='absolute w-2 h-2 rounded-full'
						style={{
							left: `${c.x}%`,
							top: '-10px',
							backgroundColor: c.color,
							animation: `fall 3s ${c.delay}s ease-in forwards`,
						}}
					/>
				))}
			</div>

			{/* CSS анимация для конфетти */}
			<style jsx>{`
				@keyframes fall {
					0% {
						transform: translateY(0) rotate(0deg);
						opacity: 1;
					}
					100% {
						transform: translateY(100vh) rotate(720deg);
						opacity: 0;
					}
				}
			`}</style>

			<div className='animate-bounce-in'>
				<p className='text-6xl mb-4'>🏆</p>
				<h1 className='text-3xl md:text-4xl font-bold text-text-primary mb-2'>Победа!</h1>
				<div className={cn('inline-block px-6 py-3 rounded-2xl', color.bg, 'border-2', color.border)}>
					<span className={cn('text-2xl font-bold', color.text)}>{winner.name}</span>
					<span className='text-text-primary text-xl ml-3'>{winner.score} очков</span>
				</div>
			</div>
		</div>
	)
}
