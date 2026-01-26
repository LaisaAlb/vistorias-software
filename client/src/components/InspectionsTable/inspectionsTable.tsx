import { Calendar, Check, Send, X } from 'lucide-react'
import { StatusBadge } from '../StatusBadge/statusBadge'
import type { Inspection } from '../../interfaces/inspection'

type Props = {
  items: Inspection[]
  isInspector: boolean
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onSendConfirmation: (id: string) => void
}

export function InspectionsTable({
  items,
  isInspector,
  onApprove,
  onReject,
  onSendConfirmation,
}: Props) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-left">Cliente / Veículo</th>
            <th className="p-3 text-left">Placa</th>
            <th className="p-3 text-left">Data</th>
            <th className="p-3 text-left">Valor</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-4 text-right">Ações</th>
          </tr>
        </thead>

        <tbody>
          {items.map((i) => {
            const date = new Date(i.createdAt).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })

            const money = Number(i.value).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })

            return (
              <tr className="border-t" key={i.id}>
                <td className="p-4 text-left">
                  <p className="font-medium">{i.customerName}</p>
                  <p className="text-xs text-gray-500">
                    {i.vehicleModel} • {i.vehicleYear}
                  </p>
                </td>

                <td className="p-3 text-left">{i.plate}</td>
                <td className="p-3 text-left">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="shrink-0 text-gray-500" />
                    <span>{date}</span>
                  </div>
                </td>
                <td className="p-3 text-left">{money}</td>
                <td className="p-3 text-left">
                  <StatusBadge status={i.status} />
                </td>

                <td className="p-4 text-right">
                  {isInspector ? (
                    <div className="inline-flex items-center gap-3">
                      <button
                        className="text-green-600 disabled:opacity-40"
                        disabled={i.status !== 'PENDING'}
                        onClick={() => onApprove(i.id)}
                        type="button"
                        title="Aprovar"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        className="text-red-600 disabled:opacity-40"
                        disabled={i.status !== 'PENDING'}
                        onClick={() => onReject(i.id)}
                        type="button"
                        title="Reprovar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      {i.status === 'APPROVED' ? (
                        <button
                          className="bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-3 py-2 text-xs hover:bg-blue-100 flex"
                          type="button"
                          onClick={() => onSendConfirmation(i.id)}
                        >
                          <Send size={16} />
                          Enviar Confirmação
                        </button>
                      ) : i.status === 'PENDING' ? (
                        <span className="text-xs text-gray-400 italic">Aguardando</span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Processado</span>
                      )}
                    </>
                  )}
                </td>
              </tr>
            )
          })}

          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                Nenhuma vistoria encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
