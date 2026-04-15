'use client'

import { Component, ReactNode } from 'react'

interface Props {
	children: ReactNode
}

interface State {
	hasError: boolean
	error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='min-h-screen flex items-center justify-center bg-background p-4'>
					<div className='max-w-md w-full bg-surface rounded-2xl p-6 text-center'>
						<div className='text-6xl mb-4'>⚠️</div>
						<h1 className='text-2xl font-bold text-text-primary mb-2'>Что-то пошло не так</h1>
						<p className='text-text-secondary mb-6'>Произошла ошибка при загрузке страницы</p>
						<button
							onClick={() => window.location.href = '/'}
							className='px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold transition-colors'
						>
							Вернуться на главную
						</button>
					</div>
				</div>
			)
		}

		return this.props.children
	}
}
