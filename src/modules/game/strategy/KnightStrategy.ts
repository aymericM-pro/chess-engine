import type { Board, Color } from "@/shared/types/chess";
import type { MoveStrategy } from "./MoveStrategy";

export class KnightStrategy implements MoveStrategy {
  getLegalMoves(
    r: number,
    c: number,
    color: Color,
    board: Board,
  ): [number, number][] {
    const moves: [number, number][] = [];

    // Les 8 sauts en L possibles du cavalier
    const jumps: [number, number][] = [
      [-2, -1],
      [-2, +1],
      [-1, -2],
      [-1, +2],
      [+1, -2],
      [+1, +2],
      [+2, -1],
      [+2, +1],
    ];

    for (const [dr, dc] of jumps) {
      const nr = r + dr;
      const nc = c + dc;

      // Hors du plateau
      if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue;

      const target = board[nr][nc];

      // Case vide ou occupée par une pièce adverse → coup légal
      if (target === null || target[0] !== color) {
        moves.push([nr, nc]);
      }
    }

    return moves;
  }
}
