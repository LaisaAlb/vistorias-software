import { describe, it, expect, vi, beforeEach } from 'vitest'

const prismaMock = vi.hoisted(() => ({
  rejectionReason: {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }))

import { prisma } from '@/lib/prisma'
import { reasonsService } from '@/services/reasons.service'

describe('reasonsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('list deve ordenar por title asc', async () => {
    ;(prisma.rejectionReason.findMany as any).mockResolvedValue([])

    await reasonsService.list()

    expect(prisma.rejectionReason.findMany).toHaveBeenCalledWith({
      orderBy: { title: 'asc' },
    })
  })

  it('create deve criar com title', async () => {
    ;(prisma.rejectionReason.create as any).mockResolvedValue({ id: 'r1' })

    await reasonsService.create('Doc ilegível')

    expect(prisma.rejectionReason.create).toHaveBeenCalledWith({
      data: { title: 'Doc ilegível' },
    })
  })

  it('update deve atualizar title por id', async () => {
    ;(prisma.rejectionReason.update as any).mockResolvedValue({ id: 'r1' })

    await reasonsService.update('r1', 'Novo título')

    expect(prisma.rejectionReason.update).toHaveBeenCalledWith({
      where: { id: 'r1' },
      data: { title: 'Novo título' },
    })
  })

  it('remove deve deletar por id', async () => {
    ;(prisma.rejectionReason.delete as any).mockResolvedValue({ id: 'r1' })

    await reasonsService.remove('r1')

    expect(prisma.rejectionReason.delete).toHaveBeenCalledWith({
      where: { id: 'r1' },
    })
  })
})
