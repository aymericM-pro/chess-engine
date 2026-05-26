import { Bell, Check, CircleX, Loader2, UserCheck, UserRoundPlus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useGameInviteStore, type FriendNotification, type GameInvite } from '@/modules/gameInvites/gameInviteStore'
import { gamesApi } from '@/shared/api/games.api'
import { notificationsApi } from '@/shared/api/notifications.api'
import { getErrorMessage } from '@/shared/api/errorMessage'
import { useToastStore } from '@/shared/toasts/toastStore'
import { IconTile } from '@/shared/components/IconTile'
import { Button } from '@/shared/components/Button'
import { useSidebar, type SidebarContentProps } from '@/shared/components/Sidebar'

export function NotificationSidebar({ closeSidebar }: SidebarContentProps) {
  const invites = useGameInviteStore((state) => state.invites)
  const friendNotifications = useGameInviteStore((state) => state.friendNotifications)
  const hasNotifications = invites.length > 0 || friendNotifications.length > 0

  return (
    <>
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
                <GameInviteItem key={invite.gameId} invite={invite} onClose={closeSidebar} />
              ))}
              {friendNotifications.map((notification) => (
                <FriendNotificationItem key={notification.id} notification={notification} onClose={closeSidebar} />
              ))}
            </>
          )}
    </>
  )
}

export function useOpenNotificationSidebar() {
  const { openSidebar } = useSidebar()
  const markAllAsRead = useGameInviteStore((state) => state.markAllAsRead)

  return () => openSidebar(NotificationSidebar, {}, {
    title: "Notifications",
    closeIcon: <CircleX size={18} />,
    closeLabel: "Fermer les notifications",
    width: 460,
    bodyClassName: "p-0",
    footer: (
      <span className="font-display text-[0.58rem] font-semibold tracking-[0.1em] uppercase text-text-muted">
        Centre de notifications
      </span>
    ),
    onClose: () => {
      markAllAsRead()
      void notificationsApi.markAllAsRead().catch(() => undefined)
    },
  })
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
        <Button
          variant="play-rules"
          onClick={handleOpen}
          className="mt-1 h-9 w-fit px-3 text-xs font-black"
          icon={<Check size={14} />}
          label="Voir les amis"
        />
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
        <Button
          variant="play-rules"
          disabled={accepting}
          onClick={handleAccept}
          className="mt-1 h-9 w-fit px-3 text-xs font-black disabled:cursor-default disabled:opacity-60"
          icon={accepting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          label="Rejoindre"
        />
      </div>
    </div>
  )
}
