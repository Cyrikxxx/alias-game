'use client'
import { ReactNode, useEffect } from 'react'
import { cn } from '@/lib/utils'

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
				className='absolute inset-0 bg-black/60 backdrop-blur-sm'
				onClick={onClose}
			/>
			{/* Само окно */}
			<div
				className={cn(
					'relative bg-surface rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto',
					'animate-fade-in'
				)}
			>
				{title && <h2 className='text-xl font-bold text-text-primary mb-4'>{title}</h2>}
				{children}
			</div>
		</div>
	)
}
