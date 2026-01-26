import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  BarChart3,
} from "lucide-react"
import logo from "../../assets/images/logo.png"
import { SidebarItem } from "./sidebarItem"
import { useAuth } from "../../contexts/AuthContext"

export function Sidebar() {
  const { user, logout, hasRole } = useAuth()

  const roleLabel =
    user?.role === 'INSPECTOR' ? 'Vistoriador' : 'Vendedor'

  return (
    <aside className="w-64 h-full bg-white border-r flex flex-col min-h-0">
      <div className="h-16 flex items-center px-8 border-b shrink-0">
        <img src={logo} alt="EPTA" className="h-8" />
      </div>

      <nav className="flex-1 min-h-0 px-3 py-4 space-y-1 overflow-y-auto">
        <SidebarItem to="/inspections" label="Vistorias" icon={ClipboardList} />
        <SidebarItem to="/dashboard" label="Dashboard" icon={LayoutDashboard} />

        {hasRole('INSPECTOR') && (
          <SidebarItem
            to="/reasonsRejects"
            label="Motivos Reprovação"
            icon={BarChart3}
          />
        )}
      </nav>

      <div className="border-t px-4 py-3 shrink-0 text-left">
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-800">
            {user?.name ?? '—'}
          </p>
          <p className="text-xs text-gray-500">{roleLabel}</p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition"
          type="button"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}
