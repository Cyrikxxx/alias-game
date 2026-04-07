import Link from 'next/link';
import { logoutAction } from './actions/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-background'>
      <div className='flex'>
        {/* Боковое меню */}
        <aside className='w-64 bg-surface min-h-screen p-6'>
          <h1 className='text-xl font-bold text-text-primary mb-8'>Админ-панель</h1>
          
          <nav className='space-y-2'>
            <Link 
              href='/admin' 
              className='block px-4 py-2 rounded-lg text-text-secondary hover:bg-surface-light hover:text-text-primary transition-colors'
            >
              Dashboard
            </Link>
            <Link 
              href='/admin/categories' 
              className='block px-4 py-2 rounded-lg text-text-secondary hover:bg-surface-light hover:text-text-primary transition-colors'
            >
              Категории
            </Link>
            <Link 
              href='/admin/words' 
              className='block px-4 py-2 rounded-lg text-text-secondary hover:bg-surface-light hover:text-text-primary transition-colors'
            >
              Слова
            </Link>
          </nav>

          <form action={logoutAction} className='mt-8'>
            <button 
              type='submit'
              className='w-full px-4 py-2 rounded-lg bg-danger text-white hover:bg-danger-hover transition-colors'
            >
              Выйти
            </button>
          </form>
        </aside>

        {/* Основной контент */}
        <main className='flex-1 p-8'>
          {children}
        </main>
      </div>
    </div>
  );
}
