import { authenticate } from '@/services/auth.service';
import { describe, it, expect, vi, beforeEach } from 'vitest'

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
  },
}))

const comparePasswordMock = vi.hoisted(() => vi.fn())

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }))
vi.mock('@/lib/password', () => ({ comparePassword: comparePasswordMock }))

import { prisma } from '@/lib/prisma'

describe('authenticate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna null quando usuário não existe', async () => {
    ;(prisma.user.findUnique as any).mockResolvedValue(null)

    const res = await authenticate('a@a.com', '123')

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'a@a.com' } })
    expect(res).toBeNull()
  })

  it('retorna null quando senha é inválida', async () => {
    ;(prisma.user.findUnique as any).mockResolvedValue({
      id: 'u1',
      email: 'a@a.com',
      passwordHash: 'hash',
    })
    ;(comparePasswordMock as any).mockResolvedValue(false)

    const res = await authenticate('a@a.com', 'wrong')

    expect(comparePasswordMock).toHaveBeenCalledWith('wrong', 'hash')
    expect(res).toBeNull()
  })

  it('retorna user quando senha é válida', async () => {
    const user = { id: 'u1', email: 'a@a.com', passwordHash: 'hash' }
    ;(prisma.user.findUnique as any).mockResolvedValue(user)
    ;(comparePasswordMock as any).mockResolvedValue(true)

    const res = await authenticate('a@a.com', 'ok')

    expect(comparePasswordMock).toHaveBeenCalledWith('ok', 'hash')
    expect(res).toEqual(user)
  })
})
