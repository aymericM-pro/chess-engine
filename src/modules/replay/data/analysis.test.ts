import { describe, it, expect } from 'vitest'
import { ANALYSIS } from './analysis'

const VALID_PHASES = new Set(['opening', 'middle', 'end'])
const VALID_TAGS = new Set(['attack', 'defense', 'strategy', 'tactic', 'opening', 'blunder'])

describe('ANALYSIS data', () => {
  it('has 36 entries (35 moves + initial position)', () => expect(ANALYSIS).toHaveLength(36))

  it('every entry has a valid phase', () => {
    ANALYSIS.forEach((a) => expect(VALID_PHASES.has(a.phase)).toBe(true))
  })

  it('every entry has non-empty san, who, text', () => {
    ANALYSIS.forEach((a) => {
      expect(a.san.length).toBeGreaterThan(0)
      expect(a.who.length).toBeGreaterThan(0)
      expect(a.text.length).toBeGreaterThan(0)
    })
  })

  it('every tag has a valid type and non-empty label', () => {
    ANALYSIS.forEach((a) => {
      a.tags.forEach(([type, label]) => {
        expect(VALID_TAGS.has(type)).toBe(true)
        expect(label.length).toBeGreaterThan(0)
      })
    })
  })

  it('first entry is initial position', () => expect(ANALYSIS[0].san).toBe('—'))
  it('last entry is Bxd7', () => expect(ANALYSIS[35].san).toBe('Bxd7'))
})
