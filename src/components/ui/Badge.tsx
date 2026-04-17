'use client'
import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'default' | 'secondary' | 'outline' | 'accent'
}

const variants = {
	default: 'bg-primary text-primary-foreground',
	secondary: 'bg-secondary text-secondary-foreground',
	outline: 'bg-transparent border border-border text-foreground',
	accent: 'bg-accent text-accent-foreground',
}

export default function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
	return (
		<div
			className={cn(
				'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
				variants[variant],
				className
			)}
			{...props}
		>
			{children}
		</div>
	)
}
