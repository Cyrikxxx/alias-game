import prisma from '@/lib/prisma';
import WordsTable from '@/components/admin/WordsTable';

export default async function WordsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string; categoryId?: string; page?: string }> 
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || '';
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const perPage = 50;
  
  // Прямой доступ к БД с пагинацией и фильтрацией
  const [words, total, categories] = await prisma.$transaction([
    prisma.word.findMany({
      where: {
        text: search ? { contains: search, mode: 'insensitive' } : undefined,
        ...(categoryId && {
          categories: { some: { categoryId } }
        })
      },
      include: {
        categories: { 
          include: { category: true } 
        }
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.word.count({
      where: {
        text: search ? { contains: search, mode: 'insensitive' } : undefined,
        ...(categoryId && {
          categories: { some: { categoryId } }
        })
      }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-text-primary'>Слова</h1>
      </div>

      <WordsTable 
        words={words} 
        categories={categories}
        total={total}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
