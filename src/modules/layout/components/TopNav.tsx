import { useRef, useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Bell, LogOut, Settings, User, Sun, Moon } from "lucide-react";
import { IconButton } from "@/shared/components/IconButton";
import { NotificationSidebar } from "./NotificationSidebar";
import { useThemeStore } from "@/shared/theme/useThemeStore";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { usePlayerStore } from "@/modules/players/store/playerStore";
import { useNotificationStore } from "@/modules/notifications/notificationStore";

export function TopNav() {
  const { t } = useTranslation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useThemeStore();
  const authUser = useAuthStore((s) => s.user);
  const { player, fetchPlayer } = usePlayerStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  useEffect(() => {
    if (authUser?.id && !player) {
      fetchPlayer(authUser.id).catch(() => undefined);
    }
  }, [authUser?.id]);

  const initials = ((authUser?.firstName?.[0] ?? '') + (authUser?.lastName?.[0] ?? authUser?.username?.[0] ?? '')).toUpperCase() || '?';
  const displayName = player?.username ?? authUser?.username ?? 'Profil';
  const displayElo  = player?.elo ?? null;

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
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
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

        {/* Right zone */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <IconButton
            onClick={toggle}
            title={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </IconButton>

          {/* Notification bell */}
          <IconButton onClick={() => setNotifOpen(true)} badge={unreadCount}>
            <Bell size={16} />
          </IconButton>

          {/* Avatar */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setAvatarOpen((o) => !o)}
              className="border-none cursor-pointer p-0 rounded-full hover:opacity-80 transition-opacity"
              style={{ background: "none" }}
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
            </button>

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
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #e6d5a0, #c8a95a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0d1117", letterSpacing: "0.04em", flexShrink: 0 }}>
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
                    { icon: <User size={13} />, label: "Profil", to: "/profile" },
                    { icon: <Settings size={13} />, label: t("nav.settings"), to: "/settings" },
                  ].map(({ icon, label, to }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setAvatarOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", gap: 9,
                        padding: "8px 16px", textDecoration: "none",
                        fontSize: 13, color: "var(--color-text-primary)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-bg-3)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <span style={{ color: "var(--color-text-muted)" }}>{icon}</span>
                      {label}
                    </Link>
                  ))}

                  <div style={{ height: 1, background: "var(--color-border)", margin: "4px 0" }} />

                  <Link
                    to="/login"
                    onClick={() => setAvatarOpen(false)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 9,
                      padding: "8px 16px", textDecoration: "none",
                      fontSize: 13, fontWeight: 500, color: "var(--color-danger)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,81,73,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <LogOut size={13} />
                    {t("nav.logout")}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <NotificationSidebar open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
