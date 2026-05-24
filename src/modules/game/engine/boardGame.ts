import type { Board, Piece, Color, PieceType } from "@/shared/types/chess";
import { getMoveStrategy } from "../strategy/MoveStrategyMap";

export type PromotionPieceType = "Q" | "R" | "B" | "N";

export interface BoardGameState {
  board: Board;
  selected: { row: number; col: number } | null;
  legalMoves: [number, number][];
  turn: Color;
  inCheck: boolean;
  pendingPromotion: { row: number; col: number; color: Color } | null;
  movedPieces: Set<string>;
}

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const rcToAlg = (r: number, c: number) => `${FILES[c]}${8 - r}`;

export const INITIAL_STATE: BoardGameState = {
  board: (() => {
    const backRank = ["R", "N", "B", "Q", "K", "B", "N", "R"] as const;
    const empty = (): (Piece | null)[] => Array.from({ length: 8 }, () => null);
    return [
      backRank.map((t) => `b${t}` as Piece),
      Array.from({ length: 8 }, (): Piece => "bP"),
      empty(),
      empty(),
      empty(),
      empty(),
      Array.from({ length: 8 }, (): Piece => "wP"),
      backRank.map((t) => `w${t}` as Piece),
    ] as Board;
  })(),
  selected: null,
  legalMoves: [],
  turn: "w",
  inCheck: false,
  pendingPromotion: null,
  movedPieces: new Set(),
};

// Vérifie si une case est attaquée par une couleur donnée.
// Pour le roi, on vérifie ses 8 cases directement (évite la récursion avec le roque).
function isSquareAttacked(
  board: Board,
  r: number,
  c: number,
  byColor: Color,
): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece || piece[0] !== byColor) continue;

      const type = piece[1] as PieceType;
      let moves: [number, number][];

      if (type === "K") {
        moves = (
          [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1],
            [1, -1],
            [1, 0],
            [1, 1],
          ] as [number, number][]
        )
          .map(([dr, dc]) => [row + dr, col + dc] as [number, number])
          .filter(([nr, nc]) => nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7);
      } else {
        const strategy = getMoveStrategy(type);
        moves = strategy
          ? strategy.getLegalMoves(row, col, byColor, board)
          : [];
      }

      if (moves.some(([mr, mc]) => mr === r && mc === c)) return true;
    }
  }
  return false;
}

function isInCheck(board: Board, color: Color): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === `${color}K`) {
        const opponent: Color = color === "w" ? "b" : "w";
        return isSquareAttacked(board, r, c, opponent);
      }
    }
  }
  return false;
}

function filterLegal(
  moves: [number, number][],
  board: Board,
  from: [number, number],
  color: Color,
): [number, number][] {
  return moves.filter(([tr, tc]) => {
    const next = board.map((row) => [...row]) as Board;
    next[tr][tc] = next[from[0]][from[1]];
    next[from[0]][from[1]] = null;
    return !isInCheck(next, color);
  });
}

function computeLegalMoves(
  piece: Piece,
  r: number,
  c: number,
  board: Board,
): [number, number][] {
  const strategy = getMoveStrategy(piece[1] as PieceType);
  const raw = strategy
    ? strategy.getLegalMoves(r, c, piece[0] as Color, board)
    : [];
  return filterLegal(raw, board, [r, c], piece[0] as Color);
}

// Retourne les cases de roque disponibles pour la couleur donnée.
function getCastlingMoves(
  board: Board,
  color: Color,
  movedPieces: Set<string>,
): [number, number][] {
  const moves: [number, number][] = [];
  const row = color === "w" ? 7 : 0;
  const kingKey = color === "w" ? "e1" : "e8";
  const opponent: Color = color === "w" ? "b" : "w";

  if (movedPieces.has(kingKey)) return moves;
  if (isSquareAttacked(board, row, 4, opponent)) return moves;

  // Petit roque (côté roi)
  const kRookKey = color === "w" ? "h1" : "h8";
  if (
    !movedPieces.has(kRookKey) &&
    board[row][5] === null &&
    board[row][6] === null &&
    !isSquareAttacked(board, row, 5, opponent) &&
    !isSquareAttacked(board, row, 6, opponent)
  ) {
    moves.push([row, 6]);
  }

  // Grand roque (côté dame)
  const qRookKey = color === "w" ? "a1" : "a8";
  if (
    !movedPieces.has(qRookKey) &&
    board[row][3] === null &&
    board[row][2] === null &&
    board[row][1] === null &&
    !isSquareAttacked(board, row, 3, opponent) &&
    !isSquareAttacked(board, row, 2, opponent)
  ) {
    moves.push([row, 2]);
  }

  return moves;
}

function allMovesForColor(
  board: Board,
  color: Color,
  movedPieces: Set<string>,
): [number, number][] {
  const moves: [number, number][] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece[0] !== color) continue;
      const pieceMoves = computeLegalMoves(piece, r, c, board);
      if (piece[1] === "K") {
        pieceMoves.push(...getCastlingMoves(board, color, movedPieces));
      }
      moves.push(...pieceMoves);
    }
  }
  return moves;
}

export type GameStatus = "playing" | "check" | "checkmate" | "stalemate";

export function getGameStatus(
  board: Board,
  turn: Color,
  movedPieces: Set<string>,
): GameStatus {
  const hasAnyMove = allMovesForColor(board, turn, movedPieces).length > 0;
  const inCheck = isInCheck(board, turn);
  if (hasAnyMove) return inCheck ? "check" : "playing";
  return inCheck ? "checkmate" : "stalemate";
}

function buildNextState(
  next: Board,
  newTurn: Color,
  pendingPromotion: BoardGameState["pendingPromotion"],
  movedPieces: Set<string>,
): BoardGameState {
  const status = pendingPromotion
    ? "playing"
    : getGameStatus(next, newTurn, movedPieces);
  return {
    board: next,
    selected: null,
    legalMoves: [],
    turn: newTurn,
    inCheck: status === "check" || status === "checkmate",
    pendingPromotion,
    movedPieces,
  };
}

export function clickCell(
  state: BoardGameState,
  r: number,
  c: number,
): BoardGameState {
  const { board, selected, legalMoves, turn, movedPieces } = state;
  const piece = board[r][c];

  if (!selected) {
    if (!piece || piece[0] !== turn) return state;
    const moves = computeLegalMoves(piece, r, c, board);
    const allMoves =
      piece[1] === "K"
        ? [...moves, ...getCastlingMoves(board, turn, movedPieces)]
        : moves;
    return { ...state, selected: { row: r, col: c }, legalMoves: allMoves };
  }

  const { row: sr, col: sc } = selected;
  const deselect = { ...state, selected: null, legalMoves: [] };

  if (sr === r && sc === c) return deselect;

  const isLegal = legalMoves.some(([lr, lc]) => lr === r && lc === c);
  if (isLegal) {
    const moving = board[sr][sc];
    const next = board.map((row) => [...row]) as Board;
    next[r][c] = moving;
    next[sr][sc] = null;

    const newMoved = new Set(movedPieces);
    newMoved.add(rcToAlg(sr, sc));

    // Roque : déplacer aussi la tour
    if (moving && moving[1] === "K" && Math.abs(c - sc) === 2) {
      if (c === 6) {
        next[sr][5] = next[sr][7];
        next[sr][7] = null;
        newMoved.add(turn === "w" ? "h1" : "h8");
      } else if (c === 2) {
        next[sr][3] = next[sr][0];
        next[sr][0] = null;
        newMoved.add(turn === "w" ? "a1" : "a8");
      }
    }

    const isPromotion =
      (moving === "wP" && r === 0) || (moving === "bP" && r === 7);
    const nextTurn: Color = turn === "w" ? "b" : "w";

    return buildNextState(
      next,
      isPromotion ? turn : nextTurn,
      isPromotion ? { row: r, col: c, color: turn } : null,
      newMoved,
    );
  }

  const target = board[r][c];
  if (target && target[0] === turn) {
    const moves = computeLegalMoves(target, r, c, board);
    const allMoves =
      target[1] === "K"
        ? [...moves, ...getCastlingMoves(board, turn, movedPieces)]
        : moves;
    return { ...state, selected: { row: r, col: c }, legalMoves: allMoves };
  }

  return deselect;
}

export function promote(
  state: BoardGameState,
  pieceType: PromotionPieceType,
): BoardGameState {
  const { board, pendingPromotion, turn, movedPieces } = state;
  if (!pendingPromotion) return state;

  const { row, col, color } = pendingPromotion;
  const next = board.map((r) => [...r]) as Board;
  next[row][col] = `${color}${pieceType}` as Piece;

  const nextTurn: Color = turn === "w" ? "b" : "w";
  return buildNextState(next, nextTurn, null, movedPieces);
}
