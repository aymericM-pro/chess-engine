import type { Board, Move, Piece } from '@/shared/types/chess'

export function idx(col: number, row: number): number {
  return row * 8 + col
}

export function startPos(): Board {
  const b: Board = new Array(64).fill(null)
  const backRank: Piece[] = ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
  backRank.forEach((p, c) => (b[idx(c, 7)] = p))
  for (let c = 0; c < 8; c++) b[idx(c, 6)] = 'wP'
  const blackRank: Piece[] = ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR']
  blackRank.forEach((p, c) => (b[idx(c, 0)] = p))
  for (let c = 0; c < 8; c++) b[idx(c, 1)] = 'bP'
  return b
}

export function applyMoves(moves: Move[], n: number): Board {
  const clamped = Math.max(0, Math.min(n, moves.length))
  const b = startPos()
  for (let i = 0; i < clamped; i++) {
    const m = moves[i]
    const fi = idx(m.f[0], m.f[1])
    const ti = idx(m.t[0], m.t[1])
    b[ti] = b[fi]
    b[fi] = null
  }
  return b
}
