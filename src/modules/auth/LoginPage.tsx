import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout, Field, SubmitButton, inputStyle } from "./AuthLayout";
import { Button } from "@/shared/components/Button";
import { useAuthStore } from "./store/authStore";
import { ApiError } from "@/shared/api/client";
import { useToastStore } from "@/shared/toasts/toastStore";
import { loginSchema } from "@/shared/validation/formSchemas";
import { useZodForm } from "@/shared/validation/useZodForm";

export function LoginPage() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { errors, clearFieldError, validate } = useZodForm<typeof loginSchema>();

  const login = useAuthStore((s) => s.login);
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? "/play";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = validate(loginSchema, { email, password });
    if (!parsed) return;

    setLoading(true);
    try {
      await login(parsed);
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
              clearFieldError("email");
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
                clearFieldError("password");
              }}
              required
              style={{ ...inputStyle, paddingRight: 44, borderColor: errors.password ? "var(--color-danger)" : "#2a2a34" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = errors.password ? "var(--color-danger)" : "var(--color-border)")}
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
        <div style={{ textAlign: "right", marginTop: -12 }}>
          <Button
            to="/forgot-password"
            variant="auth-link"
            className="text-xs"
            label="Mot de passe oublié ?"
          />
        </div>

        <div style={{ marginTop: 4 }}>
          <SubmitButton label="Se connecter" loading={loading} disabled={loading} />
        </div>
      </form>

      <p style={{ fontSize: 13, color: "var(--color-text-muted)", textAlign: "center", marginTop: 28 }}>
        Pas encore de compte ?{" "}
        <Button
          to="/register"
          variant="auth-link"
          label="S'inscrire"
        />
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
