'use client'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { memo } from 'react'

interface WordCardProps {
	word: string
}

function WordCard({ word }: WordCardProps) {
	return (
		<div className='flex items-center justify-center flex-1 px-4'>
			<Card className='w-full max-w-2xl min-h-[200px] flex items-center justify-center border-2 border-primary p-8'>
				<h1
					className={cn(
						'text-4xl md:text-5xl font-bold text-foreground text-center',
						'animate-bounce-in select-none'
					)}
					key={word}
				>
					{word}
				</h1>
			</Card>
		</div>
	)
}

export default memo(WordCard)
