import { api } from "./client";
import type { NotificationResponseDto } from "./types";

export const notificationsApi = {
  list: () => api.get<NotificationResponseDto[]>("/notifications"),
  markAllAsRead: () => api.patch<void>("/notifications/read", {}),
};
