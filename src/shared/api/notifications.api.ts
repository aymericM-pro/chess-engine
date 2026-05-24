import { api } from './client'
import type { NotificationResponseDto } from './types'

export const notificationsApi = {
  list: () => api.get<NotificationResponseDto[]>('/api/notifications'),
  markAllAsRead: () => api.patch<{ success: boolean }>('/api/notifications/read-all', {}),
}
