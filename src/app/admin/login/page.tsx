"use client"
import { useActionState } from 'react';
import { loginAction } from '@/app/admin/actions/auth';
import SubmitButton from '@/components/admin/SubmitButton';

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='bg-surface p-8 rounded-2xl w-full max-w-md'>
        <h1 className='text-2xl font-bold text-text-primary mb-6'>Вход в админ-панель</h1>
        
        <form action={formAction} className='space-y-4'>
          <div>
            <label className='block text-text-secondary mb-2'>Пароль</label>
            <input
              type='password'
              name='password'
              className='w-full px-4 py-3 rounded-xl bg-surface-light text-text-primary border-2 border-surface-light focus:border-primary outline-none'
              autoFocus
            />
          </div>
          
          {state?.error && (
            <p className='text-danger text-sm'>{state.error}</p>
          )}
          
          <SubmitButton>Войти</SubmitButton>
        </form>
      </div>
    </div>
  );
}
