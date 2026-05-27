interface NavProps {
  children: React.ReactNode;
  "aria-label"?: string;
}

export function Nav({ children, "aria-label": ariaLabel }: NavProps) {
  return (
    <nav className="flex flex-row gap-2 lg:flex-col lg:gap-1.5" aria-label={ariaLabel}>
      {children}
    </nav>
  );
}
