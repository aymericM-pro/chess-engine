import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TOTAL_MOVES } from '../data/moves'
import { DEFAULT_THEME_ID } from '../data/themes'

interface ReplayState {
  step: number
  themeId: string
  goTo: (step: number) => void
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  setTheme: (id: string) => void
}

export const useReplayStore = create<ReplayState>()(
  persist(
    (set) => ({
      step: 0,
      themeId: DEFAULT_THEME_ID,
      goTo: (step) => set({ step: Math.max(0, Math.min(step, TOTAL_MOVES)) }),
      next: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_MOVES) })),
      prev: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),
      first: () => set({ step: 0 }),
      last: () => set({ step: TOTAL_MOVES }),
      setTheme: (id) => set({ themeId: id }),
    }),
    {
      name: 'chess-replay-store',
      partialize: (s) => ({ step: s.step, themeId: s.themeId }),
    },
  ),
)
