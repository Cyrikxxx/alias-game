'use client'
import { cn } from '@/lib/utils'

interface WordCardProps {
	word: string
}

// Карточка со словом — показывается крупно по центру экрана
export default function WordCard({ word }: WordCardProps) {
	console.log('WordCard render:', word)
	return (
		<div className='flex items-center justify-center flex-1 px-4'>
			{/* key={word} заставляет React пересоздавать элемент при смене слова,
          что запускает анимацию bounce-in заново */}
			<h1
				className={cn(
					'text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary text-center',
					'animate-bounce-in select-none'
				)}
				key={word}
			>
				{word}
			</h1>
		</div>
	)
}
