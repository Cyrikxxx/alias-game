'use client'
// "use client" говорит Next.js, что этот код работает в БРАУЗЕРЕ
// (а не на сервере). Хуки React работают только в браузере.

import { useState, useEffect, useCallback, useRef } from 'react'

// Описываем какие параметры принимает хук
interface UseTimerOptions {
	initialTime: number // Начальное время (в секундах)
	onTimeUp?: () => void // Функция, которая вызовется когда время выйдет
	autoStart?: boolean // Запускать ли сразу?
}

export function useTimer({ initialTime, onTimeUp, autoStart = false }: UseTimerOptions) {
	// useState — хранит значение, которое может меняться
	// При изменении React автоматически перерисовывает компонент
	const [timeLeft, setTimeLeft] = useState(initialTime)
	const [isRunning, setIsRunning] = useState(autoStart)

	// useRef — хранит значение, которое НЕ вызывает перерисовку
	// Нужно чтобы callback всегда был актуальным внутри setInterval
	const onTimeUpRef = useRef(onTimeUp)
	onTimeUpRef.current = onTimeUp

	// useEffect — выполняет "побочный эффект" (в данном случае — запускает интервал)
	// Выполняется когда isRunning или timeLeft изменяются
	useEffect(() => {
		// Если таймер не запущен или время вышло — ничего не делаем
		if (!isRunning || timeLeft <= 0) return

		// setInterval — вызывает функцию каждые 1000мс (1 секунда)
		const interval = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					// Время вышло!
					setIsRunning(false)
					clearInterval(interval)
					// Вызываем callback (например, показать итоги раунда)
					setTimeout(() => onTimeUpRef.current?.(), 0)
					return 0
				}
				return prev - 1 // Уменьшаем на 1 секунду
			})
		}, 1000)

		// Функция очистки — вызывается когда компонент уничтожается
		// или когда useEffect перезапускается
		return () => clearInterval(interval)
	}, [isRunning, timeLeft])

	// useCallback — запоминает функцию, чтобы не создавать новую каждый рендер
	const start = useCallback(() => setIsRunning(true), [])
	const pause = useCallback(() => setIsRunning(false), [])
	const reset = useCallback(() => {
		setTimeLeft(initialTime)
		setIsRunning(false)
	}, [initialTime])

	// Возвращаем объект с данными и функциями управления
	return { timeLeft, isRunning, start, pause, reset }
}
