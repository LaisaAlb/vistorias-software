import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/password'

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const ok = await comparePassword(password, user.passwordHash)
  if (!ok) return null

  return user
}
