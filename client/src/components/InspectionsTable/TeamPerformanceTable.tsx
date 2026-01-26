type SellerRow = {
  sellerId: string
  total: number
  approved: number
  rejected: number
  efficacyPct: number
}

type Props = {
  loading: boolean
  sellers: SellerRow[]
}

export function TeamPerformanceTable({ loading, sellers }: Props) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold tracking-widest text-gray-500 mb-3 text-left">
        PERFORMANCE DA EQUIPE
      </p>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Vendedor</th>
              <th className="p-3 text-left">Volume Total</th>
              <th className="p-3 text-left text-green-600">Aprovadas</th>
              <th className="p-3 text-left text-red-600">Reprovadas</th>
              <th className="p-4 text-left">Eficiência</th>
            </tr>
          </thead>

          <tbody>
            {sellers.map((s) => (
              <tr key={s.sellerId} className="border-t">
                <td className="p-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-semibold">
                      {(s.sellerId || "?").slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Vendedor #{s.sellerId.slice(-4)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-3">{s.total}</td>

                <td className="p-3">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs">
                    {s.approved}
                  </span>
                </td>

                <td className="p-3">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs">
                    {s.rejected}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${s.efficacyPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-10">{s.efficacyPct}%</span>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && sellers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Nenhum dado para exibir.
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Carregando...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
