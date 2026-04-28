import { describe, it, expect } from 'vitest'
import { idx, startPos, applyMoves } from './boardEngine'
import { MOVES } from '../data/moves'

describe('idx', () => {
  it('(0,0) = 0', () => expect(idx(0, 0)).toBe(0))
  it('(7,7) = 63', () => expect(idx(7, 7)).toBe(63))
  it('(4,6) = 52', () => expect(idx(4, 6)).toBe(52))
  it('(0,7) = 56', () => expect(idx(0, 7)).toBe(56))
})

describe('startPos', () => {
  it('has 64 squares', () => expect(startPos()).toHaveLength(64))
  it('white king on e1', () => expect(startPos()[idx(4, 7)]).toBe('wK'))
  it('black king on e8', () => expect(startPos()[idx(4, 0)]).toBe('bK'))
  it('white queen on d1', () => expect(startPos()[idx(3, 7)]).toBe('wQ'))
  it('black rook on a8', () => expect(startPos()[idx(0, 0)]).toBe('bR'))
  it('white pawns on row 6', () => {
    for (let c = 0; c < 8; c++) expect(startPos()[idx(c, 6)]).toBe('wP')
  })
  it('black pawns on row 1', () => {
    for (let c = 0; c < 8; c++) expect(startPos()[idx(c, 1)]).toBe('bP')
  })
  it('center squares are empty', () => {
    for (let r = 2; r < 6; r++)
      for (let c = 0; c < 8; c++) expect(startPos()[idx(c, r)]).toBeNull()
  })
})

describe('applyMoves', () => {
  it('n=0 returns startPos', () => {
    expect(applyMoves(MOVES, 0)).toEqual(startPos())
  })

  it('n=1 (e4): pawn moves from e2 to e4', () => {
    const b = applyMoves(MOVES, 1)
    expect(b[idx(4, 6)]).toBeNull()
    expect(b[idx(4, 4)]).toBe('wP')
  })

  it('n=2 (e5): black pawn moves from e7 to e5', () => {
    const b = applyMoves(MOVES, 2)
    expect(b[idx(4, 1)]).toBeNull()
    expect(b[idx(4, 3)]).toBe('bP')
  })

  it('n=35 (Bxd7): white bishop ends on d7', () => {
    const b = applyMoves(MOVES, 35)
    expect(b[idx(3, 1)]).toBe('wB')
  })

  it('clamps n < 0 to 0', () => {
    expect(applyMoves(MOVES, -5)).toEqual(startPos())
  })

  it('clamps n > 35 to 35', () => {
    expect(applyMoves(MOVES, 100)).toEqual(applyMoves(MOVES, 35))
  })
})
