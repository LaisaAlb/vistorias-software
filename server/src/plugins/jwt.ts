import fastifyJwt from '@fastify/jwt'
import type { FastifyInstance } from 'fastify'
import { env } from '@/env'

export async function registerJwt(app: FastifyInstance) {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: env.JWT_EXPIRES_IN },
  })
}
