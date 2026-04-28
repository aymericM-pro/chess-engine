import type { Board, Color } from "@/shared/types/chess";
import type { MoveStrategy } from "./MoveStrategy";

export class BishopStrategy implements MoveStrategy {
  getLegalMoves(
    r: number,
    c: number,
    color: Color,
    board: Board,
  ): [number, number][] {
    const moves: [number, number][] = [];

    // Les 4 diagonales
    const directions: [number, number][] = [
      [-1, -1],
      [-1, +1],
      [+1, -1],
      [+1, +1],
    ];

    for (const [dr, dc] of directions) {
      let nr = r + dr;
      let nc = c + dc;

      while (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
        const target = board[nr][nc];

        if (target === null) {
          // Case vide : coup légal, on continue
          moves.push([nr, nc]);
        } else if (target[0] !== color) {
          // Pièce adverse : capture possible, mais on s'arrête
          moves.push([nr, nc]);
          break;
        } else {
          // Pièce alliée : on s'arrête sans capturer
          break;
        }

        nr += dr;
        nc += dc;
      }
    }

    return moves;
  }
}
