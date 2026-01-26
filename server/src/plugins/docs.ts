import fastifySwagger from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import type { FastifyInstance } from 'fastify'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

export async function registerDocs(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Sistema de Vistorias API',
        description: 'API do desafio (Fastify + Prisma + JWT + Notificações)',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  await app.register(ScalarApiReference, {
    routePrefix: '/docs',
  })
}
