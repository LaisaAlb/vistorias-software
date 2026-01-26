import type { FastifyReply, FastifyRequest } from 'fastify'
import type { Role } from '@prisma/client'

export function requireRole(roles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { role?: Role }
    if (!user?.role || !roles.includes(user.role)) {
      return reply.status(403).send({ message: 'Forbidden' })
    }
  }
}
