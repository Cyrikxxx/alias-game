// Вспомогательные функции, которые используются в разных местах

// cn — "class names" — объединяет CSS-классы
// Удобно для условных классов:
// cn("base-class", isActive && "active-class", isError && "error-class")
// Если isActive = false, то "active-class" не добавится
export function cn(...classes: (string | boolean | undefined | null)[]): string {
	return classes.filter(Boolean).join(' ')
}

// Перемешивает массив случайным образом (алгоритм Фишера-Йетса)
// Используем для выбора случайных слов
export function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array] // Копируем массив, чтобы не менять оригинал
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] // Меняем элементы местами
	}
	return shuffled
}

// Форматирует дату в читабельный вид
// Например: "15 янв. 2024, 18:30"
export function formatDate(date: string | Date): string {
	return new Date(date).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}
