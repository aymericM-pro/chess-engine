import { Link } from "react-router";
import { Crown, Settings, Swords, TrendingUp } from "lucide-react";
import { PageBackground } from "@/modules/layout/components/PageBackground";

const FEATURES = [
  { icon: <Swords size={18} strokeWidth={1.8} />, title: "Jouez en ligne", desc: "Affrontez des joueurs du monde entier en temps réel, à toutes les cadences." },
  { icon: <Settings size={18} strokeWidth={1.8} />, title: "Analyse Stockfish", desc: "Analysez chaque coup avec le moteur n°1 mondial et comprenez vos erreurs." },
  { icon: <TrendingUp size={18} strokeWidth={1.8} />, title: "Progressez", desc: "Suivez votre ELO, vos statistiques et votre progression jour après jour." },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-shell">
      <PageBackground />

      {/* Left — Presentation */}
      <div className="auth-side">

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: 0 }}>
          <div style={{ width: 40, height: 40, border: "1.5px solid #c9a96e", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a96e" }}>
            <Crown size={21} strokeWidth={1.8} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", color: "#c9a96e" }}>
            CHESS<span style={{ color: "#fff", fontWeight: 400 }}>MASTER</span>
          </div>
        </Link>

        {/* Centered content */}
        <div className="auth-hero">
          <h1 style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.15, marginBottom: 14, letterSpacing: "-0.025em", maxWidth: 400 }}>
            Vos parties d&apos;échecs en <span style={{ color: "var(--color-gold)" }}>pilote automatique</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-text-muted)", lineHeight: 1.75, maxWidth: 380, marginBottom: 48 }}>
            Jouez, analysez, progressez. Rejoignez 180&nbsp;000 joueurs qui améliorent leur niveau chaque jour.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#c9a96e", flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, color: "var(--color-text-primary)" }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: "var(--color-faint)", marginTop: 0 }}>© 2026 ChessMaster · Tous droits réservés</p>
      </div>

      {/* Right — Form */}
      <div className="auth-form-panel">
        {children}
      </div>
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 8,
  background: "#1c1c24", border: "1px solid #2a2a34",
  color: "#fff", fontSize: 14, outline: "none",
  boxSizing: "border-box", transition: "border-color 0.15s",
};

export function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "#777", display: "block", marginBottom: 7, letterSpacing: "0.03em" }}>{label}</label>
      {children}
      {error && (
        <p style={{ margin: "6px 0 0", color: "var(--color-danger)", fontSize: 12, lineHeight: 1.45 }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ label, loading, disabled }: { label: string; loading?: boolean; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "#c9a96e", color: "#0d1117", fontSize: 15, fontWeight: 700, cursor: disabled || loading ? "wait" : "pointer", transition: "opacity 0.15s", opacity: disabled || loading ? 0.7 : 1 }}
      onMouseEnter={(e) => { if (!disabled && !loading) e.currentTarget.style.opacity = "0.88" }}
      onMouseLeave={(e) => { if (!disabled && !loading) e.currentTarget.style.opacity = "1" }}>
      {loading ? "Chargement…" : label}
    </button>
  );
}
