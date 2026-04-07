"use client"
import { useState } from 'react';
import CategoryModal from './CategoryModal';
import { deleteCategory } from '@/app/admin/actions/categories';

type Category = {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  _count: {
    words: number;
  };
};

export default function CategoriesTable({ categories }: { categories: Category[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Удалить категорию "${name}"?`)) {
      await deleteCategory(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <>
      <div className='bg-surface rounded-2xl p-6'>
        <div className='flex justify-between items-center mb-4'>
          <p className='text-text-secondary'>Всего категорий: {categories.length}</p>
          <button
            onClick={handleCreate}
            className='px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors'
          >
            Добавить категорию
          </button>
        </div>

        {categories.length === 0 ? (
          <p className='text-text-secondary text-center py-8'>Категорий пока нет</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-surface-light'>
                  <th className='text-left py-3 px-4 text-text-secondary font-medium'>ID</th>
                  <th className='text-left py-3 px-4 text-text-secondary font-medium'>Название</th>
                  <th className='text-left py-3 px-4 text-text-secondary font-medium'>Slug</th>
                  <th className='text-left py-3 px-4 text-text-secondary font-medium'>Слов</th>
                  <th className='text-right py-3 px-4 text-text-secondary font-medium'>Действия</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className='border-b border-surface-light hover:bg-surface-light transition-colors'>
                    <td className='py-3 px-4 text-text-primary'>{category.id}</td>
                    <td className='py-3 px-4 text-text-primary font-medium'>{category.name}</td>
                    <td className='py-3 px-4 text-text-secondary'>{category.slug}</td>
                    <td className='py-3 px-4 text-text-secondary'>{category._count.words}</td>
                    <td className='py-3 px-4 text-right'>
                      <button
                        onClick={() => handleEdit(category)}
                        className='text-primary hover:text-primary-hover mr-3 transition-colors'
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className='text-danger hover:text-danger-hover transition-colors'
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
      />
    </>
  );
}
