import { useState, useEffect } from "react";
import { Trophy, Clock, TrendingUp, Pencil, CircleX, ChevronDown, Check } from "lucide-react";
import { GAMES } from "@/modules/history/data/games";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { playersApi } from "@/shared/api/players.api";
import { usersApi } from "@/shared/api/users.api";
import { usePlayerStore } from "@/modules/players/store/playerStore";
import type { PatchPlayerBody, PatchUserBody } from "@/shared/api/types";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useToastStore } from "@/shared/toasts/toastStore";
import { profileSchema } from "@/shared/validation/formSchemas";
import { useZodForm } from "@/shared/validation/useZodForm";
import { IconTile } from "@/shared/components/IconTile";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import { Button } from "@/shared/components/Button";
import { useSidebar, type SidebarContentProps } from "@/shared/components/Sidebar";

const COUNTRIES = [
  { code: "FR", label: "France", flag: "🇫🇷" },
  { code: "DE", label: "Allemagne", flag: "🇩🇪" },
  { code: "GB", label: "Royaume-Uni", flag: "🇬🇧" },
  { code: "US", label: "États-Unis", flag: "🇺🇸" },
  { code: "ES", label: "Espagne", flag: "🇪🇸" },
  { code: "RU", label: "Russie", flag: "🇷🇺" },
];

interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  countryCode: string;
  color: "Blancs" | "Noirs" | "Les deux";
  elo: number;
  joinedYear: number;
}

type ProfileColor = UserProfile["color"];

const PROFILE_COLORS: ProfileColor[] = ["Blancs", "Noirs", "Les deux"];

function toProfileColor(value: string | null | undefined): ProfileColor {
  return PROFILE_COLORS.includes(value as ProfileColor) ? (value as ProfileColor) : "Les deux";
}

const EMPTY_USER: UserProfile = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  bio: "",
  countryCode: "FR",
  color: "Les deux",
  elo: 1200,
  joinedYear: new Date().getFullYear(),
};

const wins   = GAMES.filter((g) => g.result === "1-0").length;
const losses = GAMES.filter((g) => g.result === "0-1").length;
const draws  = GAMES.filter((g) => g.result === "1/2-1/2").length;
const total  = GAMES.length;
const winPct = Math.round((wins / total) * 100);

const openingCount: Record<string, number> = {};
for (const g of GAMES) openingCount[g.opening] = (openingCount[g.opening] ?? 0) + 1;
const topOpenings = Object.entries(openingCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
const avgMoves = Math.round(GAMES.reduce((s, g) => s + g.moves.length, 0) / total);

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof Trophy; label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
      <IconTile icon={Icon} tone="gold" size="md" />
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--color-faint)", marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "var(--color-text-muted)", display: "block", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ margin: "6px 0 0", color: "var(--color-danger)", fontSize: 12, lineHeight: 1.45 }}>
          {error}
        </p>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 8,
  background: "var(--color-bg-3)", border: "1px solid var(--color-border)",
  color: "var(--color-text-primary)", fontSize: 14, outline: "none",
  boxSizing: "border-box", transition: "border-color 0.15s",
};

function CountrySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = COUNTRIES.find((c) => c.code === value)!;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-country-select]")) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div style={{ position: "relative" }} data-country-select="">
      <Button
        variant="profile-select"
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={open ? "border-[rgba(201,169,110,0.5)]" : ""}
      >
        <span style={{ fontSize: 20 }}>{selected.flag}</span>
        <span style={{ flex: 1, textAlign: "left" }}>{selected.label}</span>
        <ChevronDown size={14} style={{ color: "var(--color-text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
      </Button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 400,
          background: "var(--color-bg-2)", border: "1px solid var(--color-border)",
          borderRadius: 10, overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        }}>
          {COUNTRIES.map((c) => {
            const active = c.code === value;
            return (
              <Button
                key={c.code}
                variant="profile-option"
                type="button"
                onClick={() => { onChange(c.code); setOpen(false); }}
                className={active ? "bg-[rgba(201,169,110,0.08)] text-[var(--color-gold)] hover:bg-[rgba(201,169,110,0.08)]" : ""}
              >
                <span style={{ fontSize: 20 }}>{c.flag}</span>
                <span style={{ flex: 1 }}>{c.label}</span>
                {active && <Check size={14} color="var(--color-gold)" />}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EditSidebar({
  user,
  playerId,
  onSave,
  closeSidebar,
}: {
  user: UserProfile;
  playerId?: string;
  onSave: (u: UserProfile) => boolean | Promise<boolean>;
} & SidebarContentProps) {
  const [draft, setDraft] = useState<UserProfile>(user);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [saving, setSaving] = useState(false);
  const { errors, clearFieldError, validate } = useZodForm<typeof profileSchema>();
  const addToast = useToastStore((state) => state.addToast);
  const { setFooter } = useSidebar();

  useEffect(() => {
    if (!playerId) return;
    setLoadingPlayer(true);
    playersApi.getOne(playerId)
      .then((p) => setDraft((prev) => ({ ...prev, username: p.username, elo: p.elo })))
      .catch((err) => {
        addToast({
          type: "error",
          title: "Profil incomplet",
          message: getErrorMessage(err, "Impossible de charger les informations joueur."),
        });
      })
      .finally(() => setLoadingPlayer(false));
  }, [addToast, playerId]);

  const set = <K extends keyof UserProfile>(k: K, v: UserProfile[K]) => {
    setDraft((p) => ({ ...p, [k]: v }));
    clearFieldError(k);
  };
  const handleSaveClick = async () => {
    const parsed = validate(profileSchema, draft);
    if (!parsed) return;

    setSaving(true);
    const saved = await onSave(parsed);
    setSaving(false);
    if (saved) closeSidebar();
  };

  useEffect(() => {
    setFooter(
      <>
        <Button
          variant="profile-outline"
          onClick={closeSidebar}
          className="flex-1 justify-center px-4 py-3"
          label="Annuler"
        />
        <Button
          variant="profile-primary"
          onClick={handleSaveClick}
          disabled={loadingPlayer || saving}
          className="flex-[2]"
          label={loadingPlayer ? "Chargement…" : saving ? "Enregistrement…" : "Enregistrer"}
        />
      </>,
    );
  }, [closeSidebar, loadingPlayer, saving, setFooter]);

  return (
    <>
          {/* Avatar */}
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
            <ProfileAvatar initials={(draft.firstName[0] ?? "") + (draft.lastName[0] ?? "")} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Prénom" error={errors.firstName}>
              <input aria-label="Prénom" value={draft.firstName} onChange={(e) => set("firstName", e.target.value)} style={{ ...inputStyle, borderColor: errors.firstName ? "var(--color-danger)" : "var(--color-border)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.firstName ? "var(--color-danger)" : "var(--color-border)")} />
            </Field>
            <Field label="Nom" error={errors.lastName}>
              <input aria-label="Nom" value={draft.lastName} onChange={(e) => set("lastName", e.target.value)} style={{ ...inputStyle, borderColor: errors.lastName ? "var(--color-danger)" : "var(--color-border)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.lastName ? "var(--color-danger)" : "var(--color-border)")} />
            </Field>
          </div>

          <Field label="Nom d'utilisateur" error={errors.username}>
            <input aria-label="Nom d'utilisateur" value={draft.username} onChange={(e) => set("username", e.target.value)} style={{ ...inputStyle, borderColor: errors.username ? "var(--color-danger)" : "var(--color-border)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.username ? "var(--color-danger)" : "var(--color-border)")} />
          </Field>

          <Field label="Email" error={errors.email}>
            <input aria-label="Email" type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} style={{ ...inputStyle, borderColor: errors.email ? "var(--color-danger)" : "var(--color-border)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "var(--color-danger)" : "var(--color-border)")} />
          </Field>

          <Field label="Biographie" error={errors.bio}>
            <textarea aria-label="Biographie" value={draft.bio} onChange={(e) => set("bio", e.target.value)} rows={3}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, borderColor: errors.bio ? "var(--color-danger)" : "var(--color-border)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.bio ? "var(--color-danger)" : "var(--color-border)")} />
          </Field>

          <Field label="Pays" error={errors.countryCode}>
            <CountrySelect value={draft.countryCode} onChange={(v) => set("countryCode", v)} />
          </Field>

          <Field label="Couleur préférée" error={errors.color}>
            <div style={{ display: "flex", gap: 10 }}>
              {PROFILE_COLORS.map((c) => (
                <Button
                  key={c}
                  variant="profile-segment"
                  onClick={() => set("color", c)}
                  className={draft.color === c ? "border-[rgba(201,169,110,0.4)] bg-[rgba(201,169,110,0.08)] font-semibold text-[var(--color-gold)]" : ""}
                  label={c}
                />
              ))}
            </div>
          </Field>
    </>
  );
}

export function ProfilePage() {
  const authUser = useAuthStore((s) => s.user);
  const setAuthUser = useAuthStore((s) => s.setUser);
  const { player, fetchPlayer, setPlayer } = usePlayerStore();
  const [user, setUser] = useState<UserProfile>({
    ...EMPTY_USER,
    username: authUser?.username ?? "",
    email: authUser?.email ?? "",
  });
  const addToast = useToastStore((state) => state.addToast);
  const { openSidebar } = useSidebar();
  const winPctDraw = Math.round((draws / total) * 100);
  const lossPct = 100 - winPct - winPctDraw;
  const country = COUNTRIES.find((c) => c.code === user.countryCode);

  useEffect(() => {
    if (!authUser) return;
    const load = player ? Promise.resolve(player) : fetchPlayer(authUser.id).then(() => usePlayerStore.getState().player!);
    load
      .then((p) => {
        if (!p) return;
        setUser({
          username:    p.username,
          firstName:   authUser.firstName ?? "",
          lastName:    authUser.lastName  ?? "",
          email:       authUser.email ?? "",
          bio:         p.bio          ?? "",
          countryCode: p.country      ?? "FR",
          color:       toProfileColor(p.preferredColor),
          elo:         p.elo,
          joinedYear:  new Date(p.createdAt).getFullYear(),
        });
      })
      .catch((err) => {
        addToast({
          type: "error",
          title: "Profil non chargé",
          message: getErrorMessage(err, "Impossible de charger votre profil joueur."),
        });
      });
  }, [addToast, authUser, fetchPlayer, player]);

  const handleSave = async (draft: UserProfile) => {
    if (!authUser) {
      setUser(draft);
      addToast({ type: "success", title: "Profil mis à jour" });
      return true;
    }

    const userBody: PatchUserBody = {};
    if (draft.firstName !== user.firstName) userBody.firstName = draft.firstName;
    if (draft.lastName  !== user.lastName)  userBody.lastName  = draft.lastName;

    const playerBody: PatchPlayerBody = {};
    if (draft.username    !== user.username)    playerBody.username       = draft.username;
    if (draft.elo         !== user.elo)         playerBody.elo            = draft.elo;
    if (draft.bio         !== user.bio)         playerBody.bio            = draft.bio;
    if (draft.countryCode !== user.countryCode) playerBody.country        = draft.countryCode;
    if (draft.color       !== user.color)       playerBody.preferredColor = draft.color;

    if (Object.keys(userBody).length === 0 && Object.keys(playerBody).length === 0) {
      setUser(draft);
      addToast({
        type: "info",
        title: "Aucune modification",
        message: "Votre profil était déjà à jour.",
      });
      return true;
    }

    try {
      const [updatedUser, updatedPlayer] = await Promise.all([
        Object.keys(userBody).length   > 0 ? usersApi.patch(authUser.id, userBody)      : Promise.resolve(authUser),
        Object.keys(playerBody).length > 0 ? playersApi.patch(authUser.id, playerBody)  : Promise.resolve(player),
      ]);

      if (Object.keys(userBody).length > 0)   setAuthUser(updatedUser!);
      if (Object.keys(playerBody).length > 0) setPlayer(updatedPlayer!);

      setUser({
        username:    updatedPlayer?.username    ?? draft.username,
        firstName:   updatedUser?.firstName     ?? draft.firstName,
        lastName:    updatedUser?.lastName      ?? draft.lastName,
        email:       draft.email,
        bio:         updatedPlayer?.bio         ?? draft.bio,
        countryCode: updatedPlayer?.country     ?? draft.countryCode,
        color:       toProfileColor(updatedPlayer?.preferredColor ?? draft.color),
        elo:         updatedPlayer?.elo         ?? draft.elo,
        joinedYear:  updatedPlayer ? new Date(updatedPlayer.createdAt).getFullYear() : draft.joinedYear,
      });
      addToast({
        type: "success",
        title: "Profil sauvegardé",
        message: "Vos modifications ont bien été enregistrées.",
      });
      return true;
    } catch (err) {
      addToast({
        type: "error",
        title: "Sauvegarde impossible",
        message: getErrorMessage(err, "Impossible de sauvegarder le profil."),
      });
      return false;
    }
  };

  const openEditSidebar = () => {
    openSidebar(
      EditSidebar,
      { user, playerId: authUser?.id, onSave: handleSave },
      {
        title: "Modifier le profil",
        description: "Les modifications sont sauvegardées sur votre compte.",
        closeIcon: <CircleX size={18} />,
        closeLabel: "Fermer la modification du profil",
        width: 480,
        zIndex: 300,
        bodyClassName: "flex flex-col gap-5 p-7",
        footerClassName: "flex gap-3 px-7 py-[18px]",
      },
    );
  };

  return (
    <>
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "48px 24px", width: "100%", boxSizing: "border-box" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em" }}>Profil</h1>
          <Button
            variant="profile-outline"
            onClick={openEditSidebar}
            icon={<Pencil size={14} />}
            label="Modifier le profil"
          />
        </div>

        {/* Hero */}
        <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 16, padding: "36px 40px", marginBottom: 24, display: "flex", alignItems: "center", gap: 28 }}>
          <ProfileAvatar initials={`${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{user.firstName} {user.lastName}</div>
            {user.bio && <div style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 6, lineHeight: 1.5 }}>{user.bio}</div>}
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

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <StatCard icon={Trophy} label="Parties jouées" value={total} />
          <StatCard icon={TrendingUp} label="Taux de victoire" value={`${winPct}%`} sub={`${wins}V · ${draws}N · ${losses}D`} />
          <StatCard icon={Clock} label="Coups moyens" value={avgMoves} sub="par partie" />
          <StatCard icon={Trophy} label="ELO actuel" value={user.elo} />
        </div>

        {/* Win rate + openings */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 12, padding: "24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Résultats</div>
            <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 10, marginBottom: 16 }}>
              <div style={{ flex: winPct, background: "var(--color-gold)" }} />
              <div style={{ flex: winPctDraw, background: "var(--color-faint)" }} />
              <div style={{ flex: lossPct, background: "var(--color-danger)", opacity: 0.7 }} />
            </div>
            {[
              { label: "Victoires", value: wins, pct: winPct, color: "var(--color-gold)" },
              { label: "Nulles",    value: draws, pct: winPctDraw, color: "var(--color-faint)" },
              { label: "Défaites", value: losses, pct: lossPct, color: "var(--color-danger)" },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color }} />
                  <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{r.label}</span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{r.value}</span>
                  <span style={{ fontSize: 12, color: "var(--color-text-muted)", width: 32, textAlign: "right" }}>{r.pct}%</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 12, padding: "24px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Ouvertures favorites</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {topOpenings.map(([opening, count], i) => (
                <div key={opening}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13 }}>{opening}</span>
                    <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{count} partie{count > 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 100, background: "var(--color-bg-3)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(count / total) * 100}%`, background: i === 0 ? "var(--color-gold)" : i === 1 ? "#b8925a" : "#a87c48", borderRadius: 100 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
