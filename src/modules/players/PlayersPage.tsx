import { PLAYERS, type Player } from "./data/players";

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
  const winPct = Math.round((wins / total) * 100);
  const drawPct = Math.round((draws / total) * 100);
  const lossPct = 100 - winPct - drawPct;

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

function PlayerCard({ player }: { player: Player }) {
  const initials = player.name.slice(0, 2).toUpperCase();
  const total = player.wins + player.losses + player.draws;

  return (
    <div
      style={{
        background: "var(--color-bg-2)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "pointer",
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
    </div>
  );
}

export function PlayersPage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
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
          {PLAYERS.length} joueurs enregistrés
        </p>
      </div>

      <div
        style={{
          display: "grid",
          justifyContent: "center",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
      >
        {PLAYERS.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
