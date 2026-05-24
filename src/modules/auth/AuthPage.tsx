import { useState } from "react";
import { Link } from "react-router";
import { Crown, Eye, EyeOff, Settings, Swords, TrendingUp } from "lucide-react";

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
        <button type="button" onClick={() => setVisible((v) => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex", padding: 4, transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}>
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
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
          <Link to="/forgot-password" style={{ fontSize: 12, color: "#c9a96e", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}>
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
      <button type="submit" style={{ padding: "13px", borderRadius: 8, border: "none", background: "#c9a96e", color: "#0d1117", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s", marginTop: 4 }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
        Se connecter
      </button>
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
      <button type="submit" style={{ padding: "13px", borderRadius: 8, border: "none", background: "#c9a96e", color: "#0d1117", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
        Créer mon compte
      </button>
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
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "10px", borderRadius: 7, border: "none", background: mode === m ? "#c9a96e" : "none", color: mode === m ? "#0d1117" : "#888", fontSize: 14, fontWeight: mode === m ? 700 : 400, cursor: "pointer", transition: "all 0.2s" }}>
              {m === "login" ? "Connexion" : "Inscription"}
            </button>
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
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", color: "#c9a96e", fontSize: 12, cursor: "pointer", padding: 0, textDecoration: "underline" }}>
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}
