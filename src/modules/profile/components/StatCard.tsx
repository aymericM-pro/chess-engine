import type { LucideIcon } from "lucide-react";
import { IconTile } from "@/shared/components/IconTile";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
}

export function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
      <IconTile icon={icon} tone="gold" size="md" />
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--color-faint)", marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}
