'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { GameFromAPI, WordInRound } from '@/types'
import { useTimer } from '@/hooks/useTimer'
import Timer from '@/components/ui/Timer'
import WordCard from '@/components/game/WordCard'
import RoundSummary from '@/components/game/RoundSummary'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

export default function RoundPage() {
	const router = useRouter()
	const params = useParams()
	const gameId = params.id as string

	const [game, setGame] = useState<GameFromAPI | null>(null)
	const [words, setWords] = useState<WordInRound[]>([])
	const [currentIndex, setCurrentIndex] = useState(0) // Индекс текущего слова
	const [showSummary, setShowSummary] = useState(false) // Показывать итоги?
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [isPaused, setIsPaused] = useState(false) // Состояние паузы

	// useRef — позволяет хранить значение, доступное внутри callback-ов
	// без этого callback handleTimeUp будет видеть старые значения words
	const wordsRef = useRef(words)
	wordsRef.current = words
	const currentIndexRef = useRef(currentIndex)
	currentIndexRef.current = currentIndex
	const hasFetchedRef = useRef(false) // Защита от повторной загрузки

	// Что делать когда таймер истёк
	const handleTimeUp = useCallback(() => {
		const updatedWords = [...wordsRef.current]
		// Если текущее слово ещё не отвечено — помечаем как не угадано
		if (currentIndexRef.current < updatedWords.length && updatedWords[currentIndexRef.current].guessed === null) {
			updatedWords[currentIndexRef.current] = {
				...updatedWords[currentIndexRef.current],
				guessed: false,
			}
		}
		setWords(updatedWords)
		setShowSummary(true) // Показываем итоги

		// Пробуем воспроизвести звук (может не сработать без взаимодействия)
		try {
			const audio = new Audio('/sounds/timer-end.mp3')
			audio.play().catch(() => {})
		} catch {}
	}, [])

	// Используем наш хук таймера
	const { timeLeft, start, pause } = useTimer({
		initialTime: game?.roundTime ?? 60,
		onTimeUp: handleTimeUp,
	})

	// Загружаем данные игры и слова при открытии страницы
	useEffect(() => {
		// Защита от повторной загрузки (React.StrictMode вызывает эффекты дважды)
		if (hasFetchedRef.current) return
		hasFetchedRef.current = true

		const fetchData = async () => {
			try {
				// Делаем два запроса параллельно (быстрее чем последовательно)
				const [gameRes, wordsRes] = await Promise.all([
					fetch(`/api/games/${gameId}`),
					fetch(`/api/games/${gameId}/words`),
				])

				if (gameRes.ok && wordsRes.ok) {
					const gameData = await gameRes.json()
					const wordsData = await wordsRes.json()

					// Диагностика: проверяем что загружается из БД
					console.log('Game loaded with roundTime:', gameData.roundTime, 'winScore:', gameData.winScore)
					console.log('Words loaded:', wordsData.length, 'First word:', wordsData[0]?.text)

					setGame(gameData)
					// Преобразуем слова в формат для раунда
					setWords(
						wordsData.map((w: { id: number; text: string }) => ({
							wordId: w.id,
							text: w.text,
							guessed: null, // Ещё не показано
						}))
					)
				}
			} catch (error) {
				console.error('Failed to fetch data:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [gameId])

	// Автозапуск таймера после загрузки данных
	useEffect(() => {
		if (!loading && game) {
			start()
		}
	}, [loading, game, start])

	// Обработка нажатия "Угадано" или "Пропуск"
	const handleGuess = (guessed: boolean) => {
		console.log('handleGuess called:', { currentIndex, word: words[currentIndex]?.text, guessed })
		const updated = [...words]
		updated[currentIndex] = { ...updated[currentIndex], guessed }
		setWords(updated)
		setCurrentIndex(prev => prev + 1) // Переходим к следующему слову
	}

	// Переключение статуса слова в итогах (исправление ошибки)
	const handleToggleWord = (displayIndex: number) => {
		const answeredWords = words.filter(w => w.guessed !== null)
		const actualIndex = words.findIndex(w => w.wordId === answeredWords[displayIndex].wordId)
		if (actualIndex === -1) return

		const updated = [...words]
		updated[actualIndex] = {
			...updated[actualIndex],
			guessed: !updated[actualIndex].guessed,
		}
		setWords(updated)
	}

	// Подтверждение итогов — сохраняем в БД и переходим дальше
	const handleConfirm = async () => {
		if (!game || saving) return

		const currentTeam = game.teams.find(t => t.order === game.currentTeamIndex)!
		const currentPlayer = currentTeam.players[currentTeam.currentPlayerIndex]
		const answeredWords = words.filter(w => w.guessed !== null)

		setSaving(true)
		try {
			const res = await fetch(`/api/games/${gameId}/rounds`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					teamId: currentTeam.id,
					playerName: currentPlayer.name,
					words: answeredWords.map(w => ({
						wordId: w.wordId,
						guessed: w.guessed,
					})),
				}),
			})

			if (res.ok) {
				const result = await res.json()
				if (result.gameFinished) {
					// Игра закончена — переходим к результатам
					router.replace(`/game/${gameId}/results`)
				} else {
					// Переходим к следующему ходу
					router.replace(`/game/${gameId}/turn`)
				}
			}
		} catch (error) {
			console.error('Failed to save round:', error)
		} finally {
			setSaving(false)
		}
	}

	// Обработка паузы
	const handlePause = () => {
		pause()
		setIsPaused(true)
	}

	const handleResume = () => {
		start()
		setIsPaused(false)
	}

	const handleEndRound = () => {
		setIsPaused(false)
		handleTimeUp()
	}

	if (loading || !game) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
			</div>
		)
	}

	const currentTeam = game.teams.find(t => t.order === game.currentTeamIndex)!
	const currentWord = currentIndex < words.length ? words[currentIndex] : null
	const noMoreWords = currentIndex >= words.length

	console.log('RoundPage render:', { currentIndex, currentWord: currentWord?.text, wordsLength: words.length, loading })

	return (
		<>
			{/* Основной экран — таймер, слово, кнопки */}
			<div className='flex flex-col h-[calc(100vh-57px)]'>
				{/* Таймер сверху с кнопкой паузы */}
				<div className='pt-4 px-4 relative'>
					<Timer
						timeLeft={timeLeft}
						totalTime={game.roundTime}
					/>
					{/* Кнопка паузы */}
					<button
						onClick={handlePause}
						className='absolute top-4 right-4 bg-surface-light hover:bg-surface-lighter text-text-primary rounded-lg px-3 py-2 text-sm font-medium transition-colors'
					>
						⏸️ Пауза
					</button>
				</div>

				{/* Слово по центру */}
				{noMoreWords ? (
					<div className='flex-1 flex items-center justify-center px-4'>
						<p className='text-text-secondary text-xl text-center'>Слова закончились! Ждите окончания таймера.</p>
					</div>
				) : currentWord ? (
					<WordCard word={currentWord.text} />
				) : null}

				{/* Кнопки внизу */}
				{!noMoreWords && !showSummary && (
					<div className='p-4 pb-8 flex gap-4'>
						<Button
							variant='danger'
							size='xl'
							fullWidth
							onClick={() => handleGuess(false)}
						>
							❌ Пропуск
						</Button>
						<Button
							variant='success'
							size='xl'
							fullWidth
							onClick={() => handleGuess(true)}
						>
							✅ Угадал
						</Button>
					</div>
				)}
			</div>

			{/* Модальное окно итогов */}
			<RoundSummary
				isOpen={showSummary}
				words={words.filter(w => w.guessed !== null)}
				onToggleWord={handleToggleWord}
				onConfirm={handleConfirm}
				penaltySkip={game.penaltySkip}
				teamName={currentTeam.name}
			/>

			{/* Модальное окно паузы */}
			<Modal
				isOpen={isPaused}
				onClose={handleResume}
				title='Пауза'
			>
				<div className='space-y-4'>
					<p className='text-text-secondary text-center'>Игра приостановлена</p>
					<div className='space-y-2'>
						<Button
							fullWidth
							size='lg'
							onClick={handleResume}
						>
							▶️ Продолжить
						</Button>
						<Button
							fullWidth
							size='lg'
							variant='danger'
							onClick={handleEndRound}
						>
							⏹️ Завершить раунд
						</Button>
					</div>
				</div>
			</Modal>
		</>
	)
}
