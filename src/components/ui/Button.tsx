'use client'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, ReactNode, memo } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'success' | 'danger' | 'ghost' | 'outline'
	size?: 'sm' | 'md' | 'lg' | 'xl'
	children: ReactNode
	fullWidth?: boolean
}

const variants = {
	primary: 'bg-primary hover:bg-primary-hover text-white',
	success: 'bg-success hover:bg-success-hover text-white',
	danger: 'bg-danger hover:bg-danger-hover text-white',
	ghost: 'bg-transparent hover:bg-surface-light text-text-primary',
	outline: 'bg-transparent border-2 border-surface-light hover:bg-surface-light text-text-primary',
}

const sizes = {
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-base',
	lg: 'px-6 py-3 text-lg',
	xl: 'px-8 py-4 text-xl',
}

function Button({
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
				'rounded-xl font-semibold transition-all duration-200 active:scale-95',
				'min-h-[48px] min-w-[48px]',
				'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
				variants[variant],
				sizes[size],
				fullWidth && 'w-full',
				className
			)}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	)
}

export default memo(Button)
