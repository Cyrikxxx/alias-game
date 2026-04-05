// Константы — это значения, которые не меняются
// Выносим их в отдельный файл, чтобы:
// 1) Легко находить и менять
// 2) Не дублировать одни и те же числа в разных местах

export const MIN_TEAMS = 2 // Минимум команд
export const MAX_TEAMS = 4 // Максимум команд
export const MIN_PLAYERS_PER_TEAM = 2 // Минимум игроков в команде

// Варианты времени раунда (в секундах)
export const ROUND_TIME_OPTIONS = [30, 45, 60, 90, 120]

// Варианты очков для победы (0 = бесконечная игра)
export const WIN_SCORE_OPTIONS = [25, 50, 75, 100, 0]

// Сколько слов загружать за раз с сервера
export const WORDS_BATCH_SIZE = 50

// Когда таймер меньше этого — мигает красным
export const TIMER_WARNING_SECONDS = 5

// Цвета для команд (каждая команда получает свой цвет)
export const TEAM_COLORS = [
	{ bg: 'bg-indigo-500/20', border: 'border-indigo-500', text: 'text-indigo-400' },
	{ bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400' },
	{ bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400' },
	{ bg: 'bg-rose-500/20', border: 'border-rose-500', text: 'text-rose-400' },
]
