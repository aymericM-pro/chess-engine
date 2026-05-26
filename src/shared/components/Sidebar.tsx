import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface SidebarContentProps {
  closeSidebar: () => void;
}

interface SidebarShellProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  closeIcon?: ReactNode;
  closeLabel?: string;
  width?: number | string;
  zIndex?: number;
  children: ReactNode;
  footer?: ReactNode;
  bodyClassName?: string;
  footerClassName?: string;
}

export interface OpenSidebarOptions {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  closeIcon?: ReactNode;
  closeLabel?: string;
  width?: number | string;
  zIndex?: number;
  footer?: ReactNode;
  bodyClassName?: string;
  footerClassName?: string;
  onClose?: () => void;
}

interface SidebarState {
  component: ComponentType<any>;
  props: object;
  options: OpenSidebarOptions;
}

interface SidebarService {
  openSidebar: <P extends object>(
    component: ComponentType<P & SidebarContentProps>,
    props: P,
    options: OpenSidebarOptions,
  ) => void;
  closeSidebar: () => void;
  setFooter: (footer: ReactNode) => void;
}

const SidebarContext = createContext<SidebarService | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SidebarState | null>(null);
  const [open, setOpen] = useState(false);
  const [footer, setFooter] = useState<ReactNode>(null);

  const closeSidebar = useCallback(() => {
    setOpen(false);
    state?.options.onClose?.();
    window.setTimeout(() => {
      setState(null);
      setFooter(null);
    }, 300);
  }, [state]);

  const openSidebar = useCallback<SidebarService["openSidebar"]>((component, props, options) => {
    setState({ component, props, options });
    setFooter(options.footer ?? null);
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const value = useMemo(
    () => ({ openSidebar, closeSidebar, setFooter }),
    [closeSidebar, openSidebar],
  );

  const ActiveComponent = state?.component;

  return (
    <SidebarContext.Provider value={value}>
      {children}
      {state && ActiveComponent && (
        <SidebarShell
          open={open}
          onClose={closeSidebar}
          title={state.options.title}
          description={state.options.description}
          icon={state.options.icon}
          closeIcon={state.options.closeIcon}
          closeLabel={state.options.closeLabel}
          width={state.options.width}
          zIndex={state.options.zIndex}
          bodyClassName={state.options.bodyClassName}
          footerClassName={state.options.footerClassName}
          footer={footer}
        >
          <ActiveComponent {...state.props} closeSidebar={closeSidebar} />
        </SidebarShell>
      )}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }
  return context;
}

function SidebarShell({
  open,
  onClose,
  title,
  description,
  icon,
  closeIcon,
  closeLabel = "Fermer",
  width = 480,
  zIndex = 200,
  children,
  footer,
  bodyClassName = "px-7 py-6",
  footerClassName = "px-7 py-4",
}: SidebarShellProps) {
  const sidebarWidth = typeof width === "number" ? `${width}px` : width;

  return (
    <>
      <div
        className={`fixed inset-0 transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        style={{ zIndex: zIndex - 50, background: "rgba(0,0,0,0.45)" }}
        onClick={onClose}
      />

      <aside
        className={`fixed bottom-0 right-0 top-0 flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{
          zIndex,
          width: `min(${sidebarWidth}, 100vw)`,
          background: "var(--color-bg-2)",
          borderLeft: "1px solid var(--color-border)",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.22)",
        }}
      >
        <header
          className="flex flex-shrink-0 items-center justify-between gap-4 px-7 py-5"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex min-w-0 items-center gap-3">
            {icon}
            <div className="min-w-0">
              <div className="font-display text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-primary)]">
                {title}
              </div>
              {description && (
                <div className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">
                  {description}
                </div>
              )}
            </div>
          </div>

          <Button
            variant="profile-icon"
            onClick={onClose}
            className="-mr-2"
            aria-label={closeLabel}
            title={closeLabel}
          >
            {closeIcon ?? <X size={18} />}
          </Button>
        </header>

        <div className={`flex-1 overflow-y-auto ${bodyClassName}`}>
          {children}
        </div>

        {footer && (
          <footer className={`flex-shrink-0 ${footerClassName}`} style={{ borderTop: "1px solid var(--color-border)" }}>
            {footer}
          </footer>
        )}
      </aside>
    </>
  );
}
