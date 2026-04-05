'use client'

import { useState, useEffect } from 'react'

// Хук для работы с localStorage
// localStorage — это хранилище в браузере, которое сохраняется
// даже после закрытия вкладки
export function useLocalStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(initialValue)
	const [isLoaded, setIsLoaded] = useState(false)

	// При первом рендере читаем значение из localStorage
	useEffect(() => {
		try {
			const item = window.localStorage.getItem(key)
			if (item) {
				setStoredValue(JSON.parse(item)) // JSON.parse превращает строку обратно в объект
			}
		} catch (error) {
			console.error(error)
		}
		setIsLoaded(true)
	}, [key])

	// Функция для сохранения нового значения
	const setValue = (value: T | ((val: T) => T)) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value
			setStoredValue(valueToStore)
			window.localStorage.setItem(key, JSON.stringify(valueToStore)) // JSON.stringify превращает объект в строку
		} catch (error) {
			console.error(error)
		}
	}

	return { value: storedValue, setValue, isLoaded } as const
}
