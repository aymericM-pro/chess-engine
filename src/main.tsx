import './i18n/index'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { setTokenGetter, setLogoutCallback } from '@/shared/api/client'
import { useAuthStore } from '@/modules/auth/store/authStore'
import { ToastViewport } from '@/shared/toasts/ToastViewport'

setTokenGetter(() => useAuthStore.getState().token)
setLogoutCallback(() => useAuthStore.getState().logout())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastViewport />
  </StrictMode>,
)
