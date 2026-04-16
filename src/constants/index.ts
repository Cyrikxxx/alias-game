// Константы — это значения, которые не меняются
// Выносим их в отдельный файл, чтобы:
// 1) Легко находить и менять
// 2) Не дублировать одни и те же числа в разных местах

export const MIN_TEAMS = 2 // Минимум команд
export const MAX_TEAMS = 4 // Максимум команд
export const MIN_PLAYERS_PER_TEAM = 2 // Минимум игроков в команде
export const MAX_PLAYERS_PER_TEAM = 6 // Максимум игроков в команде

// Варианты времени раунда (в секундах)
export const ROUND_TIME_OPTIONS = [30, 45, 60, 90, 120]

// Варианты очков для победы
export const WIN_SCORE_OPTIONS = [25, 50, 75, 100]

// Сколько слов загружать за раз с сервера
export const WORDS_BATCH_SIZE = 50

// Когда таймер меньше этого — мигает красным
export const TIMER_WARNING_SECONDS = 5

// Цвета для команд (каждая команда получает свой цвет)
export const TEAM_COLORS = [
	{ 
		bg: 'bg-primary/10', 
		border: 'border-primary', 
		text: 'text-primary', 
		avatar: 'bg-primary/20',
		cssVar: 'var(--color-primary)'
	},
	{ 
		bg: 'bg-accent/10', 
		border: 'border-accent', 
		text: 'text-accent', 
		avatar: 'bg-accent/20',
		cssVar: 'var(--color-accent)'
	},
	{ 
		bg: '', 
		border: '', 
		text: '', 
		avatar: '',
		cssVar: 'var(--color-blue)'
	},
	{ 
		bg: '', 
		border: '', 
		text: '', 
		avatar: '',
		cssVar: 'var(--color-purple)'
	},
]
