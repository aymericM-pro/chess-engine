function AsideRoot({ children }: { children: React.ReactNode }) {
  return (
    <aside className="z-[90] flex w-full shrink-0 flex-col overflow-x-auto border-b border-[var(--color-border)] bg-[var(--color-bg-2)] px-3.5 py-2.5 backdrop-blur-lg lg:relative lg:min-h-[calc(100vh-64px)] lg:w-[252px] lg:self-stretch lg:overflow-visible lg:border-r lg:border-b-0 lg:px-3.5 lg:py-0">
      <div className="lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-64px)] lg:w-full lg:shrink-0 lg:flex-col lg:overflow-hidden lg:py-[18px]">
        {children}
      </div>
    </aside>
  );
}

function AsideHeader({ label, title }: { label?: string; title?: string }) {
  if (!label && !title) return null;
  return (
    <div className="hidden px-3 pb-[18px] pt-2.5 lg:block">
      {label && (
        <span className="block text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] text-[var(--color-text-muted)]">
          {label}
        </span>
      )}
      {title && (
        <span className="mt-1 block text-[17px] font-bold leading-tight text-[var(--color-text-primary)]">
          {title}
        </span>
      )}
    </div>
  );
}

function AsideBody({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-y-auto">{children}</div>;
}

function AsideFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-auto">{children}</div>;
}

export const Aside = Object.assign(AsideRoot, {
  Header: AsideHeader,
  Body:   AsideBody,
  Footer: AsideFooter,
});
