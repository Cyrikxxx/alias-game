'use client'
import { WordInRound } from '@/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

interface RoundSummaryProps {
	isOpen: boolean
	words: WordInRound[]
	onToggleWord: (index: number) => void // Переключить угадано/не угадано
	onConfirm: () => void // Подтвердить результат
	penaltySkip: boolean
	teamName: string
}

export default function RoundSummary({
	isOpen,
	words,
	onToggleWord,
	onConfirm,
	penaltySkip,
	teamName,
}: RoundSummaryProps) {
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
			<div className='space-y-2 max-h-[50vh] overflow-y-auto mb-4'>
				{answered.map((word, i) => (
					<button
						key={word.wordId}
						onClick={() => onToggleWord(i)}
						className={cn(
							'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all border-2',
							word.guessed 
								? 'bg-primary/10 border-primary/50 hover:bg-primary/20' 
								: 'bg-destructive/10 border-destructive/50 hover:bg-destructive/20'
						)}
					>
						{word.guessed ? (
							<Check className='w-5 h-5 text-primary shrink-0' />
						) : (
							<X className='w-5 h-5 text-destructive shrink-0' />
						)}
						<span className='text-foreground font-medium flex-1 text-left'>{word.text}</span>
					</button>
				))}
			</div>

			{/* Итого */}
			<div className='bg-secondary rounded-lg p-4 mb-4'>
				<div className='flex justify-between text-sm text-muted-foreground'>
					<span>Угадано:</span>
					<span className='text-primary font-bold'>+{guessedCount}</span>
				</div>
				{skippedCount > 0 && (
					<div className='flex justify-between text-sm text-muted-foreground'>
						<span>Пропущено:</span>
						<span className={penaltySkip ? 'text-destructive font-bold' : 'text-muted-foreground'}>
							{penaltySkip ? `−${skippedCount}` : `${skippedCount} (без штрафа)`}
						</span>
					</div>
				)}
				<div className='flex justify-between text-lg font-bold text-foreground mt-2 pt-2 border-t border-border'>
					<span>Итого:</span>
					<span className={score >= 0 ? 'text-primary' : 'text-destructive'}>
						{score > 0 ? '+' : ''}
						{score}
					</span>
				</div>
			</div>

		<p className='text-muted-foreground text-xs text-center mb-3'>Нажмите на слово, чтобы изменить его статус</p>

		<Button
			fullWidth
			size='xl'
			onClick={onConfirm}
		>
			Подтвердить
		</Button>
		</Modal>
	)
}
