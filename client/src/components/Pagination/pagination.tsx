type Props = {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function Pagination({ page, totalPages, onPrev, onNext }: Props) {
  return (
   <div className="flex items-center justify-between px-4 py-3 border rounded-lg text-sm text-gray-500 bg-gray-50">
      <span>
        Mostrando {page} de {totalPages || 1} resultados
      </span>

      <div className="flex gap-2">
        <button
          className="border rounded px-3 py-1 disabled:opacity-40"
          disabled={page <= 1}
          onClick={onPrev}
          type="button"
        >
          Anterior
        </button>

        <button
          className="border rounded px-3 py-1 disabled:opacity-40"
          disabled={page >= totalPages}
          onClick={onNext}
          type="button"
        >
          Próximo
        </button>
      </div>
    </div>
  )
}

