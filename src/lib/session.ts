export function getSessionId(): string {
	if (typeof window === 'undefined') return ''

	let sessionId = localStorage.getItem('alias_session_id')

	if (!sessionId) {
		sessionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
		localStorage.setItem('alias_session_id', sessionId)
	}

	return sessionId
}
