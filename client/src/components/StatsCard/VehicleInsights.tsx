import { BarChart3, AlertTriangle, TrendingUp } from "lucide-react"

type Props = {
  loading: boolean
  topBrands: {
    list: { name: string; value: number }[]
    max: number
  }
}

export function VehicleInsights({ loading, topBrands }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-gray-500 mb-3 text-left">
        INSIGHTS DE VEÍCULOS
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <h3 className="font-semibold text-gray-800">Top Marcas</h3>
          </div>

          {loading ? (
            <div className="text-sm text-gray-500">Carregando...</div>
          ) : topBrands.list.length === 0 ? (
            <div className="text-sm text-gray-500">Sem dados.</div>
          ) : (
            <div className="space-y-4">
              {topBrands.list.map((item) => {
                const pct =
                  topBrands.max === 0 ? 0 : Math.round((item.value / topBrands.max) * 100)

                return (
                  <div key={item.name} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-700">{item.name}</span>

                    <div className="flex items-center gap-3 w-40">
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-5 text-right">{item.value}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 min-h-[220px] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <h3 className="font-semibold text-gray-800">Motivos de Reprovação</h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="h-14 w-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-3">
              <TrendingUp size={26} />
            </div>
            <p className="text-sm text-gray-500">Tudo certo por aqui!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
