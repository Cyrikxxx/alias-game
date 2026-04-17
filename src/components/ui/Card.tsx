'use client'
import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	active?: boolean
}

export function Card({ className, active, ...props }: CardProps) {
	return (
		<div
			className={cn(
				'rounded-lg border bg-card shadow-sm transition-colors',
				active ? 'border-primary bg-primary/10' : 'border-border',
				className
			)}
			{...props}
		/>
	)
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
	return <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
	return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('p-6 pt-0', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
}
