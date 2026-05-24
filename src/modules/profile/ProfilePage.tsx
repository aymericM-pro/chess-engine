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
import { getFieldErrors, profileSchema, type FieldErrors } from "@/shared/validation/formSchemas";
import { IconTile } from "@/shared/components/IconTile";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";

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
  color: string;
  elo: number;
  joinedYear: number;
}

type ProfileField = keyof UserProfile;

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
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ ...inputStyle, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", border: `1px solid ${open ? "rgba(201,169,110,0.5)" : "var(--color-border)"}` }}
      >
        <span style={{ fontSize: 20 }}>{selected.flag}</span>
        <span style={{ flex: 1, textAlign: "left" }}>{selected.label}</span>
        <ChevronDown size={14} style={{ color: "var(--color-text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 400,
          background: "var(--color-bg-2)", border: "1px solid var(--color-border)",
          borderRadius: 10, overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        }}>
          {COUNTRIES.map((c) => {
            const active = c.code === value;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => { onChange(c.code); setOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", border: "none", background: active ? "rgba(201,169,110,0.08)" : "none",
                  color: active ? "var(--color-gold)" : "var(--color-text-primary)",
                  fontSize: 14, cursor: "pointer", textAlign: "left", transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--color-bg-3)"; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "none"; }}
              >
                <span style={{ fontSize: 20 }}>{c.flag}</span>
                <span style={{ flex: 1 }}>{c.label}</span>
                {active && <Check size={14} color="var(--color-gold)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EditSidebar({ user, playerId, onSave, onClose }: { user: UserProfile; playerId?: string; onSave: (u: UserProfile) => boolean | Promise<boolean>; onClose: () => void }) {
  const [draft, setDraft] = useState<UserProfile>(user);
  const [visible, setVisible] = useState(false);
  const [loadingPlayer, setLoadingPlayer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<ProfileField>>({});
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

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

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const set = (k: keyof UserProfile, v: string) => {
    setDraft((p) => ({ ...p, [k]: v }));
    setErrors((current) => ({ ...current, [k]: undefined }));
  };
  const handleSaveClick = async () => {
    const parsed = profileSchema.safeParse(draft);
    if (!parsed.success) {
      setErrors(getFieldErrors<ProfileField>(parsed.error));
      return;
    }

    setErrors({});
    setSaving(true);
    const saved = await onSave(parsed.data);
    setSaving(false);
    if (saved) close();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.5)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 300,
        width: 480, background: "var(--color-bg-2)",
        borderLeft: "1px solid var(--color-border)",
        boxShadow: "-12px 0 40px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 28px", borderBottom: "1px solid var(--color-border)" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Modifier le profil</div>
            <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 3 }}>Les modifications sont sauvegardées sur votre compte.</div>
          </div>
          <button
            onClick={close}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[#7d8490] transition-[background,color] duration-150 hover:bg-black/[0.18] hover:text-[#c6ccd5]"
          >
            <CircleX size={18} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px", display: "flex", flexDirection: "column", gap: 20 }}>

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
              {["Blancs", "Noirs", "Les deux"].map((c) => (
                <button key={c} type="button" onClick={() => set("color", c)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 8,
                  border: `1px solid ${draft.color === c ? "rgba(201,169,110,0.4)" : "var(--color-border)"}`,
                  background: draft.color === c ? "rgba(201,169,110,0.08)" : "var(--color-bg-1)",
                  color: draft.color === c ? "var(--color-gold)" : "var(--color-text-muted)",
                  fontSize: 13, fontWeight: draft.color === c ? 600 : 400, cursor: "pointer", transition: "all 0.15s",
                }}>
                  {c}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div style={{ padding: "18px 28px", borderTop: "1px solid var(--color-border)", display: "flex", gap: 12 }}>
          <button onClick={close} style={{ flex: 1, padding: "12px", borderRadius: 8, background: "none", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", fontSize: 14, cursor: "pointer", transition: "border-color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-faint)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}>
            Annuler
          </button>
          <button onClick={handleSaveClick} disabled={loadingPlayer || saving} style={{ flex: 2, padding: "12px", borderRadius: 8, background: "var(--color-gold)", border: "none", color: "#0d1117", fontSize: 14, fontWeight: 700, cursor: loadingPlayer || saving ? "default" : "pointer", opacity: loadingPlayer || saving ? 0.6 : 1, transition: "opacity 0.15s" }}
            onMouseEnter={(e) => { if (!loadingPlayer && !saving) e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={(e) => { if (!loadingPlayer && !saving) e.currentTarget.style.opacity = "1"; }}>
            {loadingPlayer ? "Chargement…" : saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
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
  const [editOpen, setEditOpen] = useState(false);
  const addToast = useToastStore((state) => state.addToast);
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
          color:       p.preferredColor ?? "Les deux",
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
        color:       updatedPlayer?.preferredColor ?? draft.color,
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

  return (
    <>
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "48px 24px", width: "100%", boxSizing: "border-box" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em" }}>Profil</h1>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-transparent px-[18px] py-[9px] text-sm text-[var(--color-text-muted)] transition-[border-color,color] duration-150 hover:border-[rgba(201,169,110,0.4)] hover:text-[var(--color-gold)]"
          >
            <Pencil size={14} />
            Modifier le profil
          </button>
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

      {editOpen && (
        <EditSidebar user={user} playerId={authUser?.id} onSave={handleSave} onClose={() => setEditOpen(false)} />
      )}
    </>
  );
}
