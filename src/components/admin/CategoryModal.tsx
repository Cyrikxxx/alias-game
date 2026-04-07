"use client"
import { useActionState, useEffect } from 'react';
import { createCategory, updateCategory } from '@/app/admin/actions/categories';
import SubmitButton from './SubmitButton';

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function CategoryModal({ 
  isOpen, 
  onClose, 
  category 
}: { 
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}) {
  const action = category ? updateCategory.bind(null, category.id) : createCategory;
  const [state, formAction] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-surface p-6 rounded-2xl w-full max-w-md'>
        <h2 className='text-xl font-bold text-text-primary mb-4'>
          {category ? 'Редактировать категорию' : 'Новая категория'}
        </h2>
        
        <form action={formAction} className='space-y-4'>
          <div>
            <label className='block text-text-secondary mb-2'>Название</label>
            <input
              type='text'
              name='name'
              defaultValue={category?.name}
              className='w-full px-4 py-3 rounded-xl bg-surface-light text-text-primary border-2 border-surface-light focus:border-primary outline-none'
              required
              autoFocus
            />
          </div>
          
          {state?.error && (
            <p className='text-danger text-sm'>{state.error}</p>
          )}
          
          <div className='flex gap-2'>
            <SubmitButton>{category ? 'Сохранить' : 'Создать'}</SubmitButton>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-3 rounded-xl bg-surface-light text-text-secondary hover:text-text-primary transition-all'
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
