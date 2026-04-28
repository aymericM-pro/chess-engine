import { useTranslation } from "react-i18next";
import { useReplayStore } from "../store/replayStore";
import { ANALYSIS } from "../data/analysis";
import type { Phase } from "@/shared/types/chess";

const phaseClasses: Record<Phase, string> = {
  opening:
    "bg-[rgba(118,150,86,0.14)] border border-[rgba(118,150,86,0.28)] text-success",
  middle:
    "bg-[rgba(88,166,255,0.12)] border border-[rgba(88,166,255,0.24)] text-accent",
  end: "bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.24)] text-danger",
};

export function GameHeader() {
  const { t } = useTranslation();
  const step = useReplayStore((s) => s.step);
  const phase = ANALYSIS[Math.min(step, ANALYSIS.length - 1)].phase;

  return (
    <div className="text-center flex flex-col items-center gap-[6px]">
      <div
        className="font-display font-bold tracking-[0.12em]"
        style={{
          fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
          background:
            "linear-gradient(135deg, #e6d5a0 0%, #f5ead6 40%, #c8a95a 70%, #e6d5a0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {t("header.title")}
      </div>
      <div className="flex items-center gap-[10px]">
        <span className="font-serif italic text-[0.95rem] text-text-muted tracking-[0.04em]">
          {t("header.subtitle")}
        </span>
        <span
          className={`font-display text-[0.6rem] font-semibold tracking-[0.12em] uppercase py-[3px] px-[10px] rounded-full transition-all duration-250 ${phaseClasses[phase]}`}
        >
          {t(`phase.${phase}`)}
        </span>
      </div>
    </div>
  );
}
