import { History, Swords, UserRoundPlus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { usePlayerStore } from "@/modules/players/store/playerStore";
import { Route } from "@/shared/services/routes";
import { Aside } from "@/shared/components/Aside";
import { Nav } from "@/shared/components/Nav";
import { Link } from "@/shared/components/Link";

const sidebarLinks = [
  { key: "play",    label: "nav.play",    path: Route.Play,    icon: <Swords size={17} /> },
  { key: "history", label: "nav.history", path: Route.History, icon: <History size={17} /> },
  { key: "players", label: "nav.players", path: Route.Players, icon: <Users size={17} /> },
  { key: "friends", label: "nav.friends", path: Route.Friends, icon: <UserRoundPlus size={17} /> },
];

export function MainSidebar() {
  const { t } = useTranslation();
  const authUser = useAuthStore((state) => state.user);
  const player   = usePlayerStore((state) => state.player);

  const initials    = ((authUser?.firstName?.[0] ?? "") + (authUser?.lastName?.[0] ?? authUser?.username?.[0] ?? "")).toUpperCase() || "?";
  const displayName = player?.username ?? authUser?.username ?? "Profil";
  const displayElo  = player?.elo ?? null;

  return (
    <Aside>
      <Aside.Header label="Navigation" title="Espace joueur" />

      <Aside.Body>
        <Nav aria-label="Navigation principale">
          {sidebarLinks.map((link) => (
            <Link key={link.key} to={link.path} icon={link.icon} label={t(link.label)} />
          ))}
        </Nav>
      </Aside.Body>

      <Aside.Footer>
        <div className="hidden min-w-0 items-center gap-[11px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-3)] p-3 lg:flex">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e6d5a0,#c8a95a)] text-[11px] font-extrabold tracking-[0.04em] text-[#0d1117]">
            {initials}
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold text-[var(--color-text-primary)]">{displayName}</span>
            {displayElo !== null && (
              <span className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{displayElo} ELO</span>
            )}
          </div>
        </div>
      </Aside.Footer>
    </Aside>
  );
}
