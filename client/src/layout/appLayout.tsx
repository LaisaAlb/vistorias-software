import { Outlet, useLocation } from "react-router-dom"
import { Sidebar } from "../components/Sidebar/sidebar"
import { Header } from "../components/Header/header"

export function AppLayout() {
  const { pathname } = useLocation()

  const titleByRoute: Record<string, string> = {
    "/inspections": "Minhas Vistorias",
    "/dashboard": "Dashboard de Performance",
    "/motivos-reprovacao": "Motivos Reprovação",
  }

  const title = titleByRoute[pathname] ?? "Sistema"

  return (
    <div className="h-dvh w-full bg-gray-50 flex overflow-hidden">
      <aside className="hidden md:flex shrink-0">
        <Sidebar />
      </aside>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Header title={title} />

        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="w-full p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
