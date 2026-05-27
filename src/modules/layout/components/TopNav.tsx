import { useRef, useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Bell, LogOut, Settings, User, Sun, Moon } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { useOpenNotificationSidebar } from "./NotificationSidebar";
import { useThemeStore } from "@/shared/theme/useThemeStore";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { usePlayerStore } from "@/modules/players/store/playerStore";
import { useGameInviteStore } from "@/modules/gameInvites/store/gameInviteStore";
import { useRouter } from "@/shared/services/router";
import { Route } from "@/shared/services/routes";

export function TopNav() {
  const { t } = useTranslation();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useThemeStore();
  const token = useAuthStore((s) => s.token);
  const authUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { player, fetchPlayer } = usePlayerStore();
  const clearPlayer = usePlayerStore((state) => state.clearPlayer);
  const inviteCount = useGameInviteStore((state) => state.unreadCount);
  const clearInvites = useGameInviteStore((state) => state.clearInvites);
  const { goTo } = useRouter();
  const openNotificationSidebar = useOpenNotificationSidebar();

  useEffect(() => {
    if (authUser?.id && !player) {
      fetchPlayer(authUser.id).catch(() => undefined);
    }
  }, [authUser?.id, fetchPlayer, player]);

  const initials = ((authUser?.firstName?.[0] ?? '') + (authUser?.lastName?.[0] ?? authUser?.username?.[0] ?? '')).toUpperCase() || '?';
  const displayName = player?.username ?? authUser?.username ?? 'Profil';
  const displayElo  = player?.elo ?? null;

  const handleLogout = () => {
    setAvatarOpen(false);
    clearPlayer();
    clearInvites();
    logout();
    goTo({ route: "login" }, { replace: true });
  };

  useEffect(() => {
    if (!avatarOpen) return;
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [avatarOpen]);

  return (
    <>
      <nav
        className="sticky top-0 z-[100] w-full flex items-center justify-between px-10"
        style={{
          height: 64,
          borderBottom: "1px solid var(--color-border)",
          background: theme === "dark" ? "rgba(28,28,34,0.97)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* Logo */}
        <Link to={Route.Home} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: "1.5px solid var(--color-gold)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "var(--color-gold)",
              flexShrink: 0,
            }}
          >
            ♔
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-gold)", lineHeight: 1.2 }}>
              CHESS<span style={{ color: "var(--color-text-primary)", fontWeight: 400 }}>MASTER</span>
            </div>
            <div style={{ fontSize: 9, color: "var(--color-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Jouez en ligne
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="nav-icon"
            onClick={toggle}
            title={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>

          {!token ? (
            <div className="flex items-center gap-2">
              <Button
                to={Route.Login}
                variant="nav-secondary"
                label="Connexion"
              />
              <Button
                to={Route.Register}
                variant="nav-primary"
                label="Inscription"
              />
            </div>
          ) : (
            <>
              <Button variant="nav-icon" onClick={openNotificationSidebar} badge={inviteCount}>
                <Bell size={16} />
              </Button>

              <div ref={avatarRef} className="relative">
                <Button
                  variant="nav-avatar"
                  onClick={() => setAvatarOpen((o) => !o)}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[0.6rem] tracking-[0.06em] flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #e6d5a0, #c8a95a)",
                      color: "#0d1117",
                    }}
                  >
                    {initials}
                  </div>
                </Button>

                {avatarOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 rounded-xl z-[300]"
                    style={{
                      background: "var(--color-bg-2)",
                      border: "1px solid var(--color-border)",
                      boxShadow: theme === "dark" ? "0 12px 32px rgba(0,0,0,0.5)" : "0 8px 24px rgba(0,0,0,0.12)",
                      width: 192,
                    }}
                  >
                    {/* User info */}
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #e6d5a0,#c8a95a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0d1117", letterSpacing: "0.04em", flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {displayName}
                        </p>
                        {displayElo !== null && (
                          <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 1 }}>{displayElo} ELO</p>
                        )}
                      </div>
                    </div>

                    {/* Links */}
                    <div style={{ paddingTop: 4, paddingBottom: 4 }}>
                      {[
                        { icon: <User size={13} />, label: "Profil", to: Route.Profile },
                        { icon: <Settings size={13} />, label: t("nav.settings"), to: Route.Settings },
                      ].map(({ icon, label, to }) => (
                        <Button
                          key={to}
                          to={to}
                          variant="menu-item"
                          icon={<span style={{ color: "var(--color-text-muted)" }}>{icon}</span>}
                          label={label}
                          onClick={() => setAvatarOpen(false)}
                        />
                      ))}

                      <div style={{ height: 1, background: "var(--color-border)", margin: "4px 0" }} />

                      <Button
                        variant="menu-danger"
                        icon={<LogOut size={13} />}
                        label={t("nav.logout")}
                        onClick={handleLogout}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
