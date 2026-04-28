import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PieceType, Color } from "@/shared/types/chess";
import { PieceSVG } from "@/shared/pieces/PieceSVG";
import { BoardHeader } from "./components/BoardHeader";
import { PlayerBar } from "@/modules/replay/components/PlayerBar";
import { clickCell, promote, INITIAL_STATE } from "./engine/boardGame";
import type { PromotionPieceType } from "./engine/boardGame";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

const labelStyle: React.CSSProperties = {
  fontSize: "0.6rem",
  fontWeight: 600,
  color: "rgba(255,255,255,0.5)",
  fontFamily: "var(--font-display)",
  letterSpacing: "0.05em",
  userSelect: "none",
};

export function Board() {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const { board, selected, legalMoves, turn, inCheck, pendingPromotion } = gameState;

  const toAlgebraic = (row: number, col: number) => `${FILES[col]}${8 - row}`;

  const selectedPiece = selected ? board[selected.row][selected.col] : null;

  const PROMOTION_PIECES: PromotionPieceType[] = ["Q", "R", "B", "N"];

  return (
    <div className="relative z-10 w-full max-w-[1080px] flex flex-col items-center gap-4 mx-auto">
      <BoardHeader />
      <PlayerBar />

      {pendingPromotion && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="flex flex-col items-center gap-4 p-6 rounded-2xl"
            style={{
              background: "var(--color-bg-3)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            }}
          >
            <p className="font-display text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-text-muted">
              {t("board.promotion")}
            </p>
            <div className="flex gap-3">
              {PROMOTION_PIECES.map((pt) => (
                <button
                  key={pt}
                  onClick={() => setGameState((s) => promote(s, pt))}
                  className="w-16 h-16 flex items-center justify-center rounded-xl border cursor-pointer transition-colors duration-150 hover:border-gold"
                  style={{
                    background: "var(--color-bg-2)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <PieceSVG
                    type={pt as PieceType}
                    color={pendingPromotion.color}
                    size={44}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Échiquier + panneau */}
      <div className="flex items-start gap-4">
        {/* Wrapper échiquier + coordonnées */}
        <div className="flex flex-col gap-0">
          <div className="flex">
            {/* Numéros (rangs) à gauche */}
            <div className="flex flex-col">
              {Array.from({ length: 8 }, (_, r) => (
                <div
                  key={r}
                  className="w-5 h-16 flex items-center justify-center"
                  style={labelStyle}
                >
                  {8 - r}
                </div>
              ))}
            </div>

            {/* Échiquier */}
            <div className="inline-block border-2 border-[#333]">
              <div className="grid grid-cols-8">
                {board.map((row, r) =>
                  row.map((piece, c) => {
                    const isLight = (r + c) % 2 === 0;
                    const isSelected =
                      selected?.row === r && selected?.col === c;
                    const isLegal = legalMoves.some(
                      ([lr, lc]) => lr === r && lc === c,
                    );
                    const isKingInCheck =
                      inCheck && piece === `${turn}K`;

                    return (
                      <div
                        key={`${r}-${c}`}
                        className="w-16 h-16 flex items-center justify-center cursor-pointer transition-all duration-100 relative"
                        style={{
                          background: isKingInCheck
                            ? "#e84040"
                            : isSelected
                              ? "#f6f669"
                              : isLight
                                ? "#f0d9b5"
                                : "#b58863",
                        }}
                        onClick={() => setGameState((s) => clickCell(s, r, c))}
                      >
                        {piece !== null && (
                          <PieceSVG
                            type={piece[1] as PieceType}
                            color={piece[0] as Color}
                            size={52}
                          />
                        )}
                        {isLegal && (
                          <div
                            className="absolute w-5 h-5 rounded-full pointer-events-none"
                            style={{ background: "rgba(0,0,0,0.2)" }}
                          />
                        )}
                      </div>
                    );
                  }),
                )}
              </div>
            </div>
          </div>

          {/* Lettres (colonnes) en bas */}
          <div className="flex ml-5">
            {FILES.map((f) => (
              <div
                key={f}
                className="w-16 h-5 flex items-center justify-center"
                style={labelStyle}
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Panneau sélection + tour */}
        <div
          className="w-44 flex flex-col gap-3 p-4 rounded-xl"
          style={{
            background: "var(--color-bg-3, rgba(255,255,255,0.04))",
            border: "1px solid var(--color-border)",
            minHeight: "8rem",
          }}
        >
          {/* Tour en cours */}
          <div
            className="flex flex-col gap-1 pb-3"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <p className="font-display text-[0.6rem] font-semibold tracking-[0.12em] uppercase text-text-muted">
              {t("board.turn")}
            </p>
            <p
              className="font-display font-semibold text-[0.75rem] tracking-[0.06em]"
              style={{ color: turn === "w" ? "#f0d9b5" : "#b58863" }}
            >
              {t(turn === "w" ? "player.white" : "player.black")}
            </p>
          </div>

          {/* Pièce sélectionnée */}
          <p className="font-display text-[0.6rem] font-semibold tracking-[0.12em] uppercase text-text-muted">
            {t("board.selection")}
          </p>

          {selectedPiece ? (
            <div className="flex flex-col items-center gap-3">
              <PieceSVG
                type={selectedPiece[1] as PieceType}
                color={selectedPiece[0] as Color}
                size={48}
              />
              <div className="text-center flex flex-col gap-1">
                <p className="font-display font-semibold text-[0.75rem] tracking-[0.06em] text-text-primary">
                  {t(`piece.${selectedPiece[1]}`)}
                </p>
                <p className="font-serif italic text-[0.7rem] text-text-muted">
                  {t(
                    selectedPiece[0] === "w" ? "player.white" : "player.black",
                  )}
                </p>
                <p
                  className="font-display text-[0.6rem] font-semibold tracking-[0.1em] uppercase mt-1 py-[3px] px-[10px] rounded-full"
                  style={{
                    background: "rgba(88,166,255,0.12)",
                    border: "1px solid rgba(88,166,255,0.24)",
                    color: "var(--color-accent, #58a6ff)",
                  }}
                >
                  {toAlgebraic(selected!.row, selected!.col)}
                </p>
              </div>
            </div>
          ) : (
            <p className="font-serif italic text-[0.75rem] text-text-muted text-center mt-2">
              {t("board.clickHint")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
