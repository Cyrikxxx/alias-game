export default function RoundLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='h-[calc(100vh-72px)] overflow-hidden'>
			{children}
		</div>
	)
}
