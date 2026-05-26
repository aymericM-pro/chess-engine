import type { ReactNode } from "react";

interface TabsProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function Tabs({ children, className = "", ariaLabel = "Onglets" }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={[
        "inline-flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto",
        className,
      ].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
