type ProfileAvatarSize = "sm" | "md" | "lg";

interface ProfileAvatarProps {
  initials: string;
  size?: ProfileAvatarSize;
  className?: string;
}

const sizeClasses: Record<ProfileAvatarSize, string> = {
  sm: "h-12 w-12 text-xl",
  md: "h-20 w-20 text-[26px]",
  lg: "h-28 w-28 text-4xl",
};

export function ProfileAvatar({ initials, size = "md", className = "" }: ProfileAvatarProps) {
  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e6d5a0,#c8a95a)] font-bold lowercase text-[#0d1117]",
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {initials || "?"}
    </div>
  );
}
