'use client'
import { cn } from '@/lib/utils'
import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: string // Текст ошибки (если есть)
	label?: string // Подпись над полем
}

export default function Input({ error, label, className, ...props }: InputProps) {
	return (
		<div className='w-full'>
			{/* Показываем подпись, если передана */}
			{label && <label className='block text-sm font-medium text-foreground mb-2'>{label}</label>}
			<input
				className={cn(
					'w-full h-10 px-4 bg-secondary border rounded-md text-foreground',
					'placeholder:text-muted-foreground outline-none transition-colors',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
					error ? 'border-destructive' : 'border-input', // Красная рамка если ошибка
					className
				)}
				{...props}
			/>
			{/* Показываем текст ошибки под полем */}
			{error && <p className='mt-1 text-sm text-destructive' role='alert'>{error}</p>}
		</div>
	)
}
