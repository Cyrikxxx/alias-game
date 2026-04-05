'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { GameFromAPI, WordInRound } from '@/types'
import { useTimer } from '@/hooks/useTimer'
import Container from '@/components/layout/Container'
import Timer from '@/components/ui/Timer'
import WordCard from '@/components/game/WordCard'
import RoundSummary from '@/components/game/RoundSummary'
import Button from '@/components/ui/Button'

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
	const [roundStarted, setRoundStarted] = useState(false)

	// useRef — позволяет хранить значение, доступное внутри callback-ов
	// без этого callback handleTimeUp будет видеть старые значения words
	const wordsRef = useRef(words)
	wordsRef.current = words
	const currentIndexRef = useRef(currentIndex)
	currentIndexRef.current = currentIndex

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
	const { timeLeft, start } = useTimer({
		initialTime: game?.roundTime ?? 60,
		onTimeUp: handleTimeUp,
	})

	// Загружаем данные игры и слова при открытии страницы
	useEffect(() => {
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

	// Обработка нажатия "Угадано" или "Пропуск"
	const handleGuess = (guessed: boolean) => {
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

	// Запуск раунда
	const handleStartRound = () => {
		setRoundStarted(true)
		start() // Запускаем таймер
	}

	if (loading || !game) {
		return (
			<Container>
				<div className='text-center py-12'>
					<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
				</div>
			</Container>
		)
	}

	const currentTeam = game.teams.find(t => t.order === game.currentTeamIndex)!
	const currentWord = currentIndex < words.length ? words[currentIndex] : null
	const noMoreWords = currentIndex >= words.length

	// Экран перед началом раунда
	if (!roundStarted) {
		return (
			<Container>
				<div className='flex flex-col items-center justify-center min-h-[calc(100vh-180px)]'>
					<p className='text-text-secondary mb-4'>Готовы? Нажмите кнопку, чтобы начать раунд</p>
					<Button
						size='xl'
						onClick={handleStartRound}
					>
						▶️ Начать раунд
					</Button>
				</div>
			</Container>
		)
	}

	return (
		<>
			{/* Основной экран — таймер, слово, кнопки */}
			<div className='flex flex-col h-[calc(100vh-57px)]'>
				{/* Таймер сверху */}
				<div className='pt-4 px-4'>
					<Timer
						timeLeft={timeLeft}
						totalTime={game.roundTime}
					/>
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
		</>
	)
}
