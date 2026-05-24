import { useState } from "react";

interface IconButtonProps {
  onClick?: () => void;
  title?: string;
  badge?: number;
  children: React.ReactNode;
}

export function IconButton({ onClick, title, badge, children }: IconButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
        background: hovered ? "var(--color-bg-3)" : "transparent",
        color: hovered ? "var(--color-text-primary)" : "var(--color-text-muted)",
        flexShrink: 0,
      }}
    >
      {children}
      {badge != null && badge > 0 && (
        <span
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--color-danger)",
            border: "1.5px solid var(--color-bg-1)",
            transform: "translate(2px, -2px)",
          }}
        />
      )}
    </button>
  );
}
