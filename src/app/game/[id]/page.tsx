import { redirect } from 'next/navigation'

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	redirect(`/game/${id}/turn`)
}
