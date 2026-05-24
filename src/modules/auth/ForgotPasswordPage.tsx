import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Crown, Mail, MailCheck } from "lucide-react";
import { forgotPasswordSchema, getFieldErrors, type FieldErrors } from "@/shared/validation/formSchemas";
import { useToastStore } from "@/shared/toasts/toastStore";
import { authApi } from "@/shared/api/auth.api";
import { getErrorMessage } from "@/shared/api/errorMessage";

type ForgotPasswordField = "email";

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors<ForgotPasswordField>>({});
  const [loading, setLoading] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setErrors(getFieldErrors<ForgotPasswordField>(parsed.error));
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await authApi.forgotPassword(parsed.data);
      setSent(true);
      addToast({
        type: "success",
        title: "Email envoyé",
        message: "Si un compte existe, un lien de réinitialisation sera envoyé.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Envoi impossible",
        message: getErrorMessage(err, "Impossible d'envoyer le lien de réinitialisation."),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-shell">
      <div className="forgot-panel">

        {/* Logo */}
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

            <form noValidate onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 7 }}>Adresse email</label>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((current) => ({ ...current, email: undefined }));
                  }}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 8, background: "#1c1c24", border: `1px solid ${errors.email ? "var(--color-danger)" : "#2e2e38"}`, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "var(--color-danger)" : "#2e2e38")}
                />
                {errors.email && (
                  <p style={{ margin: "6px 0 0", color: "var(--color-danger)", fontSize: 12, lineHeight: 1.45 }}>
                    {errors.email}
                  </p>
                )}
              </div>
              <button type="submit" disabled={loading} style={{ padding: "13px", borderRadius: 8, border: "none", background: "#c9a96e", color: "#0d1117", fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.15s" }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = "1"; }}>
                {loading ? "Envoi…" : "Envoyer le lien"}
              </button>
            </form>

            <div style={{ marginTop: 24, textAlign: "center" }}>
              <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#888", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                <ArrowLeft size={14} />
                Retour à la connexion
              </Link>
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
            <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 24px", borderRadius: 8, background: "#c9a96e", color: "#0d1117", fontWeight: 700, fontSize: 14, textDecoration: "none", transition: "opacity 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
              <ArrowLeft size={14} />
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
