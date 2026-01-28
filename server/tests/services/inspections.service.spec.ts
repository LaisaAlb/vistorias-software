import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------- Mocks "hoisted-safe" ----------
const prismaMock = vi.hoisted(() => ({
  inspection: {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    findUnique: vi.fn(),
  },
}))

const busMock = vi.hoisted(() => ({
  emit: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }))
vi.mock('@/lib/bus', () => ({ bus: busMock }))

// ---------- Imports após mocks ----------
import { prisma } from '@/lib/prisma'
import { bus } from '@/lib/bus'
import { inspectionsService } from '@/services/inspections.service'

describe('inspectionsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // -----------------------
  // LIST
  // -----------------------
  describe('list', () => {
    it('SELLER deve filtrar por sellerId', async () => {
      ;(prisma.inspection.findMany as any).mockResolvedValue([])
      ;(prisma.inspection.count as any).mockResolvedValue(0)

      await inspectionsService.list({
        userId: 'seller-1',
        role: 'SELLER',
        page: 1,
        perPage: 10,
      })

      expect(prisma.inspection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ sellerId: 'seller-1' }),
        })
      )
    })

    it('INSPECTOR não deve filtrar por sellerId', async () => {
      ;(prisma.inspection.findMany as any).mockResolvedValue([])
      ;(prisma.inspection.count as any).mockResolvedValue(0)

      await inspectionsService.list({
        userId: 'inspector-1',
        role: 'INSPECTOR',
        page: 1,
        perPage: 10,
      })

      const call = (prisma.inspection.findMany as any).mock.calls[0]?.[0]
      expect(call.where?.sellerId).toBeUndefined()
    })

    it('status deve entrar no where', async () => {
      ;(prisma.inspection.findMany as any).mockResolvedValue([])
      ;(prisma.inspection.count as any).mockResolvedValue(0)

      await inspectionsService.list({
        userId: 'inspector-1',
        role: 'INSPECTOR',
        page: 1,
        perPage: 10,
        status: 'PENDING',
      })

      expect(prisma.inspection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'PENDING' }),
        })
      )
    })

    it('q deve aplicar OR (placa ou cliente)', async () => {
      ;(prisma.inspection.findMany as any).mockResolvedValue([])
      ;(prisma.inspection.count as any).mockResolvedValue(0)

      await inspectionsService.list({
        userId: 'inspector-1',
        role: 'INSPECTOR',
        page: 1,
        perPage: 10,
        q: 'joao',
      })

      expect(prisma.inspection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              expect.objectContaining({ plate: expect.any(Object) }),
              expect.objectContaining({ customerName: expect.any(Object) }),
            ],
          }),
        })
      )
    })

    it('q deve normalizar placa (ABC-1234 -> ABC1234) no filtro de plate', async () => {
      ;(prisma.inspection.findMany as any).mockResolvedValue([])
      ;(prisma.inspection.count as any).mockResolvedValue(0)

      await inspectionsService.list({
        userId: 'inspector-1',
        role: 'INSPECTOR',
        page: 1,
        perPage: 10,
        q: 'abc-1234',
      })

      const call = (prisma.inspection.findMany as any).mock.calls[0]?.[0]
      const or = call.where?.OR
      const plateFilter = or?.[0]?.plate
      expect(plateFilter).toEqual({ contains: 'ABC1234' })
    })

    it('quando não há q, mas há plate, deve filtrar por plate normalizada', async () => {
      ;(prisma.inspection.findMany as any).mockResolvedValue([])
      ;(prisma.inspection.count as any).mockResolvedValue(0)

      await inspectionsService.list({
        userId: 'inspector-1',
        role: 'INSPECTOR',
        page: 1,
        perPage: 10,
        plate: 'abc-1234',
      })

      const call = (prisma.inspection.findMany as any).mock.calls[0]?.[0]
      expect(call.where?.plate).toEqual({ contains: 'ABC1234' })
    })

    it('deve calcular paginação e meta corretamente', async () => {
      ;(prisma.inspection.findMany as any).mockResolvedValue([{ id: '1' }])
      ;(prisma.inspection.count as any).mockResolvedValue(21)

      const res = await inspectionsService.list({
        userId: 'inspector-1',
        role: 'INSPECTOR',
        page: 2,
        perPage: 10,
      })

      expect(prisma.inspection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 })
      )

      expect(res.meta.total).toBe(21)
      expect(res.meta.totalPages).toBe(3)
    })
  })

  // -----------------------
  // CREATE
  // -----------------------
  describe('create', () => {
    it('deve criar com plate normalizada e status PENDING', async () => {
      ;(prisma.inspection.create as any).mockResolvedValue({
        id: 'insp-1',
        sellerId: 'seller-1',
        customerName: 'João',
        plate: 'ABC1234',
        status: 'PENDING',
      })

      await inspectionsService.create({
        sellerId: 'seller-1',
        customerName: 'João',
        plate: 'abc-1234',
        vehicleModel: 'Civic',
        vehicleYear: 2020,
        value: '12000.50',
      })

      const call = (prisma.inspection.create as any).mock.calls[0]?.[0]
      expect(call.data.plate).toBe('ABC1234')
      expect(call.data.status).toBe('PENDING')
    })

    it('deve emitir evento inspection.created com inspectionId e sellerId', async () => {
      ;(prisma.inspection.create as any).mockResolvedValue({
        id: 'insp-1',
        sellerId: 'seller-1',
      })

      await inspectionsService.create({
        sellerId: 'seller-1',
        customerName: 'João',
        plate: 'abc-1234',
        vehicleModel: 'Civic',
        vehicleYear: 2020,
        value: '12000.50',
      })

      expect(bus.emit).toHaveBeenCalledWith('inspection.created', {
        inspectionId: 'insp-1',
        sellerId: 'seller-1',
      })
    })
  })

  // -----------------------
  // CHANGE STATUS
  // -----------------------
  describe('changeStatus', () => {
    it('retorna null se a inspeção não existir', async () => {
      ;(prisma.inspection.findUnique as any).mockResolvedValue(null)

      const res = await inspectionsService.changeStatus({
        inspectionId: 'missing',
        status: 'APPROVED',
      })

      expect(res).toBeNull()
      expect(prisma.inspection.update).not.toHaveBeenCalled()
    })

    it('lança INVALID_STATUS_TRANSITION se status atual não for PENDING', async () => {
      ;(prisma.inspection.findUnique as any).mockResolvedValue({
        id: 'insp-1',
        status: 'APPROVED',
      })

      await expect(
        inspectionsService.changeStatus({
          inspectionId: 'insp-1',
          status: 'REJECTED',
          rejectionReasonId: 'r1',
        })
      ).rejects.toThrow('INVALID_STATUS_TRANSITION')
    })

    it('lança REJECTION_REASON_REQUIRED se REJECTED sem rejectionReasonId', async () => {
      ;(prisma.inspection.findUnique as any).mockResolvedValue({
        id: 'insp-1',
        sellerId: 'seller-1',
        status: 'PENDING',
      })

      await expect(
        inspectionsService.changeStatus({
          inspectionId: 'insp-1',
          status: 'REJECTED',
        })
      ).rejects.toThrow('REJECTION_REASON_REQUIRED')
    })

    it('quando APPROVED, deve setar rejectionReasonId e rejectionComment como null e emitir evento', async () => {
      ;(prisma.inspection.findUnique as any).mockResolvedValue({
        id: 'insp-1',
        sellerId: 'seller-1',
        status: 'PENDING',
      })

      ;(prisma.inspection.update as any).mockResolvedValue({
        id: 'insp-1',
        sellerId: 'seller-1',
        status: 'APPROVED',
      })

      const res = await inspectionsService.changeStatus({
        inspectionId: 'insp-1',
        status: 'APPROVED',
      })

      expect(prisma.inspection.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'APPROVED',
            rejectionReasonId: null,
            rejectionComment: null,
          }),
        })
      )

      expect(bus.emit).toHaveBeenCalledWith('inspection.status_changed', {
        inspectionId: 'insp-1',
        sellerId: 'seller-1',
        status: 'APPROVED',
      })

      expect(res?.status).toBe('APPROVED')
    })

    it('quando REJECTED, deve setar rejectionReasonId e rejectionComment, incluir rejectionReason e emitir evento', async () => {
      ;(prisma.inspection.findUnique as any).mockResolvedValue({
        id: 'insp-1',
        sellerId: 'seller-1',
        status: 'PENDING',
      })

      ;(prisma.inspection.update as any).mockResolvedValue({
        id: 'insp-1',
        sellerId: 'seller-1',
        status: 'REJECTED',
        rejectionReason: { id: 'r1', title: 'Doc inválido' },
      })

      const res = await inspectionsService.changeStatus({
        inspectionId: 'insp-1',
        status: 'REJECTED',
        rejectionReasonId: 'r1',
        rejectionComment: 'foto ilegível',
      })

      expect(prisma.inspection.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'REJECTED',
            rejectionReasonId: 'r1',
            rejectionComment: 'foto ilegível',
          }),
          include: { rejectionReason: true },
        })
      )

      expect(bus.emit).toHaveBeenCalledWith('inspection.status_changed', {
        inspectionId: 'insp-1',
        sellerId: 'seller-1',
        status: 'REJECTED',
      })

      expect(res?.status).toBe('REJECTED')
      expect((res as any).rejectionReason?.id).toBe('r1')
    })
  })
})
