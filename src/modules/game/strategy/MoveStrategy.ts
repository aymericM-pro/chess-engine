import type { Board, Color } from "@/shared/types/chess";

export interface MoveStrategy {
  getLegalMoves(
    r: number,
    c: number,
    color: Color,
    board: Board,
  ): [number, number][];
}
