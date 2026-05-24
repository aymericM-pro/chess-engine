import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface Signal {
  id: number;
  at: string;
}

export interface UseLiveGameReturn {
  connected: boolean;
  signals: Signal[];
  sendPing: () => void;
}

export function useLiveGame(): UseLiveGameReturn {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [signals] = useState<Signal[]>([]);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("ping", () => {
      socket.emit("pong", { at: new Date().toISOString() });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function sendPing() {
    socketRef.current?.emit("ping");
  }

  return { connected, signals, sendPing };
}
