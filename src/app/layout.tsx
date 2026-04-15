import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
	title: 'Alias Online — Скажи иначе',
	description: 'Браузерная реализация настольной игры Alias. Играйте с друзьями!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='ru'>
			<body className={inter.className}>
				<ErrorBoundary>
					<Header />
					<main className='min-h-[calc(100vh-57px)]'>{children}</main>
				</ErrorBoundary>
			</body>
		</html>
	)
}
