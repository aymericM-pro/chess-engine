import { useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { useToastStore } from "@/shared/toasts/toastStore";
import { useNotificationStore } from "@/modules/notifications/notificationStore";
import { notificationsApi } from "@/shared/api/notifications.api";
import type { NotificationResponseDto } from "@/shared/api/types";

const STREAM_URL = "http://localhost:3000/notifications/stream";
const RECONNECT_DELAY_MS = 3000;

interface GameNotificationPayload {
  gameId: string;
  result?: string | null;
  endReason?: string | null;
  notification?: NotificationResponseDto;
}

export function RealtimeNotifications() {
  const token = useAuthStore((state) => state.token);
  const addToast = useToastStore((state) => state.addToast);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const setNotifications = useNotificationStore((state) => state.setNotifications);

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      return;
    }

    let active = true;
    let reconnectTimer: number | undefined;
    let abortController: AbortController | undefined;

    notificationsApi.list()
      .then((notifications) => {
        if (active) setNotifications(notifications);
      })
      .catch(() => undefined);

    const connect = async () => {
      abortController = new AbortController();

      try {
        const response = await fetch(STREAM_URL, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) throw new Error("SSE connection failed");

        await readSseStream(response.body, (event, data) => {
          if (event === "game.started") {
            window.dispatchEvent(new CustomEvent("chess:game-started", { detail: data }));
            addNotification({
              id: (data as GameNotificationPayload).notification?.id,
              kind: "game",
              title: (data as GameNotificationPayload).notification?.title ?? "Partie lancée",
              description: (data as GameNotificationPayload).notification?.description ?? "Votre partie vient de commencer.",
              data: (data as GameNotificationPayload).notification?.data ?? (data as Record<string, unknown>),
              createdAt: (data as GameNotificationPayload).notification?.createdAt,
              unread: (data as GameNotificationPayload).notification?.readAt !== undefined
                ? (data as GameNotificationPayload).notification?.readAt === null
                : true,
            });
            addToast({
              type: "info",
              title: "Partie lancée",
              message: "Votre partie vient de commencer.",
            });
          }

          if (event === "game.ended") {
            const payload = data as GameNotificationPayload;
            window.dispatchEvent(new CustomEvent("chess:game-ended", { detail: payload }));
            const message = payload.notification?.description ?? getGameEndedMessage(payload);
            addNotification({
              id: payload.notification?.id,
              kind: "game",
              title: payload.notification?.title ?? "Partie terminée",
              description: message,
              data: payload.notification?.data ?? (payload as unknown as Record<string, unknown>),
              createdAt: payload.notification?.createdAt,
              unread: payload.notification?.readAt !== undefined ? payload.notification.readAt === null : true,
            });
            addToast({
              type: "info",
              title: "Partie terminée",
              message,
            });
          }

        });
      } catch {
        if (!active || abortController?.signal.aborted) return;
      }

      if (active) {
        reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
      }
    };

    connect();

    return () => {
      active = false;
      abortController?.abort();
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
    };
  }, [addNotification, addToast, setNotifications, token]);

  return null;
}

async function readSseStream(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: string, data: unknown) => void,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      const parsed = parseSseChunk(chunk);
      if (parsed) onEvent(parsed.event, parsed.data);
    }
  }
}

function parseSseChunk(chunk: string): { event: string; data: unknown } | null {
  const lines = chunk.split("\n");
  const event = lines.find((line) => line.startsWith("event: "))?.slice(7);
  const dataLine = lines.find((line) => line.startsWith("data: "))?.slice(6);

  if (!event || !dataLine) return null;

  try {
    return { event, data: JSON.parse(dataLine) };
  } catch {
    return { event, data: dataLine };
  }
}

function getGameEndedMessage(payload: GameNotificationPayload): string {
  if (payload.endReason === "checkmate") return "La partie s'est terminée par échec et mat.";
  if (payload.endReason === "resignation") return "La partie s'est terminée par abandon.";
  if (payload.endReason === "draw_agreement") return "La partie s'est terminée par une nulle.";
  return "Votre partie est terminée.";
}
