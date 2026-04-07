export default function AdminLoading() {
  return (
    <div>
      <div className='h-9 w-48 bg-surface rounded-lg animate-pulse mb-8'></div>

      {/* Скелетон статистики */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-surface p-6 rounded-2xl'>
          <div className='h-4 w-32 bg-surface-light rounded animate-pulse mb-2'></div>
          <div className='h-10 w-20 bg-surface-light rounded animate-pulse'></div>
        </div>
        
        <div className='bg-surface p-6 rounded-2xl'>
          <div className='h-4 w-32 bg-surface-light rounded animate-pulse mb-2'></div>
          <div className='h-10 w-20 bg-surface-light rounded animate-pulse'></div>
        </div>
      </div>

      {/* Скелетон списка категорий */}
      <div className='bg-surface p-6 rounded-2xl'>
        <div className='flex justify-between items-center mb-4'>
          <div className='h-7 w-48 bg-surface-light rounded animate-pulse'></div>
          <div className='h-5 w-32 bg-surface-light rounded animate-pulse'></div>
        </div>

        <div className='space-y-3'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i}
              className='flex justify-between items-center p-3 bg-surface-light rounded-lg'
            >
              <div className='space-y-2'>
                <div className='h-5 w-32 bg-background rounded animate-pulse'></div>
                <div className='h-4 w-24 bg-background rounded animate-pulse'></div>
              </div>
              <div className='h-4 w-16 bg-background rounded animate-pulse'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
