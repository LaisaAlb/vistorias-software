import { Clock, CheckCircle, XCircle } from 'lucide-react'
import type { InspectionStatus } from '../../interfaces/inspection'

type Props = {
  status: InspectionStatus
}

export function StatusBadge({ status }: Props) {
  const map = {
    PENDING: {
      label: 'Pendente',
      cls: 'bg-yellow-100 text-yellow-700',
      icon: Clock,
    },
    APPROVED: {
      label: 'Aprovado',
      cls: 'bg-green-100 text-green-700',
      icon: CheckCircle,
    },
    REJECTED: {
      label: 'Reprovado',
      cls: 'bg-red-100 text-red-700',
      icon: XCircle,
    },
  } as const

  const s = map[status]
  const Icon = s.icon

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${s.cls}`}
    >
      <Icon size={14} />
      {s.label}
    </span>
  )
}
