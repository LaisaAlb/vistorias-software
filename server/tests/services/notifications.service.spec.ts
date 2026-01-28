import { describe, it, expect, vi, beforeEach } from 'vitest'

const prismaMock = vi.hoisted(() => ({
  notification: {
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    updateMany: vi.fn(),
  },
}))

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }))

import { prisma } from '@/lib/prisma'
import { notificationsService } from '@/services/notifications.service'

describe('notificationsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('create deve chamar prisma.notification.create com data correta', async () => {
    ;(prisma.notification.create as any).mockResolvedValue({ id: 'n1' })

    await notificationsService.create('u1', 'Titulo', 'Mensagem')

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: { userId: 'u1', title: 'Titulo', message: 'Mensagem' },
    })
  })

  it('listForUser deve filtrar por userId e ordenar desc (take 50)', async () => {
    ;(prisma.notification.findMany as any).mockResolvedValue([])

    await notificationsService.listForUser('u1')

    expect(prisma.notification.findMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  })

  it('unreadCount deve contar apenas readAt null', async () => {
    ;(prisma.notification.count as any).mockResolvedValue(3)

    const res = await notificationsService.unreadCount('u1')

    expect(prisma.notification.count).toHaveBeenCalledWith({
      where: { userId: 'u1', readAt: null },
    })
    expect(res).toBe(3)
  })

  it('markAsRead deve retornar null quando updateMany.count = 0', async () => {
    ;(prisma.notification.updateMany as any).mockResolvedValue({ count: 0 })

    const res = await notificationsService.markAsRead('u1', 'n1')

    expect(res).toBeNull()
  })

  it('markAsRead deve retornar { ok: true } quando updateMany.count > 0', async () => {
    ;(prisma.notification.updateMany as any).mockResolvedValue({ count: 1 })

    const res = await notificationsService.markAsRead('u1', 'n1')

    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: { id: 'n1', userId: 'u1', readAt: null },
      data: { readAt: expect.any(Date) },
    })
    expect(res).toEqual({ ok: true })
  })
})
