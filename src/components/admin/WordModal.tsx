"use client"
import { useActionState, useEffect, useState } from 'react';
import { createWord, updateWord } from '@/app/admin/actions/words';
import SubmitButton from './SubmitButton';

type Word = {
  id: number;
  text: string;
  categories: Array<{
    category: {
      id: number;
      name: string;
    };
  }>;
};

type Category = {
  id: number;
  name: string;
};

export default function WordModal({ 
  isOpen, 
  onClose, 
  word,
  categories
}: { 
  isOpen: boolean;
  onClose: () => void;
  word?: Word | null;
  categories: Category[];
}) {
  const action = word ? updateWord.bind(null, word.id) : createWord;
  const [state, formAction] = useActionState(action, null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    word?.categories.map(wc => wc.category.id) || []
  );

  useEffect(() => {
    if (word) {
      setSelectedCategories(word.categories.map(wc => wc.category.id));
    } else {
      setSelectedCategories([]);
    }
  }, [word]);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-surface p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        <h2 className='text-xl font-bold text-text-primary mb-4'>
          {word ? 'Редактировать слово' : 'Новое слово'}
        </h2>
        
        <form action={formAction} className='space-y-4'>
          <div>
            <label className='block text-text-secondary mb-2'>Текст слова</label>
            <input
              type='text'
              name='text'
              defaultValue={word?.text}
              className='w-full px-4 py-3 rounded-xl bg-surface-light text-text-primary border-2 border-surface-light focus:border-primary outline-none'
              required
              autoFocus
            />
          </div>

          <div>
            <label className='block text-text-secondary mb-2'>Категории</label>
            <div className='space-y-2 max-h-60 overflow-y-auto p-2 bg-surface-light rounded-xl'>
              {categories.map((category) => (
                <label
                  key={category.id}
                  className='flex items-center gap-2 p-2 hover:bg-background rounded-lg cursor-pointer transition-colors'
                >
                  <input
                    type='checkbox'
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className='w-4 h-4'
                  />
                  <span className='text-text-primary'>{category.name}</span>
                </label>
              ))}
            </div>
            <input
              type='hidden'
              name='categoryIds'
              value={JSON.stringify(selectedCategories)}
            />
          </div>
          
          {state?.error && (
            <p className='text-danger text-sm'>{state.error}</p>
          )}
          
          <div className='flex gap-2'>
            <SubmitButton>{word ? 'Сохранить' : 'Создать'}</SubmitButton>
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
