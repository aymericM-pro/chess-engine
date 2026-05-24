/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Bot, ArrowLeft, Clock, Crown, Swords, Zap, Handshake, Flag, AlertTriangle, Timer, Flame, Infinity as InfinityIcon, Shield, ShieldOff, ChevronRight, Users, MonitorCog, Download } from "lucide-react";
import type { PieceType, Color } from "@/shared/types/chess";
import { PieceSVG } from "@/shared/pieces/PieceSVG";
import { clickCell, promote, INITIAL_STATE, getGameStatus } from "@/modules/game/engine/boardGame";
import type { PromotionPieceType } from "@/modules/game/engine/boardGame";
import { gamesApi } from "@/shared/api/games.api";
import { usersApi } from "@/shared/api/users.api";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useToastStore } from "@/shared/toasts/toastStore";
import type { GameResponseDto } from "@/shared/api/types";

/* ─── Types ─────────────────────────────────────────── */
type GameMode = "cpu" | "online";
type Difficulty = "easy" | "medium" | "hard";
type TimeControl = { id: "bullet" | "blitz" | "rapid" | "classical"; label: string; minutes: number; increment: number };

const TIME_CONTROLS: TimeControl[] = [
  { id: "bullet",    label: "Bullet",     minutes: 1,  increment: 0 },
  { id: "blitz",     label: "Blitz 3+2",  minutes: 3,  increment: 2 },
  { id: "blitz",     label: "Blitz 5+0",  minutes: 5,  increment: 0 },
  { id: "rapid",     label: "Rapide",     minutes: 10, increment: 0 },
  { id: "classical", label: "Illimité",   minutes: 0,  increment: 0 },
];

function getTimeControlFromGame(game: GameResponseDto): TimeControl {
  return TIME_CONTROLS.find((tc) => (
    tc.id === game.timeControl
    && tc.minutes * 60 === game.timeLimit
    && tc.increment === game.increment
  )) ?? {
    id: game.timeControl as TimeControl["id"],
    label: game.timeLimit === 0 ? "Illimité" : `${Math.floor(game.timeLimit / 60)}+${game.increment}`,
    minutes: Math.floor(game.timeLimit / 60),
    increment: game.increment,
  };
}

interface GameConfig {
  color: "w" | "b";
  difficulty: Difficulty;
  timeControl: TimeControl;
  mode?: GameMode;
  opponentName?: string;
}

const PROMOTION_PIECES: PromotionPieceType[] = ["Q", "R", "B", "N"];
const SQ = 76; // square size in px

/* ─── Two-column layout ──────────────────────────────── */
function TwoCol({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: 900, display: "grid", gridTemplateColumns: "1fr 1.4fr", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }}>
        {/* Left — accent column */}
        <div style={{ background: "var(--color-bg-3)", padding: "40px 32px", display: "flex", flexDirection: "column" }}>
          {left}
        </div>
        {/* Right — form column */}
        <div style={{ background: "var(--color-bg-2)", padding: "40px 36px", display: "flex", flexDirection: "column" }}>
          {right}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared back button ─────────────────────────────── */
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-bg-3)", border: "none", borderRadius: 8, padding: "7px 13px", fontSize: 13, fontWeight: 500, color: "var(--color-text-muted)", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; }}
    >
      <ArrowLeft size={13} /> Retour
    </button>
  );
}

/* ─── Mode selection ─────────────────────────────────── */
const MODES = [
  {
    id: "cpu" as GameMode,
    icon: <MonitorCog size={28} strokeWidth={1.5} />,
    label: "Contre l'ordinateur",
    desc: "Affrontez l'IA · 3 niveaux de difficulté",
    tag: "Solo",
    meta: ["3 niveaux", "Rapport PDF", "Revanche rapide"],
  },
  {
    id: "online" as GameMode,
    icon: <Users size={28} strokeWidth={1.5} />,
    label: "Joueur en ligne",
    desc: "Invitez un adversaire · partie en direct",
    tag: "Multi",
    meta: ["Temps réel", "Invitation", "Historique"],
  },
];

function ModeSelect({ onSelect }: { onSelect: (mode: GameMode) => void }) {
  const [hovered, setHovered] = useState<GameMode | null>(null);

  const left = (
    <>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(201,169,110,0.14)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <Crown size={26} color="var(--color-gold)" strokeWidth={1.5} />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 8 }}>Nouvelle partie</h1>
      <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: 24 }}>
        Choisissez votre adversaire et lancez une partie d'échecs.
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {[
          { value: "2.4M+", label: "Parties jouées" },
          { value: "180k",  label: "Joueurs actifs" },
          { value: "5",     label: "Cadences" },
          { value: "< 50ms", label: "Latence" },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--color-bg-2)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--color-gold)", letterSpacing: "-0.01em" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "var(--color-border)", marginBottom: 20 }} />

      {/* Features */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { icon: <MonitorCog size={15} strokeWidth={1.5} />, title: "Contre l'IA", text: "3 niveaux · Facile à Difficile" },
          { icon: <Users size={15} strokeWidth={1.5} />, title: "Multijoueur", text: "Invitez un ami en temps réel" },
          { icon: <Timer size={15} strokeWidth={1.5} />, title: "Cadences", text: "Bullet, Blitz, Rapide, Classique" },
        ].map(({ icon, title, text }) => (
          <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(201,169,110,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-gold)", flexShrink: 0 }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 1 }}>{title}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{text}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

	  const right = (
	    <>
	      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
	        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Mode de jeu</div>
	        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 8, background: "var(--color-bg-3)", color: "var(--color-text-muted)", fontSize: 11, fontWeight: 600 }}>
	          <Zap size={12} strokeWidth={2} /> Partie rapide
	        </div>
	      </div>
	      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
	        {MODES.map((m) => {
	          const isHov = hovered === m.id;
	          return (
	            <button
	              key={m.id}
              onClick={() => onSelect(m.id)}
              onMouseEnter={() => setHovered(m.id)}
	              onMouseLeave={() => setHovered(null)}
	              style={{
	                display: "grid", gridTemplateColumns: "48px 1fr auto", alignItems: "center", gap: 16, padding: "18px 20px",
	                borderRadius: 12, border: `1px solid ${isHov ? "rgba(201,169,110,0.38)" : "var(--color-border)"}`, cursor: "pointer", textAlign: "left",
	                background: isHov ? "rgba(201,169,110,0.08)" : "var(--color-bg-3)",
	                transition: "background 0.15s, border-color 0.15s, transform 0.15s",
	                transform: isHov ? "translateY(-1px)" : "none",
	              }}
	            >
	              <div style={{ width: 48, height: 48, borderRadius: 12, background: isHov ? "rgba(201,169,110,0.15)" : "var(--color-bg-2)", display: "flex", alignItems: "center", justifyContent: "center", color: isHov ? "var(--color-gold)" : "var(--color-text-muted)", flexShrink: 0, transition: "all 0.15s" }}>
	                {m.icon}
	              </div>
	              <div style={{ flex: 1, minWidth: 0 }}>
	                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{m.label}</div>
	                <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{m.desc}</div>
	                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
	                  {m.meta.map((item) => (
	                    <span key={item} style={{ padding: "4px 8px", borderRadius: 7, background: "var(--color-bg-2)", color: "var(--color-text-muted)", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
	                      {item}
	                    </span>
	                  ))}
	                </div>
	              </div>
	              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
	                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 100, background: isHov ? "rgba(201,169,110,0.15)" : "var(--color-bg-2)", color: isHov ? "var(--color-gold)" : "var(--color-text-muted)", transition: "all 0.15s" }}>{m.tag}</span>
	                <ChevronRight size={16} color={isHov ? "var(--color-gold)" : "var(--color-faint)"} style={{ transition: "color 0.15s" }} />
	              </div>
	            </button>
	          );
	        })}
	      </div>
	      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
	        {[
	          { icon: <Shield size={15} strokeWidth={1.5} />, label: "Couleur", value: "Blancs ou noirs" },
	          { icon: <Timer size={15} strokeWidth={1.5} />, label: "Cadence", value: "Bullet à classique" },
	          { icon: <Flame size={15} strokeWidth={1.5} />, label: "Niveau", value: "Facile à difficile" },
	          { icon: <Download size={15} strokeWidth={1.5} />, label: "Rapport", value: "PDF en fin de partie" },
	        ].map((item) => (
	          <div key={item.label} style={{ background: "var(--color-bg-3)", border: "1px solid var(--color-border)", borderRadius: 10, padding: "12px", minHeight: 62 }}>
	            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-gold)", marginBottom: 7 }}>
	              {item.icon}
	              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{item.label}</span>
	            </div>
	            <div style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.35 }}>{item.value}</div>
	          </div>
	        ))}
	      </div>
	      <div style={{ marginTop: 14, padding: "13px 14px", borderRadius: 10, background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.20)", display: "flex", alignItems: "center", gap: 12 }}>
	        <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(201,169,110,0.14)", color: "var(--color-gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
	          <Swords size={17} strokeWidth={1.8} />
	        </div>
	        <div>
	          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Configuration guidée</div>
	          <div style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.45 }}>Le prochain écran garde vos choix visibles avant de lancer la partie.</div>
	        </div>
	      </div>
	    </>
	  );

  return <TwoCol left={left} right={right} />;
}

/* ─── Online setup ────────────────────────────────────── */
function OnlineSetup({ onBack, onStart }: { onBack: () => void; onStart: (cfg: GameConfig, gameId: string) => void }) {
  const [username, setUsername] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addToast = useToastStore((state) => state.addToast);

  const handleSend = async () => {
    if (username.trim().length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const users = await usersApi.getAll();
      const opponent = users.find((user) => user.username.toLowerCase() === username.trim().toLowerCase());
      if (!opponent) {
        setError("Aucun utilisateur trouvé avec ce nom.");
        return;
      }

      const timeControl = TIME_CONTROLS[2];
      const game = await gamesApi.create({
        timeControl: timeControl.id,
        timeLimit: timeControl.minutes * 60,
        increment: timeControl.increment,
        opponent: opponent.id,
      });

      setSent(true);
      onStart({ color: "w", difficulty: "medium", timeControl, mode: "online", opponentName: opponent.username }, game.id);
      addToast({
        type: "info",
        title: "Partie lancée",
        message: `${opponent.username} peut rejoindre la partie depuis sa notification.`,
      });
    } catch (err) {
      const message = getErrorMessage(err, "Impossible de créer la partie en ligne.");
      setError(message);
      addToast({
        type: "error",
        title: "Invitation impossible",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const left = (
    <>
      <BackButton onClick={onBack} />
      <div style={{ marginTop: 24, marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(201,169,110,0.14)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Users size={26} color="var(--color-gold)" strokeWidth={1.5} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 6 }}>Joueur en ligne</h2>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.7 }}>
          Entrez le nom d'un joueur pour lui envoyer une invitation de partie.
        </p>
      </div>

      {/* Info card */}
      <div style={{ background: "var(--color-bg-2)", borderRadius: 12, padding: "14px 16px", marginBottom: 10, border: "1px solid var(--color-border)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-gold)", marginBottom: 6, letterSpacing: "0.02em" }}>Invitation privée</div>
        <p style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.7, margin: 0 }}>
          La partie démarre dès que l&apos;adversaire accepte. Vous choisissez la cadence en premier.
        </p>
      </div>

      {/* Real-time status */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--color-bg-2)", borderRadius: 10, padding: "11px 14px", marginBottom: 20, border: "1px solid var(--color-border)" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-success)", flexShrink: 0, boxShadow: "0 0 6px var(--color-success)" }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Connexion temps réel active</div>
          <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Notifications instantanées</div>
        </div>
      </div>

      <div style={{ height: 1, background: "var(--color-border)", marginBottom: 20 }} />

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { n: "1", title: "Cherchez un joueur", text: "Entrez son nom d'utilisateur exact" },
          { n: "2", title: "Envoyez l'invitation", text: "Il reçoit une notification immédiate" },
          { n: "3", title: "La partie commence", text: "Dès qu'il accepte, le plateau s'ouvre" },
        ].map(({ n, title, text }) => (
          <div key={n} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(201,169,110,0.14)", color: "var(--color-gold)", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{n}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 1 }}>{title}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{text}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const right = !sent ? (
    <>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 16 }}>Inviter un joueur</div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 8 }}>
          Nom d'utilisateur
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="ex: Magnus2847"
          style={{ width: "100%", padding: "11px 14px", borderRadius: 10, boxSizing: "border-box", border: "none", background: "var(--color-bg-3)", color: "var(--color-text-primary)", fontSize: 14, outline: "none", transition: "box-shadow 0.15s" }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px var(--color-gold)")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={username.trim().length === 0 || loading}
        style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: username.trim().length > 0 && !loading ? "var(--color-gold)" : "var(--color-bg-3)", color: username.trim().length > 0 && !loading ? "#0d1117" : "var(--color-faint)", fontSize: 14, fontWeight: 700, cursor: username.trim().length > 0 && !loading ? "pointer" : "not-allowed", transition: "opacity 0.15s" }}
        onMouseEnter={(e) => { if (username.trim().length > 0 && !loading) (e.currentTarget.style.opacity = "0.88"); }}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {loading ? "Création…" : "Envoyer la demande"}
      </button>
      {error && <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--color-danger)" }}>{error}</p>}
    </>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", gap: 12 }}>
      <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(201,169,110,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Clock size={28} color="var(--color-gold)" strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: 17, fontWeight: 700 }}>Demande envoyée à <span style={{ color: "var(--color-gold)" }}>{username}</span></div>
      <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.65, maxWidth: 280 }}>
        En attente d'acceptation. La partie démarrera automatiquement.
      </p>
      <button
        onClick={() => { setSent(false); setUsername(""); }}
        style={{ marginTop: 8, background: "var(--color-bg-3)", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 500, color: "var(--color-text-muted)", cursor: "pointer", transition: "color 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
      >
        Inviter quelqu'un d'autre
      </button>
    </div>
  );

  return <TwoCol left={left} right={right} />;
}

/* ─── Setup ──────────────────────────────────────────── */
const COLOR_OPTIONS = [
  { id: "w" as const, label: "Blancs", sub: "Vous jouez en premier", icon: <Shield size={22} strokeWidth={1.5} /> },
  { id: "b" as const, label: "Noirs", sub: "L'IA joue en premier",  icon: <ShieldOff size={22} strokeWidth={1.5} /> },
];

const DIFF_OPTIONS = [
  { id: "easy"   as Difficulty, label: "Facile",    sub: "~800 ELO",  icon: <Zap size={20} strokeWidth={1.5} /> },
  { id: "medium" as Difficulty, label: "Moyen",     sub: "~1200 ELO", icon: <Flame size={20} strokeWidth={1.5} /> },
  { id: "hard"   as Difficulty, label: "Difficile", sub: "~1800 ELO", icon: <Bot size={20} strokeWidth={1.5} /> },
];

const TC_ICONS: Record<string, React.ReactNode> = {
  "Bullet":    <Zap size={13} strokeWidth={2} />,
  "Blitz 3+2": <Flame size={13} strokeWidth={2} />,
  "Blitz 5+0": <Flame size={13} strokeWidth={2} />,
  "Rapide":    <Timer size={13} strokeWidth={2} />,
  "Illimité":  <InfinityIcon size={13} strokeWidth={2} />,
};

function OptionRow({ active, onClick, icon, label, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; sub: string }) {
  const [hov, setHov] = useState(false);
  const highlight = active || hov;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12,
        border: "none", cursor: "pointer", textAlign: "left", width: "100%",
        background: active ? "rgba(201,169,110,0.10)" : hov ? "rgba(201,169,110,0.05)" : "var(--color-bg-3)",
        transition: "background 0.15s",
        boxShadow: active ? "inset 0 0 0 1.5px var(--color-gold)" : "none",
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10, background: active ? "rgba(201,169,110,0.18)" : "var(--color-bg-2)", display: "flex", alignItems: "center", justifyContent: "center", color: highlight ? "var(--color-gold)" : "var(--color-text-muted)", flexShrink: 0, transition: "all 0.15s" }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: active ? "var(--color-gold)" : "var(--color-text-primary)" }}>{label}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 1 }}>{sub}</div>
      </div>
      {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-gold)", flexShrink: 0 }} />}
    </button>
  );
}

function SetupScreen({ onStart, onBack }: { onStart: (cfg: GameConfig, gameId: string) => void; onBack: () => void }) {
  const [color, setColor]         = useState<"w" | "b">("w");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [timeControl, setTimeControl] = useState<TimeControl>(TIME_CONTROLS[2]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addToast = useToastStore((state) => state.addToast);

  const colorLabel = color === "w" ? "Blancs" : "Noirs";
  const diffLabel2 = DIFF_OPTIONS.find((d) => d.id === difficulty)!;

  const left = (
    <>
      <BackButton onClick={onBack} />
      <div style={{ marginTop: 24, marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(201,169,110,0.14)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <MonitorCog size={26} color="var(--color-gold)" strokeWidth={1.5} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 6 }}>Contre l'IA</h2>
        <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.7 }}>
          Configurez votre partie puis lancez le défi.
        </p>
      </div>

      {/* Piece preview — réactif à la couleur sélectionnée */}
      <div style={{ background: "var(--color-bg-2)", borderRadius: 14, padding: "18px", textAlign: "center", marginBottom: 10, border: "1px solid var(--color-border)" }}>
        <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 10, filter: color === "b" ? "drop-shadow(0 0 8px rgba(255,255,255,0.08))" : "drop-shadow(0 0 8px rgba(201,169,110,0.3))" }}>
          {color === "w" ? "♔" : "♚"}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>Vous jouez les {colorLabel}</div>
        <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
          {color === "w" ? "Vous commencez en premier" : "L'adversaire commence"}
        </div>
      </div>

      {/* Difficulty badge */}
      <div style={{ background: "var(--color-bg-2)", borderRadius: 12, padding: "12px 14px", marginBottom: 20, border: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ color: "var(--color-gold)", flexShrink: 0 }}>{diffLabel2.icon}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>{diffLabel2.label} · {diffLabel2.sub}</div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            {difficulty === "easy" ? "Idéal pour apprendre" : difficulty === "medium" ? "Bon entraînement" : "Pour joueurs confirmés"}
          </div>
        </div>
      </div>

      {/* Live config summary */}
      <div style={{ marginTop: "auto", background: "var(--color-bg-2)", borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, border: "1px solid var(--color-border)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 2 }}>Récapitulatif</div>
        {[
          { icon: <Shield size={13} strokeWidth={1.5} />, label: "Couleur", value: colorLabel },
          { icon: diffLabel2.icon, label: "Difficulté", value: `${diffLabel2.label} · ${diffLabel2.sub}` },
          { icon: TC_ICONS[timeControl.label], label: "Cadence", value: timeControl.label },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--color-gold)", flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-muted)", width: 68, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{value}</span>
          </div>
        ))}
      </div>
    </>
  );

  const right = (
    <>
      {/* Color */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 8 }}>Couleur</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {COLOR_OPTIONS.map((c) => (
            <OptionRow key={c.id} active={color === c.id} onClick={() => setColor(c.id)} icon={c.icon} label={c.label} sub={c.sub} />
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 8 }}>Difficulté</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DIFF_OPTIONS.map((d) => (
            <OptionRow key={d.id} active={difficulty === d.id} onClick={() => setDifficulty(d.id)} icon={d.icon} label={d.label} sub={d.sub} />
          ))}
        </div>
      </div>

      {/* Time control */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 8 }}>Cadence</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TIME_CONTROLS.map((tc) => {
            const active = timeControl.label === tc.label;
            return (
              <button key={tc.label} onClick={() => setTimeControl(tc)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all 0.15s", background: active ? "rgba(201,169,110,0.10)" : "var(--color-bg-3)", color: active ? "var(--color-gold)" : "var(--color-text-muted)", boxShadow: active ? "inset 0 0 0 1.5px var(--color-gold)" : "none" }}>
                {TC_ICONS[tc.label]}{tc.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      {error && <p style={{ fontSize: 13, color: "var(--color-danger)", margin: "0 0 8px" }}>{error}</p>}
      <button
        disabled={loading}
        onClick={async () => {
          setError(null);
          setLoading(true);
            const BOT_ID = '9ef75cd3-91a6-403a-b7f5-f08851e705e7';

            try {
                  const game = await gamesApi.create({
                      timeControl: timeControl.id,
                      timeLimit: timeControl.minutes * 60,
                      increment: timeControl.increment,
                      opponent: BOT_ID,
                  });

              onStart({ color, difficulty, timeControl }, game.id);
              addToast({
                type: "success",
                title: "Partie créée",
                message: "Le plateau est prêt. À vous de jouer.",
              });
          } catch (err) {
            const message = getErrorMessage(err, "Impossible de créer la partie. Vérifiez votre connexion.");
            setError(message);
            addToast({
              type: "error",
              title: "Création impossible",
              message,
            });
          } finally {
            setLoading(false);
          }
        }}
        style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: loading ? "var(--color-bg-3)" : "var(--color-gold)", color: loading ? "var(--color-text-muted)" : "#0d1117", fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer", transition: "opacity 0.15s", letterSpacing: "0.02em", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: "auto" }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <Swords size={16} strokeWidth={2} /> {loading ? "Création…" : "Jouer"}
      </button>
    </>
  );

  return <TwoCol left={left} right={right} />;
}

/* ─── Confirm dialog ─────────────────────────────────── */
type DialogType = "resign" | "draw";

function ConfirmDialog({ type, onConfirm, onCancel }: { type: DialogType; onConfirm: () => void; onCancel: () => void }) {
  const isResign = type === "resign";
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "32px 36px", width: 380, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ marginBottom: 12 }}>{isResign ? <Flag size={28} color="var(--color-danger)" strokeWidth={1.5} /> : <Handshake size={28} color="var(--color-gold)" strokeWidth={1.5} />}</div>
        <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 8 }}>
          {isResign ? "Abandonner la partie ?" : "Proposer la nulle ?"}
        </div>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 28, lineHeight: 1.65 }}>
          {isResign
            ? "Vous concédez la victoire à l'adversaire. Cette action est irréversible."
            : "L'ordinateur évaluera votre proposition. En cas de refus, la partie continue."}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "none", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", fontSize: 14, cursor: "pointer", transition: "border-color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-faint)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}>
            Annuler
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: isResign ? "var(--color-danger)" : "var(--color-gold)", color: isResign ? "#fff" : "#0d1117", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            {isResign ? "Abandonner" : "Proposer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Player bar ─────────────────────────────────────── */
function PlayerBar({ name, elo, isBot, minutes, active, color }: { name: string; elo: number; isBot?: boolean; minutes: number; active: boolean; color: "w" | "b" }) {
  const display = minutes === 0 ? "∞" : `${String(minutes).padStart(2, "0")}:00`;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: color === "w" ? "linear-gradient(135deg,#e6d5a0,#c8a95a)" : "linear-gradient(135deg,#444,#222)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, border: "1px solid var(--color-border)" }}>
          {color === "w" ? "♔" : "♚"}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{elo} ELO{isBot ? " · CPU" : ""}</div>
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", padding: "6px 14px", borderRadius: 8, background: active ? "var(--color-bg-3)" : "transparent", border: `1px solid ${active ? "var(--color-border)" : "transparent"}`, color: active ? "var(--color-text-primary)" : "var(--color-faint)", transition: "all 0.2s" }}>
        {display}
      </div>
    </div>
  );
}

/* ─── Move list ──────────────────────────────────────── */
function MoveList({ moves }: { moves: string[] }) {
  const pairs: [string, string | undefined][] = [];
  for (let i = 0; i < moves.length; i += 2) pairs.push([moves[i], moves[i + 1]]);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
      {pairs.length === 0
        ? <div style={{ padding: "20px 16px", fontSize: 13, color: "var(--color-faint)", textAlign: "center" }}>Aucun coup</div>
        : pairs.map(([w, b], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 5, background: i === pairs.length - 1 ? "rgba(201,169,110,0.06)" : "none" }}>
            <span style={{ fontSize: 11, color: "var(--color-faint)", width: 22, textAlign: "right", flexShrink: 0 }}>{i + 1}.</span>
            <span style={{ fontSize: 13, fontWeight: 500, flex: 1, fontFamily: "monospace" }}>{w}</span>
            <span style={{ fontSize: 13, flex: 1, color: "var(--color-text-muted)", fontFamily: "monospace" }}>{b ?? ""}</span>
          </div>
        ))
      }
    </div>
  );
}

/* ─── SAN helper ─────────────────────────────────────── */
const SAN_FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
function rcToSq(r: number, c: number) { return `${SAN_FILES[c]}${8 - r}`; }
function sqToRc(square: string): [number, number] {
  return [8 - Number(square[1]), SAN_FILES.indexOf(square[0])];
}

function stateFromGame(game: GameResponseDto) {
  return game.moves.reduce((state, move) => {
    const [fromRow, fromCol] = sqToRc(move.from);
    const [toRow, toCol] = sqToRc(move.to);
    const moved = clickCell(clickCell(state, fromRow, fromCol), toRow, toCol);

    if (moved.pendingPromotion && move.promotion) {
      return promote(moved, move.promotion.toUpperCase() as PromotionPieceType);
    }

    return moved;
  }, INITIAL_STATE);
}

function buildSan(
  fromCol: number,
  toRow: number,
  toCol: number,
  piece: string,
  isCapture: boolean,
  isCheck: boolean,
  isMate: boolean,
): string {
  const type = piece[1];
  const to   = rcToSq(toRow, toCol);
  let san    = "";

  if (type === "K" && Math.abs(toCol - fromCol) === 2) {
    san = toCol === 6 ? "O-O" : "O-O-O";
  } else if (type === "P") {
    san = isCapture ? `${SAN_FILES[fromCol]}x${to}` : to;
  } else {
    san = `${type}${isCapture ? "x" : ""}${to}`;
  }

  if (isMate)   return san + "#";
  if (isCheck)  return san + "+";
  return san;
}

/* ─── Game view ──────────────────────────────────────── */
type PendingMoveInfo = { fromRow: number; fromCol: number; toRow: number; toCol: number; isCapture: boolean };

function GameView({ config, gameId, onEnd }: { config: GameConfig; gameId: string; onEnd: () => void }) {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [moves, setMoves] = useState<string[]>([]);
  const [remoteGame, setRemoteGame] = useState<GameResponseDto | null>(null);
  const [dialog, setDialog] = useState<DialogType | null>(null);
  const [pendingMoveInfo, setPendingMoveInfo] = useState<PendingMoveInfo | null>(null);
  const reportRequestedRef = useRef(false);
  const addToast = useToastStore((state) => state.addToast);
  const authUser = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const { board, selected, legalMoves, turn, inCheck, pendingPromotion } = gameState;

  useEffect(() => {
    let active = true;

    gamesApi.getOne(gameId)
      .then((game) => {
        if (!active) return;
        setRemoteGame(game);
        setGameState(stateFromGame(game));
        setMoves(game.moves.map((move) => move.san));
      })
      .catch((err) => {
        addToast({
          type: "error",
          title: "Partie non chargée",
          message: getErrorMessage(err, "Impossible de charger la partie en temps réel."),
        });
      });

    return () => {
      active = false;
    };
  }, [addToast, gameId]);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:3000/ws/games?token=${encodeURIComponent(token)}`);
    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ type: "game.join", gameId }));
    });
    ws.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data) as { type: string; gameId?: string; game?: GameResponseDto };
      if ((payload.type !== "game.snapshot" && payload.type !== "game.updated") || payload.gameId !== gameId || !payload.game) return;

      setRemoteGame(payload.game);
      setGameState(stateFromGame(payload.game));
      setMoves(payload.game.moves.map((move) => move.san));
    });

    return () => {
      ws.close();
    };
  }, [gameId, token]);

  const labelStyle: React.CSSProperties = {
    fontSize: "0.6rem", fontWeight: 600, color: "var(--color-faint)",
    fontFamily: "var(--font-display)", letterSpacing: "0.05em", userSelect: "none",
  };

  const generateReportOnce = async () => {
    if (!gameId || reportRequestedRef.current) return;
    reportRequestedRef.current = true;

    try {
      const result = await gamesApi.generateReport(gameId);
      if (result.skipped) {
        console.info("[generateReport] skipped:", result.reason);
        return;
      }
      addToast({
        type: "success",
        title: "Rapport généré",
        message: "Le PDF de la partie est disponible dans l'historique.",
      });
    } catch (err) {
      reportRequestedRef.current = false;
      console.error("[generateReport] failed:", err);
      addToast({
        type: "error",
        title: "Rapport non généré",
        message: getErrorMessage(err, "La partie est terminée, mais le rapport PDF n'a pas pu être créé."),
      });
    }
  };

  const sendMove = (
    from: string, to: string, san: string,
    isCheck: boolean, isCheckmate: boolean,
    promotion?: string,
  ) => {
    if (!gameId) return;
    gamesApi.playMove(gameId, { san, from, to, isCheck, isCheckmate, timeLeft: 0, promotion })
      .then((game) => {
        setRemoteGame(game);
        if (game.status === "finished") {
          addToast({
            type: "success",
            title: "Partie terminée",
            message: "Le résultat a bien été enregistré.",
          });
          void generateReportOnce();
        }
      })
      .catch((err) => {
        console.error("[playMove] failed:", err);
        addToast({
          type: "error",
          title: "Coup non enregistré",
          message: getErrorMessage(err, "Le coup reste visible localement, mais l'API ne l'a pas accepté."),
        });
      });
  };

  const handleClick = (r: number, c: number) => {
    if (pendingPromotion) return;
    if (turn !== config.color) return;
    const prev = gameState;
    const next = clickCell(prev, r, c);

    if (next.turn !== prev.turn) {
      // Normal move (turn changed immediately)
      setMoves((m) => [...m, `${SAN_FILES[c]}${8 - r}`]);
      if (prev.selected) {
        const { row: sr, col: sc } = prev.selected;
        const piece     = prev.board[sr][sc];
        const isCapture = prev.board[r][c] !== null;
        const status    = getGameStatus(next.board, next.turn, next.movedPieces);
        const isMate    = status === "checkmate";
        const isChk     = status === "check" || isMate;
        const san       = piece ? buildSan(sc, r, c, piece, isCapture, isChk, isMate) : `${SAN_FILES[c]}${8 - r}`;
        sendMove(rcToSq(sr, sc), rcToSq(r, c), san, isChk, isMate);
      }
    } else if (!prev.pendingPromotion && next.pendingPromotion && prev.selected) {
      // Pawn just reached last rank — save from/to for when piece is chosen
      const { row: sr, col: sc } = prev.selected;
      setPendingMoveInfo({ fromRow: sr, fromCol: sc, toRow: r, toCol: c, isCapture: prev.board[r][c] !== null });
    }

    setGameState(next);
  };

  const handlePromotion = (pt: PromotionPieceType) => {
    const prev = gameState;
    const next = promote(prev, pt);
    setGameState(next);
    setMoves((m) => [...m, `${SAN_FILES[pendingMoveInfo?.toCol ?? 0]}${8 - (pendingMoveInfo?.toRow ?? 0)}=${pt}`]);

    if (pendingMoveInfo) {
      const { fromRow, fromCol, toRow, toCol, isCapture } = pendingMoveInfo;
      const status  = getGameStatus(next.board, next.turn, next.movedPieces);
      const isMate  = status === "checkmate";
      const isChk   = status === "check" || isMate;
      const toSq    = rcToSq(toRow, toCol);
      let san       = isCapture ? `${SAN_FILES[fromCol]}x${toSq}=${pt}` : `${toSq}=${pt}`;
      if (isMate) san += "#"; else if (isChk) san += "+";
      sendMove(rcToSq(fromRow, fromCol), toSq, san, isChk, isMate, pt.toLowerCase());
      setPendingMoveInfo(null);
    }
  };

  const diffLabel = { easy: "Facile", medium: "Moyen", hard: "Difficile" }[config.difficulty];
  const opponentName = config.mode === "online" ? config.opponentName ?? "Adversaire" : "Ordinateur";
  const opponentColor: "w" | "b" = config.color === "w" ? "b" : "w";
  const gameStatus = remoteGame?.status ?? "active";
  const boardRows = config.color === "b" ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const boardCols = config.color === "b" ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const handleConfirm = async () => {
    setDialog(null);
    try {
      const game =
        dialog === "resign"
          ? await gamesApi.resign(gameId)
          : dialog === "draw"
            ? await gamesApi.draw(gameId)
            : null;

      if (game?.status === "finished") await generateReportOnce();
      addToast({
        type: "success",
        title: dialog === "resign" ? "Partie abandonnée" : "Nulle proposée",
        message: dialog === "resign" ? "La fin de partie a bien été enregistrée." : "Votre proposition a été envoyée.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: dialog === "resign" ? "Abandon impossible" : "Proposition impossible",
        message: getErrorMessage(err, "La partie continue localement, mais l'action n'a pas pu être enregistrée."),
      });
      // game continues locally if API call fails
    }
    onEnd();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 28, padding: "28px 40px", maxWidth: 1100, margin: "0 auto", flex: 1 }}>

      {/* Board column */}
      <div style={{ flexShrink: 0 }}>

        {/* Opponent player bar */}
        <PlayerBar name={opponentName} elo={800} isBot={config.mode !== "online"} color={opponentColor} minutes={config.timeControl.minutes} active={turn === opponentColor} />

        {/* Board */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 6, marginBottom: 6 }}>
          <div style={{ display: "flex" }}>
            {/* Rank labels */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {boardRows.map((r) => (
                <div key={r} style={{ width: 20, height: SQ, display: "flex", alignItems: "center", justifyContent: "center", ...labelStyle }}>{8 - r}</div>
              ))}
            </div>
            {/* Grid */}
            <div style={{ border: "2px solid #2a2a32", display: "inline-block", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(8, ${SQ}px)` }}>
                {boardRows.map((r) =>
                  boardCols.map((c) => {
                    const piece = board[r][c];
                    const isLight = (r + c) % 2 === 0;
                    const isSel   = selected?.row === r && selected?.col === c;
                    const isLegal = legalMoves.some(([lr, lc]) => lr === r && lc === c);
                    const isCheck = inCheck && piece === `${turn}K`;
                    return (
                      <div key={`${r}-${c}`} onClick={() => handleClick(r, c)} style={{ width: SQ, height: SQ, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", background: isCheck ? "#c84040" : isSel ? "#f6f669" : isLight ? "#f0d9b5" : "#b58863" }}>
                        {piece && <PieceSVG type={piece[1] as PieceType} color={piece[0] as Color} size={SQ - 10} />}
                        {isLegal && (
                          <div style={{ position: "absolute", width: piece ? SQ - 6 : 24, height: piece ? SQ - 6 : 24, borderRadius: piece ? 0 : "50%", background: piece ? "transparent" : "rgba(0,0,0,0.18)", border: piece ? "4px solid rgba(0,0,0,0.22)" : "none", pointerEvents: "none", boxSizing: "border-box" }} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          {/* File labels */}
          <div style={{ display: "flex", marginLeft: 20 }}>
            {boardCols.map((c) => (
              <div key={SAN_FILES[c]} style={{ width: SQ, height: 18, display: "flex", alignItems: "center", justifyContent: "center", ...labelStyle }}>{SAN_FILES[c]}</div>
            ))}
          </div>
        </div>

        {/* Player bar */}
        <PlayerBar name={authUser?.username ?? "Joueur"} elo={0} color={config.color} minutes={config.timeControl.minutes} active={turn === config.color} />
      </div>

      {/* Right panel */}
      <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 12, paddingTop: 52 }}>

        {/* Game info */}
        <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{config.mode === "online" ? "En ligne" : `Solo · ${diffLabel}`}</div>
          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            {config.timeControl.label}{config.timeControl.increment > 0 ? ` +${config.timeControl.increment}s` : ""} · {gameStatus === "finished" ? "Terminée" : "En cours"}
          </div>
        </div>

        {/* Turn */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 8, background: "var(--color-bg-2)", border: "1px solid var(--color-border)" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: turn === "w" ? "var(--color-text-primary)" : "var(--color-faint)", border: "1px solid var(--color-border)", flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
            {inCheck && <><AlertTriangle size={12} style={{ display: "inline", marginRight: 4, color: "var(--color-danger)" }} />Échec · </>}{turn === "w" ? "Blancs" : "Noirs"} jouent
          </span>
        </div>

        {/* Move list */}
        <div style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 10, display: "flex", flexDirection: "column", height: 280 }}>
          <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-border)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", flexShrink: 0 }}>
            Coups · {moves.length}
          </div>
          <MoveList moves={moves} />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => setDialog("draw")} style={{ padding: "11px", borderRadius: 8, border: "1px solid var(--color-border)", background: "none", color: "var(--color-text-muted)", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.4)"; (e.currentTarget as HTMLElement).style.color = "var(--color-gold)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; }}>
            <Handshake size={15} /> Proposer la nulle
          </button>
          <button onClick={() => setDialog("resign")} style={{ padding: "11px", borderRadius: 8, border: "1px solid rgba(248,81,73,0.3)", background: "rgba(248,81,73,0.07)", color: "var(--color-danger)", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "background 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,81,73,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248,81,73,0.07)")}>
            <Flag size={15} /> Abandonner
          </button>
        </div>
      </div>

      {/* Promotion modal */}
      {pendingPromotion && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 28, borderRadius: 16, background: "var(--color-bg-3)", border: "1px solid var(--color-border)", boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Promotion</p>
            <div style={{ display: "flex", gap: 12 }}>
              {PROMOTION_PIECES.map((pt) => (
                <button key={pt} onClick={() => handlePromotion(pt)} style={{ width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-bg-2)", cursor: "pointer", transition: "border-color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}>
                  <PieceSVG type={pt as PieceType} color={pendingPromotion.color} size={52} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {dialog && (
        <ConfirmDialog
          type={dialog}
          onConfirm={handleConfirm}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export function PlayPage() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [gameId, setGameId] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const authUser = useAuthStore((s) => s.user);
  const addToast = useToastStore((state) => state.addToast);

  const handleStart = (cfg: GameConfig, id: string) => {
    setGameId(id);
    setConfig(cfg);
    setSearchParams({ game: id });
  };

  useEffect(() => {
    const id = searchParams.get("game");
    if (!id || !authUser || gameId === id) return;

    gamesApi.getOne(id)
      .then((game) => {
        const color = game.whiteId === authUser.id ? "w" : "b";
        setGameId(game.id);
        setConfig({
          color,
          difficulty: "medium",
          timeControl: getTimeControlFromGame(game),
          mode: "online",
          opponentName: color === "w" ? game.blackUsername ?? "Adversaire" : game.whiteUsername ?? "Adversaire",
        });
      })
      .catch((err) => {
        addToast({
          type: "error",
          title: "Partie introuvable",
          message: getErrorMessage(err, "Impossible d'ouvrir cette partie."),
        });
      });
  }, [addToast, authUser, gameId, searchParams]);

  if (config) return <GameView config={config} gameId={gameId} onEnd={() => { setConfig(null); setMode(null); setGameId(""); setSearchParams({}); }} />;
  if (mode === "cpu") return <SetupScreen onStart={handleStart} onBack={() => setMode(null)} />;
  if (mode === "online") return <OnlineSetup onStart={handleStart} onBack={() => setMode(null)} />;
  return <ModeSelect onSelect={setMode} />;
}
