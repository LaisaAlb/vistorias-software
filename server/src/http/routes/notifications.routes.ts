import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { requireAuth } from '@/http/middlewares/auth'
import { notificationsService } from '@/services/notifications.service'

export async function notificationsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth)

  app.get('/notifications', { schema: { tags: ['notifications'] } }, async (request) => {
    const user = request.user as any
    return notificationsService.listForUser(user.sub)
  })

  app.get('/notifications/unread-count', { schema: { tags: ['notifications'] } }, async (request) => {
    const user = request.user as any
    const count = await notificationsService.unreadCount(user.sub)
    return { count }
  })

  app.patch(
    '/notifications/:id/read',
    {
      schema: {
        tags: ['notifications'],
        params: z.object({ id: z.string() }),
      },
    },
    async (request, reply) => {
      const user = request.user as any
      const { id } = request.params as any

      const updated = await notificationsService.markAsRead(user.sub, id)

      if (!updated) return reply.status(404).send({ message: 'Not found' })
      return reply.status(204).send()
    }
  )
}
