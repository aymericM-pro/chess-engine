import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Palette, Bell, Shield } from "lucide-react";
import { THEMES } from "@/modules/replay/data/themes";
import { useReplayStore } from "@/modules/replay/store/replayStore";
import { usersApi } from "@/shared/api/users.api";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useToastStore } from "@/shared/toasts/toastStore";
import { changePasswordSchema } from "@/shared/validation/formSchemas";
import { useForm, Form, Field } from "@/shared/form";
import { Button } from "@/shared/components/Button";

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
            <Button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              variant="choice-row"
              className={active ? "border-[rgba(201,169,110,0.4)] bg-[rgba(201,169,110,0.08)] font-semibold text-[var(--color-gold)]" : ""}
            >
              <span style={{ fontSize: 22 }}>{lang.flag}</span>
              <span>{lang.label}</span>
              {active && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--color-gold)", letterSpacing: "0.06em" }}>ACTIF</span>}
            </Button>
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
            <Button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              variant="choice-card"
              className={active ? "border-[rgba(201,169,110,0.4)] bg-[rgba(201,169,110,0.08)]" : ""}
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
            </Button>
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
    <Button
      variant="switch"
      onClick={onChange}
      className={on ? "bg-[var(--color-gold)] shadow-none" : ""}
    >
      <span style={{
        position: "absolute", top: 3, left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: on ? "#0d1117" : "var(--color-faint)",
        transition: "left 0.2s",
      }} />
    </Button>
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


/* ── Security ── */
function SecurityTab() {
  const [showDelete, setShowDelete] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const { ctx, handleSubmit } = useForm(changePasswordSchema, {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div>
      {/* Password */}
      <SectionTitle>Mot de passe</SectionTitle>
      <SectionDesc>Changez votre mot de passe régulièrement pour sécuriser votre compte.</SectionDesc>
      <Form ctx={ctx} onSubmit={handleSubmit(async (data) => {
        setSavingPassword(true);
        try {
          await usersApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
          addToast({ type: "success", title: "Mot de passe modifié", message: "Votre nouveau mot de passe est actif." });
        } catch (err) {
          addToast({ type: "error", title: "Modification impossible", message: getErrorMessage(err, "Impossible de modifier le mot de passe.") });
        } finally {
          setSavingPassword(false);
        }
      })} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
        <Field name="currentPassword" label="Mot de passe actuel"           type="password" />
        <Field name="newPassword"     label="Nouveau mot de passe"           type="password" />
        <Field name="confirmPassword" label="Confirmer le nouveau mot de passe" type="password" />
        <Button
          variant="small-primary"
          type="submit"
          disabled={savingPassword}
          className="self-start"
          label={savingPassword ? "Mise à jour…" : "Mettre à jour"}
        />
      </Form>

      <Divider />

      {/* Delete account */}
      <SectionTitle>Supprimer le compte</SectionTitle>
      <SectionDesc>
        Cette action est irréversible. Toutes vos parties, statistiques et données seront définitivement supprimées.
      </SectionDesc>
      {!showDelete ? (
        <Button
          variant="small-danger"
          onClick={() => setShowDelete(true)}
          label="Supprimer mon compte"
        />
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
            <Button
              variant="profile-outline"
              onClick={() => setShowDelete(false)}
              className="px-[18px] py-[9px] text-[13px]"
              label="Annuler"
            />
            <Button
              variant="dialog-danger"
              className="flex-none px-[18px] py-[9px] text-[13px]"
              label="Confirmer la suppression"
            />
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
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="sidebar-tab"
                className={active ? "bg-[rgba(201,169,110,0.10)] font-semibold text-[var(--color-gold)]" : ""}
                icon={tab.icon}
                label={tab.label}
              />
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
