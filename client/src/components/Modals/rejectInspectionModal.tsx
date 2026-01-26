import { useEffect, useState } from 'react'
import type { RejectionReason } from '../../interfaces/RejectionReason ' 
import type { Inspection } from '../../interfaces/inspection'
import { AlertTriangle } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  inspection: Inspection | null
  reasons: RejectionReason[]
  onSubmit: (data: { reasonId: string; comment?: string }) => Promise<void>
}

export function RejectInspectionModal({
  open,
  onClose,
  inspection,
  reasons,
  onSubmit,
}: Props) {
  const [reasonId, setReasonId] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setReasonId('')
      setComment('')
      setError(null)
    }
  }, [open])

  if (!open || !inspection) return null

  async function handleSubmit() {
    if (!reasonId) {
      setError('Selecione um motivo de reprovação.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSubmit({
        reasonId,
        comment: comment.trim() || undefined,
      })
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao reprovar vistoria')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-white rounded-xl border shadow-lg p-6 space-y-4">

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>

          <div className="flex-1 text-left">
            <h2 className="text-lg font-semibold">Reprovar vistoria</h2>
            <p className="text-sm text-gray-600">
              Você está prestes a reprovar a vistoria do veículo{' '}
              <strong>{inspection.vehicleModel}</strong> • placa{' '}
              <strong>{inspection.plate}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Motivo */}
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-gray-700">
            Motivo da reprovação
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={reasonId}
            onChange={(e) => setReasonId(e.target.value)}
            disabled={loading}
          >
            <option value="">Selecione um motivo...</option>
            {reasons
              .filter((r) => r.isActive)
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
          </select>
        </div>

        {/* Comentário */}
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-gray-700">
            Comentário adicional (opcional)
          </label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 min-h-[90px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Detalhes adicionais..."
            disabled={loading}
          />
        </div>

        {/* Erro */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
            {error}
          </p>
        )}

        {/* Ações */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            className="border rounded-lg px-4 py-2"
            onClick={onClose}
            type="button"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="bg-red-600 text-white rounded-lg px-4 py-2 disabled:opacity-60"
            onClick={handleSubmit}
            disabled={loading}
            type="button"
          >
            {loading ? 'Enviando...' : 'Confirmar reprovação'}
          </button>
        </div>
      </div>
    </div>
  )
}
