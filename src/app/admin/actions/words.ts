"use server"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createWord(prevState: any, formData: FormData) {
  const text = formData.get("text") as string;
  const categoryIdsStr = formData.get("categoryIds") as string;
  
  if (!text || text.trim().length === 0) {
    return { error: 'Текст слова обязателен' };
  }
  
  let categoryIds: number[] = [];
  try {
    categoryIds = JSON.parse(categoryIdsStr || '[]');
  } catch {
    return { error: 'Неверный формат категорий' };
  }
  
  if (categoryIds.length === 0) {
    return { error: 'Выберите хотя бы одну категорию' };
  }
  
  try {
    await prisma.word.create({
      data: {
        text: text.trim(),
        categories: {
          create: categoryIds.map(id => ({ categoryId: id }))
        }
      }
    });
    
    revalidatePath('/admin/words');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Слово уже существует' };
    }
    return { error: 'Ошибка при создании слова' };
  }
}

export async function updateWord(id: number, prevState: any, formData: FormData) {
  const text = formData.get("text") as string;
  const categoryIdsStr = formData.get("categoryIds") as string;
  
  if (!text || text.trim().length === 0) {
    return { error: 'Текст слова обязателен' };
  }
  
  let categoryIds: number[] = [];
  try {
    categoryIds = JSON.parse(categoryIdsStr || '[]');
  } catch {
    return { error: 'Неверный формат категорий' };
  }
  
  if (categoryIds.length === 0) {
    return { error: 'Выберите хотя бы одну категорию' };
  }
  
  try {
    // Удаляем старые связи и создаем новые
    await prisma.$transaction([
      prisma.wordCategory.deleteMany({
        where: { wordId: id }
      }),
      prisma.word.update({
        where: { id },
        data: {
          text: text.trim(),
          categories: {
            create: categoryIds.map(catId => ({ categoryId: catId }))
          }
        }
      })
    ]);
    
    revalidatePath('/admin/words');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Слово уже существует' };
    }
    return { error: 'Ошибка при обновлении слова' };
  }
}

export async function deleteWord(id: number) {
  try {
    await prisma.word.delete({
      where: { id }
    });
    
    revalidatePath('/admin/words');
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    return { error: 'Ошибка при удалении слова' };
  }
}

export async function bulkDeleteWords(ids: number[]) {
  try {
    await prisma.word.deleteMany({
      where: { id: { in: ids } }
    });
    
    revalidatePath('/admin/words');
    revalidatePath('/admin');
    
    return { success: true, count: ids.length };
  } catch (error) {
    return { error: 'Ошибка при удалении слов' };
  }
}
