import { cookies } from 'next/headers';

// Функция для создания хеша с использованием Web Crypto API
async function createHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Генерация простого токена
export async function generateToken(password: string): Promise<string> {
  return await createHash(password + process.env.ADMIN_PASSWORD);
}

// Проверка токена из cookies
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  
  if (!token) return false;
  
  const validToken = await generateToken(process.env.ADMIN_PASSWORD!);
  return token === validToken;
}

// Установка токена в cookies
export async function setAuthCookie(password: string) {
  const cookieStore = await cookies();
  const token = await generateToken(password);
  
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 дней
    path: '/'
  });
}

// Удаление токена из cookies
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
}
