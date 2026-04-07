"use server"
import { redirect } from 'next/navigation';
import { setAuthCookie, clearAuthCookie } from '@/lib/auth';

export async function loginAction(prevState: any, formData: FormData) {
  const password = formData.get('password') as string;
  
  if (!password) {
    return { error: 'Введите пароль' };
  }
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Неверный пароль' };
  }
  
  await setAuthCookie(password);
  redirect('/admin');
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect('/admin/login');
}
