'use client'
import { cn } from '@/lib/utils'
import { memo } from 'react'

interface WordCardProps {
	word: string
}

function WordCard({ word }: WordCardProps) {
	return (
		<div className='flex items-center justify-center flex-1 px-4'>
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

export default memo(WordCard)
