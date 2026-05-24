import { api } from './client'
import type { AuthResponseDto, ForgotPasswordBody, ForgotPasswordResponseDto, LoginBody, RegisterBody, ResetPasswordBody, ResetPasswordResponseDto } from './types'

export const authApi = {
  login:          (body: LoginBody)           => api.post<AuthResponseDto>('/api/auth/login', body),
  register:       (body: RegisterBody)        => api.post<AuthResponseDto>('/api/auth/register', body),
  forgotPassword: (body: ForgotPasswordBody)  => api.post<ForgotPasswordResponseDto>('/api/auth/forgot-password', body),
  resetPassword:  (body: ResetPasswordBody)   => api.post<ResetPasswordResponseDto>('/api/auth/reset-password', body),
}
