import { Download, Filter, Plus, Search } from 'lucide-react'
import type { InspectionStatus } from "../../interfaces/inspection"

type Props = {
  search: string
  onSearchChange: (v: string) => void
  status: InspectionStatus | ''
  onStatusChange: (v: InspectionStatus | '') => void
  onExport: () => void
  isSeller: boolean
  onNewInspection?: () => void
}

export function SearchBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onExport,
  isSeller,
  onNewInspection,
}: Props) {
  return (
    <div className="bg-white border rounded-lg p-4 flex flex-wrap gap-3 items-center justify-between">
      <div className="flex gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            placeholder="Buscar por placa ou cliente..."
            className="w-full pl-9 py-2 border rounded-lg text-sm"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm">
          <Filter size={16} className="text-gray-500" />
          <select
            className="outline-none bg-transparent"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as InspectionStatus | '')}
          >
            <option value="">Todos Status</option>
            <option value="PENDING">Pendente</option>
            <option value="APPROVED">Aprovado</option>
            <option value="REJECTED">Reprovado</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onExport}
          className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
          type="button"
        >
          <Download size={16} />
          Exportar
        </button>

        {isSeller && (
          <button
            onClick={onNewInspection}
            className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700"
            type="button"
          >
            <Plus size={16} />
            Nova Vistoria
          </button>
        )}
      </div>
    </div>
  )
}
