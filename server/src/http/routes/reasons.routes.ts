import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { requireAuth } from '@/http/middlewares/auth'
import { requireRole } from '@/http/middlewares/role'
import { reasonsService } from '@/services/reasons.service'

export async function reasonsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth)
  app.addHook('preHandler', requireRole(['INSPECTOR']))

  app.get('/rejection-reasons', { schema: { tags: ['reasons'] } }, async () => {
    return reasonsService.list()
  })

  app.post(
    '/rejection-reasons',
    {
      schema: {
        tags: ['reasons'],
        body: z.object({ title: z.string().min(2) }),
      },
    },
    async (request, reply) => {
      const { title } = request.body as any
      const created = await reasonsService.create(title)
      return reply.status(201).send(created)
    }
  )

  app.put(
    '/rejection-reasons/:id',
    {
      schema: {
        tags: ['reasons'],
        params: z.object({ id: z.string() }),
        body: z.object({ title: z.string().min(2) }),
      },
    },
    async (request) => {
      const { id } = request.params as any
      const { title } = request.body as any
      return reasonsService.update(id, title)
    }
  )

  app.delete(
    '/rejection-reasons/:id',
    {
      schema: {
        tags: ['reasons'],
        params: z.object({ id: z.string() }),
      },
    },
    async (request, reply) => {
      const { id } = request.params as any
      await reasonsService.remove(id)
      return reply.status(204).send()
    }
  )
}
