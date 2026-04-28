import { describe, it, expect } from 'vitest'
import { MOVES, TOTAL_MOVES } from './moves'

describe('MOVES data', () => {
  it('has 35 moves', () => expect(MOVES).toHaveLength(35))
  it('TOTAL_MOVES equals 35', () => expect(TOTAL_MOVES).toBe(35))
  it('every move has a SAN string', () => {
    MOVES.forEach((m) => expect(typeof m.s).toBe('string'))
  })
  it('every move has valid from/to coordinates', () => {
    MOVES.forEach((m) => {
      expect(m.f).toHaveLength(2)
      expect(m.t).toHaveLength(2)
      ;[...m.f, ...m.t].forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(7)
      })
    })
  })
  it('first move is e4', () => expect(MOVES[0].s).toBe('e4'))
  it('last move is Bxd7', () => expect(MOVES[34].s).toBe('Bxd7'))
})
