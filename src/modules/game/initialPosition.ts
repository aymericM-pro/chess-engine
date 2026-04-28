import type { Board } from "@/shared/types/chess";

export const INITIAL_BOARD: Board = [
  // row 0 — rang 8 (noir)
  ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
  // row 1 — pions noirs
  ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
  // rows 2-5 — vides
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  // row 6 — pions blancs
  ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
  // row 7 — rang 1 (blanc)
  ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"],
];
