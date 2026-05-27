import { useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { useGameInviteStore } from "../store/gameInviteStore";
import { useToastStore } from "@/shared/toasts/toastStore";
import { notificationsApi } from "@/shared/api/notifications.api";
import type { FriendRequestPlayerDto, FriendRequestResponseDto, FriendRequestWithPlayerDto, GameResponseDto, NotificationResponseDto } from "@/shared/api/types";

interface GameInviteMessage {
  type: "game.invite";
  gameId: string;
  game: GameResponseDto;
  from: {
    id: string;
    username: string;
  };
}

interface FriendRequestMessage {
  type: "friend.request" | "friend.request.resolved";
  request: FriendRequestResponseDto;
  requester: FriendRequestPlayerDto;
  addressee: FriendRequestPlayerDto;
}

type PersistedNotificationPayload = GameInviteMessage | FriendRequestMessage;

function toFriendRequestWithPlayers(payload: FriendRequestMessage): FriendRequestWithPlayerDto {
  return {
    ...payload.request,
    requester: payload.requester,
    addressee: payload.addressee,
  };
}

function restoreNotification(
  notification: NotificationResponseDto,
  addInvite: ReturnType<typeof useGameInviteStore.getState>["addInvite"],
  addFriendNotification: ReturnType<typeof useGameInviteStore.getState>["addFriendNotification"],
) {
  const payload = notification.data as unknown as PersistedNotificationPayload;

  if (payload.type === "game.invite") {
    addInvite({
      gameId: payload.gameId,
      from: payload.from,
      game: payload.game,
      createdAt: notification.createdAt,
      unread: notification.readAt === null,
    });
  }

  if (payload.type === "friend.request" || payload.type === "friend.request.resolved") {
    const request = toFriendRequestWithPlayers(payload);
    const accepted = request.status === "accepted";
    addFriendNotification({
      kind: payload.type === "friend.request" ? "friend.request" : accepted ? "friend.accepted" : "friend.declined",
      request,
      createdAt: notification.createdAt,
      unread: notification.readAt === null,
    });
  }
}

export function GameInviteSocket() {
  const token = useAuthStore((state) => state.token);
  const addInvite = useGameInviteStore((state) => state.addInvite);
  const addFriendNotification = useGameInviteStore((state) => state.addFriendNotification);
  const clearInvites = useGameInviteStore((state) => state.clearInvites);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    if (!token) {
      clearInvites();
      return;
    }

    notificationsApi.list()
      .then((notifications) => {
        notifications
          .slice()
          .reverse()
          .forEach((notification) => restoreNotification(notification, addInvite, addFriendNotification));
      })
      .catch(() => undefined);

    const ws = new WebSocket(`ws://localhost:3000/ws/games?token=${encodeURIComponent(token)}`);

    ws.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data) as { type?: string };

      if (payload.type === "game.invite") {
        const invite = payload as GameInviteMessage;
        addInvite({
          gameId: invite.gameId,
          from: invite.from,
          game: invite.game,
        });
        addToast({
          type: "info",
          title: "Demande de partie",
          message: `${invite.from.username} vous invite à jouer.`,
        });
      }

      if (payload.type === "friend.request" || payload.type === "friend.request.resolved") {
        const friendPayload = payload as FriendRequestMessage;
        const request = toFriendRequestWithPlayers(friendPayload);
        const accepted = request.status === "accepted";

        addFriendNotification({
          kind: payload.type === "friend.request" ? "friend.request" : accepted ? "friend.accepted" : "friend.declined",
          request,
        });

        addToast({
          type: accepted ? "success" : "info",
          title: payload.type === "friend.request" ? "Demande d'ami" : accepted ? "Demande acceptée" : "Demande refusée",
          message: payload.type === "friend.request"
            ? `${request.requester.username} vous a envoyé une demande d'ami.`
            : accepted
              ? `${request.addressee.username} a accepté votre demande d'ami.`
              : `${request.addressee.username} a refusé votre demande d'ami.`,
        });
      }
    });

    return () => {
      ws.close();
    };
  }, [addFriendNotification, addInvite, addToast, clearInvites, token]);

  return null;
}
