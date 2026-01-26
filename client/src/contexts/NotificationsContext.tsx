import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import type { Notification } from '../interfaces/notification'
import {
  listNotifications,
  getUnreadCount,
  markNotificationAsRead,
} from '../services/notifications.service'

type NotificationsContextType = {
  items: Notification[]
  unreadCount: number
  refreshList: () => Promise<void>
  refreshUnreadCount: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationsContext = createContext({} as NotificationsContextType)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()

  const [items, setItems] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  async function refreshList() {
    if (!token) return
    const data = await listNotifications(token)
    setItems(data)

    // atualiza contador a partir da lista também (evita 2 requests)
    const unread = data.filter((n) => !n.readAt).length
    setUnreadCount(unread)
  }

  async function refreshUnreadCount() {
    if (!token) return
    const data = await getUnreadCount(token)
    setUnreadCount(data.count)
  }

  async function markAsRead(id: string) {
    if (!token) return

    // ✅ Otimista: atualiza UI imediatamente
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))

    try {
      await markNotificationAsRead(token, id)
      // opcional: sincroniza com o backend (caso o item já estivesse lido etc)
      // await refreshUnreadCount()
    } catch (e) {
      // rollback básico (se falhar)
      await refreshList()
      throw e
    }
  }

  async function markAllAsRead() {
    // se você ainda não tem endpoint "read-all",
    // dá pra marcar todas localmente + chamar uma a uma
    const unread = items.filter((n) => !n.readAt)
    if (!token || unread.length === 0) return

    // otimista
    setItems((prev) => prev.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() })))
    setUnreadCount(0)

    try {
      await Promise.all(unread.map((n) => markNotificationAsRead(token, n.id)))
    } catch (e) {
      await refreshList()
      throw e
    }
  }

  // ✅ quando token muda (login/logout), carrega o count
  useEffect(() => {
    if (!token) {
      setItems([])
      setUnreadCount(0)
      return
    }
    refreshUnreadCount()
  }, [token])

  const value = useMemo(
    () => ({
      items,
      unreadCount,
      refreshList,
      refreshUnreadCount,
      markAsRead,
      markAllAsRead,
    }),
    [items, unreadCount]
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationsContext)
}
