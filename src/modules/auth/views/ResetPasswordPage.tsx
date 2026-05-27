import { useState } from "react";
import { useSearchParams } from "react-router";
import { ArrowLeft, KeyRound } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "@/shared/components/Button";
import { authApi } from "@/shared/api/auth.api";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useToastStore } from "@/shared/toasts/toastStore";
import { resetPasswordSchema } from "@/shared/validation/formSchemas";
import { useForm, Form, Field } from "@/shared/form";
import { useRouter } from "@/shared/services/router";
import { Route } from "@/shared/services/routes";

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const { goTo } = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const token = params.get("token") ?? "";
  const [loading, setLoading] = useState(false);

  const { ctx, errors, submitted, handleSubmit } = useForm(resetPasswordSchema, {
    token,
    password: "",
    confirm: "",
  });

  return (
    <AuthLayout>
      <div style={{ marginBottom: 32 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a96e", marginBottom: 20 }}>
          <KeyRound size={22} />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6 }}>Nouveau mot de passe</h2>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)", lineHeight: 1.7 }}>
          Choisissez un nouveau mot de passe pour récupérer l&apos;accès à votre compte.
        </p>
      </div>

      {submitted && errors.token && (
        <p style={{ margin: "0 0 16px", color: "var(--color-danger)", fontSize: 13, lineHeight: 1.5 }}>
          {errors.token}
        </p>
      )}

      <Form ctx={ctx} onSubmit={handleSubmit(async (data) => {
        setLoading(true);
        try {
          await authApi.resetPassword({ token: data.token, password: data.password });
          addToast({ type: "success", title: "Mot de passe modifié", message: "Vous pouvez maintenant vous connecter." });
          goTo(Route.Login);
        } catch (err) {
          addToast({ type: "error", title: "Lien invalide", message: getErrorMessage(err, "Le lien de réinitialisation est invalide ou expiré.") });
        } finally {
          setLoading(false);
        }
      })} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Field name="password" label="Nouveau mot de passe" type="password" placeholder="••••••••" />
        <Field name="confirm" label="Confirmer le mot de passe" type="password" placeholder="••••••••" />

        <div style={{ marginTop: 4 }}>
          <Button variant="auth-primary" type="submit" disabled={loading} label={loading ? "Chargement…" : "Changer le mot de passe"} />
        </div>
      </Form>

      <p style={{ fontSize: 13, color: "var(--color-text-muted)", textAlign: "center", marginTop: 24 }}>
        <Button to={Route.Login} variant="auth-link" icon={<ArrowLeft size={14} />} label="Retour à la connexion" />
      </p>
    </AuthLayout>
  );
}
