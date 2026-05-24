import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout, Field, SubmitButton, inputStyle } from "./AuthLayout";
import { useAuthStore } from "./store/authStore";
import { ApiError } from "@/shared/api/client";
import { useToastStore } from "@/shared/toasts/toastStore";
import { getFieldErrors, loginSchema, type FieldErrors } from "@/shared/validation/formSchemas";

type LoginField = "email" | "password";

export function LoginPage() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors<LoginField>>({});
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? "/play";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setErrors(getFieldErrors<LoginField>(parsed.error));
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await login(parsed.data);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = getLoginErrorMessage(err);
      addToast({
        type: "error",
        title: "Connexion impossible",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6 }}>Bon retour</h2>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Connectez-vous pour reprendre votre progression.</p>
      </div>

      <form noValidate onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((current) => ({ ...current, email: undefined }));
            }}
            required
            style={{ ...inputStyle, borderColor: errors.email ? "var(--color-danger)" : "#2a2a34" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "var(--color-danger)" : "var(--color-border)")}
          />
        </Field>

        <Field label="Mot de passe" error={errors.password}>
          <div style={{ position: "relative" }}>
            <input
              type={visible ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
              required
              style={{ ...inputStyle, paddingRight: 44, borderColor: errors.password ? "var(--color-danger)" : "#2a2a34" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.password ? "var(--color-danger)" : "var(--color-border)")}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", padding: 4, transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              {visible ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
        <div style={{ textAlign: "right", marginTop: -12 }}>
          <Link
            to="/forgot-password"
            style={{ fontSize: 12, color: "#c9a96e", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <div style={{ marginTop: 4 }}>
          <SubmitButton label="Se connecter" loading={loading} disabled={loading} />
        </div>
      </form>

      <p style={{ fontSize: 13, color: "var(--color-text-muted)", textAlign: "center", marginTop: 28 }}>
        Pas encore de compte ?{" "}
        <Link
          to="/register"
          style={{ color: "#c9a96e", textDecoration: "none", fontWeight: 500 }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          S&apos;inscrire
        </Link>
      </p>
    </AuthLayout>
  );
}

function getLoginErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return "Erreur réseau";

  if (error.status === 423) {
    const minutes = error.body?.retryAfterMinutes ?? 15;
    return `Compte temporairement bloqué. Réessayez dans ${minutes} min.`;
  }

  if (error.status === 401 && typeof error.body?.attemptsLeft === "number") {
    if (error.body.attemptsLeft === 0) {
      return "Identifiants invalides. Le compte est maintenant bloqué pendant 15 min.";
    }
    return `Identifiants invalides. Il vous reste ${error.body.attemptsLeft} tentative${error.body.attemptsLeft > 1 ? "s" : ""}.`;
  }

  if (error.status === 401) return "Identifiants invalides.";
  return error.body?.message ?? "Erreur de connexion";
}
