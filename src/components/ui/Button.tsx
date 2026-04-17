'use client'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, ReactNode, memo } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
	size?: 'sm' | 'md' | 'lg' | 'xl'
	children: ReactNode
	fullWidth?: boolean
}

const variants = {
	default: 'bg-primary hover:bg-primary/90 text-primary-foreground',
	secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
	outline: 'bg-transparent border border-border hover:bg-secondary text-foreground',
	ghost: 'bg-transparent hover:bg-accent/10 text-foreground',
	destructive: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
}

const sizes = {
	sm: 'h-9 px-3 text-sm',
	md: 'h-10 px-4 text-base',
	lg: 'h-11 px-8 text-lg',
	xl: 'h-14 px-8 text-xl',
}

function Button({
	variant = 'default',
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
				'rounded-md font-medium transition-colors duration-200 cursor-pointer',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
				'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
				'inline-flex items-center justify-center gap-2',
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
