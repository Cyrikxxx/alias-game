"use client"
import { useFormStatus } from 'react-dom';

export default function SubmitButton({ 
  children = 'Сохранить',
  variant = 'primary' 
}: { 
  children?: string;
  variant?: 'primary' | 'danger';
}) {
  const { pending } = useFormStatus();
  
  const baseClasses = 'w-full px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50';
  const variantClasses = variant === 'primary' 
    ? 'bg-primary text-white hover:bg-primary-hover' 
    : 'bg-danger text-white hover:bg-danger-hover';
  
  return (
    <button
      type='submit'
      disabled={pending}
      className={`${baseClasses} ${variantClasses}`}
    >
      {pending ? 'Загрузка...' : children}
    </button>
  );
}
