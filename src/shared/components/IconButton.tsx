import { Button } from "./Button";

interface IconButtonProps {
  onClick?: () => void;
  title?: string;
  badge?: number;
  children: React.ReactNode;
}

export function IconButton({ onClick, title, badge, children }: IconButtonProps) {
  return (
    <Button
      variant="nav-icon"
      onClick={onClick}
      title={title}
      badge={badge}
    >
      {children}
    </Button>
  );
}
