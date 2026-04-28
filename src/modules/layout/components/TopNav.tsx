import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { Bell, LogOut } from "lucide-react";
import { NotificationSidebar } from "./NotificationSidebar";

const scrollTo = (id: string) => {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const navLinks = [
  { key: "replay", label: "nav.replay", path: "/replay" },
  { key: "board", label: "nav.board", path: "/board" },
];

const UNREAD_COUNT = 2;

export function TopNav() {
  const { t } = useTranslation();
  const [active, setActive] = useState("game");
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const location = useLocation();
  const isReplay = location.pathname === "/replay" || location.pathname === "/";
  const avatarRef = useRef<HTMLDivElement>(null);

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
        className="sticky top-0 z-[100] w-full border-b border-border flex items-center justify-between px-6 h-12"
        style={{
          background: "rgba(13,17,23,0.85)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <Link
          to="/replay"
          className="font-display text-[0.8rem] font-bold tracking-[0.15em] uppercase no-underline"
          style={{
            background: "linear-gradient(135deg, #e6d5a0, #c8a95a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t("nav.logo")}
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.key}
                to={link.path}
                className={`nav-item font-display text-[0.58rem] font-semibold tracking-[0.1em] uppercase py-[6px] px-3 no-underline transition-colors duration-150 ${
                  isActive ? "text-gold" : "text-text-muted hover:text-gold"
                }`}
              >
                <span className="relative pb-[3px]">
                  {t(link.label)}
                  <span className="nav-underline-bar" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button
            onClick={() => setNotifOpen(true)}
            className="relative text-text-muted hover:text-text-primary transition-colors border-none cursor-pointer p-1"
          >
            <Bell size={15} />
            {UNREAD_COUNT > 0 && (
              <span
                className="absolute top-0 right-0 w-[7px] h-[7px] rounded-full bg-danger border border-bg-1"
                style={{ transform: "translate(2px, -2px)" }}
              />
            )}
          </button>

          {/* Avatar */}
          <div ref={avatarRef} className="relative">
            <button
              onClick={() => setAvatarOpen((o) => !o)}
              className="border-none cursor-pointer p-0 rounded-full transition-opacity duration-150 hover:opacity-80"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-[0.55rem] tracking-[0.06em] flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #e6d5a0, #c8a95a)",
                  color: "#0d1117",
                }}
              >
                WL
              </div>
            </button>

            {avatarOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-[300]"
                style={{
                  background: "var(--color-bg-3)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  className="px-4 py-3"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  <p className="font-display font-semibold text-[0.72rem] tracking-[0.06em] text-text-primary">
                    Wynn4Life
                  </p>
                  <p className="font-serif italic text-[0.7rem] text-text-muted mt-[2px]">
                    249 ELO · Blancs
                  </p>
                </div>
                <div className="px-2 py-2">
                  <button
                    className="w-full flex items-center gap-2 px-3 py-[7px] rounded-lg text-left border-none cursor-pointer text-danger hover:bg-[rgba(248,81,73,0.1)] transition-colors"
                    onClick={() => setAvatarOpen(false)}
                  >
                    <LogOut size={13} />
                    <span className="font-display text-[0.62rem] font-semibold tracking-[0.08em] uppercase">
                      {t("nav.logout")}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <NotificationSidebar
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
    </>
  );
}
