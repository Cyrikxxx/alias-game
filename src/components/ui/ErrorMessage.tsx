'use client'

import { cn } from '@/lib/utils'

interface ErrorMessageProps {
	message: string
	onClose?: () => void
}

export default function ErrorMessage({ message, onClose }: ErrorMessageProps) {
	return (
		<div className='fixed top-4 right-4 z-50 max-w-md animate-fade-in'>
			<div className='bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3'>
				<span className='text-2xl'>⚠️</span>
				<div className='flex-1'>
					<p className='text-destructive font-medium'>{message}</p>
				</div>
				{onClose && (
					<button
						onClick={onClose}
						className='text-destructive hover:text-destructive/80 transition-colors'
					>
						✕
					</button>
				)}
			</div>
		</div>
	)
}
