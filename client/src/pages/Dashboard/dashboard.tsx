import { useAuth } from "../../contexts/AuthContext"
import { useDashboardData } from "../../hooks/useDashboardData"
import { DashboardOverview } from "../../components/StatsCard/dashboardOverview"
import { TeamPerformanceTable } from "../../components/InspectionsTable/TeamPerformanceTable"
import { VehicleInsights } from "../../components/StatsCard/vehicleInsights"

export default function Dashboard() {
  const { token, user } = useAuth()
  const isInspector = user?.role === "INSPECTOR"

  const { loading, error, metrics, topBrands, sellers } = useDashboardData(token)

  if (!isInspector) {
    return (
      <div className="w-full">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-600">
            Dashboard disponível apenas para o perfil <b>Vistoriador</b>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <DashboardOverview loading={loading} error={error} metrics={metrics} />
      <TeamPerformanceTable loading={loading} sellers={sellers} />
      <VehicleInsights loading={loading} topBrands={topBrands} />
    </div>
  )
}
