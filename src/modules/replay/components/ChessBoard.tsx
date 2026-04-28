import { useEffect, useState } from "react";
import { PieceSVG } from "@/shared/pieces/PieceSVG";
import type { Color, PieceType } from "@/shared/types/chess";
import { applyMoves } from "../engine/boardEngine";
import { MOVES } from "../data/moves";
import { useReplayStore } from "../store/replayStore";
import { idx } from "../engine/boardEngine";

function getSqSize() {
  const sidebar = window.innerWidth > 760 ? 240 : 0;
  return Math.floor(Math.min(window.innerWidth - sidebar - 80, 560) / 8);
}

export function ChessBoard() {
  const step = useReplayStore((s) => s.step);
  const [sqSize, setSqSize] = useState(getSqSize);

  useEffect(() => {
    const handleResize = () => setSqSize(getSqSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const board = applyMoves(MOVES, step);
  const lastMove = step > 0 ? MOVES[step - 1] : null;
  const fromIdx = lastMove ? idx(lastMove.f[0], lastMove.f[1]) : -1;
  const toIdx = lastMove ? idx(lastMove.t[0], lastMove.t[1]) : -1;

  const cells = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const i = idx(c, r);
      const isLight = (c + r) % 2 === 0;
      const isFrom = i === fromIdx;
      const isTo = i === toIdx;
      const piece = board[i];

      let bg: string;
      if (isFrom) bg = "rgba(246,246,105,0.72)";
      else if (isTo) bg = "rgba(246,246,105,0.4)";
      else bg = isLight ? "var(--sq-light)" : "var(--sq-dark)";

      cells.push(
        <div
          key={i}
          className="flex items-center justify-center relative"
          style={{
            width: sqSize,
            height: sqSize,
            background: bg,
            transition: "background 0.3s",
          }}
        >
          {piece && (
            <PieceSVG
              type={piece[1] as PieceType}
              color={piece[0] as Color}
              size={Math.round(sqSize * 0.9)}
            />
          )}
        </div>,
      );
    }
  }

  return (
    <div
      className="rounded-[4px] overflow-hidden"
      style={{
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.6), 0 20px 50px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(8, ${sqSize}px)`,
          gridTemplateRows: `repeat(8, ${sqSize}px)`,
        }}
      >
        {cells}
      </div>
    </div>
  );
}

export { getSqSize };
