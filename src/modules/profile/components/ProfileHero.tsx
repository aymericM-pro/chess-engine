import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { COUNTRIES, type UserProfile } from "../models";

export function ProfileHero({ user }: { user: UserProfile }) {
  const country = COUNTRIES.find((c) => c.code === user.countryCode);

  return (
    <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 16, padding: "36px 40px", marginBottom: 24, display: "flex", alignItems: "center", gap: 28 }}>
      <ProfileAvatar initials={`${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{user.firstName} {user.lastName}</div>
        {user.bio && (
          <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 6, lineHeight: 1.5 }}>{user.bio}</div>
        )}
        <div style={{ fontSize: 13, color: "var(--color-text-muted)", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span>{country?.flag} {user.username}</span>
          <span>·</span>
          <span>Membre depuis {user.joinedYear}</span>
          <span>·</span>
          <span>{user.color}</span>
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 38, fontWeight: 700, color: "var(--color-gold)", lineHeight: 1 }}>{user.elo}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>ELO</div>
      </div>
    </div>
  );
}
