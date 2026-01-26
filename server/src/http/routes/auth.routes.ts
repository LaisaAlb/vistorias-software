import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { authenticate } from '@/services/auth.service'

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/auth/login',
    {
      schema: {
        tags: ['auth'],
        body: z.object({
          email: z.string().email(),
          password: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as any
      const user = await authenticate(email, password)

      if (!user) {
        return reply.status(401).send({ message: 'Invalid credentials' })
      }

      const token = await reply.jwtSign(
        { role: user.role, sub: user.id },
        { subject: user.id }
      )

      return reply.send({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      })
    }
  )
}
