import { useNavigate } from "react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout, Field, SubmitButton, inputStyle } from "./AuthLayout";
import { Button } from "@/shared/components/Button";
import { useAuthStore } from "./store/authStore";
import { ApiError } from "@/shared/api/client";
import { OnboardingModal } from "@/modules/onboarding/OnboardingModal";
import { useToastStore } from "@/shared/toasts/toastStore";
import { registerSchema } from "@/shared/validation/formSchemas";
import { useZodForm } from "@/shared/validation/useZodForm";

function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Field label={label} error={error}>
      <div style={{ position: "relative" }}>
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder ?? "••••••••"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          style={{ ...inputStyle, paddingRight: 44, borderColor: error ? "var(--color-danger)" : "#2a2a34" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = error ? "var(--color-danger)" : "#2a2a34")}
        />
        <Button
          variant="auth-input-icon"
          type="button"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </Button>
      </div>
    </Field>
  );
}

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { errors, clearFieldError, validate } = useZodForm<typeof registerSchema>();

  const register = useAuthStore((s) => s.register);
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = validate(registerSchema, { username, email, password, confirm });
    if (!parsed) return;

    setLoading(true);
    try {
      await register({
        email: parsed.email,
        username: parsed.username,
        password: parsed.password,
      });
      setShowOnboarding(true);
    } catch (err) {
      const message = err instanceof ApiError ? (err.body?.message ?? "Erreur lors de l'inscription") : "Erreur réseau";
      addToast({
        type: "error",
        title: "Inscription impossible",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {showOnboarding && <OnboardingModal onClose={() => navigate("/")} />}
    <AuthLayout>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Créer un compte</h2>
        <p style={{ fontSize: 14, color: "#666" }}>Rejoignez la communauté ChessMaster gratuitement.</p>
      </div>

      <form noValidate onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Nom d'utilisateur" error={errors.username}>
          <input
            placeholder="Wynn4Life"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearFieldError("username");
            }}
            required
            style={{ ...inputStyle, borderColor: errors.username ? "var(--color-danger)" : "#2a2a34" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = errors.username ? "var(--color-danger)" : "#2a2a34")}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            required
            style={{ ...inputStyle, borderColor: errors.email ? "var(--color-danger)" : "#2a2a34" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "var(--color-danger)" : "#2a2a34")}
          />
        </Field>

        <PasswordInput
          label="Mot de passe"
          placeholder="8 caractères minimum"
          value={password}
          error={errors.password}
          onChange={(value) => {
            setPassword(value);
            clearFieldError("password", ["confirm"]);
          }}
        />
        <PasswordInput
          label="Confirmer le mot de passe"
          value={confirm}
          error={errors.confirm}
          onChange={(value) => {
            setConfirm(value);
            clearFieldError("confirm");
          }}
        />

        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 2 }}>
          <input type="checkbox" required style={{ marginTop: 2, accentColor: "#c9a96e", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
            J&apos;accepte les{" "}
            <a href="#" style={{ color: "#c9a96e", textDecoration: "none" }}>conditions d&apos;utilisation</a>
            {" "}et la{" "}
            <a href="#" style={{ color: "#c9a96e", textDecoration: "none" }}>politique de confidentialité</a>
          </span>
        </label>

        <div style={{ marginTop: 4 }}>
          <SubmitButton label="Créer mon compte" loading={loading} disabled={loading} />
        </div>
      </form>

      <p style={{ fontSize: 13, color: "#555", textAlign: "center", marginTop: 24 }}>
        Déjà un compte ?{" "}
        <Button
          to="/login"
          variant="auth-link"
          label="Se connecter"
        />
      </p>
    </AuthLayout>
    </>
  );
}
