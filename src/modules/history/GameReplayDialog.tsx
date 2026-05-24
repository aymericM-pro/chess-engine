import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Loader2,
} from "lucide-react";
import { applyMoves, idx } from "@/modules/replay/engine/boardEngine";
import { PieceSVG } from "@/shared/pieces/PieceSVG";
import { useThemeStore } from "@/shared/theme/useThemeStore";
import { gamesApi } from "@/shared/api/games.api";
import type { Color, PieceType, Move } from "@/shared/types/chess";
import type { GameResponseDto, GameMove } from "@/shared/api/types";

// ─── helpers ──────────────────────────────────────────────────────────────────

function sqCoords(sq: string): [number, number] {
  return [sq.charCodeAt(0) - 97, 8 - parseInt(sq[1])];
}

function toEngineMove(gm: GameMove): Move {
  return { s: gm.san, f: sqCoords(gm.from), t: sqCoords(gm.to) };
}

function getBoardSize(dialogRef: HTMLDivElement | null): number {
  if (!dialogRef) return Math.floor(Math.min(window.innerHeight * 0.75, window.innerWidth * 0.45) / 8) * 8;
  const h = dialogRef.clientHeight - 120;
  const w = dialogRef.clientWidth * 0.48;
  return Math.floor(Math.min(h, w) / 8) * 8;
}

const END_LABELS: Record<string, string> = {
  checkmate:      "Échec et mat",
  resignation:    "Abandon",
  timeout:        "Temps écoulé",
  draw_agreement: "Accord mutuel",
  stalemate:      "Pat",
  abandoned:      "Partie abandonnée",
};

// ─── Board ────────────────────────────────────────────────────────────────────

function ReplayBoard({ moves, step, size }: { moves: Move[]; step: number; size: number }) {
  const { theme } = useThemeStore();
  const sqSize = Math.floor(size / 8);
  const board = applyMoves(moves, step) as unknown as (string | null)[];
  const lastMove = step > 0 ? moves[step - 1] : null;
  const fromIdx = lastMove ? idx(lastMove.f[0], lastMove.f[1]) : -1;
  const toIdx   = lastMove ? idx(lastMove.t[0], lastMove.t[1]) : -1;

  const cells = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const i = idx(c, r);
      const isLight = (c + r) % 2 === 0;
      const isFrom  = i === fromIdx;
      const isTo    = i === toIdx;
      const piece   = board[i];
      const bg = isFrom ? "rgba(246,246,105,0.72)"
               : isTo   ? "rgba(246,246,105,0.4)"
               : isLight ? "var(--sq-light)" : "var(--sq-dark)";
      cells.push(
        <div key={i} style={{ width: sqSize, height: sqSize, background: bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "background 0.25s" }}>
          {piece && <PieceSVG type={piece[1] as PieceType} color={piece[0] as Color} size={Math.round(sqSize * 0.88)} />}
        </div>,
      );
    }
  }

  return (
    <div style={{ borderRadius: 6, overflow: "hidden", boxShadow: theme === "dark" ? "0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.6)" : "0 0 0 1px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.12)" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(8, ${sqSize}px)`, gridTemplateRows: `repeat(8, ${sqSize}px)` }}>
        {cells}
      </div>
    </div>
  );
}

// ─── Transport Controls ───────────────────────────────────────────────────────

function Controls({ step, total, moves, onGoTo }: { step: number; total: number; moves: Move[]; onGoTo: (n: number) => void }) {
  const progressRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    onGoTo(Math.round(((e.clientX - rect.left) / rect.width) * total));
  };

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 36, height: 34, borderRadius: 8,
    border: "1px solid var(--color-border)",
    background: "var(--color-bg-2)",
    color: disabled ? "var(--color-text-muted)" : "var(--color-text-primary)",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.3 : 1,
    flexShrink: 0,
    transition: "background 0.15s",
  });

  let status: React.ReactNode = "Position initiale";
  if (step > 0 && step <= total) {
    const m = moves[step - 1];
    const color = step % 2 === 1 ? "Blancs" : "Noirs";
    status = <><b style={{ color: "var(--color-text-primary)", fontStyle: "normal" }}>{color}</b>{" · "}<b style={{ color: "var(--color-text-primary)", fontStyle: "normal" }}>{m.s}</b>{m.s.includes("x") && <span style={{ color: "var(--color-danger)" }}> ×</span>}</>;
  }

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button style={btnStyle(step === 0)} disabled={step === 0} onClick={() => onGoTo(0)}><ChevronsLeft size={15} /></button>
        <button style={btnStyle(step === 0)} disabled={step === 0} onClick={() => onGoTo(step - 1)}><ChevronLeft size={15} /></button>
        <div ref={progressRef} onClick={handleProgressClick} style={{ flex: 1, height: 5, borderRadius: 3, background: "var(--color-bg-3)", border: "1px solid var(--color-border)", overflow: "hidden", cursor: "pointer" }}>
          <div style={{ height: "100%", borderRadius: 3, minWidth: 2, transition: "width 0.18s", width: `${total === 0 ? 0 : (step / total) * 100}%`, background: "linear-gradient(90deg, var(--color-accent, #58a6ff), #79c0ff)" }} />
        </div>
        <button style={btnStyle(step === total)} disabled={step === total} onClick={() => onGoTo(step + 1)}><ChevronRight size={15} /></button>
        <button style={btnStyle(step === total)} disabled={step === total} onClick={() => onGoTo(total)}><ChevronsRight size={15} /></button>
      </div>
      <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 13, color: "var(--color-text-muted)", marginTop: 6, paddingLeft: 4 }}>
        {step > 0 && <span style={{ color: "var(--color-text-muted)" }}>Coup {step} · </span>}{status}
      </div>
    </div>
  );
}

// ─── Moves List ───────────────────────────────────────────────────────────────

function MovesList({ moves, step, onGoTo }: { moves: GameMove[]; step: number; onGoTo: (n: number) => void }) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [step]);

  const pairs: { n: number; white?: { move: GameMove; step: number }; black?: { move: GameMove; step: number } }[] = [];
  let engineStep = 0;
  for (const m of moves) {
    engineStep++;
    if (m.color === "white") {
      pairs.push({ n: m.moveNumber, white: { move: m, step: engineStep } });
    } else {
      const last = pairs[pairs.length - 1];
      if (last && last.n === m.moveNumber && last.white && !last.black) {
        last.black = { move: m, step: engineStep };
      } else {
        pairs.push({ n: m.moveNumber, black: { move: m, step: engineStep } });
      }
    }
  }

  if (pairs.length === 0) {
    return <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontStyle: "italic", padding: "16px 0" }}>Aucun coup enregistré.</p>;
  }

  const moveCell = (entry: { move: GameMove; step: number } | undefined, key: string) => {
    if (!entry) return <div key={key} style={{ padding: "5px 10px" }} />;
    const active = step === entry.step;
    return (
      <div
        key={key}
        ref={active ? activeRef : undefined}
        onClick={() => onGoTo(entry.step)}
        style={{
          padding: "5px 10px", borderRadius: 5, cursor: "pointer", fontFamily: "monospace",
          fontSize: 13, fontWeight: active ? 700 : 400,
          color: active ? "var(--color-gold)" : "var(--color-text-primary)",
          background: active ? "rgba(201,169,110,0.12)" : "none",
          transition: "background 0.12s",
        }}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--color-bg-3)"; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "none"; }}
      >
        {entry.move.san}
        {entry.move.isCheckmate ? " #" : entry.move.isCheck ? " +" : ""}
      </div>
    );
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr", rowGap: 2 }}>
      <div style={{ fontSize: 10, color: "var(--color-text-muted)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 6px 8px" }}>#</div>
      <div style={{ fontSize: 10, color: "var(--color-text-muted)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px 8px" }}>Blancs</div>
      <div style={{ fontSize: 10, color: "var(--color-text-muted)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px 8px" }}>Noirs</div>
      {pairs.map(({ n, white, black }) => (
        <>
          <div key={`n-${n}`} style={{ display: "flex", alignItems: "center", padding: "4px 6px", fontSize: 11, color: "var(--color-text-muted)" }}>{n}.</div>
          {moveCell(white, `w-${n}`)}
          {moveCell(black, `b-${n}`)}
        </>
      ))}
    </div>
  );
}

// ─── Main Dialog ──────────────────────────────────────────────────────────────

interface Props {
  game: GameResponseDto;
  authUserId: string | undefined;
  onClose: () => void;
}

export function GameReplayDialog({ game: initialGame, authUserId, onClose }: Props) {
  const dialogRef  = useRef<HTMLDivElement>(null);
  const [game, setGame]       = useState<GameResponseDto>(initialGame);
  const [loadingMoves, setLoadingMoves] = useState(true);
  const engineMoves = game.moves.map(toEngineMove);
  const total = engineMoves.length;
  const [step, setStep] = useState(0);
  const [boardSize, setBoardSize] = useState(480);

  // Lazy-load full game (with moves) on dialog open
  useEffect(() => {
    setLoadingMoves(true);
    gamesApi.getOne(initialGame.id)
      .then(setGame)
      .catch(() => undefined)
      .finally(() => setLoadingMoves(false));
  }, [initialGame.id]);

  const goTo = useCallback((n: number) => setStep(Math.max(0, Math.min(n, total))), [total]);

  useEffect(() => {
    const update = () => {
      if (dialogRef.current) setBoardSize(getBoardSize(dialogRef.current));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(step + 1); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); goTo(step - 1); }
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [step, goTo, onClose]);

  const myColor: "white" | "black" | null =
    game.whiteId === authUserId ? "white"
    : game.blackId === authUserId ? "black" : null;

  const resultLabel = !game.result ? null
    : game.result === "draw" ? "Nulle"
    : game.result === myColor ? "Victoire" : "Défaite";

  const resultColor = !game.result ? "var(--color-text-muted)"
    : game.result === "draw" ? "var(--color-faint)"
    : game.result === myColor ? "var(--color-gold)" : "var(--color-danger)";

  const whiteName = game.whiteUsername ?? game.whiteId.slice(0, 8);
  const blackName = game.blackId ? (game.blackUsername ?? game.blackId.slice(0, 8)) : "Ordinateur";
  const endLabel  = game.endReason ? (END_LABELS[game.endReason] ?? game.endReason) : null;
  const dateStr   = new Date(game.finishedAt ?? game.startedAt ?? game.createdAt)
    .toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const sqSize = Math.floor(boardSize / 8);
  const labelW = 22;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-bg-1)", border: "1px solid var(--color-border)",
          borderRadius: 16, width: "100%", maxWidth: 1100,
          height: "90vh", display: "flex", flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)", overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--color-border)", flexShrink: 0, background: "var(--color-bg-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{whiteName}</span>
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>♔ vs ♚</span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{blackName}</span>
            {resultLabel && <span style={{ fontSize: 13, fontWeight: 700, color: resultColor, marginLeft: 4 }}>— {resultLabel}</span>}
            {endLabel && <span style={{ fontSize: 12, color: "var(--color-text-muted)", background: "var(--color-bg-3)", border: "1px solid var(--color-border)", borderRadius: 6, padding: "2px 8px" }}>{endLabel}</span>}
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{dateStr}</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: 6, borderRadius: 6, display: "flex", transition: "color 0.15s, background 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text-primary)"; e.currentTarget.style.background = "var(--color-bg-3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.background = "none"; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left — board */}
          <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "20px 16px 20px 20px", borderRight: "1px solid var(--color-border)" }}>
            {/* Rank labels + board */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", flexDirection: "column", height: sqSize * 8 }}>
                {[8, 7, 6, 5, 4, 3, 2, 1].map((r) => (
                  <span key={r} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: labelW, height: sqSize, fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Georgia, serif", fontWeight: 600 }}>
                    {r}
                  </span>
                ))}
              </div>
              <ReplayBoard moves={engineMoves} step={step} size={boardSize} />
            </div>
            {/* File labels */}
            <div style={{ display: "flex", marginLeft: labelW + 6 }}>
              {["a", "b", "c", "d", "e", "f", "g", "h"].map((f) => (
                <span key={f} style={{ width: sqSize, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Georgia, serif", fontWeight: 600, paddingTop: 5 }}>
                  {f}
                </span>
              ))}
            </div>
            {/* Transport */}
            <div style={{ width: sqSize * 8 + labelW + 6, marginTop: 2 }}>
              <Controls step={step} total={total} moves={engineMoves} onGoTo={goTo} />
            </div>
          </div>

          {/* Right — moves list */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Stats strip */}
            <div style={{ display: "flex", gap: 28, padding: "12px 20px", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-2)", flexShrink: 0 }}>
              {[
                { label: "Cadence", value: game.timeControl.charAt(0).toUpperCase() + game.timeControl.slice(1) },
                { label: "Coups",   value: String(game.moveCount) },
                { label: "Temps",   value: `${Math.floor(game.timeLimit / 60)}min${game.increment ? ` +${game.increment}s` : ""}` },
                { label: "Statut",  value: game.status === "finished" ? "Terminée" : game.status === "active" ? "En cours" : "En attente" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
            {/* Moves */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
              {loadingMoves ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, color: "var(--color-text-muted)" }}>
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: 13 }}>Chargement des coups…</span>
                </div>
              ) : (
                <MovesList moves={game.moves} step={step} onGoTo={goTo} />
              )}
            </div>
            {/* Keyboard hint */}
            <div style={{ padding: "10px 20px", borderTop: "1px solid var(--color-border)", flexShrink: 0, background: "var(--color-bg-2)" }}>
              <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>← → pour naviguer · Échap pour fermer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
