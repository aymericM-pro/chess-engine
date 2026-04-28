import { useTranslation } from "react-i18next";

export function BoardHeader() {
  const { t } = useTranslation();

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
        {t("board.title")}
      </div>
      <span className="font-serif italic text-[0.95rem] text-text-muted tracking-[0.04em]">
        {t("board.subtitle")}
      </span>
    </div>
  );
}
