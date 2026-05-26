import type { ReactNode } from "react";

interface TabProps {
  active: boolean;
  onClick: () => void;
  label: ReactNode;
  count?: number;
  className?: string;
}

export function Tab({ active, onClick, label, count, className = "" }: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "group relative inline-flex min-h-[42px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent px-4 text-sm font-bold no-underline outline-none transition-[background,color,border-color,box-shadow] duration-150",
        "focus-visible:ring-2 focus-visible:ring-[rgba(201,169,110,0.36)] focus-visible:ring-offset-0",
        active
          ? "bg-[rgba(201,169,110,0.10)] text-[var(--color-gold)] shadow-[inset_0_0_0_1px_rgba(201,169,110,0.20)] hover:bg-[rgba(201,169,110,0.10)] hover:text-[var(--color-gold)]"
          : "bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-bg-3)] hover:text-[var(--color-text-primary)]",
        className,
      ].filter(Boolean).join(" ")}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={[
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-black transition",
            active
              ? "bg-[rgba(201,169,110,0.22)] text-[var(--color-gold)]"
              : "bg-[rgba(255,255,255,0.045)] text-[var(--color-text-muted)] group-hover:bg-[rgba(255,255,255,0.07)]",
          ].join(" ")}
        >
          {count}
        </span>
      )}
    </button>
  );
}
