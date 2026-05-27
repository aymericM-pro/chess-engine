import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuthStore } from '../store/authStore'
import { Route } from '@/shared/services/routes'

export function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()

  if (!token) return <Navigate to={Route.Login} replace state={{ from: location }} />
  return <>{children}</>
}

export function RequireGuest({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname ?? Route.Play

  if (token) return <Navigate to={redirectTo} replace />
  return <>{children}</>
}
