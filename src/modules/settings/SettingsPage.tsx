import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Palette, Bell, Shield, Eye, EyeOff } from "lucide-react";
import { THEMES } from "@/modules/replay/data/themes";
import { useReplayStore } from "@/modules/replay/store/replayStore";
import { usersApi } from "@/shared/api/users.api";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useToastStore } from "@/shared/toasts/toastStore";
import { changePasswordSchema, getFieldErrors, type FieldErrors } from "@/shared/validation/formSchemas";

type Tab = "language" | "theme" | "notifications" | "security";

const TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: "language",      icon: <Globe size={16} />,   label: "Langue" },
  { id: "theme",         icon: <Palette size={16} />,  label: "Échiquier" },
  { id: "notifications", icon: <Bell size={16} />,     label: "Notifications" },
  { id: "security",      icon: <Shield size={16} />,   label: "Sécurité" },
];

const languages = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English",  flag: "🇬🇧" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{children}</h2>;
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 28, lineHeight: 1.7 }}>{children}</p>;
}

function Divider() {
  return <div style={{ height: 1, background: "var(--color-border)", margin: "28px 0" }} />;
}

/* ── Language ── */
function LanguageTab() {
  const { i18n } = useTranslation();
  return (
    <div>
      <SectionTitle>Langue de l&apos;interface</SectionTitle>
      <SectionDesc>Choisissez la langue affichée dans toute l&apos;application.</SectionDesc>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320 }}>
        {languages.map((lang) => {
          const active = i18n.language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px", borderRadius: 10, cursor: "pointer",
                background: active ? "rgba(201,169,110,0.08)" : "var(--color-bg-3)",
                border: `1px solid ${active ? "rgba(201,169,110,0.4)" : "var(--color-border)"}`,
                color: active ? "var(--color-gold)" : "var(--color-text-primary)",
                fontSize: 14, fontWeight: active ? 600 : 400,
                transition: "all 0.15s", textAlign: "left",
              }}
            >
              <span style={{ fontSize: 22 }}>{lang.flag}</span>
              <span>{lang.label}</span>
              {active && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--color-gold)", letterSpacing: "0.06em" }}>ACTIF</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Theme ── */
function ThemeTab() {
  const { themeId, setTheme } = useReplayStore();
  return (
    <div>
      <SectionTitle>Thème de l&apos;échiquier</SectionTitle>
      <SectionDesc>Personnalisez les couleurs des cases de votre échiquier.</SectionDesc>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {THEMES.map((theme) => {
          const active = themeId === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                padding: "14px 10px", borderRadius: 10, cursor: "pointer",
                background: active ? "rgba(201,169,110,0.08)" : "var(--color-bg-3)",
                border: `1px solid ${active ? "rgba(201,169,110,0.4)" : "var(--color-border)"}`,
                transition: "all 0.15s",
              }}
            >
              {/* Mini board preview */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", width: 48, height: 48, borderRadius: 5, overflow: "hidden" }}>
                {Array.from({ length: 16 }, (_, i) => (
                  <div key={i} style={{ background: (Math.floor(i / 4) + i) % 2 === 0 ? theme.light : theme.dark }} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: active ? "var(--color-gold)" : "var(--color-text-muted)", fontWeight: active ? 600 : 400, textAlign: "center" }}>
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Notifications ── */
type NotifKey = "game_end" | "new_challenge" | "tournament" | "newsletter";

const NOTIF_OPTIONS: { key: NotifKey; label: string; desc: string }[] = [
  { key: "game_end",      label: "Fin de partie",        desc: "Recevoir un email quand une partie se termine." },
  { key: "new_challenge", label: "Nouveaux défis",        desc: "Être notifié quand un joueur vous défie." },
  { key: "tournament",    label: "Tournois",              desc: "Rappels et résultats des tournois auxquels vous participez." },
  { key: "newsletter",    label: "Newsletter",            desc: "Actualités, conseils et nouvelles fonctionnalités." },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 40, height: 22, borderRadius: 100, border: "none",
        background: on ? "var(--color-gold)" : "var(--color-bg-3)",
        cursor: "pointer", position: "relative", flexShrink: 0,
        transition: "background 0.2s", padding: 0,
        boxShadow: on ? "none" : "inset 0 0 0 1px var(--color-border)",
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: on ? "#0d1117" : "var(--color-faint)",
        transition: "left 0.2s",
      }} />
    </button>
  );
}

function NotificationsTab() {
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    game_end: true, new_challenge: true, tournament: false, newsletter: false,
  });

  return (
    <div>
      <SectionTitle>Notifications par email</SectionTitle>
      <SectionDesc>Gérez les emails que vous souhaitez recevoir de notre part.</SectionDesc>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden" }}>
        {NOTIF_OPTIONS.map((opt, i) => (
          <div
            key={opt.key}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 20px", gap: 20,
              borderBottom: i < NOTIF_OPTIONS.length - 1 ? "1px solid var(--color-border)" : "none",
              background: "var(--color-bg-2)",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{opt.label}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{opt.desc}</div>
            </div>
            <Toggle on={notifs[opt.key]} onChange={() => setNotifs((p) => ({ ...p, [opt.key]: !p[opt.key] }))} />
          </div>
        ))}
      </div>
    </div>
  );
}

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

/* ── Password input with show/hide ── */
function PasswordInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label style={{ fontSize: 13, color: "var(--color-text-muted)", display: "block", marginBottom: 8 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%", padding: "12px 44px 12px 16px", borderRadius: 8,
            background: "var(--color-bg-3)", border: `1px solid ${error ? "var(--color-danger)" : "var(--color-border)"}`,
            color: "var(--color-text-primary)", fontSize: 15, outline: "none",
            boxSizing: "border-box", transition: "border-color 0.15s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = error ? "var(--color-danger)" : "var(--color-border)")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", padding: 4,
            color: "var(--color-text-muted)", display: "flex", alignItems: "center",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && (
        <p style={{ margin: "6px 0 0", color: "var(--color-danger)", fontSize: 12, lineHeight: 1.45 }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Security ── */
function SecurityTab() {
  const [showDelete, setShowDelete] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors<PasswordField>>({});
  const [savingPassword, setSavingPassword] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!parsed.success) {
      setErrors(getFieldErrors<PasswordField>(parsed.error));
      return;
    }

    setErrors({});
    setSavingPassword(true);
    try {
      await usersApi.changePassword({
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      addToast({
        type: "success",
        title: "Mot de passe modifié",
        message: "Votre nouveau mot de passe est actif.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Modification impossible",
        message: getErrorMessage(err, "Impossible de modifier le mot de passe."),
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div>
      {/* Password */}
      <SectionTitle>Mot de passe</SectionTitle>
      <SectionDesc>Changez votre mot de passe régulièrement pour sécuriser votre compte.</SectionDesc>
      <form noValidate onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
        <PasswordInput
          label="Mot de passe actuel"
          value={currentPassword}
          error={errors.currentPassword}
          onChange={(value) => {
            setCurrentPassword(value);
            setErrors((current) => ({ ...current, currentPassword: undefined, newPassword: undefined }));
          }}
        />
        <PasswordInput
          label="Nouveau mot de passe"
          value={newPassword}
          error={errors.newPassword}
          onChange={(value) => {
            setNewPassword(value);
            setErrors((current) => ({ ...current, newPassword: undefined, confirmPassword: undefined }));
          }}
        />
        <PasswordInput
          label="Confirmer le nouveau mot de passe"
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            setErrors((current) => ({ ...current, confirmPassword: undefined }));
          }}
        />
        <button
          type="submit"
          disabled={savingPassword}
          style={{
            alignSelf: "flex-start", marginTop: 4,
            padding: "10px 22px", borderRadius: 8, border: "none",
            background: "var(--color-gold)", color: "#0d1117",
            fontSize: 14, fontWeight: 600, cursor: savingPassword ? "wait" : "pointer",
            transition: "opacity 0.15s", opacity: savingPassword ? 0.7 : 1,
          }}
          onMouseEnter={(e) => { if (!savingPassword) e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { if (!savingPassword) e.currentTarget.style.opacity = "1"; }}
        >
          {savingPassword ? "Mise à jour…" : "Mettre à jour"}
        </button>
      </form>

      <Divider />

      {/* Delete account */}
      <SectionTitle>Supprimer le compte</SectionTitle>
      <SectionDesc>
        Cette action est irréversible. Toutes vos parties, statistiques et données seront définitivement supprimées.
      </SectionDesc>
      {!showDelete ? (
        <button
          onClick={() => setShowDelete(true)}
          style={{
            padding: "10px 22px", borderRadius: 8,
            background: "rgba(248,81,73,0.08)", border: "1px solid rgba(248,81,73,0.3)",
            color: "var(--color-danger)", fontSize: 14, fontWeight: 600, cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,81,73,0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248,81,73,0.08)")}
        >
          Supprimer mon compte
        </button>
      ) : (
        <div style={{ background: "rgba(248,81,73,0.06)", border: "1px solid rgba(248,81,73,0.25)", borderRadius: 10, padding: "20px 24px", maxWidth: 400 }}>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 14, lineHeight: 1.6 }}>
            Tapez <strong style={{ color: "var(--color-text-primary)" }}>SUPPRIMER</strong> pour confirmer.
          </p>
          <input
            type="text"
            placeholder="SUPPRIMER"
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 8, marginBottom: 12,
              background: "var(--color-bg-3)", border: "1px solid rgba(248,81,73,0.3)",
              color: "var(--color-text-primary)", fontSize: 14, outline: "none",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setShowDelete(false)}
              style={{ padding: "9px 18px", borderRadius: 8, background: "none", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", fontSize: 13, cursor: "pointer" }}
            >
              Annuler
            </button>
            <button
              style={{ padding: "9px 18px", borderRadius: 8, background: "var(--color-danger)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              Confirmer la suppression
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main ── */
export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("language");

  const content: Record<Tab, React.ReactNode> = {
    language:      <LanguageTab />,
    theme:         <ThemeTab />,
    notifications: <NotificationsTab />,
    security:      <SecurityTab />,
  };

  return (
    <div style={{ width: "100%", maxWidth: 1000, margin: "0 auto", padding: "48px 24px", boxSizing: "border-box" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32, letterSpacing: "-0.01em" }}>Paramètres</h1>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, alignItems: "start" }}>
        {/* Sidebar */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: "sticky",
            top: 24,
            background: "var(--color-bg-2)",
            border: "1px solid var(--color-border)",
            borderRadius: 14,
            padding: "8px",
            boxSizing: "border-box",
          }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", border: "none",
                  borderRadius: 8,
                  background: active ? "rgba(201,169,110,0.10)" : "transparent",
                  color: active ? "var(--color-gold)" : "var(--color-text-muted)",
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  cursor: "pointer", textAlign: "left", width: "100%",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)"; (e.currentTarget as HTMLElement).style.background = "var(--color-bg-3)"; } }}
                onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "40px 44px", minHeight: 480, boxSizing: "border-box" }}>
          {content[activeTab]}
        </div>
      </div>
    </div>
  );
}
