'use client'
import { TeamFromAPI } from '@/types'
import { TEAM_COLORS } from '@/constants'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'

interface WinnerBannerProps {
	winner: TeamFromAPI
}

// Баннер победителя с эффектом конфетти
export default function WinnerBanner({ winner }: WinnerBannerProps) {
	const color = TEAM_COLORS[winner.order % TEAM_COLORS.length]
	const [confetti, setConfetti] = useState<{ id: number; x: number; delay: number; color: string }[]>([])

	// Создаём случайные конфетти при первом рендере
	useEffect(() => {
		const colors = ['hsl(160, 84%, 44%)', 'hsl(36, 95%, 55%)', 'hsl(0, 72%, 51%)', 'hsl(280, 70%, 60%)', 'hsl(200, 80%, 50%)']
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
				<div className='bg-accent/10 rounded-2xl p-6 inline-block mb-4'>
					<Trophy className='w-16 h-16 text-accent' />
				</div>
				<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight'>Победа!</h1>
				<div className={cn('inline-block px-6 py-3 rounded-xl', color.bg, 'border-2', color.border)}>
					<span className={cn('text-2xl font-bold', color.text)}>{winner.name}</span>
					<span className='text-foreground text-xl ml-3 font-mono'>{winner.score} очков</span>
				</div>
			</div>
		</div>
	)
}
