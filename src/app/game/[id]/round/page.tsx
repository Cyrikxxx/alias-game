'use client'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { GameFromAPI, WordInRound } from '@/types'
import { getSessionId } from '@/lib/session'
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
	const [currentIndex, setCurrentIndex] = useState(0)
	const [showSummary, setShowSummary] = useState(false)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [isPaused, setIsPaused] = useState(false)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	const wordsRef = useRef(words)
	wordsRef.current = words
	const currentIndexRef = useRef(currentIndex)
	currentIndexRef.current = currentIndex
	const hasFetchedRef = useRef(false)

	useEffect(() => {
		audioRef.current = new Audio('/sounds/timer-end.mp3')
		audioRef.current.preload = 'auto'
		
		return () => {
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current = null
			}
		}
	}, [])

	const handleTimeUp = useCallback(() => {
		const updatedWords = [...wordsRef.current]
		if (currentIndexRef.current < updatedWords.length && updatedWords[currentIndexRef.current].guessed === null) {
			updatedWords[currentIndexRef.current] = {
				...updatedWords[currentIndexRef.current],
				guessed: false,
			}
		}
		setWords(updatedWords)
		setShowSummary(true)

		if (audioRef.current) {
			audioRef.current.play().catch(err => {
				console.error('Failed to play sound:', err)
			})
		}
	}, [])

	const { timeLeft, start, pause } = useTimer({
		initialTime: game?.roundTime ?? 60,
		onTimeUp: handleTimeUp,
	})

	useEffect(() => {
		if (hasFetchedRef.current) return
		hasFetchedRef.current = true

		const fetchData = async () => {
			try {
				const [gameRes, wordsRes] = await Promise.all([
					fetch(`/api/games/${gameId}`),
					fetch(`/api/games/${gameId}/words`),
				])

				if (gameRes.ok && wordsRes.ok) {
					const gameData = await gameRes.json()
					const wordsData = await wordsRes.json()

					setGame(gameData)
					setWords(
						wordsData.map((w: { id: number; text: string }) => ({
							wordId: w.id,
							text: w.text,
							guessed: null,
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

	useEffect(() => {
		if (!loading && game) {
			start()
		}
	}, [loading, game, start])

	const handleGuess = (guessed: boolean) => {
		const updated = [...words]
		updated[currentIndex] = { ...updated[currentIndex], guessed }
		setWords(updated)
		setCurrentIndex(prev => prev + 1)
	}

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

	const handleConfirm = async () => {
		if (!game || saving) return

		const currentTeam = game.teams.find(t => t.order === game.currentTeamIndex)
		
		if (!currentTeam) {
			console.error('Current team not found')
			return
		}

		const currentPlayer = currentTeam.players[currentTeam.currentPlayerIndex]
		const answeredWords = words.filter(w => w.guessed !== null)

		setSaving(true)
		try {
			const sessionId = getSessionId()
			const res = await fetch(`/api/games/${gameId}/rounds`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					teamId: currentTeam.id,
					playerName: currentPlayer.name,
					sessionId,
					words: answeredWords.map(w => ({
						wordId: w.wordId,
						guessed: w.guessed,
					})),
				}),
			})

			if (res.ok) {
				const result = await res.json()
				if (result.gameFinished) {
					router.replace(`/game/${gameId}/results`)
				} else {
					router.replace(`/game/${gameId}/turn`)
				}
			}
		} catch (error) {
			console.error('Failed to save round:', error)
		} finally {
			setSaving(false)
		}
	}

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

	const currentTeam = useMemo(() => 
		game?.teams.find(t => t.order === game.currentTeamIndex),
		[game]
	)

	if (loading || !game) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
			</div>
		)
	}
	
	if (!currentTeam) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<p className='text-danger'>Ошибка: команда не найдена</p>
			</div>
		)
	}

	const currentWord = currentIndex < words.length ? words[currentIndex] : null
	const noMoreWords = currentIndex >= words.length

	return (
		<>
			<div className='flex flex-col h-[calc(100vh-57px)]'>
				<div className='pt-4 px-4 relative'>
					<Timer
						timeLeft={timeLeft}
						totalTime={game.roundTime}
					/>
					<button
						onClick={handlePause}
						className='absolute top-4 right-4 bg-surface-light hover:bg-surface-lighter text-text-primary rounded-lg px-3 py-2 text-sm font-medium transition-colors'
					>
						⏸️ Пауза
					</button>
				</div>

				{noMoreWords ? (
					<div className='flex-1 flex items-center justify-center px-4'>
						<p className='text-text-secondary text-xl text-center'>Слова закончились! Ждите окончания таймера.</p>
					</div>
				) : currentWord ? (
					<WordCard word={currentWord.text} />
				) : null}

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

			<RoundSummary
				isOpen={showSummary}
				words={words.filter(w => w.guessed !== null)}
				onToggleWord={handleToggleWord}
				onConfirm={handleConfirm}
				penaltySkip={game.penaltySkip}
				teamName={currentTeam.name}
			/>

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
