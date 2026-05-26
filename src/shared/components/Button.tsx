import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { Link, type LinkProps } from "react-router";

interface ButtonBaseProps {
  variant?: keyof typeof variantClasses;
  badge?: number;
  className?: string;
  icon?: ReactNode;
  label?: ReactNode;
  children?: ReactNode;
}

type NativeButtonProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never;
  };

type RouterButtonProps = ButtonBaseProps &
  Omit<LinkProps, "className" | "children"> & {
    to: LinkProps["to"];
  };

export type ButtonProps = NativeButtonProps | RouterButtonProps;

const variantClasses = {
  "nav-secondary":
    "h-9 rounded-lg border border-[var(--color-border)] px-4 text-sm font-semibold text-[var(--color-text-primary)] hover:border-[rgba(201,169,110,0.42)] hover:bg-[rgba(201,169,110,0.08)] hover:text-[var(--color-gold)]",
  "nav-primary":
    "h-9 rounded-lg border border-[var(--color-gold)] bg-[var(--color-gold)] px-4 text-sm font-bold text-[#0d1117] hover:opacity-90",
  "nav-icon":
    "relative h-[34px] w-[34px] rounded-lg border-none bg-transparent p-0 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-3)] hover:text-[var(--color-text-primary)]",
  "nav-avatar":
    "rounded-full border-none bg-transparent p-0 hover:opacity-80",
  "menu-item":
    "w-full justify-start gap-[9px] px-4 py-2 text-[13px] font-normal text-[var(--color-text-primary)] hover:bg-[var(--color-bg-3)]",
  "menu-danger":
    "w-full justify-start gap-[9px] border-none bg-transparent px-4 py-2 text-left text-[13px] font-medium text-[var(--color-danger)] hover:bg-[rgba(248,81,73,0.08)]",
  "auth-primary":
    "w-full rounded-lg border-none bg-[var(--color-gold)] px-6 py-[13px] text-[15px] font-bold text-[#0d1117] hover:opacity-[0.88] disabled:cursor-wait disabled:opacity-70",
  "auth-link":
    "gap-1.5 border-none bg-transparent p-0 text-[13px] font-medium text-[var(--color-gold)] hover:underline",
  "auth-muted-link":
    "gap-1.5 border-none bg-transparent p-0 text-[13px] font-normal text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
  "auth-input-icon":
    "absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
  "auth-tab":
    "flex-1 rounded-[7px] border-none px-3 py-2 text-sm",
  "play-primary":
    "w-full gap-2 rounded-xl border-none bg-[var(--color-gold)] p-3.5 text-[15px] font-bold tracking-[0.02em] text-[#0d1117] hover:opacity-[0.88] disabled:cursor-wait disabled:bg-[var(--color-bg-3)] disabled:text-[var(--color-text-muted)] disabled:opacity-100",
  "play-rules":
    "h-[42px] w-full gap-[9px] rounded-[10px] border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.08)] px-4 text-[13px] font-extrabold text-[var(--color-gold)] hover:border-[rgba(201,169,110,0.42)] hover:bg-[rgba(201,169,110,0.13)]",
  "play-neutral":
    "w-full gap-2 rounded-lg border border-[var(--color-border)] bg-transparent p-[11px] text-sm font-medium text-[var(--color-text-muted)] hover:border-[rgba(201,169,110,0.4)] hover:text-[var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-text-muted)]",
  "play-danger":
    "w-full gap-2 rounded-lg border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.07)] p-[11px] text-sm font-medium text-[var(--color-danger)] hover:bg-[rgba(248,81,73,0.15)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[rgba(248,81,73,0.07)]",
  "profile-outline":
    "gap-2 rounded-lg border border-[var(--color-border)] bg-transparent px-[18px] py-[9px] text-sm font-medium text-[var(--color-text-muted)] hover:border-[rgba(201,169,110,0.4)] hover:text-[var(--color-gold)]",
  "profile-primary":
    "rounded-lg border-none bg-[var(--color-gold)] px-4 py-3 text-sm font-bold text-[#0d1117] hover:opacity-[0.88] disabled:cursor-default disabled:opacity-60",
  "profile-icon":
    "h-9 w-9 rounded-lg border-none bg-transparent p-0 text-[var(--color-text-muted)] hover:bg-black/[0.18] hover:text-[var(--color-text-primary)]",
  "profile-select":
    "w-full justify-start gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-3)] px-3.5 py-[11px] text-sm text-[var(--color-text-primary)]",
  "profile-option":
    "w-full justify-start gap-3 border-none bg-transparent px-3.5 py-[11px] text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-3)]",
  "profile-segment":
    "flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-1)] px-3 py-2.5 text-[13px] font-normal text-[var(--color-text-muted)] hover:border-[rgba(201,169,110,0.4)] hover:text-[var(--color-gold)]",
  "dialog-primary":
    "flex-1 rounded-lg border-none bg-[var(--color-gold)] px-4 py-2.5 text-sm font-bold text-[#0d1117] hover:opacity-[0.85]",
  "dialog-danger":
    "flex-1 rounded-lg border-none bg-[var(--color-danger)] px-4 py-2.5 text-sm font-bold text-white hover:opacity-[0.85]",
  "players-action":
    "mt-auto min-h-[38px] w-full gap-2 rounded-[9px] border border-[rgba(201,169,110,0.28)] bg-[rgba(201,169,110,0.08)] px-3 py-2 text-[13px] font-bold text-[var(--color-gold)] hover:border-[rgba(201,169,110,0.42)] hover:bg-[rgba(201,169,110,0.13)] disabled:cursor-default disabled:border-[rgba(201,169,110,0.20)] disabled:bg-[rgba(201,169,110,0.05)] disabled:text-[var(--color-text-muted)] disabled:opacity-100",
  "choice-row":
    "w-full justify-start gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-3)] px-4 py-3.5 text-left text-sm font-normal text-[var(--color-text-primary)] hover:border-[rgba(201,169,110,0.4)] hover:text-[var(--color-gold)]",
  "choice-card":
    "flex flex-col items-center gap-2.5 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-bg-3)] px-2.5 py-3.5 text-center hover:border-[rgba(201,169,110,0.4)]",
  "sidebar-tab":
    "w-full justify-start gap-3 rounded-lg border-none bg-transparent px-4 py-3 text-left text-sm font-normal text-[var(--color-text-muted)] hover:bg-[var(--color-bg-3)] hover:text-[var(--color-text-primary)]",
  "tab":
    "gap-2 rounded-md border-none bg-transparent px-3.5 text-sm font-bold text-[var(--color-text-muted)] hover:bg-[rgba(255,255,255,0.035)] hover:text-[var(--color-text-primary)]",
  "switch":
    "relative h-[22px] w-10 rounded-full border-none bg-[var(--color-bg-3)] p-0 shadow-[inset_0_0_0_1px_var(--color-border)]",
  "landing-primary":
    "rounded border-none bg-[var(--color-gold)] px-7 py-3 text-[15px] font-semibold text-[#0a0a0a] hover:bg-[var(--color-accent-lt)]",
  "landing-outline":
    "rounded border-[1.5px] border-[var(--color-border)] bg-transparent px-7 py-3 text-[15px] font-semibold text-white hover:border-[var(--color-faint)] hover:bg-[var(--color-bg-3)]",
  "landing-floating":
    "rounded border-[1.5px] border-[var(--color-gold)] bg-[var(--color-gold)] px-7 py-3 text-[15px] font-semibold text-[#0a0a0a] hover:border-[var(--color-accent-lt)] hover:bg-[var(--color-accent-lt)]",
  "icon-ghost":
    "h-9 w-9 rounded-lg border-none bg-transparent p-0 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-3)] hover:text-[var(--color-text-primary)]",
  "compact-icon":
    "h-8 w-8 rounded-lg border-none bg-transparent p-0 text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text-primary)]",
  "small-primary":
    "rounded-lg border-none bg-[var(--color-gold)] px-[18px] py-[9px] text-[13px] font-semibold text-[#0d1117] hover:opacity-[0.85] disabled:cursor-wait disabled:opacity-70",
  "small-danger":
    "rounded-lg border border-[rgba(248,81,73,0.3)] bg-[rgba(248,81,73,0.08)] px-[18px] py-[9px] text-[13px] font-semibold text-[var(--color-danger)] hover:bg-[rgba(248,81,73,0.15)]",
  "tile":
    "rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] text-[var(--color-text-primary)] hover:border-[var(--color-gold)]",
} as const;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = "nav-secondary", badge, className = "", children, ...props },
  ref,
) {
  const { icon, label, ...buttonProps } = props;
  const classes = [
    "inline-flex items-center justify-center no-underline transition-all duration-150 flex-shrink-0 cursor-pointer",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {children ?? (
        <>
          {icon}
          {label}
        </>
      )}
      {badge != null && badge > 0 && (
        <span className="pointer-events-none absolute right-1 top-1 h-[7px] w-[7px] translate-x-[2px] translate-y-[-2px] rounded-full border-[1.5px] border-[var(--color-bg-1)] bg-[var(--color-danger)]" />
      )}
    </>
  );

  if ("to" in buttonProps && buttonProps.to !== undefined) {
    return (
      <Link {...buttonProps} ref={ref as Ref<HTMLAnchorElement>} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button {...buttonProps} ref={ref as Ref<HTMLButtonElement>} type={buttonProps.type ?? "button"} className={classes}>
      {content}
    </button>
  );
});
