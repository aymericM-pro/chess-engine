import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { AuthLayout, Field, SubmitButton, inputStyle } from "./AuthLayout";
import { authApi } from "@/shared/api/auth.api";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useToastStore } from "@/shared/toasts/toastStore";
import { getFieldErrors, resetPasswordSchema, type FieldErrors } from "@/shared/validation/formSchemas";

type ResetPasswordField = "token" | "password" | "confirm";

function PasswordField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} error={error}>
      <div style={{ position: "relative" }}>
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          style={{ ...inputStyle, paddingRight: 44, borderColor: error ? "var(--color-danger)" : "#2a2a34" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = error ? "var(--color-danger)" : "#2a2a34")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", padding: 4 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </Field>
  );
}

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FieldErrors<ResetPasswordField>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = resetPasswordSchema.safeParse({ token, password, confirm });
    if (!parsed.success) {
      setErrors(getFieldErrors<ResetPasswordField>(parsed.error));
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await authApi.resetPassword({
        token: parsed.data.token,
        password: parsed.data.password,
      });
      addToast({
        type: "success",
        title: "Mot de passe modifié",
        message: "Vous pouvez maintenant vous connecter.",
      });
      navigate("/login");
    } catch (err) {
      addToast({
        type: "error",
        title: "Lien invalide",
        message: getErrorMessage(err, "Le lien de réinitialisation est invalide ou expiré."),
      });
    } finally {
      setLoading(false);
    }
  };

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

      {errors.token && (
        <p style={{ margin: "0 0 16px", color: "var(--color-danger)", fontSize: 13, lineHeight: 1.5 }}>
          {errors.token}
        </p>
      )}

      <form noValidate onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <PasswordField
          label="Nouveau mot de passe"
          value={password}
          error={errors.password}
          onChange={(value) => {
            setPassword(value);
            setErrors((current) => ({ ...current, password: undefined, confirm: undefined }));
          }}
        />
        <PasswordField
          label="Confirmer le mot de passe"
          value={confirm}
          error={errors.confirm}
          onChange={(value) => {
            setConfirm(value);
            setErrors((current) => ({ ...current, confirm: undefined }));
          }}
        />

        <div style={{ marginTop: 4 }}>
          <SubmitButton label="Changer le mot de passe" loading={loading} disabled={loading} />
        </div>
      </form>

      <p style={{ fontSize: 13, color: "var(--color-text-muted)", textAlign: "center", marginTop: 24 }}>
        <Link
          to="/login"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#c9a96e", textDecoration: "none", fontWeight: 500 }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          <ArrowLeft size={14} />
          Retour à la connexion
        </Link>
      </p>
    </AuthLayout>
  );
}
