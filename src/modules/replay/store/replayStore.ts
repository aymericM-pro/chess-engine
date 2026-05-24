import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Move, AnalysisEntry, GameResult, GameRecord } from '@/shared/types/chess'
import { DEFAULT_THEME_ID } from '../data/themes'
import { GAMES } from '@/modules/history/data/games'

interface ReplayState {
  moves: Move[]
  analysis: AnalysisEntry[]
  totalMoves: number
  currentGameId: string | null
  opening: string
  result: GameResult
  white: { name: string; elo: number }
  black: { name: string; elo: number }
  step: number
  themeId: string
  loadGame: (game: GameRecord) => void
  goTo: (step: number) => void
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  setTheme: (id: string) => void
}

function gameToState(game: GameRecord) {
  return {
    moves: game.moves,
    analysis: game.analysis,
    totalMoves: game.moves.length,
    currentGameId: game.id,
    opening: game.opening,
    result: game.result,
    white: game.white,
    black: game.black,
  }
}

const defaultGame = GAMES[0]

export const useReplayStore = create<ReplayState>()(
  persist(
    (set) => ({
      ...gameToState(defaultGame),
      step: 0,
      themeId: DEFAULT_THEME_ID,
      loadGame: (game) => set({ ...gameToState(game), step: 0 }),
      goTo: (step) => set((s) => ({ step: Math.max(0, Math.min(step, s.totalMoves)) })),
      next: () => set((s) => ({ step: Math.min(s.step + 1, s.totalMoves) })),
      prev: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),
      first: () => set({ step: 0 }),
      last: () => set((s) => ({ step: s.totalMoves })),
      setTheme: (id) => set({ themeId: id }),
    }),
    {
      name: 'chess-replay-store',
      partialize: (s) => ({ step: s.step, themeId: s.themeId, currentGameId: s.currentGameId }),
      merge: (persisted, current) => {
        const p = persisted as { step: number; themeId: string; currentGameId: string | null }
        const game = GAMES.find((g) => g.id === p.currentGameId) ?? defaultGame
        return { ...current, ...gameToState(game), step: p.step, themeId: p.themeId }
      },
    },
  ),
)
