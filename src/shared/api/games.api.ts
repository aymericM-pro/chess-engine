import { api } from './client'
import type { GameResponseDto, CreateGameBody, PlayMoveBody, GameReportUploadResponse } from './types'

export const gamesApi = {
  getAll:      ()                       => api.get<GameResponseDto[]>('/api/games'),
  getOne:      (id: string)             => api.get<GameResponseDto>(`/api/games/${id}`),
  create:      (body: CreateGameBody)   => api.post<GameResponseDto>('/api/games', body),
  playMove:    (id: string, body: PlayMoveBody) => api.post<GameResponseDto>(`/api/games/${id}/moves`, body),
  simulate:    (id: string)             => api.post<GameResponseDto>(`/api/games/${id}/simulate`, {}),
  resign:      (id: string)             => api.post<GameResponseDto>(`/api/games/${id}/resign`, {}),
  draw:        (id: string)             => api.post<GameResponseDto>(`/api/games/${id}/draw`, {}),
  drawAccept:  (id: string)             => api.post<GameResponseDto>(`/api/games/${id}/draw/accept`, {}),
  drawDecline: (id: string)             => api.post<GameResponseDto>(`/api/games/${id}/draw/decline`, {}),
  generateReport: (id: string)          => api.post<GameReportUploadResponse>(`/api/games/${id}/report`, {}),
  getReport:   (id: string, token: string) =>
    fetch(`http://localhost:3000/api/games/${id}/report`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
}
