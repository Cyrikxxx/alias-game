// Здесь описываем ФОРМУ наших данных
// interface — это как чертёж: говорит какие поля есть у объекта

// Команда при создании (ещё не сохранена в БД)
export interface TeamSetup {
	name: string // Название команды
	players: { name: string }[] // Массив игроков (у каждого есть имя)
}

// Настройки игры
export interface GameSettings {
	roundTime: number // Время раунда в секундах
	winScore: number // Очки для победы (0 = бесконечно)
	penaltySkip: boolean // Штраф за пропуск?
	categoryIds: number[] // ID выбранных категорий
}

// Слово в текущем раунде (на клиенте)
export interface WordInRound {
	wordId: number
	text: string
	guessed: boolean | null // true=угадано, false=пропущено, null=ещё не показано
}

// ==========================================
// Ниже — типы данных, которые приходят с сервера (из API)
// "FromAPI" в названии означает — так выглядят данные в JSON-ответе
// ==========================================

export interface GameFromAPI {
	id: string
	sessionId: string
	status: 'IN_PROGRESS' | 'FINISHED'
	roundTime: number
	winScore: number
	penaltySkip: boolean
	currentTeamIndex: number
	currentRoundNumber: number
	usedWordIds: number[]
	createdAt: string
	updatedAt: string
	teams: TeamFromAPI[]
	rounds: RoundFromAPI[]
	gameCategories: { categoryId: number; category?: { name: string } }[]
}

export interface TeamFromAPI {
	id: number
	name: string
	score: number
	order: number
	currentPlayerIndex: number
	gameId: string
	players: PlayerFromAPI[]
}

export interface PlayerFromAPI {
	id: number
	name: string
	order: number
	teamId: number
}

export interface RoundFromAPI {
	id: number
	roundNumber: number
	teamId: number
	gameId: string
	playerName: string
	scoreEarned: number
	createdAt: string
	words: RoundWordFromAPI[]
}

export interface RoundWordFromAPI {
	id: number
	guessed: boolean
	wordId: number
	word?: { text: string }
}

export interface CategoryFromAPI {
	id: number
	name: string
	slug: string
	_count?: { words: number } // Количество слов в категории
}

// Результат сохранения раунда
export interface RoundResult {
	round: RoundFromAPI
	teamScore: number // Обновлённый счёт команды
	gameFinished: boolean // Закончилась ли игра?
	winnerId?: number // ID команды-победителя (если есть)
	nextTeamIndex: number
	nextRoundNumber: number
}
