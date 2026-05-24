import { create } from "zustand";
import type { FriendRequestWithPlayerDto, GameResponseDto } from "@/shared/api/types";

export interface GameInvite {
  id: string;
  gameId: string;
  from: {
    id: string;
    username: string;
  };
  game: GameResponseDto;
  createdAt: string;
  unread: boolean;
}

export interface FriendNotification {
  id: string;
  kind: "friend.request" | "friend.accepted" | "friend.declined";
  request: FriendRequestWithPlayerDto;
  createdAt: string;
  unread: boolean;
}

interface GameInviteState {
  invites: GameInvite[];
  friendNotifications: FriendNotification[];
  unreadCount: number;
  addInvite: (invite: Omit<GameInvite, "id" | "createdAt" | "unread"> & Partial<Pick<GameInvite, "createdAt" | "unread">>) => void;
  addFriendNotification: (notification: Omit<FriendNotification, "id" | "createdAt" | "unread"> & Partial<Pick<FriendNotification, "createdAt" | "unread">>) => void;
  markAllAsRead: () => void;
  removeInvite: (gameId: string) => void;
  clearInvites: () => void;
}

export const useGameInviteStore = create<GameInviteState>()((set) => ({
  invites: [],
  friendNotifications: [],
  unreadCount: 0,
  addInvite: (invite) => {
    set((state) => {
      const nextInvite: GameInvite = {
        ...invite,
        id: invite.gameId,
        createdAt: invite.createdAt ?? new Date().toISOString(),
        unread: invite.unread ?? true,
      };

      const next = [
        nextInvite,
        ...state.invites.filter((item) => item.gameId !== invite.gameId),
      ].slice(0, 20);

      return {
        invites: next,
        unreadCount: next.filter((item) => item.unread).length + state.friendNotifications.filter((item) => item.unread).length,
      };
    });
  },
  addFriendNotification: (notification) => {
    set((state) => {
      const nextNotification: FriendNotification = {
        ...notification,
        id: `${notification.kind}-${notification.request.id}`,
        createdAt: notification.createdAt ?? new Date().toISOString(),
        unread: notification.unread ?? true,
      };

      const next = [
        nextNotification,
        ...state.friendNotifications.filter((item) => item.id !== nextNotification.id),
      ].slice(0, 20);

      return {
        friendNotifications: next,
        unreadCount: state.invites.filter((item) => item.unread).length + next.filter((item) => item.unread).length,
      };
    });
  },
  markAllAsRead: () => {
    set((state) => {
      const next = state.invites.map((invite) => ({ ...invite, unread: false }));
      const friendNotifications = state.friendNotifications.map((notification) => ({ ...notification, unread: false }));
      return { invites: next, friendNotifications, unreadCount: 0 };
    });
  },
  removeInvite: (gameId) => {
    set((state) => {
      const next = state.invites.filter((invite) => invite.gameId !== gameId);
      return {
        invites: next,
        unreadCount: next.filter((invite) => invite.unread).length + state.friendNotifications.filter((item) => item.unread).length,
      };
    });
  },
  clearInvites: () => set({ invites: [], friendNotifications: [], unreadCount: 0 }),
}));
