import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })
const spaceMono = Space_Mono({ 
	weight: ['400', '700'],
	subsets: ['latin'],
	variable: '--font-mono'
})

export const metadata: Metadata = {
	title: 'Alias Online — Скажи иначе',
	description: 'Браузерная реализация настольной игры Alias. Играйте с друзьями!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='ru'>
			<body className={`${inter.className} ${spaceMono.variable}`}>
				<ErrorBoundary>
					<Header />
					<main className='min-h-[calc(100vh-57px)]'>{children}</main>
				</ErrorBoundary>
			</body>
		</html>
	)
}
