// Этот файл работает с "сессией" пользователя
//
// Наша игра не требует регистрации. Но нам нужно отличать
// одного пользователя от другого, чтобы показывать ему ЕГО историю игр.
//
// Решение: при первом визите генерируем случайный ID,
// сохраняем его в localStorage браузера. При следующих визитах
// используем тот же ID.

export function getSessionId(): string {
	// typeof window === "undefined" означает, что код выполняется на сервере
	// localStorage доступен только в браузере
	if (typeof window === 'undefined') return ''

	// Пробуем получить уже сохранённый ID
	let sessionId = localStorage.getItem('alias_session_id')

	if (!sessionId) {
		// Если ID нет — генерируем новый
		// Math.random().toString(36) — случайная строка из букв и цифр
		// Date.now().toString(36) — текущее время в компактном формате
		sessionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
		localStorage.setItem('alias_session_id', sessionId)
	}

	return sessionId
}
