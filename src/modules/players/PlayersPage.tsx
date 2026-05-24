import { useEffect, useState } from "react";
import { Check, Search, UserRoundPlus } from "lucide-react";
import { playersApi } from "@/shared/api/players.api";
import { friendsApi } from "@/shared/api/friends.api";
import type { PlayerResponseDto } from "@/shared/api/types";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useToastStore } from "@/shared/toasts/toastStore";
import { useAuthStore } from "@/modules/auth/store/authStore";

interface Player {
  id: string;
  name: string;
  elo: number;
  country: string;
  color: "white" | "black" | "both";
  wins: number;
  losses: number;
  draws: number;
  joinedYear: number;
}

type FriendActionStatus = "self" | "friend" | "outgoing" | "incoming" | "available";

const FLAG: Record<string, string> = {
  FR: "🇫🇷",
  DE: "🇩🇪",
  GB: "🇬🇧",
  US: "🇺🇸",
  ES: "🇪🇸",
  RU: "🇷🇺",
};

const COLOR_LABEL: Record<Player["color"], string> = {
  white: "Blancs",
  black: "Noirs",
  both: "Les deux",
};

function WinRate({
  wins,
  losses,
  draws,
}: {
  wins: number;
  losses: number;
  draws: number;
}) {
  const total = wins + losses + draws;
  const winPct = total > 0 ? Math.round((wins / total) * 100) : 0;
  const drawPct = total > 0 ? Math.round((draws / total) * 100) : 0;
  const lossPct = total > 0 ? 100 - winPct - drawPct : 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "var(--color-text-muted)",
          marginBottom: 5,
        }}
      >
        <span style={{ color: "var(--color-gold)" }}>{winPct}% V</span>
        <span>{drawPct}% N</span>
        <span style={{ color: "var(--color-danger)" }}>{lossPct}% D</span>
      </div>
      <div
        style={{
          display: "flex",
          height: 4,
          borderRadius: 100,
          overflow: "hidden",
          gap: 1,
        }}
      >
        <div style={{ flex: winPct, background: "var(--color-gold)" }} />
        <div style={{ flex: drawPct, background: "var(--color-faint)" }} />
        <div
          style={{
            flex: lossPct,
            background: "var(--color-danger)",
            opacity: 0.7,
          }}
        />
      </div>
    </div>
  );
}

function PlayerCard({
  player,
  actionStatus,
  requesting,
  onRequestFriend,
}: {
  player: Player;
  actionStatus: FriendActionStatus;
  requesting: boolean;
  onRequestFriend: (player: Player) => void;
}) {
  const initials = player.name.slice(0, 2).toUpperCase();
  const total = player.wins + player.losses + player.draws;
  const canRequest = actionStatus === "available";
  const isLocked = actionStatus !== "available";
  const buttonLabel: Record<FriendActionStatus, string> = {
    self: "Votre profil",
    friend: "Déjà ami",
    outgoing: "Demande envoyée",
    incoming: "Demande reçue",
    available: "Demander en ami",
  };

  return (
    <div
      style={{
        background: "var(--color-bg-2)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 246,
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(201,169,110,0.4)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--color-border)";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            flexShrink: 0,
            background: "linear-gradient(135deg, #c9a96e, #a87c48)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 700,
            color: "#0d1117",
            letterSpacing: "0.04em",
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              marginBottom: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {player.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{FLAG[player.country] ?? player.country}</span>
            <span>·</span>
            <span>Depuis {player.joinedYear}</span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--color-gold)",
              lineHeight: 1,
            }}
          >
            {player.elo}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--color-text-muted)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            ELO
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 0,
          background: "var(--color-bg-3)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {[
          { label: "V", value: player.wins, color: "var(--color-gold)" },
          { label: "N", value: player.draws, color: "var(--color-text-muted)" },
          { label: "D", value: player.losses, color: "var(--color-danger)" },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 0",
              borderRight: i < 2 ? "1px solid var(--color-border)" : "none",
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--color-text-muted)",
                letterSpacing: "0.06em",
                marginTop: 1,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Win rate bar */}
      <WinRate wins={player.wins} losses={player.losses} draws={player.draws} />

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--color-accent)",
            background: "rgba(201,169,110,0.08)",
            border: "1px solid rgba(201,169,110,0.2)",
            borderRadius: 100,
            padding: "2px 9px",
          }}
        >
          {COLOR_LABEL[player.color]}
        </span>
        <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
          {total} partie{total !== 1 ? "s" : ""}
        </span>
      </div>

      <button
        type="button"
        disabled={!canRequest || requesting}
        onClick={() => onRequestFriend(player)}
        style={{
          marginTop: "auto",
          minHeight: 38,
          borderRadius: 9,
          border: canRequest ? "1px solid rgba(201,169,110,0.28)" : "1px solid rgba(201,169,110,0.20)",
          background: canRequest ? "rgba(201,169,110,0.08)" : "rgba(201,169,110,0.05)",
          color: canRequest ? "var(--color-gold)" : "var(--color-text-muted)",
          cursor: !canRequest || requesting ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontSize: 13,
          fontWeight: 700,
          opacity: requesting ? 0.7 : 1,
          transition: "background 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!canRequest || requesting) return;
          e.currentTarget.style.background = "rgba(201,169,110,0.13)";
          e.currentTarget.style.borderColor = "rgba(201,169,110,0.42)";
        }}
        onMouseLeave={(e) => {
          if (!canRequest || requesting) return;
          e.currentTarget.style.background = "rgba(201,169,110,0.08)";
          e.currentTarget.style.borderColor = "rgba(201,169,110,0.28)";
        }}
      >
        {isLocked ? <Check size={15} /> : <UserRoundPlus size={15} />}
        {requesting ? "Envoi…" : buttonLabel[actionStatus]}
      </button>
    </div>
  );
}

function toPlayer(dto: PlayerResponseDto): Player {
  const preferredColor = dto.preferredColor === "white" || dto.preferredColor === "black"
    ? dto.preferredColor
    : "both";

  return {
    id: dto.id,
    name: dto.username,
    elo: dto.elo,
    country: dto.country ?? "FR",
    color: preferredColor,
    wins: 0,
    losses: 0,
    draws: 0,
    joinedYear: new Date(dto.createdAt).getFullYear(),
  };
}

export function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const [incomingRequestIds, setIncomingRequestIds] = useState<Set<string>>(new Set());
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addToast = useToastStore((state) => state.addToast);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    setLoading(true);
    Promise.all([playersApi.getAll(), friendsApi.list(), friendsApi.requests()])
      .then(([data, friends, requests]) => {
        setPlayers(data.map(toPlayer));
        setFriendIds(new Set(friends.map((friend) => friend.player.id)));
        setRequestedIds(new Set(requests.outgoing.map((request) => request.addresseeId)));
        setIncomingRequestIds(new Set(requests.incoming.map((request) => request.requesterId)));
        setError(null);
      })
      .catch((err) => {
        const message = getErrorMessage(err, "Impossible de charger les joueurs.");
        setError(message);
        addToast({
          type: "error",
          title: "Joueurs non chargés",
          message,
        });
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  const getActionStatus = (playerId: string): FriendActionStatus => {
    if (playerId === authUser?.id) return "self";
    if (friendIds.has(playerId)) return "friend";
    if (requestedIds.has(playerId)) return "outgoing";
    if (incomingRequestIds.has(playerId)) return "incoming";
    return "available";
  };

  const filteredPlayers = players.filter((player) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return player.name.toLowerCase().includes(q);
  });

  const handleRequestFriend = async (player: Player) => {
    setRequestingId(player.id);
    try {
      await friendsApi.request({ addresseeId: player.id });
      setRequestedIds((current) => new Set(current).add(player.id));
      addToast({
        type: "success",
        title: "Demande envoyée",
        message: `${player.name} a reçu votre demande d'ami.`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Demande impossible",
        message: getErrorMessage(err, "Impossible d'envoyer la demande d'ami."),
      });
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 32px", width: "100%", boxSizing: "border-box" }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 4,
            letterSpacing: "-0.01em",
          }}
        >
          Joueurs
        </h1>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
          {loading ? "Chargement des joueurs…" : `${filteredPlayers.length} joueur${filteredPlayers.length !== 1 ? "s" : ""} affiché${filteredPlayers.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {!loading && !error && (
        <div style={{ position: "relative", marginBottom: 22, maxWidth: 360 }}>
          <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", pointerEvents: "none" }} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un joueur"
            style={{
              width: "100%",
              height: 42,
              borderRadius: 10,
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-2)",
              color: "var(--color-text-primary)",
              padding: "0 14px 0 40px",
              outline: "none",
              fontSize: 14,
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.45)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
          />
        </div>
      )}

      {loading && (
        <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "48px 0" }}>
          Chargement…
        </p>
      )}

      {!loading && error && (
        <p style={{ textAlign: "center", color: "var(--color-danger)", padding: "48px 0" }}>
          {error}
        </p>
      )}

      {!loading && !error && filteredPlayers.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "48px 0" }}>
          {search.trim() ? "Aucun joueur ne correspond à votre recherche." : "Aucun joueur trouvé."}
        </p>
      )}

      {!loading && !error && filteredPlayers.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
            alignItems: "stretch",
          }}
        >
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              actionStatus={getActionStatus(player.id)}
              requesting={requestingId === player.id}
              onRequestFriend={handleRequestFriend}
            />
          ))}
        </div>
      )}
    </div>
  );
}
