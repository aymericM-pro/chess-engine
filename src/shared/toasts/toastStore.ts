import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration: number
}

type ToastInput = Omit<Toast, 'id' | 'duration'> & { duration?: number }

interface ToastState {
  toasts: Toast[]
  addToast: (toast: ToastInput) => string
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id,
          duration: toast.duration ?? (toast.type === 'error' ? 6500 : 4200),
        },
      ].slice(-4),
    }))
    return id
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },
}))
