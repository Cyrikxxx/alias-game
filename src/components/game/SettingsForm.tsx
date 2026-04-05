'use client'
import { GameSettings, CategoryFromAPI } from '@/types'
import { ROUND_TIME_OPTIONS, WIN_SCORE_OPTIONS } from '@/constants'
import Toggle from '@/components/ui/Toggle'
import { cn } from '@/lib/utils'

interface SettingsFormProps {
	settings: GameSettings
	setSettings: (s: GameSettings) => void
	categories: CategoryFromAPI[]
}

// Форма настроек игры
export default function SettingsForm({ settings, setSettings, categories }: SettingsFormProps) {
	// Включить/выключить категорию
	const toggleCategory = (id: number) => {
		const ids = settings.categoryIds.includes(id)
			? settings.categoryIds.filter(c => c !== id) // Убрать
			: [...settings.categoryIds, id] // Добавить
		setSettings({ ...settings, categoryIds: ids })
	}

	// Выбрать все категории
	const selectAll = () => {
		setSettings({ ...settings, categoryIds: categories.map(c => c.id) })
	}

	return (
		<div className='space-y-8'>
			{/* Время раунда */}
			<div>
				<h3 className='text-text-primary font-semibold mb-3'>⏱️ Время раунда</h3>
				<div className='flex flex-wrap gap-2'>
					{ROUND_TIME_OPTIONS.map(time => (
						<button
							key={time}
							onClick={() => setSettings({ ...settings, roundTime: time })}
							className={cn(
								'px-4 py-2 rounded-xl font-medium transition-all',
								settings.roundTime === time
									? 'bg-primary text-white'
									: 'bg-surface-light text-text-secondary hover:text-text-primary'
							)}
						>
							{time} сек
						</button>
					))}
				</div>
			</div>

			{/* Очки для победы */}
			<div>
				<h3 className='text-text-primary font-semibold mb-3'>🏆 Очки для победы</h3>
				<div className='flex flex-wrap gap-2'>
					{WIN_SCORE_OPTIONS.map(score => (
						<button
							key={score}
							onClick={() => setSettings({ ...settings, winScore: score })}
							className={cn(
								'px-4 py-2 rounded-xl font-medium transition-all',
								settings.winScore === score
									? 'bg-primary text-white'
									: 'bg-surface-light text-text-secondary hover:text-text-primary'
							)}
						>
							{score === 0 ? '∞' : score}
						</button>
					))}
				</div>
			</div>

			{/* Штраф */}
			<div>
				<h3 className='text-text-primary font-semibold mb-3'>⚡ Штраф за пропуск</h3>
				<Toggle
					checked={settings.penaltySkip}
					onChange={checked => setSettings({ ...settings, penaltySkip: checked })}
					label={settings.penaltySkip ? 'Да (−1 очко)' : 'Нет (0 очков)'}
				/>
			</div>

			{/* Категории */}
			<div>
				<div className='flex justify-between items-center mb-3'>
					<h3 className='text-text-primary font-semibold'>📂 Категории слов</h3>
					<button
						onClick={selectAll}
						className='text-sm text-primary hover:text-primary-hover'
					>
						Выбрать все
					</button>
				</div>
				<div className='grid grid-cols-2 gap-2'>
					{categories.map(cat => (
						<button
							key={cat.id}
							onClick={() => toggleCategory(cat.id)}
							className={cn(
								'px-3 py-2 rounded-xl text-sm text-left transition-all border-2',
								settings.categoryIds.includes(cat.id)
									? 'bg-primary/20 border-primary text-primary'
									: 'bg-surface border-surface-light text-text-secondary hover:border-text-secondary'
							)}
						>
							{cat.name}
							{cat._count && <span className='block text-xs opacity-60'>{cat._count.words} слов</span>}
						</button>
					))}
				</div>
				{settings.categoryIds.length === 0 && (
					<p className='text-danger text-sm mt-2'>Выберите хотя бы одну категорию</p>
				)}
			</div>
		</div>
	)
}
