// Этот файл обрабатывает запросы к /api/categories
// GET /api/categories — возвращает список всех категорий

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
	try {
		// Получаем все категории из БД
		// include._count — добавляет подсчёт количества слов
		const categories = await prisma.category.findMany({
			include: {
				_count: { select: { words: true } },
			},
			orderBy: { id: 'asc' },
		})

		// NextResponse.json() — отправляет данные в формате JSON
		return NextResponse.json(categories)
	} catch (error) {
		console.error('GET /api/categories error:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 } // 500 = ошибка сервера
		)
	}
}
