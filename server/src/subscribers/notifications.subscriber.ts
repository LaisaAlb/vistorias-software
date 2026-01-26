import { bus } from '@/lib/bus'
import { prisma } from '@/lib/prisma'
import { notificationsService } from '@/services/notifications.service'

export function registerNotificationSubscribers() {
  bus.on('inspection.created', async ({ inspectionId }) => {
    const inspection = await prisma.inspection.findUnique({
      where: { id: inspectionId },
      select: { plate: true },
    })

    const plate = inspection?.plate ?? '—'

    const inspectors = await prisma.user.findMany({
      where: { role: 'INSPECTOR' },
      select: { id: true },
    })

    await Promise.all(
      inspectors.map((u) =>
        notificationsService.create(
          u.id,
          'Nova vistoria pendente',
          `Uma nova vistoria foi criada para a placa ${plate}.`
        )
      )
    )
  })

  bus.on('inspection.status_changed', async ({ inspectionId, sellerId, status }) => {
    const inspection = await prisma.inspection.findUnique({
      where: { id: inspectionId },
      select: { plate: true },
    })

    const plate = inspection?.plate ?? '—'

    const title = status === 'APPROVED' ? 'Vistoria aprovada' : 'Vistoria reprovada'
    const message =
      status === 'APPROVED'
        ? `Sua vistoria da placa ${plate} foi aprovada com sucesso.`
        : `Sua vistoria da placa ${plate} foi reprovada. Verifique o motivo informado.`

    await notificationsService.create(sellerId, title, message)
  })
}
