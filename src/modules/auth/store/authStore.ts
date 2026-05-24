import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/shared/api/auth.api'
import type { UserResponseDto, LoginBody, RegisterBody } from '@/shared/api/types'

interface AuthState {
  token: string | null
  user: UserResponseDto | null
  login:    (body: LoginBody)    => Promise<void>
  register: (body: RegisterBody) => Promise<void>
  logout:   () => void
  setUser:  (u: UserResponseDto) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: async (body) => {
        const r = await authApi.login(body)
        set({ token: r.token, user: r.user })
      },
      register: async (body) => {
        const r = await authApi.register(body)
        set({ token: r.token, user: r.user })
      },
      logout:  () => set({ token: null, user: null }),
      setUser: (u) => set({ user: u }),
    }),
    {
      name: 'chess-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
)
