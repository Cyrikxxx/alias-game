'use client'
import { cn } from '@/lib/utils'

interface ToggleProps {
	checked: boolean
	onChange: (checked: boolean) => void
	label?: string
}

// Toggle — это переключатель вкл/выкл (как на iPhone)
export default function Toggle({ checked, onChange, label }: ToggleProps) {
	return (
		<label className='flex items-center gap-3 cursor-pointer'>
			<button
				type='button'
				role='switch'
				aria-checked={checked}
				onClick={() => onChange(!checked)}
				className={cn(
					'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
					checked ? 'bg-primary' : 'bg-surface-light'
				)}
			>
				{/* Кружочек, который двигается */}
				<span
					className={cn(
						'inline-block h-5 w-5 rounded-full bg-white transition-transform',
						checked ? 'translate-x-6' : 'translate-x-1'
					)}
				/>
			</button>
			{label && <span className='text-text-primary'>{label}</span>}
		</label>
	)
}
