import type { ElementType } from "react"
import type { LucideIcon } from "lucide-react"

type Variant = "default" | "success" | "warning" | "danger"

type DashboardStatsCardProps = {
  title: string
  value: string | number
  icon: LucideIcon | ElementType
  variant?: Variant
  className?: string
}

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ")
}

const stylesByVariant: Record<Variant, { wrap: string; iconBox: string; icon: string }> = {
  default: {
    wrap: "bg-white border-slate-200",
    iconBox: "bg-slate-100",
    icon: "text-slate-700",
  },
  success: {
    wrap: "bg-white border-slate-200",
    iconBox: "bg-green-50",
    icon: "text-green-600",
  },
  warning: {
    wrap: "bg-white border-slate-200",
    iconBox: "bg-yellow-50",
    icon: "text-yellow-700",
  },
  danger: {
    wrap: "bg-white border-slate-200",
    iconBox: "bg-red-50",
    icon: "text-red-600",
  },
}

export function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  className,
}: DashboardStatsCardProps) {
  const s = stylesByVariant[variant]

  return (
    <div
      className={cx(
        "rounded-xl border shadow-sm p-5",
        "h-full min-h-[180px] flex flex-col",
        s.wrap,
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold tracking-widest text-gray-500 text-left">{title}</p>
        <div className={cx("h-10 w-10 rounded-lg flex items-center justify-center", s.iconBox)}>
          <Icon className={cx("h-5 w-5", s.icon)} />
        </div>
      </div>

      <div className="flex-grow flex items-end">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}