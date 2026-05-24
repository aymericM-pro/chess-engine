import { Bell, Check, Loader2, UserCheck, UserRoundPlus, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useGameInviteStore, type FriendNotification, type GameInvite } from '@/modules/gameInvites/gameInviteStore'
import { gamesApi } from '@/shared/api/games.api'
import { notificationsApi } from '@/shared/api/notifications.api'
import { getErrorMessage } from '@/shared/api/errorMessage'
import { useToastStore } from '@/shared/toasts/toastStore'
import { IconTile } from '@/shared/components/IconTile'

interface Props {
  open: boolean
  onClose: () => void
}

export function NotificationSidebar({ open, onClose }: Props) {
  const invites = useGameInviteStore((state) => state.invites)
  const friendNotifications = useGameInviteStore((state) => state.friendNotifications)
  const markAllAsRead = useGameInviteStore((state) => state.markAllAsRead)
  const hasNotifications = invites.length > 0 || friendNotifications.length > 0

  const handleClose = () => {
    markAllAsRead()
    void notificationsApi.markAllAsRead().catch(() => undefined)
    onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[150] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={handleClose}
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
            onClick={handleClose}
            className="-mr-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[#7d8490] transition-[background,color] duration-150 hover:bg-black/[0.18] hover:text-[#c6ccd5]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!hasNotifications ? (
            <div className="flex min-h-full items-center justify-center px-7 py-10 text-center">
              <div className="max-w-[260px]">
                <div className="mx-auto mb-4 flex justify-center">
                  <IconTile icon={Bell} tone="gold" size="md" />
                </div>
                <p className="font-display text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--color-text-primary)]">
                  Aucune invitation
                </p>
                <p className="mt-2 font-serif text-[0.86rem] font-semibold leading-snug text-[var(--color-text-muted)]">
                  Les demandes de partie et d&apos;ami apparaîtront ici en temps réel.
                </p>
              </div>
            </div>
          ) : (
            <>
              {invites.map((invite) => (
                <GameInviteItem key={invite.gameId} invite={invite} onClose={handleClose} />
              ))}
              {friendNotifications.map((notification) => (
                <FriendNotificationItem key={notification.id} notification={notification} onClose={handleClose} />
              ))}
            </>
          )}
        </div>

        <div
          className="flex-shrink-0 px-7 py-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <span className="font-display text-[0.58rem] font-semibold tracking-[0.1em] uppercase text-text-muted">
            Centre de notifications
          </span>
        </div>
      </div>
    </>
  )
}

function FriendNotificationItem({ notification, onClose }: { notification: FriendNotification; onClose: () => void }) {
  const navigate = useNavigate()
  const isRequest = notification.kind === 'friend.request'
  const accepted = notification.kind === 'friend.accepted'
  const Icon = isRequest ? UserRoundPlus : UserCheck
  const title = isRequest ? "Demande d'ami" : accepted ? 'Demande acceptée' : 'Demande refusée'
  const message = isRequest
    ? `${notification.request.requester.username} vous a envoyé une demande d'ami.`
    : accepted
      ? `${notification.request.addressee.username} a accepté votre demande d'ami.`
      : `${notification.request.addressee.username} a refusé votre demande d'ami.`

  const handleOpen = () => {
    onClose()
    navigate('/friends')
  }

  return (
    <div
      className="flex gap-4 px-7 py-4"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <IconTile icon={Icon} tone="gold" size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-display truncate text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[var(--color-text-primary)]">
            {title}
          </span>
          {notification.unread && (
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--color-gold)]" />
          )}
        </div>
        <p className="font-serif text-[0.86rem] font-semibold leading-snug text-[var(--color-text-muted)]">
          {message}
        </p>
        <button
          type="button"
          onClick={handleOpen}
          className="mt-1 flex h-9 w-fit cursor-pointer items-center gap-2 rounded-lg border border-[rgba(201,169,110,0.34)] bg-[rgba(201,169,110,0.12)] px-3 text-xs font-black text-[var(--color-gold)] transition hover:bg-[rgba(201,169,110,0.18)]"
        >
          <Check size={14} />
          Voir les amis
        </button>
      </div>
    </div>
  )
}

function GameInviteItem({ invite, onClose }: { invite: GameInvite; onClose: () => void }) {
  const [accepting, setAccepting] = useState(false)
  const navigate = useNavigate()
  const removeInvite = useGameInviteStore((state) => state.removeInvite)
  const addToast = useToastStore((state) => state.addToast)

  const handleAccept = async () => {
    setAccepting(true)
    try {
      const game = await gamesApi.acceptInvite(invite.gameId)
      removeInvite(invite.gameId)
      onClose()
      navigate(`/play?game=${game.id}`)
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Invitation impossible',
        message: getErrorMessage(err, "Impossible de rejoindre cette partie."),
      })
    } finally {
      setAccepting(false)
    }
  }

  return (
    <div
      className="flex gap-4 px-7 py-4"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      <IconTile icon={Bell} tone="gold" size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-display truncate text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[var(--color-text-primary)]">
            Demande de partie
          </span>
          {invite.unread && (
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--color-gold)]" />
          )}
        </div>
        <p className="font-serif text-[0.86rem] font-semibold leading-snug text-[var(--color-text-muted)]">
          {invite.from.username} vous invite à jouer une partie en ligne.
        </p>
        <button
          type="button"
          disabled={accepting}
          onClick={handleAccept}
          className="mt-1 flex h-9 w-fit cursor-pointer items-center gap-2 rounded-lg border border-[rgba(201,169,110,0.34)] bg-[rgba(201,169,110,0.12)] px-3 text-xs font-black text-[var(--color-gold)] transition hover:bg-[rgba(201,169,110,0.18)] disabled:cursor-default disabled:opacity-60"
        >
          {accepting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          Rejoindre
        </button>
      </div>
    </div>
  )
}
