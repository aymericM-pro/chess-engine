import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useReplayStore } from '../store/replayStore'
import { THEMES } from '../data/themes'
import { Button } from '@/shared/components/Button'

export function ThemePicker() {
  const { t } = useTranslation()
  const themeId = useReplayStore((s) => s.themeId)
  const setTheme = useReplayStore((s) => s.setTheme)

  useEffect(() => {
    const theme = THEMES.find((th) => th.id === themeId)
    if (!theme) return
    document.documentElement.style.setProperty('--sq-light', theme.light)
    document.documentElement.style.setProperty('--sq-dark', theme.dark)
  }, [themeId])

  return (
    <div
      id="themes"
      className="w-full bg-bg-2 border border-border rounded-[14px] flex flex-col gap-3"
      style={{ padding: '16px 20px 18px' }}
    >
      <div className="font-display text-[0.62rem] font-semibold tracking-[0.14em] uppercase text-text-muted">
        {t('themes.heading')}
      </div>
      <div className="flex flex-wrap gap-[10px]">
        {THEMES.map((theme) => {
          const isActive = theme.id === themeId
          return (
            <Button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              title={theme.name}
              variant="nav-avatar"
              className="flex-col gap-[6px] rounded-none hover:scale-[1.06]"
            >
              <div
                className="w-12 h-12 rounded-[5px] overflow-hidden grid flex-shrink-0 transition-[outline] duration-150"
                style={{
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridTemplateRows: 'repeat(4, 1fr)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  outline: isActive ? '2px solid var(--color-accent)' : 'none',
                  outlineOffset: 2,
                }}
              >
                {Array.from({ length: 16 }, (_, i) => {
                  const r = Math.floor(i / 4)
                  const c = i % 4
                  return (
                    <div
                      key={i}
                      style={{ background: (r + c) % 2 === 0 ? theme.light : theme.dark }}
                    />
                  )
                })}
              </div>
              <span
                className={`font-display text-[0.5rem] font-semibold tracking-[0.06em] uppercase text-center whitespace-nowrap ${isActive ? 'text-accent' : 'text-text-muted'}`}
              >
                {theme.name}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
