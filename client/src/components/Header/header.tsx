import { useMemo, useState } from "react"
import { Bell, Check } from "lucide-react"
import { useNotifications } from "../../contexts/NotificationsContext"

type HeaderProps = {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { items, unreadCount, refreshList, markAsRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      if (!a.readAt && b.readAt) return -1
      if (a.readAt && !b.readAt) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [items])

  const hasUnread = useMemo(() => {
    return sorted.some((n) => !n.readAt)
  }, [sorted])

  async function toggle() {
    const next = !open
    setOpen(next)
    if (next) await refreshList()
  }

  async function handleMarkAsRead(id: string) {
    try {
      setLoadingId(id)
      await markAsRead(id)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>

      <div className="relative">
        <button className="relative" type="button" onClick={toggle}>
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Notificações</p>
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setOpen(false)}
              >
                Fechar
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {!hasUnread ? (
                <div className="px-4 py-6 text-sm text-gray-500 text-center">
                  Nenhuma notificação
                </div>
              ) : (
                sorted.map(
                  (n) =>
                    !n.readAt && (
                      <div
                        key={n.id}
                        className="px-4 py-3 border-b last:border-b-0 bg-blue-50/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800">
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 break-words">
                              {n.message}
                            </p>
                          </div>

                          <button
                            type="button"
                            className="shrink-0 inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2 py-1 hover:bg-blue-100 disabled:opacity-60"
                            onClick={() => handleMarkAsRead(n.id)}
                            disabled={loadingId === n.id}
                            title="Marcar como lida"
                          >
                            <Check size={14} />
                            {loadingId === n.id ? "..." : "Marcar como lida"}
                          </button>
                        </div>
                      </div>
                    )
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
