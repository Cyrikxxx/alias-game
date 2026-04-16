// Шапка сайта — отображается на всех страницах
import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'

export default function Header() {
	return (
		<header className='bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40'>
			<div className='max-w-2xl mx-auto px-4 md:px-8 py-6 flex items-center justify-between'>
				{/* Link — компонент Next.js для навигации без перезагрузки страницы */}
				<Link
					href='/'
					className='flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/90 transition-colors'
				>
					<Gamepad2 className='w-6 h-6' />
					Alias Online
				</Link>
			</div>
		</header>
	)
}
