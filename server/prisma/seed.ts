import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

async function main() {
  const sellerEmail = 'vendedor@teste.com'
  const inspectorEmail = 'admin@teste.com'

  const [sellerHash, inspectorHash] = await Promise.all([
    hashPassword('123456'),
    hashPassword('123456'),
  ])

  await prisma.user.upsert({
    where: { email: sellerEmail },
    update: {},
    create: {
      name: 'Vendedor Teste',
      email: sellerEmail,
      passwordHash: sellerHash,
      role: 'SELLER',
    },
  })

  await prisma.user.upsert({
    where: { email: inspectorEmail },
    update: {},
    create: {
      name: 'Vistoriador Admin',
      email: inspectorEmail,
      passwordHash: inspectorHash,
      role: 'INSPECTOR',
    },
  })

  // Motivos iniciais (opcional, mas ajuda na correção)
  const reasons = ['Pneu careca', 'Chassi adulterado', 'Vidro trincado']
  for (const title of reasons) {
    await prisma.rejectionReason.upsert({
      where: { title },
      update: {},
      create: { title },
    })
  }

  console.log('✅ Seed completed')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
