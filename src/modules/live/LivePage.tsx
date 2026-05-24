import { useTranslation } from "react-i18next";
import { useLiveGame } from "./hooks/useLiveGame";

export function LivePage() {
  const { t } = useTranslation();
  const { connected, signals, sendPing } = useLiveGame();

  return (
    <div className="relative z-10 w-full max-w-lg flex flex-col gap-6 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[1rem] font-bold tracking-[0.12em] uppercase text-text-primary">
          {t("live.title")}
        </h1>
        <span style={{ color: connected ? "#3fb950" : "#f85149" }}>
          {t(connected ? "live.status_connected" : "live.status_idle")}
        </span>
      </div>

      <button
        onClick={sendPing}
        disabled={!connected}
        className="px-8 py-3 rounded-xl font-display text-[0.7rem] font-semibold tracking-[0.12em] uppercase disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
        style={{ background: "linear-gradient(135deg, #e6d5a0, #c8a95a)", color: "#0d1117" }}
      >
        {t("live.join_btn")}
      </button>

      <ul className="flex flex-col gap-2">
        {signals.length === 0 ? (
          <li className="font-serif italic text-[0.75rem] text-text-muted text-center py-4">
            {t("live.waiting")}
          </li>
        ) : (
          signals.map((s) => (
            <li key={s.id} className="font-display text-[0.65rem] text-text-muted">
              {new Date(s.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
