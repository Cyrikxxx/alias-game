// Шапка сайта — отображается на всех страницах
import Link from 'next/link'

export default function Header() {
	return (
		<header className='bg-surface/80 backdrop-blur-sm border-b border-surface-light sticky top-0 z-40'>
			<div className='max-w-2xl mx-auto px-4 py-3 flex items-center justify-between'>
				{/* Link — компонент Next.js для навигации без перезагрузки страницы */}
				<Link
					href='/'
					className='text-xl font-bold text-primary hover:text-primary-hover transition-colors'
				>
					🎯 Alias Online
				</Link>
			</div>
		</header>
	)
}
