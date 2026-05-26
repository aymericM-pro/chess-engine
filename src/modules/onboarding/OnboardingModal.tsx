import { useState } from "react";
import { Crown, MonitorCog, Users, Trophy, CircleCheck } from "lucide-react";
import { Button } from "@/shared/components/Button";

interface OnboardingModalProps {
  onClose: () => void;
}

const TOTAL_STEPS = 4;

const fadeStyle = `
  @keyframes ob-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function Step0() {
  return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{ width: 88, height: 88, borderRadius: 24, margin: "0 auto 32px", background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.24)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent)" }}>
        <Crown size={44} strokeWidth={1.5} />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
          color: "var(--color-text-primary)",
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        Bienvenue sur ChessMate
      </h2>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
          color: "var(--color-text-muted)",
          lineHeight: 1.8,
          maxWidth: 560,
          margin: "0 auto",
        }}
      >
        Affrontez l&apos;IA ou invitez un ami, suivez vos parties et progressez coup
        par coup.
      </p>
    </div>
  );
}

function Step1() {
  const cardStyle: React.CSSProperties = {
    flex: 1,
    background: "var(--color-bg-3)",
    border: "1px solid var(--color-border)",
    borderRadius: 16,
    padding: "36px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    textAlign: "center",
  };

  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.4rem, 3vw, 2rem)",
          color: "var(--color-text-primary)",
          fontWeight: 700,
          marginBottom: 32,
          textAlign: "center",
        }}
      >
        Deux façons de jouer
      </h2>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={cardStyle}>
          <MonitorCog size={40} color="var(--color-accent)" strokeWidth={1.5} />
          <div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                fontSize: "1.05rem",
                marginBottom: 10,
              }}
            >
              Contre l&apos;IA
            </div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.65,
              }}
            >
              3 niveaux de difficulté, 5 cadences disponibles
            </div>
          </div>
        </div>
        <div style={cardStyle}>
          <Users size={40} color="var(--color-accent)" strokeWidth={1.5} />
          <div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                fontSize: "1.05rem",
                marginBottom: 10,
              }}
            >
              En ligne
            </div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.65,
              }}
            >
              Invitez un ami par username
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "rgba(201,169,110,0.12)",
          marginBottom: 32,
        }}
      >
        <Trophy size={46} color="var(--color-accent)" strokeWidth={1.5} />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.4rem, 3vw, 2rem)",
          color: "var(--color-text-primary)",
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        Suivez votre progression
      </h2>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
          color: "var(--color-text-muted)",
          lineHeight: 1.8,
          maxWidth: 520,
          margin: "0 auto",
        }}
      >
        Accédez à l&apos;historique de vos parties, consultez les résultats et
        téléchargez votre rapport PDF.
      </p>
    </div>
  );
}

function Step3({ onClose }: { onClose: () => void }) {
  const todos = [
    "Lancer une première partie contre l'IA",
    "Ajouter un ami par username",
    "Télécharger le rapport d'une partie",
  ];

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", width: "100%" }}>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.4rem, 3vw, 2rem)",
          color: "var(--color-text-primary)",
          fontWeight: 700,
          marginBottom: 32,
          textAlign: "center",
        }}
      >
        Prêt à jouer ?
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
        {todos.map((todo) => (
          <div
            key={todo}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "var(--color-bg-3)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              padding: "18px 20px",
            }}
          >
            <CircleCheck size={24} color="var(--color-accent)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1rem",
                color: "var(--color-text-primary)",
              }}
            >
              {todo}
            </span>
          </div>
        ))}
      </div>
      <Button
        variant="play-primary"
        onClick={onClose}
        className="py-4 font-sans text-[1.05rem] text-black"
        label="C'est parti !"
      />
    </div>
  );
}

export function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const isLast = step === TOTAL_STEPS - 1;

  const steps = [
    <Step0 key="s0" />,
    <Step1 key="s1" />,
    <Step2 key="s2" />,
    <Step3 key="s3" onClose={onClose} />,
  ];

  return (
    <>
      <style>{fadeStyle}</style>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.72)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--color-bg-2)",
            border: "1px solid var(--color-border)",
            borderRadius: 20,
            width: "100%",
            maxWidth: 860,
            height: "calc(100vh - 40px)",
            maxHeight: 700,
            padding: "40px 56px 36px",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.7)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Skip button */}
          <Button
            variant="auth-muted-link"
            onClick={onClose}
            className="absolute right-6 top-5 rounded-md px-2 py-1 font-sans text-[0.9rem]"
            label="Passer"
          />

          {/* Step content */}
          <div
            key={step}
            style={{
              animation: "ob-fade-in 0.22s ease",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {steps[step]}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isLast ? "center" : "space-between",
              paddingTop: 8,
            }}
          >
            {!isLast && (
              <Button
                variant="profile-outline"
                onClick={() => setStep((s) => s - 1)}
                className={`border-none px-[22px] py-[11px] font-sans text-[0.9rem] ${step === 0 ? "pointer-events-none bg-transparent text-transparent" : "bg-[var(--color-bg-3)] text-[var(--color-text-primary)]"}`}
                label="Précédent"
              />
            )}

            {/* Dots */}
            <div style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === step ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === step ? "var(--color-accent)" : "var(--color-bg-3)",
                    transition: "width 0.25s ease, background 0.25s ease",
                  }}
                />
              ))}
            </div>

            {!isLast && (
              <Button
                variant="play-primary"
                onClick={() => setStep((s) => s + 1)}
                className="w-auto rounded-[10px] px-[22px] py-[11px] font-sans text-[0.9rem] text-black"
                label="Suivant"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
