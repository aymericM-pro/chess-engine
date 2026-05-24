import { create } from 'zustand';
import { playersApi } from '@/shared/api/players.api';
import type { PlayerResponseDto } from '@/shared/api/types';

interface PlayerState {
  player: PlayerResponseDto | null
  fetchPlayer: (id: string) => Promise<void>
  setPlayer: (player: PlayerResponseDto) => void
  clearPlayer: () => void
}

export const usePlayerStore = create<PlayerState>()((set) => ({
  player: null,

  fetchPlayer: async (id: string) => {
    const player = await playersApi.getOne(id);
    set({ player });
  },

  setPlayer: (player: PlayerResponseDto) => set({ player }),

  clearPlayer: () => set({ player: null }),
}));
