"use server"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategory(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  
  if (!name || name.trim().length === 0) {
    return { error: 'Название категории обязательно' };
  }
  
  const slug = name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
  
  try {
    await prisma.category.create({ 
      data: { name: name.trim(), slug } 
    });
    
    // Сбрасываем кеш на страницах игры и админки
    revalidatePath('/game/settings');
    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Категория с таким названием уже существует' };
    }
    return { error: 'Ошибка при создании категории' };
  }
}

export async function updateCategory(id: number, prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  
  if (!name || name.trim().length === 0) {
    return { error: 'Название категории обязательно' };
  }
  
  const slug = name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
  
  try {
    await prisma.category.update({
      where: { id },
      data: { name: name.trim(), slug }
    });
    
    revalidatePath('/game/settings');
    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Категория с таким названием уже существует' };
    }
    return { error: 'Ошибка при обновлении категории' };
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({
      where: { id }
    });
    
    revalidatePath('/game/settings');
    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    
    redirect('/admin/categories');
  } catch (error) {
    return { error: 'Ошибка при удалении категории' };
  }
}
