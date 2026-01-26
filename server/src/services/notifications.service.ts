import { prisma } from '@/lib/prisma'

export const notificationsService = {
  create: (userId: string, title: string, message: string) =>
    prisma.notification.create({ data: { userId, title, message } }),

  listForUser: (userId: string) =>
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),

  unreadCount: (userId: string) =>
    prisma.notification.count({ where: { userId, readAt: null } }),

  async markAsRead(userId: string, id: string) {
    const result = await prisma.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt: new Date() },
    })

    if (result.count === 0) {
      return null
    }

    return { ok: true }
  },
}
