import type { InspectionStatus } from '../../interfaces/inspection'

export function StatusBadge({ status }: { status: InspectionStatus }) {
  const map = {
    PENDING: { label: 'Pendente', cls: 'bg-yellow-100 text-yellow-700' },
    APPROVED: { label: 'Aprovado', cls: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'Reprovado', cls: 'bg-red-100 text-red-700' },
  } as const

  const s = map[status]

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  )
}
