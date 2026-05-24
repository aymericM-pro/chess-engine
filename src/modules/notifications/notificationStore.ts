import { create } from "zustand";
import type { NotificationResponseDto } from "@/shared/api/types";

export type NotificationKind = "game" | "achievement";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  data?: Record<string, unknown>;
  createdAt: string;
  unread: boolean;
}

type NotificationInput = Omit<AppNotification, "id" | "createdAt" | "unread"> & {
  id?: string;
  createdAt?: string;
  unread?: boolean;
};

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  setNotifications: (notifications: NotificationResponseDto[]) => void;
  addNotification: (notification: NotificationInput) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => {
    const next = notifications.map(fromResponse);
    set({
      notifications: next,
      unreadCount: next.filter((notification) => notification.unread).length,
    });
  },
  addNotification: (notification) => {
    set((state) => {
      if (notification.id && state.notifications.some((item) => item.id === notification.id)) {
        return state;
      }

      const next: AppNotification[] = [
        {
          id: notification.id ?? crypto.randomUUID(),
          kind: notification.kind,
          title: notification.title,
          description: notification.description,
          data: notification.data,
          createdAt: notification.createdAt ?? new Date().toISOString(),
          unread: notification.unread ?? true,
        },
        ...state.notifications,
      ].slice(0, 30);

      return {
        notifications: next,
        unreadCount: next.filter((item) => item.unread).length,
      };
    });
  },
  markAllAsRead: () => {
    set((state) => {
      const next = state.notifications.map((notification) => ({ ...notification, unread: false }));
      return { notifications: next, unreadCount: 0 };
    });
  },
}));

function fromResponse(notification: NotificationResponseDto): AppNotification {
  return {
    id: notification.id,
    kind: notification.kind === "game" ? "game" : "achievement",
    title: notification.title,
    description: notification.description,
    data: notification.data,
    createdAt: notification.createdAt,
    unread: notification.readAt === null,
  };
}
