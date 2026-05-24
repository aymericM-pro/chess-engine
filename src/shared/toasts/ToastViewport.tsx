import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useToastStore, type Toast, type ToastType } from './toastStore'

const TOAST_TONE: Record<ToastType, { color: string; bg: string; border: string; icon: ReactNode }> = {
  success: {
    color: 'var(--color-success)',
    bg: 'rgba(63,185,80,0.12)',
    border: 'rgba(63,185,80,0.34)',
    icon: <CheckCircle2 size={18} strokeWidth={2} />,
  },
  error: {
    color: '#fff',
    bg: '#9f2f2b',
    border: 'rgba(248,81,73,0.48)',
    icon: <AlertCircle size={18} strokeWidth={2} />,
  },
  info: {
    color: '#58a6ff',
    bg: 'rgba(88,166,255,0.12)',
    border: 'rgba(88,166,255,0.32)',
    icon: <Info size={18} strokeWidth={2} />,
  },
}

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((state) => state.removeToast)
  const [visible, setVisible] = useState(false)
  const tone = TOAST_TONE[toast.type]
  const isError = toast.type === 'error'

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setVisible(true), 20)
    const leaveTimer = window.setTimeout(() => setVisible(false), toast.duration - 180)
    const removeTimer = window.setTimeout(() => removeToast(toast.id), toast.duration)
    return () => {
      window.clearTimeout(enterTimer)
      window.clearTimeout(leaveTimer)
      window.clearTimeout(removeTimer)
    }
  }, [removeToast, toast.duration, toast.id])

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      style={{
        width: 'min(380px, calc(100vw - 32px))',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 14px',
        borderRadius: 10,
        border: `1px solid ${tone.border}`,
        background: isError ? 'linear-gradient(135deg, #9f2f2b, #7f2522)' : 'var(--color-bg-2)',
        color: isError ? '#fff' : 'var(--color-text-primary)',
        boxShadow: '0 18px 48px rgba(0,0,0,0.42)',
        transform: visible ? 'translateY(0)' : 'translateY(-8px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.18s ease, transform 0.18s ease',
        pointerEvents: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: isError ? 'rgba(255,255,255,0.14)' : tone.bg,
          border: `1px solid ${isError ? 'rgba(255,255,255,0.2)' : tone.border}`,
          color: tone.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {tone.icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35 }}>{toast.title}</div>
        {toast.message && (
          <div style={{ marginTop: 3, fontSize: 13, color: isError ? 'rgba(255,255,255,0.86)' : 'var(--color-text-muted)', lineHeight: 1.45 }}>
            {toast.message}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        aria-label="Fermer la notification"
        title="Fermer"
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          border: 'none',
          background: 'transparent',
          color: isError ? 'rgba(255,255,255,0.82)' : 'var(--color-text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isError ? 'rgba(255,255,255,0.16)' : 'var(--color-bg-3)'
          e.currentTarget.style.color = isError ? '#fff' : 'var(--color-text-primary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = isError ? 'rgba(255,255,255,0.82)' : 'var(--color-text-muted)'
        }}
      >
        <X size={15} strokeWidth={2.2} />
      </button>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: isError ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-3)',
        }}
      >
        <div
          style={{
            width: visible ? '0%' : '100%',
            height: '100%',
            background: isError ? 'rgba(255,255,255,0.72)' : tone.color,
            transition: visible ? `width ${toast.duration - 180}ms linear` : 'none',
          }}
        />
      </div>
    </div>
  )
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <div
      style={{
        position: 'fixed',
        top: 18,
        right: 18,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
