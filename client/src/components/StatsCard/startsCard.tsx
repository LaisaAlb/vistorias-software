import type { LucideIcon } from "lucide-react"

type Props = {
  title: string
  value: number
  variant?: "default" | "warning"
  icon: LucideIcon
}

export function StatsCard({
  title,
  value,
  variant = "default",
  icon: Icon,
}: Props) {
  return (
    <div className="bg-white border rounded-lg p-4 flex items-center gap-4">

      <div
        className={`h-10 w-10 rounded-lg flex items-center justify-center
        ${
          variant === "warning"
            ? "bg-yellow-100 text-yellow-600"
            : "bg-blue-100 text-blue-600"
        }`}
      >
        <Icon size={20} />
      </div>

      <div className="text-left">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>

    </div>
  )
}
