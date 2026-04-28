// src/shared/pieces/PieceSVG.tsx
import type { Color, PieceType } from "@/shared/types/chess";

interface Props {
  type: PieceType;
  color: Color;
  size?: number;
}

const BASE =
  "https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett";

export function PieceSVG({ type, color, size = 40 }: Props) {
  const key = `${color}${type}`; // ex: "wP", "bK"
  return (
    <img
      src={`${BASE}/${key}.svg`}
      width={size}
      height={size}
      alt={key}
      draggable={false}
      style={{ display: "block", userSelect: "none" }}
    />
  );
}
