'use client'
import { GameSettings, CategoryFromAPI } from '@/types'
import { ROUND_TIME_OPTIONS, WIN_SCORE_OPTIONS } from '@/constants'
import Switch from '@/components/ui/Switch'
import Modal from '@/components/ui/Modal'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Clock, Trophy } from 'lucide-react'

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

	const toggleCategory = (id: number) => {
		const ids = settings.categoryIds.includes(id)
			? settings.categoryIds.filter(c => c !== id)
			: [...settings.categoryIds, id]
		setSettings({ ...settings, categoryIds: ids })
	}

	const selectAll = () => {
		setSettings({ ...settings, categoryIds: categories.map(c => c.id) })
	}

	const applyCustomTime = () => {
		const time = parseInt(customTimeInput)
		if (time >= 10 && time <= 300) {
			setSettings({ ...settings, roundTime: time })
			setShowCustomTime(false)
			setCustomTimeInput('')
		}
	}

	const applyCustomScore = () => {
		const score = parseInt(customScoreInput)
		if (score >= 10 && score <= 1000) {
			setSettings({ ...settings, winScore: score })
			setShowCustomScore(false)
			setCustomScoreInput('')
		}
	}

	// Проверка, является ли текущее значение кастомным
	const isCustomTime = !ROUND_TIME_OPTIONS.includes(settings.roundTime)
	const isCustomScore = !WIN_SCORE_OPTIONS.includes(settings.winScore)

	return (
		<>
			<div className='space-y-6'>
				{/* Время раунда */}
				<Card className='p-6'>
					<div className='flex items-center gap-2 mb-4'>
						<Clock className='w-5 h-5 text-muted-foreground' />
						<h3 className='text-sm font-medium text-foreground'>Время раунда</h3>
					</div>
					<div className='flex flex-wrap gap-2'>
						{ROUND_TIME_OPTIONS.map(time => (
							<button
								key={time}
								onClick={() => setSettings({ ...settings, roundTime: time })}
								className={cn(
									'px-4 py-2 rounded-md font-medium transition-colors',
									settings.roundTime === time
										? 'bg-primary text-primary-foreground'
										: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
								)}
							>
								<span className='font-mono'>{time}</span> сек
							</button>
						))}
						{isCustomTime && (
							<button
								onClick={() => setShowCustomTime(true)}
								className='px-4 py-2 rounded-md font-medium transition-colors bg-primary text-primary-foreground'
							>
								<span className='font-mono'>{settings.roundTime}</span> сек
							</button>
						)}
						<button
							onClick={() => setShowCustomTime(true)}
							className='px-4 py-2 rounded-md font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80'
						>
							Свое количество
						</button>
					</div>
				</Card>

				{/* Очки для победы */}
				<Card className='p-6'>
					<div className='flex items-center gap-2 mb-4'>
						<Trophy className='w-5 h-5 text-muted-foreground' />
						<h3 className='text-sm font-medium text-foreground'>Очки для победы</h3>
					</div>
					<div className='flex flex-wrap gap-2'>
						{WIN_SCORE_OPTIONS.map(score => (
							<button
								key={score}
								onClick={() => setSettings({ ...settings, winScore: score })}
								className={cn(
									'px-4 py-2 rounded-md font-medium transition-colors',
									settings.winScore === score
										? 'bg-primary text-primary-foreground'
										: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
								)}
							>
								<span className='font-mono'>{score}</span>
							</button>
						))}
						{isCustomScore && (
							<button
								onClick={() => setShowCustomScore(true)}
								className='px-4 py-2 rounded-md font-medium transition-colors bg-primary text-primary-foreground'
							>
								<span className='font-mono'>{settings.winScore}</span>
							</button>
						)}
						<button
							onClick={() => setShowCustomScore(true)}
							className='px-4 py-2 rounded-md font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80'
						>
							Свое количество
						</button>
					</div>
				</Card>

			{/* Штраф */}
			<Card className='p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h3 className='text-sm font-medium text-foreground mb-1'>Штраф за пропуск</h3>
						<p className='text-xs text-muted-foreground'>
							{settings.penaltySkip ? 'Да (−1 очко)' : 'Нет (0 очков)'}
						</p>
					</div>
					<Switch
						checked={settings.penaltySkip}
						onCheckedChange={checked => setSettings({ ...settings, penaltySkip: checked })}
					/>
				</div>
			</Card>

			{/* Категории */}
			<Card className='p-6'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-sm font-medium text-foreground'>Категории слов</h3>
					<button
						onClick={selectAll}
						className='text-sm text-primary hover:text-primary/90 transition-colors'
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
								'px-3 py-2 rounded-md text-sm text-left transition-colors border',
								settings.categoryIds.includes(cat.id)
									? 'bg-primary/10 border-primary text-primary'
									: 'bg-secondary border-border text-secondary-foreground hover:bg-secondary/80'
							)}
						>
							{cat.name}
							{cat._count && <span className='block text-xs opacity-60'>{cat._count.words} слов</span>}
						</button>
					))}
				</div>
				{settings.categoryIds.length === 0 && (
					<p className='text-destructive text-sm mt-2' role='alert'>Выберите хотя бы одну категорию</p>
				)}
			</Card>
		</div>

		{/* Модальное окно для времени раунда */}
		<Modal isOpen={showCustomTime} onClose={() => setShowCustomTime(false)} title='Свое время раунда'>
			<div className='space-y-4'>
				<input
					type='number'
					min='10'
					max='300'
					value={customTimeInput}
					onChange={e => setCustomTimeInput(e.target.value)}
					placeholder='10-300 секунд'
					className='w-full h-10 px-4 rounded-md bg-secondary text-foreground border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 font-mono text-lg'
					autoFocus
				/>
				<div className='flex gap-2'>
					<button
						onClick={applyCustomTime}
						className='flex-1 h-10 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors'
					>
						Применить
					</button>
					<button
						onClick={() => {
							setShowCustomTime(false)
							setCustomTimeInput('')
						}}
						className='flex-1 h-10 px-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors'
					>
						Отмена
					</button>
				</div>
			</div>
		</Modal>

		{/* Модальное окно для очков победы */}
		<Modal isOpen={showCustomScore} onClose={() => setShowCustomScore(false)} title='Свои очки для победы'>
			<div className='space-y-4'>
				<input
					type='number'
					min='10'
					max='1000'
					value={customScoreInput}
					onChange={e => setCustomScoreInput(e.target.value)}
					placeholder='10-1000 очков'
					className='w-full h-10 px-4 rounded-md bg-secondary text-foreground border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 font-mono text-lg'
					autoFocus
				/>
				<div className='flex gap-2'>
					<button
						onClick={applyCustomScore}
						className='flex-1 h-10 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors'
					>
						Применить
					</button>
					<button
						onClick={() => {
							setShowCustomScore(false)
							setCustomScoreInput('')
						}}
						className='flex-1 h-10 px-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors'
					>
						Отмена
					</button>
				</div>
			</div>
		</Modal>
	</>
	)
}
