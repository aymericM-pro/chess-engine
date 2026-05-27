interface OpeningsCardProps {
  topOpenings: [string, number][];
  total: number;
}

export function OpeningsCard({ topOpenings, total }: OpeningsCardProps) {
  return (
    <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Ouvertures favorites</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {topOpenings.map(([opening, count], i) => (
          <div key={opening}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13 }}>{opening}</span>
              <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{count} partie{count > 1 ? "s" : ""}</span>
            </div>
            <div style={{ height: 4, borderRadius: 100, background: "var(--color-bg-3)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(count / total) * 100}%`,
                background: i === 0 ? "var(--color-gold)" : i === 1 ? "#b8925a" : "#a87c48",
                borderRadius: 100,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
