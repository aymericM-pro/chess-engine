import type { Board, Color } from "@/shared/types/chess";
import type { MoveStrategy } from "./MoveStrategy";

export class KingStrategy implements MoveStrategy {
  getLegalMoves(
    r: number,
    c: number,
    color: Color,
    board: Board,
  ): [number, number][] {
    const moves: [number, number][] = [];

    // Les 8 directions, une seule case
    const directions: [number, number][] = [
      [-1, 0],
      [+1, 0],
      [0, -1],
      [0, +1],
      [-1, -1],
      [-1, +1],
      [+1, -1],
      [+1, +1],
    ];

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      // Hors du plateau
      if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue;

      const target = board[nr][nc];

      // Case vide ou pièce adverse
      if (target === null || target[0] !== color) {
        moves.push([nr, nc]);
      }
    }

    return moves;
  }
}
