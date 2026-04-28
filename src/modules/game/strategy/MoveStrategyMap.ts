import type { PieceType } from "@/shared/types/chess";
import type { MoveStrategy } from "./MoveStrategy";
import { PawnStrategy } from "./PawnStrategy";
import { KnightStrategy } from "./KnightStrategy";
import { BishopStrategy } from "./BishopStrategy";
import { RookStrategy } from "./RookStrategy";
import { QueenStrategy } from "./QueenStrategy";
import { KingStrategy } from "./KingStrategy";

// On instancie une seule fois chaque stratégie (singleton léger)
const strategies: Partial<Record<PieceType, MoveStrategy>> = {
  P: new PawnStrategy(),
  N: new KnightStrategy(),
  B: new BishopStrategy(),
  R: new RookStrategy(),
  Q: new QueenStrategy(),
  K: new KingStrategy(),
};

export const getMoveStrategy = (type: PieceType): MoveStrategy | null =>
  strategies[type] ?? null;
