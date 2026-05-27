interface ResultsCardProps {
  wins: number;
  draws: number;
  losses: number;
  total: number;
}

export function ResultsCard({ wins, draws, losses, total }: ResultsCardProps) {
  const winPct      = Math.round((wins   / total) * 100);
  const winPctDraw  = Math.round((draws  / total) * 100);
  const lossPct     = 100 - winPct - winPctDraw;

  const rows = [
    { label: "Victoires", value: wins,   pct: winPct,     color: "var(--color-gold)" },
    { label: "Nulles",    value: draws,  pct: winPctDraw, color: "var(--color-faint)" },
    { label: "Défaites",  value: losses, pct: lossPct,    color: "var(--color-danger)" },
  ];

  return (
    <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Résultats</div>

      <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 10, marginBottom: 16 }}>
        <div style={{ flex: winPct,     background: "var(--color-gold)" }} />
        <div style={{ flex: winPctDraw, background: "var(--color-faint)" }} />
        <div style={{ flex: lossPct,    background: "var(--color-danger)", opacity: 0.7 }} />
      </div>

      {rows.map((r) => (
        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
            <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{r.label}</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{r.value}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-muted)", width: 32, textAlign: "right" }}>{r.pct}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
