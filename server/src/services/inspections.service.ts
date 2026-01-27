import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { bus } from '@/lib/bus'

function normalizePlate(value: string) {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

export const inspectionsService = {
  async create(input: {
    sellerId: string
    customerName: string
    plate: string
    vehicleModel: string
    vehicleYear: number
    value: string
  }) {
    const inspection = await prisma.inspection.create({
      data: {
        sellerId: input.sellerId,
        customerName: input.customerName,
        plate: normalizePlate(input.plate), // <- normaliza placa
        vehicleModel: input.vehicleModel,
        vehicleYear: input.vehicleYear,
        value: new Prisma.Decimal(input.value),
        status: 'PENDING',
      },
    })

    bus.emit('inspection.created', {
      inspectionId: inspection.id,
      sellerId: inspection.sellerId,
    })

    return inspection
  },

  async changeStatus(input: {
    inspectionId: string
    status: 'APPROVED' | 'REJECTED'
    rejectionReasonId?: string
    rejectionComment?: string
  }) {
    const inspection = await prisma.inspection.findUnique({
      where: { id: input.inspectionId },
    })
    if (!inspection) return null

    if (inspection.status !== 'PENDING') {
      throw new Error('INVALID_STATUS_TRANSITION')
    }

    if (input.status === 'REJECTED' && !input.rejectionReasonId) {
      throw new Error('REJECTION_REASON_REQUIRED')
    }

    const updated = await prisma.inspection.update({
      where: { id: input.inspectionId },
      data: {
        status: input.status,
        rejectionReasonId: input.status === 'REJECTED' ? input.rejectionReasonId : null,
        rejectionComment: input.status === 'REJECTED' ? input.rejectionComment : null,
      },
      include: { rejectionReason: true },
    })

    bus.emit('inspection.status_changed', {
      inspectionId: updated.id,
      sellerId: updated.sellerId,
      status: input.status,
    })

    return updated
  },

  async list(input: {
    userId: string
    role: 'SELLER' | 'INSPECTOR'
    page: number
    perPage: number
    status?: 'PENDING' | 'APPROVED' | 'REJECTED'
    q?: string // <- busca por placa OU cliente
    plate?: string // (opcional) se você ainda quiser manter compatível
  }) {
    const where: Prisma.InspectionWhereInput = {}

    if (input.role === 'SELLER') where.sellerId = input.userId
    if (input.status) where.status = input.status

    const q = input.q?.trim()
    const plate = input.plate?.trim()

    if (q) {
      const plateQ = normalizePlate(q)

      where.OR = [
        { plate: { contains: plateQ } }, 
        { customerName: { contains: q, mode: 'insensitive' } }, 
      ]
    } else if (plate) {
      where.plate = { contains: normalizePlate(plate) }
    }

    const skip = (input.page - 1) * input.perPage

    const [items, total] = await Promise.all([
      prisma.inspection.findMany({
        where,
        include: { rejectionReason: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: input.perPage,
      }),
      prisma.inspection.count({ where }),
    ])

    return {
      items,
      meta: {
        page: input.page,
        perPage: input.perPage,
        total,
        totalPages: Math.ceil(total / input.perPage),
      },
    }
  },
}

