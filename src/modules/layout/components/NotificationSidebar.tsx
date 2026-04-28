import { X, Trophy, Swords, Star } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

const notifications = [
  {
    id: 1,
    icon: Trophy,
    iconColor: 'text-gold',
    iconBg: 'bg-[rgba(210,153,34,0.12)]',
    title: 'Partie analysée',
    desc: 'Votre partie contre Votybe a été analysée avec succès.',
    time: 'Il y a 2 min',
    unread: true,
  },
  {
    id: 2,
    icon: Swords,
    iconColor: 'text-accent',
    iconBg: 'bg-[rgba(88,166,255,0.12)]',
    title: 'Défi reçu',
    desc: 'Votybe vous défie pour une revanche en 10 min.',
    time: 'Il y a 15 min',
    unread: true,
  },
  {
    id: 3,
    icon: Star,
    iconColor: 'text-success',
    iconBg: 'bg-[rgba(63,185,80,0.12)]',
    title: 'Nouveau record',
    desc: 'Vous avez atteint 250 ELO — nouveau record personnel.',
    time: 'Il y a 1 h',
    unread: false,
  },
]

export function NotificationSidebar({ open, onClose }: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[150] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 bottom-0 z-[200] w-80 flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: 'var(--color-bg-2)', borderLeft: '1px solid var(--color-border)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <span className="font-display text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-text-primary">
            Notifications
          </span>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors border-none cursor-pointer p-1 -mr-1"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.map((n) => {
            const Icon = n.icon
            return (
              <div
                key={n.id}
                className="flex gap-3 px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.iconBg}`}>
                  <Icon size={14} className={n.iconColor} />
                </div>
                <div className="flex flex-col gap-[3px] flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-[0.65rem] font-semibold tracking-[0.06em] text-text-primary truncate">
                      {n.title}
                    </span>
                    {n.unread && (
                      <span className="w-[6px] h-[6px] rounded-full bg-accent flex-shrink-0" />
                    )}
                  </div>
                  <p className="font-serif text-[0.78rem] text-text-muted leading-[1.5]">{n.desc}</p>
                  <span className="font-serif text-[0.68rem] text-text-muted italic">{n.time}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div
          className="px-5 py-3 flex-shrink-0"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <button className="font-display text-[0.58rem] font-semibold tracking-[0.1em] uppercase text-text-muted hover:text-accent transition-colors border-none cursor-pointer">
            Tout marquer comme lu
          </button>
        </div>
      </div>
    </>
  )
}
