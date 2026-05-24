import { api } from './client'
import type {
  CreateFriendRequestBody,
  FriendRequestResponseDto,
  FriendRequestsResponseDto,
  FriendResponseDto,
} from './types'

export const friendsApi = {
  list: () => api.get<FriendResponseDto[]>('/api/friends'),
  requests: () => api.get<FriendRequestsResponseDto>('/api/friends/requests'),
  request: (body: CreateFriendRequestBody) => api.post<FriendRequestResponseDto>('/api/friends/requests', body),
  accept: (requestId: string) => api.patch<FriendRequestResponseDto>(`/api/friends/requests/${requestId}/accept`, {}),
  decline: (requestId: string) => api.patch<FriendRequestResponseDto>(`/api/friends/requests/${requestId}/decline`, {}),
}
