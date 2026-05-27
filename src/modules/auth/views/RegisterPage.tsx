import { useState } from "react";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "@/shared/components/Button";
import { useAuthStore } from "../store/authStore";
import { ApiError } from "@/shared/api/client";
import { OnboardingModal } from "@/modules/onboarding/components/OnboardingModal";
import { useToastStore } from "@/shared/toasts/toastStore";
import { registerSchema } from "@/shared/validation/formSchemas";
import { useForm, Form, Field } from "@/shared/form";
import { useRouter } from "@/shared/services/router";
import { Route } from "@/shared/services/routes";

export function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const register = useAuthStore((s) => s.register);
  const addToast = useToastStore((s) => s.addToast);
  const { goTo } = useRouter();

  const { ctx, handleSubmit } = useForm(registerSchema, {
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  return (
    <>
      {showOnboarding && <OnboardingModal onClose={() => goTo(Route.Home)} />}
      <AuthLayout>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Créer un compte</h2>
          <p style={{ fontSize: 14, color: "#666" }}>Rejoignez la communauté ChessMaster gratuitement.</p>
        </div>

        <Form ctx={ctx} onSubmit={handleSubmit(async (data) => {
          setLoading(true);
          try {
            await register({ email: data.email, username: data.username, password: data.password });
            setShowOnboarding(true);
          } catch (err) {
            const message = err instanceof ApiError ? (err.body?.message ?? "Erreur lors de l'inscription") : "Erreur réseau";
            addToast({ type: "error", title: "Inscription impossible", message });
          } finally {
            setLoading(false);
          }
        })} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field name="username" label="Nom d'utilisateur" placeholder="Wynn4Life" />
          <Field name="email" label="Email" type="email" placeholder="vous@exemple.com" />
          <Field name="password" label="Mot de passe" type="password" placeholder="8 caractères minimum" />
          <Field name="confirm" label="Confirmer le mot de passe" type="password" />

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
            <Button variant="auth-primary" type="submit" disabled={loading} label={loading ? "Chargement…" : "Créer mon compte"} />
          </div>
        </Form>

        <p style={{ fontSize: 13, color: "#555", textAlign: "center", marginTop: 24 }}>
          Déjà un compte ?{" "}
          <Button to={Route.Login} variant="auth-link" label="Se connecter" />
        </p>
      </AuthLayout>
    </>
  );
}
