'use client'
import { GameSettings, CategoryFromAPI } from '@/types'
import { ROUND_TIME_OPTIONS, WIN_SCORE_OPTIONS } from '@/constants'
import Toggle from '@/components/ui/Toggle'
import Modal from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface SettingsFormProps {
	settings: GameSettings
	setSettings: (s: GameSettings) => void
	categories: CategoryFromAPI[]
}

// Форма настроек игры
export default function SettingsForm({ settings, setSettings, categories }: SettingsFormProps) {
	const [showCustomTime, setShowCustomTime] = useState(false)
	const [showCustomScore, setShowCustomScore] = useState(false)
	const [customTimeInput, setCustomTimeInput] = useState('')
	const [customScoreInput, setCustomScoreInput] = useState('')

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

	// Применить пользовательское время
	const applyCustomTime = () => {
		const time = parseInt(customTimeInput)
		console.log('Applying custom time:', time)
		if (time >= 10 && time <= 300) {
			setSettings({ ...settings, roundTime: time })
			setShowCustomTime(false)
			setCustomTimeInput('')
		} else {
			console.log('Invalid time value:', time)
		}
	}

	// Применить пользовательские очки
	const applyCustomScore = () => {
		const score = parseInt(customScoreInput)
		console.log('Applying custom score:', score)
		if (score >= 10 && score <= 1000) {
			setSettings({ ...settings, winScore: score })
			setShowCustomScore(false)
			setCustomScoreInput('')
		} else {
			console.log('Invalid score value:', score)
		}
	}

	// Проверка, является ли текущее значение кастомным
	const isCustomTime = !ROUND_TIME_OPTIONS.includes(settings.roundTime)
	const isCustomScore = !WIN_SCORE_OPTIONS.includes(settings.winScore)

	return (
		<>
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
						{isCustomTime && (
							<button
								onClick={() => setShowCustomTime(true)}
								className='px-4 py-2 rounded-xl font-medium transition-all bg-primary text-white'
							>
								{settings.roundTime} сек
							</button>
						)}
						<button
							onClick={() => setShowCustomTime(true)}
							className='px-4 py-2 rounded-xl font-medium transition-all bg-surface-light text-text-secondary hover:text-text-primary'
						>
							Свое количество
						</button>
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
								{score}
							</button>
						))}
						{isCustomScore && (
							<button
								onClick={() => setShowCustomScore(true)}
								className='px-4 py-2 rounded-xl font-medium transition-all bg-primary text-white'
							>
								{settings.winScore}
							</button>
						)}
						<button
							onClick={() => setShowCustomScore(true)}
							className='px-4 py-2 rounded-xl font-medium transition-all bg-surface-light text-text-secondary hover:text-text-primary'
						>
							Свое количество
						</button>
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

		{/* Модальное окно для времени раунда */}
		<Modal isOpen={showCustomTime} onClose={() => setShowCustomTime(false)} title='⏱️ Свое время раунда'>
			<div className='space-y-4'>
				<input
					type='number'
					min='10'
					max='300'
					value={customTimeInput}
					onChange={e => setCustomTimeInput(e.target.value)}
					placeholder='10-300 секунд'
					className='w-full px-4 py-3 rounded-xl bg-surface-light text-text-primary border-2 border-surface-light focus:border-primary outline-none text-lg'
					autoFocus
				/>
				<div className='flex gap-2'>
					<button
						onClick={applyCustomTime}
						className='flex-1 px-4 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover transition-all'
					>
						Применить
					</button>
					<button
						onClick={() => {
							setShowCustomTime(false)
							setCustomTimeInput('')
						}}
						className='flex-1 px-4 py-3 rounded-xl bg-surface-light text-text-secondary hover:text-text-primary transition-all'
					>
						Отмена
					</button>
				</div>
			</div>
		</Modal>

		{/* Модальное окно для очков победы */}
		<Modal isOpen={showCustomScore} onClose={() => setShowCustomScore(false)} title='🏆 Свои очки для победы'>
			<div className='space-y-4'>
				<input
					type='number'
					min='10'
					max='1000'
					value={customScoreInput}
					onChange={e => setCustomScoreInput(e.target.value)}
					placeholder='10-1000 очков'
					className='w-full px-4 py-3 rounded-xl bg-surface-light text-text-primary border-2 border-surface-light focus:border-primary outline-none text-lg'
					autoFocus
				/>
				<div className='flex gap-2'>
					<button
						onClick={applyCustomScore}
						className='flex-1 px-4 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover transition-all'
					>
						Применить
					</button>
					<button
						onClick={() => {
							setShowCustomScore(false)
							setCustomScoreInput('')
						}}
						className='flex-1 px-4 py-3 rounded-xl bg-surface-light text-text-secondary hover:text-text-primary transition-all'
					>
						Отмена
					</button>
				</div>
			</div>
		</Modal>
	</>
	)
}
