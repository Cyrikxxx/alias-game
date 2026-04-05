// Layout — обёртка, которая применяется ко ВСЕМ страницам
// Здесь подключаем шрифты, стили, шапку

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'

// Подключаем шрифт Inter с поддержкой кириллицы
const inter = Inter({ subsets: ['latin', 'cyrillic'] })

// Мета-данные для SEO
export const metadata: Metadata = {
	title: 'Alias Online — Скажи иначе',
	description: 'Браузерная реализация настольной игры Alias. Играйте с друзьями!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='ru'>
			<body className={inter.className}>
				<Header />
				<main className='min-h-[calc(100vh-57px)]'>
					{children} {/* Сюда подставляется содержимое текущей страницы */}
				</main>
			</body>
		</html>
	)
}
