import { BarChart3, TrendingUp, Clock, AlertTriangle } from "lucide-react"
import { DashboardStatsCard } from "../../components/StatsCard/dashboardStatsCard"

type Props = {
  loading: boolean
  error: string | null
  metrics: {
    total: number
    pending: number
    rejected: number
    aprovadasPercent: number
    valorTotalVistoriado: string
    ticketMedio: string
  }
}

export function DashboardOverview({ loading, error, metrics }: Props) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold tracking-widest text-gray-500 mb-3 text-left">
        VISÃO GERAL
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-5">
          <div className="rounded-xl p-6 text-white border shadow-sm bg-gradient-to-b from-blue-600 to-blue-700 h-full min-h-[180px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm/5 opacity-90 text-left">Valor Total Vistoriado</p>
                <p className="text-3xl font-semibold mt-1">
                  {loading ? "..." : metrics.valorTotalVistoriado}
                </p>
              </div>

              <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center">
                <span className="text-lg font-semibold">$</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
              <p className="text-sm opacity-90">Ticket Médio</p>
              <p className="text-sm font-semibold">{loading ? "..." : metrics.ticketMedio}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full items-stretch">
          <DashboardStatsCard title="TOTAL" value={loading ? 0 : metrics.total} icon={BarChart3} />

          <DashboardStatsCard
            title="APROVADAS"
            value={loading ? "0%" : `${metrics.aprovadasPercent}%`}
            icon={TrendingUp}
            variant="success"
          />

          <DashboardStatsCard
            title="PENDENTES"
            value={loading ? 0 : metrics.pending}
            icon={Clock}
            variant="warning"
          />

          <DashboardStatsCard
            title="REPROVADAS"
            value={loading ? 0 : metrics.rejected}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>
      </div>
    </div>
  )
}
