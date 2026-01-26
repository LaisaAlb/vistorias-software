import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3333),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default('1d'),

  CORS_ORIGIN: z.string().default('*'),
})

export const env = schema.parse(process.env)
