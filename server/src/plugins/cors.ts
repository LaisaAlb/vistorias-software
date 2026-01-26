import fastifyCors from '@fastify/cors'
import type { FastifyInstance } from 'fastify'
import { env } from '../env'

export async function registerCors(app: FastifyInstance) {
  await app.register(fastifyCors, {
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
}
