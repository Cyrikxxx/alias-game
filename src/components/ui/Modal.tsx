'use client'
import { ReactNode, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface ModalProps {
	isOpen: boolean // Открыто ли окно
	onClose?: () => void // Функция закрытия
	children: ReactNode // Содержимое
	title?: string // Заголовок
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
	// Блокируем прокрутку страницы когда модалка открыта
	useEffect(() => {
		if (isOpen) document.body.style.overflow = 'hidden'
		else document.body.style.overflow = ''
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	// Если окно закрыто — ничего не рендерим
	if (!isOpen) return null

	return (
		// Контейнер на весь экран
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			{/* Затемнённый фон — при клике закрываем */}
			<div
				className='absolute inset-0 bg-black/80 animate-fade-in'
				onClick={onClose}
			/>
			{/* Само окно */}
			<div
				className={cn(
					'relative bg-card border border-border rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto',
					'animate-fade-in'
				)}
			>
				{onClose && (
					<button
						onClick={onClose}
						className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'
						aria-label='Закрыть'
					>
						<X className='h-4 w-4' />
					</button>
				)}
				{title && <h2 className='text-xl font-bold text-foreground mb-4 pr-8'>{title}</h2>}
				<div className='gap-4'>{children}</div>
			</div>
		</div>
	)
}
