import { prisma } from '@/lib/prisma'

export const reasonsService = {
  list: () => prisma.rejectionReason.findMany({ orderBy: { title: 'asc' } }),

  create: (title: string) =>
    prisma.rejectionReason.create({ data: { title } }),

  update: (id: string, title: string) =>
    prisma.rejectionReason.update({ where: { id }, data: { title } }),

  remove: (id: string) =>
    prisma.rejectionReason.delete({ where: { id } }),
}
