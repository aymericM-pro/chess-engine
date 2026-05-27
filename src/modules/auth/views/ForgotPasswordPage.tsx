import { useState } from "react";
import { ArrowLeft, Crown, Mail, MailCheck } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { forgotPasswordSchema } from "@/shared/validation/formSchemas";
import { useToastStore } from "@/shared/toasts/toastStore";
import { authApi } from "@/shared/api/auth.api";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useForm, Form, Field } from "@/shared/form";
import { Route } from "@/shared/services/routes";

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const { ctx, handleSubmit } = useForm(forgotPasswordSchema, { email: "" });

  return (
    <div className="forgot-shell">
      <div className="forgot-panel">

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48, justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, border: "1.5px solid #c9a96e", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a96e" }}>
            <Crown size={19} strokeWidth={1.8} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.06em", color: "#c9a96e" }}>CHESS<span style={{ color: "#fff", fontWeight: 400 }}>MASTER</span></div>
        </div>

        {!sent ? (
          <div className="forgot-card">
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a96e", marginBottom: 20 }}>
              <Mail size={22} />
            </div>

            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Mot de passe oublié ?</h1>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>
              Entrez votre adresse email. Si un compte existe, vous recevrez un lien de réinitialisation dans quelques minutes.
            </p>

            <Form ctx={ctx} onSubmit={handleSubmit(async (data) => {
              setLoading(true);
              try {
                await authApi.forgotPassword(data);
                setSent(true);
                addToast({ type: "success", title: "Email envoyé", message: "Si un compte existe, un lien de réinitialisation sera envoyé." });
              } catch (err) {
                addToast({ type: "error", title: "Envoi impossible", message: getErrorMessage(err, "Impossible d'envoyer le lien de réinitialisation.") });
              } finally {
                setLoading(false);
              }
            })} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field name="email" label="Adresse email" type="email" placeholder="vous@exemple.com" />
              <Button variant="auth-primary" type="submit" disabled={loading} label={loading ? "Envoi…" : "Envoyer le lien"} />
            </Form>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <Button to={Route.Login} variant="auth-muted-link" icon={<ArrowLeft size={14} />} label="Retour à la connexion" />
            </div>
          </div>
        ) : (
          <div className="forgot-card" style={{ textAlign: "center" }}>
            <div style={{ width: 58, height: 58, borderRadius: 16, margin: "0 auto 20px", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a96e" }}>
              <MailCheck size={27} strokeWidth={1.8} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Email envoyé</h1>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 32 }}>
              Si un compte correspond à cette adresse, un email de réinitialisation vient d&apos;être envoyé. Vérifiez vos spams si besoin.
            </p>
            <Button to={Route.Login} variant="auth-primary" className="w-auto px-6 py-[11px] text-sm" icon={<ArrowLeft size={14} />} label="Retour à la connexion" />
          </div>
        )}
      </div>
    </div>
  );
}
