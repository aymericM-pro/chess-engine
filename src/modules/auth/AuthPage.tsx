import { useState } from "react";
import { Crown, Eye, EyeOff, Settings, Swords, TrendingUp } from "lucide-react";
import { Button } from "@/shared/components/Button";

type Mode = "login" | "register";

const FEATURES = [
  { icon: <Swords size={18} strokeWidth={1.8} />, title: "Jouez en ligne", desc: "Affrontez des joueurs du monde entier en temps réel, à toutes les cadences." },
  { icon: <Settings size={18} strokeWidth={1.8} />, title: "Analyse Stockfish", desc: "Analysez chaque coup avec le moteur n°1 mondial et comprenez vos erreurs." },
  { icon: <TrendingUp size={18} strokeWidth={1.8} />, title: "Progressez", desc: "Suivez votre ELO, vos statistiques et votre progression jour après jour." },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 8,
  background: "#1c1c24", border: "1px solid #2e2e38",
  color: "#fff", fontSize: 14, outline: "none",
  boxSizing: "border-box", transition: "border-color 0.15s",
};

function PasswordInput({ label, placeholder }: { label: string; placeholder?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 7 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input type={visible ? "text" : "password"} placeholder={placeholder ?? "••••••••"} style={{ ...inputStyle, paddingRight: 44 }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#2e2e38")} />
        <Button
          variant="auth-input-icon"
          type="button"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </Button>
      </div>
    </div>
  );
}

function TextField({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 7 }}>{label}</label>
      <input type={type} placeholder={placeholder} style={inputStyle}
        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#2e2e38")} />
    </div>
  );
}

function LoginForm() {
  return (
    <form style={{ display: "flex", flexDirection: "column", gap: 18 }} onSubmit={(e) => e.preventDefault()}>
      <TextField label="Email" type="email" placeholder="vous@exemple.com" />
      <div>
        <PasswordInput label="Mot de passe" />
        <div style={{ textAlign: "right", marginTop: 8 }}>
          <Button
            to="/forgot-password"
            variant="auth-link"
            className="text-xs"
            label="Mot de passe oublié ?"
          />
        </div>
      </div>
      <Button
        variant="auth-primary"
        type="submit"
        className="mt-1"
        label="Se connecter"
      />
    </form>
  );
}

function RegisterForm() {
  return (
    <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={(e) => e.preventDefault()}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <TextField label="Prénom" placeholder="Wynne" />
        <TextField label="Nom" placeholder="Laurent" />
      </div>
      <TextField label="Nom d'utilisateur" placeholder="Wynn4Life" />
      <TextField label="Email" type="email" placeholder="vous@exemple.com" />
      <PasswordInput label="Mot de passe" placeholder="8 caractères minimum" />
      <PasswordInput label="Confirmer le mot de passe" />
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 2 }}>
        <input type="checkbox" style={{ marginTop: 2, accentColor: "#c9a96e", flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>
          J&apos;accepte les <a href="#" style={{ color: "#c9a96e", textDecoration: "none" }}>conditions d&apos;utilisation</a> et la <a href="#" style={{ color: "#c9a96e", textDecoration: "none" }}>politique de confidentialité</a>
        </span>
      </label>
      <Button
        variant="auth-primary"
        type="submit"
        label="Créer mon compte"
      />
    </form>
  );
}

export function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d1117" }}>

      {/* Left — Presentation */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 64px", background: "linear-gradient(160deg, #111118 0%, #0d1117 60%)", borderRight: "1px solid #1e1e28", position: "relative", overflow: "hidden" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 64 }}>
          <div style={{ width: 40, height: 40, border: "1.5px solid #c9a96e", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a96e" }}>
            <Crown size={21} strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", color: "#c9a96e" }}>CHESS<span style={{ color: "#fff", fontWeight: 400 }}>MASTER</span></div>
          </div>
        </div>

        <h1 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.02em", maxWidth: 440 }}>
          Vos parties d&apos;échecs en <span style={{ color: "#c9a96e" }}>pilote automatique</span>
        </h1>
        <p style={{ fontSize: 16, color: "#888", lineHeight: 1.7, maxWidth: 400, marginBottom: 52 }}>
          Jouez, analysez, progressez. Rejoignez 180 000 joueurs qui améliorent leur niveau chaque jour sur ChessMaster.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#c9a96e", flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div style={{ width: 480, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 52px", background: "#111118" }}>

        {/* Tab switcher */}
        <div style={{ display: "flex", background: "#1a1a22", borderRadius: 10, padding: 4, marginBottom: 36, border: "1px solid #2e2e38" }}>
          {(["login", "register"] as Mode[]).map((m) => (
            <Button
              key={m}
              variant="auth-tab"
              className={mode === m ? "bg-[var(--color-gold)] font-bold text-[#0d1117]" : "bg-transparent font-normal text-[var(--color-text-muted)]"}
              onClick={() => setMode(m)}
              label={m === "login" ? "Connexion" : "Inscription"}
            />
          ))}
        </div>

        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            {mode === "login" ? "Bon retour" : "Créer un compte"}
          </h2>
          <p style={{ fontSize: 13, color: "#666" }}>
            {mode === "login"
              ? "Connectez-vous pour reprendre votre progression."
              : "Rejoignez la communauté ChessMaster gratuitement."}
          </p>
        </div>

        {mode === "login" ? <LoginForm /> : <RegisterForm />}

        <p style={{ fontSize: 12, color: "#555", textAlign: "center", marginTop: 28 }}>
          {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <Button
            variant="auth-link"
            className="text-xs underline"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            label={mode === "login" ? "S'inscrire" : "Se connecter"}
          />
        </p>
      </div>
    </div>
  );
}
