import { NavLink } from "react-router";

const BASE =
  "relative flex min-h-[38px] items-center gap-3 whitespace-nowrap rounded-lg px-3 text-sm font-semibold no-underline transition-[background,color,box-shadow] duration-150 lg:min-h-[46px] lg:px-[13px]";

const ACTIVE =
  "rounded-l-none bg-[rgba(201,169,110,0.10)] text-[var(--color-gold)] shadow-[inset_0_0_0_1px_rgba(201,169,110,0.20)] before:absolute before:bottom-0 before:left-0 before:top-0 before:w-[3px] before:rounded-none before:bg-[var(--color-gold)]";

const INACTIVE =
  "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-3)] hover:text-[var(--color-text-primary)]";

interface LinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

export function Link({ to, icon, label, badge }: LinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => [BASE, isActive ? ACTIVE : INACTIVE].join(" ")}
    >
      <span className="flex w-5 shrink-0 items-center justify-center">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--color-gold)] px-1 text-[10px] font-bold text-[#0d1117]">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </NavLink>
  );
}
