import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface DialogProps {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  closeLabel?: string;
  onClose: () => void;
  children?: ReactNode;
  footer?: ReactNode;
  width?: number | string;
  zIndex?: number;
  className?: string;
  bodyClassName?: string;
  footerClassName?: string;
  showCloseButton?: boolean;
}

export function Dialog({
  title,
  description,
  icon,
  closeLabel = "Fermer",
  onClose,
  children,
  footer,
  width = 420,
  zIndex = 500,
  className = "",
  bodyClassName = "px-7 py-6",
  footerClassName = "px-7 pb-6",
  showCloseButton = false,
}: DialogProps) {
  const dialogWidth = typeof width === "number" ? `${width}px` : width;
  const hasHeader = title || description || icon || showCloseButton;

  return (
    <div
      role="presentation"
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex, background: "rgba(0,0,0,0.60)" }}
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        className={[
          "max-h-[calc(100dvh-32px)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-2)] shadow-[0_24px_64px_rgba(0,0,0,0.60)]",
          className,
        ].filter(Boolean).join(" ")}
        style={{ width: `min(${dialogWidth}, 100%)` }}
        onClick={(event) => event.stopPropagation()}
      >
        {hasHeader && (
          <header className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-7 py-5">
            <div className="flex min-w-0 items-start gap-3">
              {icon && <div className="mt-0.5 flex shrink-0 items-center justify-center">{icon}</div>}
              <div className="min-w-0">
                {title && (
                  <h2 className="text-[19px] font-bold leading-tight text-[var(--color-text-primary)]">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {showCloseButton && (
              <Button
                variant="profile-icon"
                onClick={onClose}
                className="-mr-2 -mt-2"
                aria-label={closeLabel}
                title={closeLabel}
              >
                <X size={18} />
              </Button>
            )}
          </header>
        )}

        {children && (
          <div className={bodyClassName}>
            {children}
          </div>
        )}

        {footer && (
          <footer className={footerClassName}>
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}
