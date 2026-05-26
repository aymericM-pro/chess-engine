import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import { AuthLayout, Field, SubmitButton, inputStyle } from "./AuthLayout";
import { Button } from "@/shared/components/Button";
import { authApi } from "@/shared/api/auth.api";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useToastStore } from "@/shared/toasts/toastStore";
import { resetPasswordSchema } from "@/shared/validation/formSchemas";
import { useZodForm } from "@/shared/validation/useZodForm";

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

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const { errors, clearFieldError, validate } = useZodForm<typeof resetPasswordSchema>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = validate(resetPasswordSchema, { token, password, confirm });
    if (!parsed) return;

    setLoading(true);
    try {
      await authApi.resetPassword({
        token: parsed.token,
        password: parsed.password,
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
            clearFieldError("password", ["confirm"]);
          }}
        />
        <PasswordField
          label="Confirmer le mot de passe"
          value={confirm}
          error={errors.confirm}
          onChange={(value) => {
            setConfirm(value);
            clearFieldError("confirm");
          }}
        />

        <div style={{ marginTop: 4 }}>
          <SubmitButton label="Changer le mot de passe" loading={loading} disabled={loading} />
        </div>
      </form>

      <p style={{ fontSize: 13, color: "var(--color-text-muted)", textAlign: "center", marginTop: 24 }}>
        <Button
          to="/login"
          variant="auth-link"
          icon={<ArrowLeft size={14} />}
          label="Retour à la connexion"
        />
      </p>
    </AuthLayout>
  );
}
