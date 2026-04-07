import prisma from '@/lib/prisma';
import CategoriesTable from '@/components/admin/CategoriesTable';

export default async function CategoriesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string }> 
}) {
  const params = await searchParams;
  const search = params.search || '';
  
  // Прямой доступ к БД
  const categories = await prisma.category.findMany({
    where: search ? {
      name: { contains: search, mode: 'insensitive' }
    } : undefined,
    include: { 
      _count: { 
        select: { words: true } 
      } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-text-primary'>Категории</h1>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  );
}
