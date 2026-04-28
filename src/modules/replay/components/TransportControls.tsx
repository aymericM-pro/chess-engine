import { useRef } from 'react'
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useReplayStore } from '../store/replayStore'
import { MOVES, TOTAL_MOVES } from '../data/moves'

interface Props {
  width: number
}

export function TransportControls({ width }: Props) {
  const { t } = useTranslation()
  const step = useReplayStore((s) => s.step)
  const { goTo, next, prev, first, last } = useReplayStore()
  const progressRef = useRef<HTMLDivElement>(null)

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const n = Math.round(((e.clientX - rect.left) / rect.width) * TOTAL_MOVES)
    goTo(n)
  }

  const btnClass =
    'flex items-center justify-center w-10 h-[38px] rounded-lg border bg-bg-2 border-border text-text-primary cursor-pointer flex-shrink-0 transition-all duration-150 hover:bg-bg-3 hover:border-accent active:scale-91 disabled:opacity-25 disabled:cursor-default'

  let statusContent: React.ReactNode
  if (step === 0) {
    statusContent = t('controls.statusInitial')
  } else if (step === TOTAL_MOVES) {
    statusContent = (
      <>
        <b className="text-text-primary not-italic font-semibold">Bxd7</b>
        {' · '}
        <span className="text-success not-italic font-semibold">1-0 {t('player.white')} gagnent</span>
      </>
    )
  } else {
    const m = MOVES[step - 1]
    const whoLabel = step % 2 === 1
      ? <b className="text-text-primary not-italic font-semibold">{t('player.white')}</b>
      : <b className="text-text-primary not-italic font-semibold">{t('player.black')}</b>
    const hasCapture = m.s.includes('x')
    statusContent = (
      <>
        {t('controls.statusMove', { step, who: '', san: '' }).split('·')[0].trim()}
        {' · '}{whoLabel}{' · '}
        <b className="text-text-primary not-italic font-semibold">{m.s}</b>
        {hasCapture && <span className="text-danger"> ×</span>}
      </>
    )
  }

  return (
    <div style={{ width }}>
      <div className="flex items-center gap-[6px] mt-[10px]">
        <button className={btnClass} onClick={first} disabled={step === 0} aria-label="First">
          <ChevronsLeft size={16} />
        </button>
        <button className={btnClass} onClick={prev} disabled={step === 0} aria-label="Previous">
          <ChevronLeft size={16} />
        </button>
        <div
          ref={progressRef}
          className="flex-1 h-[5px] rounded-[3px] bg-bg-3 border border-border overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full rounded-[3px] min-w-[2px] transition-[width] duration-[180ms]"
            style={{
              width: `${(step / TOTAL_MOVES) * 100}%`,
              background: 'linear-gradient(90deg, var(--color-accent), #79c0ff)',
            }}
          />
        </div>
        <button className={btnClass} onClick={next} disabled={step === TOTAL_MOVES} aria-label="Next">
          <ChevronRight size={16} />
        </button>
        <button className={btnClass} onClick={last} disabled={step === TOTAL_MOVES} aria-label="Last">
          <ChevronsRight size={16} />
        </button>
      </div>
      <div
        className="font-serif italic text-[0.88rem] text-text-muted mt-[7px] pl-5 h-5"
      >
        {statusContent}
      </div>
    </div>
  )
}
