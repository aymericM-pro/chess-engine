import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "@/shared/components/Button";
import { useAuthStore } from "../store/authStore";
import { ApiError } from "@/shared/api/client";
import { useToastStore } from "@/shared/toasts/toastStore";
import { loginSchema } from "@/shared/validation/formSchemas";
import { useForm, Form, Field } from "@/shared/form";
import { useRouter } from "@/shared/services/router";
import { Route } from "@/shared/services/routes";

export function LoginPage() {
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const addToast = useToastStore((s) => s.addToast);
  const { goTo } = useRouter();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? Route.Play;

  const { ctx, handleSubmit } = useForm(loginSchema, { email: "", password: "" });

  return (
    <AuthLayout>
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6 }}>Bon retour</h2>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>Connectez-vous pour reprendre votre progression.</p>
      </div>

      <Form ctx={ctx} onSubmit={handleSubmit(async (data) => {
        setLoading(true);
        try {
          await login(data);
          navigate(redirectTo, { replace: true });
        } catch (err) {
          addToast({ type: "error", title: "Connexion impossible", message: getLoginErrorMessage(err) });
        } finally {
          setLoading(false);
        }
      })} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field name="email" label="Email" type="email" placeholder="vous@exemple.com" />
        <Field name="password" label="Mot de passe" type="password" placeholder="••••••••" />

        <div style={{ textAlign: "right", marginTop: -12 }}>
          <Button to={Route.ForgotPassword} variant="auth-link" className="text-xs" label="Mot de passe oublié ?" />
        </div>

        <div style={{ marginTop: 4 }}>
          <Button variant="auth-primary" type="submit" disabled={loading} label={loading ? "Chargement…" : "Se connecter"} />
        </div>
      </Form>

      <p style={{ fontSize: 13, color: "var(--color-text-muted)", textAlign: "center", marginTop: 28 }}>
        Pas encore de compte ?{" "}
        <Button to={Route.Register} variant="auth-link" label="S'inscrire" />
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
