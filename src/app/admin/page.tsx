import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPage() {
  // Прямой доступ к БД через Prisma
  const [categoriesCount, wordsCount, categories] = await prisma.$transaction([
    prisma.category.count(),
    prisma.word.count(),
    prisma.category.findMany({
      include: {
        _count: {
          select: { words: true }
        }
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <div>
      <h1 className='text-3xl font-bold text-text-primary mb-8'>Dashboard</h1>

      {/* Статистика */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-surface p-6 rounded-2xl'>
          <h3 className='text-text-secondary text-sm mb-2'>Всего категорий</h3>
          <p className='text-4xl font-bold text-text-primary'>{categoriesCount}</p>
        </div>
        
        <div className='bg-surface p-6 rounded-2xl'>
          <h3 className='text-text-secondary text-sm mb-2'>Всего слов</h3>
          <p className='text-4xl font-bold text-text-primary'>{wordsCount}</p>
        </div>
      </div>

      {/* Последние категории */}
      <div className='bg-surface p-6 rounded-2xl'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-text-primary'>Последние категории</h2>
          <Link 
            href='/admin/categories'
            className='text-primary hover:text-primary-hover transition-colors'
          >
            Все категории →
          </Link>
        </div>

        {categories.length === 0 ? (
          <p className='text-text-secondary'>Категорий пока нет</p>
        ) : (
          <div className='space-y-3'>
            {categories.map((category) => (
              <div 
                key={category.id}
                className='flex justify-between items-center p-3 bg-surface-light rounded-lg'
              >
                <div>
                  <p className='text-text-primary font-medium'>{category.name}</p>
                  <p className='text-text-secondary text-sm'>{category.slug}</p>
                </div>
                <span className='text-text-secondary text-sm'>
                  {category._count.words} слов
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
