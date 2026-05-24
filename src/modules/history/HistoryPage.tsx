import { useState, useRef, useEffect } from "react";
import { Trash2, ChevronDown, Check, Eye, Download, X } from "lucide-react";
import { gamesApi } from "@/shared/api/games.api";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { GameReplayDialog } from "./GameReplayDialog";
import type { GameResponseDto } from "@/shared/api/types";
import { getErrorMessage } from "@/shared/api/errorMessage";
import { useToastStore } from "@/shared/toasts/toastStore";

type ResultFilter = "win" | "loss" | "draw" | "unfinished";
type ChipTone = { color: string; bg: string; border: string };

const CHIP_TONE: ChipTone = {
  color: "#c9a96e",
  bg: "rgba(201,169,110,0.12)",
  border: "rgba(201,169,110,0.32)",
};

const RESULT_FILTERS: Array<{ id: ResultFilter; label: string; tone: ChipTone }> = [
  { id: "win",        label: "Victoire",       tone: CHIP_TONE },
  { id: "loss",       label: "Défaite",        tone: CHIP_TONE },
  { id: "draw",       label: "Nulle",          tone: CHIP_TONE },
  { id: "unfinished", label: "Sans résultat",  tone: CHIP_TONE },
];

function estimateDuration(timeLimit: number, increment: number, moveCount: number): string {
  if (timeLimit === 0) return "—";
  const totalSeconds = Math.round(timeLimit * 0.75 * 2 + moveCount * increment);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function shortId(id: string | null): string {
  if (!id) return "—";
  return id.slice(0, 8) + "…";
}

function getTint() {
  return CHIP_TONE;
}

function getMyColor(game: GameResponseDto, userId?: string): "white" | "black" | null {
  if (game.whiteId === userId) return "white";
  if (game.blackId === userId) return "black";
  return null;
}

function getResultFilterValue(game: GameResponseDto, userId?: string): ResultFilter {
  const myColor = getMyColor(game, userId);
  if (!game.result || !myColor) return "unfinished";
  if (game.result === "draw") return "draw";
  return game.result === myColor ? "win" : "loss";
}

function ResultBadge({ result, myColor }: { result: string | null; myColor: "white" | "black" | null }) {
  if (!result || !myColor) return <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>—</span>;
  if (result === "draw")
    return <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-faint)", letterSpacing: "0.04em" }}>Nulle</span>;
  const won = result === myColor;
  return (
    <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", color: won ? "var(--color-gold)" : "var(--color-danger)" }}>
      {won ? "Victoire" : "Défaite"}
    </span>
  );
}

function PlayerCell({ name, isMe }: { name: string | null; isMe: boolean }) {
  if (!name) return <span style={{ fontSize: 13, color: "var(--color-text-muted)", fontStyle: "italic" }}>Ordinateur</span>;
  return (
    <span style={{ fontSize: 13, color: isMe ? "var(--color-gold)" : "var(--color-text-primary)", fontWeight: isMe ? 600 : 400 }}>
      {isMe ? "Vous" : name}
    </span>
  );
}

function ActionBtn({ icon, tooltip, onClick, loading }: { icon: React.ReactNode; tooltip: string; onClick: () => void; loading?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <button
        onClick={onClick}
        disabled={loading}
        style={{
          background: "none", border: "1px solid transparent", borderRadius: 6,
          padding: "5px 7px", cursor: loading ? "default" : "pointer",
          color: "var(--color-text-muted)", display: "flex", alignItems: "center",
          opacity: loading ? 0.5 : 1,
          transition: "color 0.15s, border-color 0.15s, background 0.15s",
        }}
        onMouseEnter={(e) => {
          setHover(true);
          e.currentTarget.style.color = "var(--color-gold)";
          e.currentTarget.style.borderColor = "rgba(201,169,110,0.35)";
          e.currentTarget.style.background = "rgba(201,169,110,0.08)";
        }}
        onMouseLeave={(e) => {
          setHover(false);
          e.currentTarget.style.color = "var(--color-text-muted)";
          e.currentTarget.style.borderColor = "transparent";
          e.currentTarget.style.background = "none";
        }}
      >
        {icon}
      </button>
      {hover && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
          background: "var(--color-bg-3)", border: "1px solid var(--color-border)",
          borderRadius: 6, padding: "4px 9px", fontSize: 11, fontWeight: 500,
          color: "var(--color-text-primary)", whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)", pointerEvents: "none", zIndex: 50,
        }}>
          {tooltip}
          <div style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
            borderTop: "5px solid var(--color-bg-3)",
          }} />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    waiting:  { label: "En attente", color: "#58a6ff" },
    active:   { label: "En cours",   color: "#3fb950" },
    finished: { label: "Terminée",   color: "var(--color-text-muted)" },
  };
  const s = map[status] ?? { label: status, color: "var(--color-text-muted)" };
  return <span style={{ fontSize: 12, color: s.color }}>{s.label}</span>;
}

function ActiveFilterChip({
  label,
  tone,
  onOpen,
  onRemove,
}: {
  label: string;
  tone: ChipTone;
  onOpen: () => void;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        minHeight: 28,
        padding: "4px 6px 4px 11px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1,
        color: tone.color,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        cursor: "pointer",
        userSelect: "none",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
    >
      <span style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label={`Retirer ${label}`}
        title={`Retirer ${label}`}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: `1px solid ${tone.border}`,
          background: "rgba(0,0,0,0.16)",
          color: tone.color,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.28)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.16)")}
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </button>
  );
}


function DeleteDialog({ count, onConfirm, onCancel }: { count: number; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "32px 36px", width: 380, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
          Supprimer {count === 1 ? "cette partie" : `ces ${count} parties`} ?
        </div>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 28, lineHeight: 1.6 }}>
          {count === 1 ? "Cette partie sera retirée de votre vue." : `Ces ${count} parties seront retirées de votre vue.`}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{ background: "none", border: "1px solid var(--color-border)", borderRadius: 6, padding: "8px 20px", fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-faint)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{ background: "var(--color-danger)", border: "1px solid var(--color-danger)", borderRadius: 6, padding: "8px 20px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export function HistoryPage() {
  const authUser = useAuthStore((s) => s.user);
  const token    = useAuthStore((s) => s.token);
  const [games, setGames] = useState<GameResponseDto[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showDialog, setShowDialog] = useState(false);
  const [detailGame, setDetailGame] = useState<GameResponseDto | null>(null);
  const [openFilter, setOpenFilter] = useState<"timeControl" | "result" | null>(null);
  const [activeTimeControls, setActiveTimeControls] = useState<Set<string>>(new Set());
  const [activeResults, setActiveResults] = useState<Set<ResultFilter>>(new Set());
  const filterRef = useRef<HTMLDivElement>(null);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    setLoading(true);
    gamesApi.getAll()
      .then((loadedGames) => {
        setGames(loadedGames);
        setError(null);
      })
      .catch((err) => {
        const message = getErrorMessage(err, "Impossible de charger les parties");
        setError(message);
        addToast({
          type: "error",
          title: "Parties non chargées",
          message,
        });
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  const allTimeControls = Array.from(new Set(games.map((g) => g.timeControl)));
  const activeFilterCount = activeTimeControls.size + activeResults.size;

  useEffect(() => {
    if (!openFilter) return;
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openFilter]);

  const toggleTimeControlFilter = (tc: string) => {
    setActiveTimeControls((prev) => {
      const next = new Set(prev);
      if (next.has(tc)) { next.delete(tc); } else { next.add(tc); }
      return next;
    });
  };

  const toggleResultFilter = (result: ResultFilter) => {
    setActiveResults((prev) => {
      const next = new Set(prev);
      if (next.has(result)) { next.delete(result); } else { next.add(result); }
      return next;
    });
  };

  const clearFilters = () => {
    setActiveTimeControls(new Set());
    setActiveResults(new Set());
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(selected.size === filteredGames.length ? new Set() : new Set(filteredGames.map((g) => g.id)));
  };

  const confirmDelete = () => {
    const count = selected.size;
    setGames((prev) => prev.filter((g) => !selected.has(g.id)));
    setSelected(new Set());
    setShowDialog(false);
    addToast({
      type: "success",
      title: count === 1 ? "Partie supprimée" : "Parties supprimées",
      message: count === 1 ? "La partie a été retirée de l'historique." : `${count} parties ont été retirées de l'historique.`,
    });
  };

  const handleDownload = async (gameId: string) => {
    if (!token || downloading) {
      addToast({
        type: "error",
        title: "Téléchargement impossible",
        message: "Vous devez être connecté pour télécharger le rapport.",
      });
      return;
    }
    setDownloading(gameId);
    try {
      const res  = await gamesApi.getReport(gameId, token);
      if (!res.ok) throw new Error("Le rapport PDF n'est pas disponible.");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `partie-${gameId.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      addToast({
        type: "success",
        title: "Rapport téléchargé",
        message: "Le PDF de la partie a été récupéré.",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Téléchargement échoué",
        message: getErrorMessage(err, "Impossible de télécharger le rapport de cette partie."),
      });
    } finally {
      setDownloading(null);
    }
  };

  const filteredGames = games.filter((g) => {
    const matchesTimeControl = activeTimeControls.size === 0 || activeTimeControls.has(g.timeControl);
    const matchesResult = activeResults.size === 0 || activeResults.has(getResultFilterValue(g, authUser?.id));
    return matchesTimeControl && matchesResult;
  });
  const visibleGames = filteredGames;
  const allChecked = filteredGames.length > 0 && selected.size === filteredGames.length;
  const someChecked = selected.size > 0 && selected.size < filteredGames.length;

  return (
    <>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px", width: "100%", boxSizing: "border-box" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.01em" }}>
              Historique des parties
            </h1>
            <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
              {filteredGames.length} partie{filteredGames.length !== 1 ? "s" : ""}
              {activeFilterCount > 0 && (
                <span style={{ color: "var(--color-gold)", marginLeft: 6 }}>
                  · {activeFilterCount} filtre{activeFilterCount > 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          {selected.size > 0 && (
            <button
              onClick={() => setShowDialog(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(248,81,73,0.1)", border: "1px solid rgba(248,81,73,0.35)", borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 600, color: "var(--color-danger)", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,81,73,0.18)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(248,81,73,0.1)")}
            >
              <Trash2 size={15} />
              Supprimer ({selected.size})
            </button>
          )}
        </div>

        {/* Loading / Error */}
        {loading && (
          <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "48px 0" }}>Chargement…</p>
        )}
        {error && (
          <p style={{ textAlign: "center", color: "var(--color-danger)", padding: "48px 0" }}>{error}</p>
        )}

        {!loading && !error && (
          <>
            {/* Filter toolbar */}
            <div ref={filterRef} style={{ position: "relative", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => setOpenFilter((current) => current === "timeControl" ? null : "timeControl")}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: activeTimeControls.size > 0 ? "rgba(201,169,110,0.10)" : "none",
                    border: `1px solid ${activeTimeControls.size > 0 ? "rgba(201,169,110,0.35)" : "var(--color-border)"}`,
                    borderRadius: 8, padding: "8px 14px", fontSize: 14, fontWeight: 500,
                    color: activeTimeControls.size > 0 ? "var(--color-gold)" : "var(--color-text-primary)",
                    cursor: "pointer",
                  }}
                >
                  Cadence
                  <ChevronDown size={14} style={{ opacity: 0.6, transform: openFilter === "timeControl" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                <button
                  onClick={() => setOpenFilter((current) => current === "result" ? null : "result")}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: activeResults.size > 0 ? "rgba(201,169,110,0.10)" : "none",
                    border: `1px solid ${activeResults.size > 0 ? "rgba(201,169,110,0.35)" : "var(--color-border)"}`,
                    borderRadius: 8, padding: "8px 14px", fontSize: 14, fontWeight: 500,
                    color: activeResults.size > 0 ? "var(--color-gold)" : "var(--color-text-primary)",
                    cursor: "pointer",
                  }}
                >
                  Résultat
                  <ChevronDown size={14} style={{ opacity: 0.6, transform: openFilter === "result" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    style={{ background: "none", border: "1px solid var(--color-border)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "var(--color-text-muted)", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                  >
                    Effacer
                  </button>
                )}

                {openFilter === "timeControl" && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 10, padding: "6px", minWidth: 180, boxShadow: "0 12px 32px rgba(0,0,0,0.5)", zIndex: 200 }}>
                    {allTimeControls.map((tc) => {
                      const c = getTint();
                      const active = activeTimeControls.has(tc);
                      return (
                        <button
                          key={tc}
                          onClick={() => toggleTimeControlFilter(tc)}
                          style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", background: active ? "rgba(201,169,110,0.08)" : "none", border: "none", borderRadius: 6, padding: "8px 10px", cursor: "pointer" }}
                          onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--color-bg-3)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = active ? "rgba(201,169,110,0.08)" : "none"; }}
                        >
                          <span style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: `1px solid ${active ? c.color : "var(--color-border)"}`, background: active ? c.bg : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {active && <Check size={10} color={c.color} strokeWidth={3} />}
                          </span>
                          <span style={{ fontSize: 13, color: active ? c.color : "var(--color-text-primary)", fontWeight: active ? 500 : 400, textTransform: "capitalize" }}>
                            {tc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {openFilter === "result" && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 118, background: "var(--color-bg-2)", border: "1px solid var(--color-border)", borderRadius: 10, padding: "6px", minWidth: 190, boxShadow: "0 12px 32px rgba(0,0,0,0.5)", zIndex: 200 }}>
                    {RESULT_FILTERS.map((option) => {
                      const active = activeResults.has(option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => toggleResultFilter(option.id)}
                          style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", background: active ? option.tone.bg : "none", border: "none", borderRadius: 6, padding: "8px 10px", cursor: "pointer" }}
                          onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--color-bg-3)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = active ? option.tone.bg : "none"; }}
                        >
                          <span style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: `1px solid ${active ? option.tone.color : "var(--color-border)"}`, background: active ? option.tone.bg : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {active && <Check size={10} color={option.tone.color} strokeWidth={3} />}
                          </span>
                          <span style={{ fontSize: 13, color: active ? option.tone.color : "var(--color-text-primary)", fontWeight: active ? 500 : 400 }}>
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {activeFilterCount > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  {Array.from(activeTimeControls).map((tc) => (
                    <ActiveFilterChip
                      key={`tc-${tc}`}
                      label={`Cadence · ${tc}`}
                      tone={getTint()}
                      onOpen={() => setOpenFilter("timeControl")}
                      onRemove={() => toggleTimeControlFilter(tc)}
                    />
                  ))}
                  {Array.from(activeResults).map((result) => {
                    const option = RESULT_FILTERS.find((r) => r.id === result)!;
                    return (
                      <ActiveFilterChip
                        key={`result-${result}`}
                        label={`Résultat · ${option.label}`}
                        tone={option.tone}
                        onOpen={() => setOpenFilter("result")}
                        onRemove={() => toggleResultFilter(result)}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Table */}
            {filteredGames.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "48px 0" }}>Aucune partie trouvée.</p>
            ) : (
              <>
                <div style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  overflow: "auto",
                  maxHeight: "min(640px, calc(100vh - 280px))",
                }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--color-bg-2)", borderBottom: "1px solid var(--color-border)" }}>
                        <th style={{ padding: "12px 16px", width: 40, position: "sticky", top: 0, zIndex: 20, background: "var(--color-bg-2)", borderBottom: "1px solid var(--color-border)" }}>
                          <input
                            type="checkbox"
                            checked={allChecked}
                            ref={(el) => { if (el) el.indeterminate = someChecked; }}
                            onChange={toggleAll}
                            style={{ cursor: "pointer", accentColor: "var(--color-gold)" }}
                          />
                        </th>
                        {["Date", "Blancs", "Noirs", "Résultat", "Statut", "Cadence", "Coups", "Durée", "Actions"].map((h) => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", position: "sticky", top: 0, zIndex: 20, background: "var(--color-bg-2)", borderBottom: "1px solid var(--color-border)" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleGames.map((game, i) => {
                        const isSelected = selected.has(game.id);
                        const c = getTint();
                        return (
                          <tr
                            key={game.id}
                            style={{ borderBottom: i < visibleGames.length - 1 ? "1px solid var(--color-border)" : "none", background: isSelected ? "rgba(201,169,110,0.06)" : "var(--color-bg-2)", cursor: "pointer", transition: "background 0.15s" }}
                            onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--color-bg-3)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isSelected ? "rgba(201,169,110,0.06)" : "var(--color-bg-2)"; }}
                            onClick={() => toggleOne(game.id)}
                          >
                            <td style={{ padding: "14px 16px" }} onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" checked={isSelected} onChange={() => toggleOne(game.id)} style={{ cursor: "pointer", accentColor: "var(--color-gold)" }} />
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 14, color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                              {new Date(game.finishedAt ?? game.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <PlayerCell
                                name={game.whiteUsername ?? shortId(game.whiteId)}
                                isMe={game.whiteId === authUser?.id}
                              />
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <PlayerCell
                                name={game.blackId ? (game.blackUsername ?? shortId(game.blackId)) : null}
                                isMe={game.blackId === authUser?.id}
                              />
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <ResultBadge
                                result={game.result}
                                myColor={game.whiteId === authUser?.id ? "white" : game.blackId === authUser?.id ? "black" : null}
                              />
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <StatusBadge status={game.status} />
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500, color: c.color, background: c.bg, border: `1px solid ${c.border}`, whiteSpace: "nowrap", textTransform: "capitalize" }}>
                                {game.timeControl}
                              </span>
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 14, color: "var(--color-text-muted)" }}>
                              {game.moveCount}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 14, color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                              {estimateDuration(game.timeLimit, game.increment, game.moveCount)}
                            </td>
                            <td style={{ padding: "10px 12px" }} onClick={(e) => e.stopPropagation()}>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <ActionBtn
                                  icon={<Eye size={15} />}
                                  tooltip="Voir la partie"
                                  onClick={() => setDetailGame(game)}
                                />
                                <ActionBtn
                                  icon={<Download size={15} />}
                                  tooltip="Télécharger (PDF)"
                                  onClick={() => handleDownload(game.id)}
                                  loading={downloading === game.id}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {showDialog && (
        <DeleteDialog count={selected.size} onConfirm={confirmDelete} onCancel={() => setShowDialog(false)} />
      )}

      {detailGame && (
        <GameReplayDialog game={detailGame} authUserId={authUser?.id} onClose={() => setDetailGame(null)} />
      )}
    </>
  );
}
