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
			{label && <label className='block text-sm text-text-secondary mb-1'>{label}</label>}
			<input
				className={cn(
					'w-full px-4 py-3 bg-surface border-2 rounded-xl text-text-primary',
					'placeholder:text-text-secondary/50 outline-none transition-colors',
					'focus:border-primary', // При фокусе — фиолетовая рамка
					error ? 'border-danger' : 'border-surface-light', // Красная рамка если ошибка
					className
				)}
				{...props}
			/>
			{/* Показываем текст ошибки под полем */}
			{error && <p className='mt-1 text-sm text-danger'>{error}</p>}
		</div>
	)
}
