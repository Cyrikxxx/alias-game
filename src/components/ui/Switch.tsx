'use client'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
}

export default function Switch({ checked, onCheckedChange, disabled, className, ...props }: SwitchProps) {
	return (
		<button
			type='button'
			role='switch'
			aria-checked={checked}
			disabled={disabled}
			onClick={() => onCheckedChange?.(!checked)}
			className={cn(
				'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
				'disabled:cursor-not-allowed disabled:opacity-50',
				checked ? 'bg-primary' : 'bg-input',
				className
			)}
			{...props}
		>
			<span
				className={cn(
					'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
					checked ? 'translate-x-5' : 'translate-x-0'
				)}
			/>
		</button>
	)
}
