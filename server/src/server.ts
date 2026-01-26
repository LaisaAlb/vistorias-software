import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
  hasZodFastifySchemaValidationErrors,
} from 'fastify-type-provider-zod'

import { env } from '../src/env'
import { registerCors } from '@/plugins/cors'
import { registerDocs } from '@/plugins/docs'
import { registerJwt } from '@/plugins/jwt'

import { authRoutes } from '@/http/routes/auth.routes'
import { inspectionsRoutes } from '@/http/routes/inspections.routes'
import { reasonsRoutes } from '@/http/routes/reasons.routes'
import { notificationsRoutes } from '@/http/routes/notifications.routes'

import { registerNotificationSubscribers } from '@/subscribers/notifications.subscriber'

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler((error, request, reply) => {
  request.log.error(error)

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation failed',
      issues: error.validation,
    })
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

await registerCors(app)
await registerJwt(app)
await registerDocs(app)

registerNotificationSubscribers()

await app.register(authRoutes)
await app.register(inspectionsRoutes)
await app.register(reasonsRoutes)
await app.register(notificationsRoutes)

await app.listen({ port: env.PORT, host: '0.0.0.0' })
app.log.info(`🔥 HTTP server running on http://localhost:${env.PORT}`)
