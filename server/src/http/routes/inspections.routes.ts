import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { requireAuth } from '@/http/middlewares/auth'
import { requireRole } from '@/http/middlewares/role'
import { inspectionsService } from '@/services/inspections.service'

export async function inspectionsRoutes(app: FastifyInstance) {
  app.get(
    '/inspections',
    {
      preHandler: [requireAuth],
      schema: {
        tags: ['inspections'],
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          perPage: z.coerce.number().min(1).max(50).default(10),
          status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
          q: z.string().optional(),
          plate: z.string().optional(),
        }),
      },
    },
    async (request) => {
      const { page, perPage, status, q, plate } = request.query as any
      const user = request.user as any

      return inspectionsService.list({
        userId: user.sub,
        role: user.role,
        page,
        perPage,
        status,
        q,
        plate,
      })
    }
  )


  app.post(
    '/inspections',
    {
      preHandler: [requireAuth, requireRole(['SELLER'])],
      schema: {
        tags: ['inspections'],
        body: z.object({
          customerName: z.string().min(2),
          plate: z.string().min(6),
          vehicleModel: z.string().min(2),
          vehicleYear: z.coerce.number().int().min(1900).max(2100),
          value: z.string().min(1), // ex: "12000.50"
        }),
      },
    },
    async (request, reply) => {
      const body = request.body as any
      const user = request.user as any

      const created = await inspectionsService.create({
        sellerId: user.sub,
        ...body,
      })

      return reply.status(201).send(created)
    }
  )

  app.patch(
    '/inspections/:id/status',
    {
      preHandler: [requireAuth, requireRole(['INSPECTOR'])],
      schema: {
        tags: ['inspections'],
        params: z.object({ id: z.string() }),
        body: z.object({
          status: z.enum(['APPROVED', 'REJECTED']),
          rejectionReasonId: z.string().optional(),
          rejectionComment: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params as any
      const { status, rejectionReasonId, rejectionComment } = request.body as any

      try {
        const updated = await inspectionsService.changeStatus({
          inspectionId: id,
          status,
          rejectionReasonId,
          rejectionComment,
        })

        if (!updated) return reply.status(404).send({ message: 'Not found' })
        return reply.send(updated)
      } catch (err: any) {
        if (err?.message === 'REJECTION_REASON_REQUIRED') {
          return reply.status(400).send({ message: 'Rejection reason is required' })
        }
        if (err?.message === 'INVALID_STATUS_TRANSITION') {
          return reply.status(409).send({ message: 'Invalid status transition' })
        }
        throw err
      }
    }
  )
}
