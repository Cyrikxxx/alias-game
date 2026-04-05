'use client'
import { WordInRound } from '@/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface RoundSummaryProps {
	isOpen: boolean
	words: WordInRound[]
	onToggleWord: (index: number) => void // Переключить угадано/не угадано
	onConfirm: () => void // Подтвердить результат
	penaltySkip: boolean
	teamName: string
}

// Модальное окно итогов раунда
// Показывает все слова с пометками ✅/❌
// Можно нажать на слово чтобы исправить ошибку
export default function RoundSummary({
	isOpen,
	words,
	onToggleWord,
	onConfirm,
	penaltySkip,
	teamName,
}: RoundSummaryProps) {
	// Считаем статистику
	const answered = words.filter(w => w.guessed !== null)
	const guessedCount = answered.filter(w => w.guessed === true).length
	const skippedCount = answered.filter(w => w.guessed === false).length
	const score = guessedCount - (penaltySkip ? skippedCount : 0)

	return (
		<Modal
			isOpen={isOpen}
			title={`Итоги раунда — ${teamName}`}
		>
			{/* Список слов */}
			<div className='space-y-3 max-h-[50vh] overflow-y-auto mb-4'>
				{answered.map((word, i) => (
					<button
						key={word.wordId}
						onClick={() => onToggleWord(i)}
						className={cn(
							'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all',
							word.guessed ? 'bg-success/20 border-2 border-success/50' : 'bg-danger/20 border-2 border-danger/50'
						)}
					>
						<span className='text-text-primary font-medium'>{word.text}</span>
						<span className='text-2xl'>{word.guessed ? '✅' : '❌'}</span>
					</button>
				))}
			</div>

			{/* Итого */}
			<div className='bg-surface-light rounded-xl p-4 mb-4'>
				<div className='flex justify-between text-sm text-text-secondary'>
					<span>Угадано:</span>
					<span className='text-success font-bold'>+{guessedCount}</span>
				</div>
				{penaltySkip && skippedCount > 0 && (
					<div className='flex justify-between text-sm text-text-secondary'>
						<span>Штраф:</span>
						<span className='text-danger font-bold'>−{skippedCount}</span>
					</div>
				)}
				<div className='flex justify-between text-lg font-bold text-text-primary mt-2 pt-2 border-t border-surface'>
					<span>Итого:</span>
					<span className={score >= 0 ? 'text-success' : 'text-danger'}>
						{score > 0 ? '+' : ''}
						{score}
					</span>
				</div>
			</div>

			<p className='text-text-secondary text-xs text-center mb-3'>Нажмите на слово, чтобы изменить его статус</p>

			<Button
				fullWidth
				size='lg'
				onClick={onConfirm}
			>
				Подтвердить
			</Button>
		</Modal>
	)
}
