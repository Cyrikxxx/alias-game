"use client"
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import WordModal from './WordModal';
import { deleteWord, bulkDeleteWords } from '@/app/admin/actions/words';

type Word = {
  id: number;
  text: string;
  createdAt: Date;
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

export default function WordsTable({ 
  words, 
  categories,
  total,
  page,
  totalPages
}: { 
  words: Word[];
  categories: Category[];
  total: number;
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingWord(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, text: string) => {
    if (confirm(`Удалить слово "${text}"?`)) {
      await deleteWord(id);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Удалить выбранные слова (${selectedIds.length})?`)) {
      await bulkDeleteWords(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWord(null);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === words.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(words.map(w => w.id));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchText) {
      params.set('search', searchText);
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <div className='bg-surface rounded-2xl p-6'>
        {/* Поиск и фильтры */}
        <div className='mb-4 flex gap-4'>
          <form onSubmit={handleSearch} className='flex-1 flex gap-2'>
            <input
              type='text'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder='Поиск по тексту...'
              className='flex-1 px-4 py-2 rounded-xl bg-surface-light text-text-primary border-2 border-surface-light focus:border-primary outline-none'
            />
            <button
              type='submit'
              className='px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors'
            >
              Найти
            </button>
          </form>
        </div>

        {/* Действия */}
        <div className='flex justify-between items-center mb-4'>
          <div className='flex gap-2 items-center'>
            <p className='text-text-secondary'>Всего слов: {total}</p>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className='ml-4 px-3 py-1 bg-danger text-white rounded-lg hover:bg-danger-hover transition-colors text-sm'
              >
                Удалить выбранные ({selectedIds.length})
              </button>
            )}
          </div>
          <button
            onClick={handleCreate}
            className='px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors'
          >
            Добавить слово
          </button>
        </div>

        {words.length === 0 ? (
          <p className='text-text-secondary text-center py-8'>Слов пока нет</p>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-surface-light'>
                    <th className='text-left py-3 px-4'>
                      <input
                        type='checkbox'
                        checked={selectedIds.length === words.length}
                        onChange={toggleSelectAll}
                        className='w-4 h-4'
                      />
                    </th>
                    <th className='text-left py-3 px-4 text-text-secondary font-medium'>ID</th>
                    <th className='text-left py-3 px-4 text-text-secondary font-medium'>Текст</th>
                    <th className='text-left py-3 px-4 text-text-secondary font-medium'>Категории</th>
                    <th className='text-right py-3 px-4 text-text-secondary font-medium'>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((word) => (
                    <tr key={word.id} className='border-b border-surface-light hover:bg-surface-light transition-colors'>
                      <td className='py-3 px-4'>
                        <input
                          type='checkbox'
                          checked={selectedIds.includes(word.id)}
                          onChange={() => toggleSelect(word.id)}
                          className='w-4 h-4'
                        />
                      </td>
                      <td className='py-3 px-4 text-text-primary'>{word.id}</td>
                      <td className='py-3 px-4 text-text-primary font-medium'>{word.text}</td>
                      <td className='py-3 px-4'>
                        <div className='flex gap-1 flex-wrap'>
                          {word.categories.map((wc) => (
                            <span 
                              key={wc.category.id}
                              className='px-2 py-1 bg-surface-light text-text-primary rounded text-xs'
                            >
                              {wc.category.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className='py-3 px-4 text-right'>
                        <button
                          onClick={() => handleEdit(word)}
                          className='text-primary hover:text-primary-hover mr-3 transition-colors'
                        >
                          Изменить
                        </button>
                        <button
                          onClick={() => handleDelete(word.id, word.text)}
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

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className='flex justify-center gap-2 mt-6'>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className='px-4 py-2 rounded-lg bg-surface-light text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background transition-colors'
                >
                  Назад
                </button>
                <span className='px-4 py-2 text-text-primary'>
                  Страница {page} из {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className='px-4 py-2 rounded-lg bg-surface-light text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background transition-colors'
                >
                  Вперед
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <WordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        word={editingWord}
        categories={categories}
      />
    </>
  );
}
