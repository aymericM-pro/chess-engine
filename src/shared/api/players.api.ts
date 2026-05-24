import { api } from './client'
import type { PlayerResponseDto, GameResponseDto, CreateGameBody, PatchPlayerBody } from './types'

export interface CreatePlayerBody { username: string; elo?: number; rating?: string }

export const playersApi = {
  getAll:     ()                                    => api.get<PlayerResponseDto[]>('/api/players'),
  getOne:     (id: string)                          => api.get<PlayerResponseDto>(`/api/players/${id}`),
  create:     (body: CreatePlayerBody)              => api.post<PlayerResponseDto>('/api/players', body),
  patch:      (id: string, body: PatchPlayerBody)   => api.patch<PlayerResponseDto>(`/api/players/${id}`, body),
  remove:     (id: string)                          => api.delete<void>(`/api/players/${id}`),
  createGame: (id: string, body: CreateGameBody)    => api.post<GameResponseDto>(`/api/players/${id}/games`, body),
}
