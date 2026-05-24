import { api } from './client'
import type { UserResponseDto, UpdateUserBody, PatchUserBody, ChangePasswordBody } from './types'

export const usersApi = {
  getAll:  ()                                => api.get<UserResponseDto[]>('/api/users'),
  getOne:  (id: string)                      => api.get<UserResponseDto>(`/api/users/${id}`),
  update:  (id: string, body: UpdateUserBody) => api.put<UserResponseDto>(`/api/users/${id}`, body),
  patch:   (id: string, body: PatchUserBody)  => api.patch<UserResponseDto>(`/api/users/${id}`, body),
  changePassword: (body: ChangePasswordBody)  => api.patch<void>('/api/users/me/password', body),
  remove:  (id: string)                      => api.delete<void>(`/api/users/${id}`),
}
