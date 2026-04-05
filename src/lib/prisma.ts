// Этот файл создаёт ОДИН экземпляр Prisma Client
// и переиспользует его во всех запросах
//
// Зачем? В режиме разработки Next.js перезагружает код при изменениях.
// Без этого файла при каждой перезагрузке создавался бы новый клиент,
// и через несколько минут их стало бы слишком много — база данных
// отказала бы в подключении.

import { PrismaClient } from '@prisma/client'

// Хитрость: сохраняем клиент в глобальную переменную
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma
}

export default prisma
