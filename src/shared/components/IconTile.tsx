import type { LucideIcon } from "lucide-react";

type IconTileTone = "gold" | "blue" | "danger" | "muted";
type IconTileSize = "sm" | "md" | "lg";

interface IconTileProps {
  icon: LucideIcon;
  tone?: IconTileTone;
  size?: IconTileSize;
  active?: boolean;
  interactive?: boolean;
  className?: string;
}

const sizeClasses: Record<IconTileSize, { box: string; icon: number }> = {
  sm: { box: "h-8 w-8 rounded-lg", icon: 15 },
  md: { box: "h-10 w-10 rounded-[10px]", icon: 18 },
  lg: { box: "h-12 w-12 rounded-xl", icon: 20 },
};

const toneClasses: Record<IconTileTone, string> = {
  gold: "border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.14)] text-[var(--color-gold)]",
  blue: "border-[#2d3b56] bg-[#253149] text-[var(--color-gold)]",
  danger: "border-[rgba(248,81,73,0.25)] bg-[rgba(248,81,73,0.08)] text-[var(--color-danger)]",
  muted: "border-[var(--color-border)] bg-[var(--color-bg-3)] text-[var(--color-text-muted)]",
};

export function IconTile({
  icon: Icon,
  tone = "gold",
  size = "md",
  active = false,
  interactive = false,
  className = "",
}: IconTileProps) {
  const sizing = sizeClasses[size];

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center justify-center border transition-[background,color,box-shadow,border-color] duration-150",
        sizing.box,
        toneClasses[tone],
        active ? "shadow-[inset_0_0_0_1px_rgba(201,169,110,0.24)]" : "",
        interactive ? "group-hover:border-[rgba(201,169,110,0.32)] group-hover:bg-[rgba(201,169,110,0.12)] group-hover:text-[var(--color-gold)]" : "",
        className,
      ].join(" ")}
    >
      <Icon size={sizing.icon} strokeWidth={2} />
    </span>
  );
}
