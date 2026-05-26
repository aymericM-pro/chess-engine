import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useReplayStore } from '../store/replayStore'
import { MOVES, TOTAL_MOVES } from '../data/moves'
import { Button } from '@/shared/components/Button'

export function MoveList() {
  const { t } = useTranslation()
  const step = useReplayStore((s) => s.step)
  const goTo = useReplayStore((s) => s.goTo)
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [step])

  const pairs = Math.ceil(TOTAL_MOVES / 2)

  return (
    <div className="bg-bg-2 border border-border rounded-xl overflow-hidden flex flex-col flex-1 min-h-0">
      <div className="py-[9px] px-[14px] font-display text-[0.6rem] font-semibold tracking-[0.12em] uppercase text-text-muted border-b border-border flex items-center gap-2 flex-shrink-0">
        {t('movelist.heading')}
        <span className="bg-[rgba(118,150,86,0.12)] border border-[rgba(118,150,86,0.25)] text-success rounded-[5px] px-[7px] py-[1px] text-[0.55rem] font-semibold">
          {t('movelist.opening')}
        </span>
      </div>

      <div
        className="overflow-y-auto flex-1 min-h-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-bg-3) transparent' }}
      >
        {Array.from({ length: pairs }, (_, i) => {
          const wStep = i * 2 + 1
          const bStep = i * 2 + 2
          const wActive = step === wStep
          const bActive = step === bStep

          return (
            <div
              key={i}
              className={`grid items-stretch ${i % 2 === 0 ? '' : 'bg-white/[0.012]'}`}
              style={{ gridTemplateColumns: '26px 1fr 1fr' }}
            >
              <div className="flex items-center justify-end px-[7px] text-[0.65rem] text-text-muted font-medium border-r border-border font-serif">
                {i + 1}
              </div>
              <Button
                ref={wActive ? activeRef : undefined}
                variant="menu-item"
                className={`justify-start rounded-none border-b border-[rgba(255,255,255,0.05)] px-[10px] py-[5px] text-left font-serif text-[0.88rem] font-normal tracking-[0.02em] ${
                  wActive
                    ? 'bg-[rgba(88,166,255,0.14)] text-accent font-semibold'
                    : 'text-text-primary hover:bg-[rgba(88,166,255,0.07)] hover:text-accent'
                }`}
                onClick={() => goTo(wStep)}
              >
                {MOVES[i * 2].s}
              </Button>
              {bStep <= TOTAL_MOVES ? (
                <Button
                  ref={bActive ? activeRef : undefined}
                  variant="menu-item"
                  className={`justify-start rounded-none border-b border-l border-[rgba(255,255,255,0.05)] border-l-[rgba(255,255,255,0.05)] px-[10px] py-[5px] text-left font-serif text-[0.88rem] font-normal tracking-[0.02em] ${
                    bActive
                      ? 'bg-[rgba(88,166,255,0.14)] text-accent font-semibold'
                      : 'text-text-primary hover:bg-[rgba(88,166,255,0.07)] hover:text-accent'
                  }`}
                  onClick={() => goTo(bStep)}
                >
                  {MOVES[i * 2 + 1]?.s ?? ''}
                </Button>
              ) : (
                <div className="border-l border-l-[rgba(255,255,255,0.03)]" />
              )}
            </div>
          )
        })}
      </div>

      <div className="py-2 px-[14px] border-t border-border font-serif italic text-[0.78rem] text-text-muted text-center flex-shrink-0">
        {t('movelist.footer')} ·{' '}
        <span className="text-success not-italic font-semibold">1-0</span>
      </div>
    </div>
  )
}
