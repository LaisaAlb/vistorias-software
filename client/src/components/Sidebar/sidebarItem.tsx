import { NavLink } from "react-router-dom"

type SidebarItemProps = {
  to: string
  label: string
  icon: React.ElementType
}

export function SidebarItem({ to, label, icon: Icon }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
        ${
          isActive
            ? "bg-blue-50 text-blue-600 font-medium"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  )
}
