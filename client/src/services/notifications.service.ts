import { http } from './http'
import type { Notification } from '../interfaces/notification'

export async function listNotifications(token: string) {
  return http<Notification[]>({
    method: 'GET',
    path: '/notifications',
    token,
  })
}

export async function getUnreadCount(token: string) {
  return http<{ count: number }>({
    method: 'GET',
    path: '/notifications/unread-count',
    token,
  })
}

export async function markNotificationAsRead(token: string, id: string) {
  await http<void>({
    method: 'PATCH',
    path: `/notifications/${id}/read`,
    token,
  })
}
