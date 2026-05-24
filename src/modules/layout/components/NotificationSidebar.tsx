import { Swords, Trophy, X } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useNotificationStore, type AppNotification } from '@/modules/notifications/notificationStore'
import { notificationsApi } from '@/shared/api/notifications.api'
import { IconTile } from '@/shared/components/IconTile'

interface Props {
  open: boolean
  onClose: () => void
}

export function NotificationSidebar({ open, onClose }: Props) {
  const notifications = useNotificationStore((state) => state.notifications)
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead)
  const handleMarkAllAsRead = async () => {
    markAllAsRead()
    await notificationsApi.markAllAsRead().catch(() => undefined)
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[150] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 bottom-0 z-[200] flex w-[min(460px,100vw)] flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: 'var(--color-bg-2)', borderLeft: '1px solid var(--color-border)' }}
      >
        <div
          className="flex flex-shrink-0 items-center justify-between px-7 py-5"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <span className="font-display text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-text-primary">
            Notifications
          </span>
          <button
            onClick={onClose}
            className="-mr-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[#7d8490] transition-[background,color] duration-150 hover:bg-black/[0.18] hover:text-[#c6ccd5]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-5 py-8 text-sm text-[var(--color-text-muted)]">
              Aucune notification pour le moment.
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          )}
        </div>

        <div
          className="flex-shrink-0 px-7 py-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <button
            onClick={handleMarkAllAsRead}
            className="font-display text-[0.58rem] font-semibold tracking-[0.1em] uppercase text-text-muted hover:text-accent transition-colors border-none cursor-pointer"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>
    </>
  )
}

function NotificationItem({ notification }: { notification: AppNotification }) {
  const Icon = notification.kind === 'game' ? Swords : Trophy
  const navigate = useNavigate()
  const gameId = typeof notification.data?.gameId === 'string' ? notification.data.gameId : null

  return (
    <div
      className="flex cursor-pointer gap-4 px-7 py-4 transition-colors hover:bg-white/[0.03]"
      style={{ borderBottom: '1px solid var(--color-border)' }}
      onClick={() => {
        if (gameId) navigate(`/play?game=${gameId}`)
      }}
    >
      <IconTile icon={Icon} tone="gold" size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-display truncate text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[var(--color-text-primary)]">
            {notification.title}
          </span>
          {notification.unread && (
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--color-gold)]" />
          )}
        </div>
        <p className="line-clamp-2 font-serif text-[0.86rem] font-semibold leading-snug text-[var(--color-text-muted)]">
          {notification.description}
        </p>
        <span className="font-serif text-[0.76rem] font-semibold italic text-[var(--color-text-muted)]">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
    </div>
  )
}

function formatRelativeTime(value: string) {
  const diffMs = Math.max(0, Date.now() - new Date(value).getTime())
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) return "À l'instant"
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `Il y a ${diffHours} h`

  const diffDays = Math.floor(diffHours / 24)
  return `Il y a ${diffDays} j`
}
