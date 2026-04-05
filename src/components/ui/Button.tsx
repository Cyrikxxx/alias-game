'use client'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, ReactNode } from 'react'

// Описываем какие свойства (props) принимает наша кнопка
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'success' | 'danger' | 'ghost' | 'outline'
	size?: 'sm' | 'md' | 'lg' | 'xl'
	children: ReactNode // Содержимое кнопки (текст, иконки)
	fullWidth?: boolean // Растянуть на всю ширину?
}

// Стили для каждого варианта кнопки
const variants = {
	primary: 'bg-primary hover:bg-primary-hover text-white',
	success: 'bg-success hover:bg-success-hover text-white',
	danger: 'bg-danger hover:bg-danger-hover text-white',
	ghost: 'bg-transparent hover:bg-surface-light text-text-primary',
	outline: 'bg-transparent border-2 border-surface-light hover:bg-surface-light text-text-primary',
}

// Стили для каждого размера
const sizes = {
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-base',
	lg: 'px-6 py-3 text-lg',
	xl: 'px-8 py-4 text-xl',
}

// Компонент Button
// { variant = "primary", ... } — значения по умолчанию
// ...props — все остальные свойства (onClick, type и т.д.)
export default function Button({
	variant = 'primary',
	size = 'md',
	fullWidth = false,
	className,
	disabled,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(
				// Базовые стили (всегда применяются)
				'rounded-xl font-semibold transition-all duration-200 active:scale-95',
				'min-h-[48px] min-w-[48px]', // Минимальный размер для удобства на телефоне
				'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
				// Стили варианта и размера
				variants[variant],
				sizes[size],
				fullWidth && 'w-full',
				className // Позволяет добавить свои классы снаружи
			)}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	)
}
