import { NavLink } from "react-router";
import { History, Swords, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { usePlayerStore } from "@/modules/players/store/playerStore";

const sidebarLinks = [
  { key: "play", label: "nav.play", path: "/play", icon: <Swords size={17} /> },
  { key: "history", label: "nav.history", path: "/history", icon: <History size={17} /> },
  { key: "players", label: "nav.players", path: "/players", icon: <Users size={17} /> },
];

export function MainSidebar() {
  const { t } = useTranslation();
  const authUser = useAuthStore((state) => state.user);
  const player = usePlayerStore((state) => state.player);
  const initials = ((authUser?.firstName?.[0] ?? "") + (authUser?.lastName?.[0] ?? authUser?.username?.[0] ?? "")).toUpperCase() || "?";
  const displayName = player?.username ?? authUser?.username ?? "Profil";
  const displayElo = player?.elo ?? null;

  return (
    <aside className="z-[90] flex w-full shrink-0 flex-col overflow-x-auto border-b border-[var(--color-border)] bg-[var(--color-bg-2)] px-3.5 py-2.5 backdrop-blur-lg lg:relative lg:min-h-[calc(100vh-64px)] lg:w-[252px] lg:self-stretch lg:overflow-visible lg:border-r lg:border-b-0 lg:px-3.5 lg:py-0">
      <div className="lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-64px)] lg:w-full lg:shrink-0 lg:flex-col lg:overflow-hidden lg:py-[18px]">
        <div className="hidden px-3 pb-[18px] pt-2.5 lg:block">
          <span className="block text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] text-[var(--color-text-muted)]">Navigation</span>
          <span className="mt-1 block text-[17px] font-bold leading-tight text-[var(--color-text-primary)]">Espace joueur</span>
        </div>

        <nav className="flex flex-row gap-2 lg:flex-col lg:gap-1.5" aria-label="Navigation principale">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.key}
              to={link.path}
              className={({ isActive }) => [
                "relative flex min-h-[38px] items-center gap-3 whitespace-nowrap rounded-lg px-3 text-sm font-semibold no-underline transition-[background,color,box-shadow] duration-150 lg:min-h-[46px] lg:px-[13px]",
                isActive
                  ? "rounded-tl-none bg-[rgba(201,169,110,0.10)] text-[var(--color-gold)] shadow-[inset_0_0_0_1px_rgba(201,169,110,0.20)] before:absolute before:bottom-0 before:left-0 before:top-0 before:w-[3px] before:rounded-none before:bg-[var(--color-gold)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-3)] hover:text-[var(--color-text-primary)]",
              ].join(" ")}
            >
              <span className="flex w-5 shrink-0 items-center justify-center">{link.icon}</span>
              <span>{t(link.label)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto hidden min-w-0 items-center gap-[11px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-3)] p-3 lg:flex">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e6d5a0,#c8a95a)] text-[11px] font-extrabold tracking-[0.04em] text-[#0d1117]">{initials}</div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold text-[var(--color-text-primary)]">{displayName}</span>
            {displayElo !== null && <span className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{displayElo} ELO</span>}
          </div>
        </div>
      </div>
    </aside>
  );
}
