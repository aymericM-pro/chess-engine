import type { Board, Color } from "@/shared/types/chess";
import type { MoveStrategy } from "./MoveStrategy";

export class PawnStrategy implements MoveStrategy {
  getLegalMoves(
    r: number,
    c: number,
    color: Color,
    board: Board,
  ): [number, number][] {
    const moves: [number, number][] = [];
    const dir = color === "w" ? -1 : 1;
    const startRow = color === "w" ? 6 : 1;
    const opponent: Color = color === "w" ? "b" : "w";

    // Avance d'une case si la case est vide
    if (board[r + dir]?.[c] === null) {
      moves.push([r + dir, c]);

      // Double pas depuis la position initiale
      if (r === startRow && board[r + 2 * dir]?.[c] === null) {
        moves.push([r + 2 * dir, c]);
      }
    }

    // Capture diagonale gauche
    const diagLeft = board[r + dir]?.[c - 1];
    if (diagLeft && diagLeft[0] === opponent) {
      moves.push([r + dir, c - 1]);
    }

    // Capture diagonale droite
    const diagRight = board[r + dir]?.[c + 1];
    if (diagRight && diagRight[0] === opponent) {
      moves.push([r + dir, c + 1]);
    }

    return moves;
  }
}
