import { useTranslation } from 'react-i18next'

export function PlayerBar() {
  const { t } = useTranslation()

  return (
    <div className="flex items-stretch bg-bg-2 border border-border rounded-xl overflow-hidden w-full">
      <div className="flex-1 flex items-center gap-[10px] py-[11px] px-5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[1.2rem] flex-shrink-0 bg-[rgba(238,238,210,0.15)] border border-[rgba(238,238,210,0.2)]">
          ♙
        </div>
        <div className="flex flex-col">
          <span className="font-display font-semibold text-[0.8rem] tracking-[0.06em]">
            Wynn4Life
          </span>
          <span className="font-serif text-[0.78rem] text-text-muted italic">
            249 ELO · {t('player.white')}
          </span>
        </div>
      </div>

      <div
        className="px-5 text-text-muted text-[0.7rem] font-bold tracking-[0.08em] border-l border-r border-border flex items-center whitespace-nowrap font-display"
      >
        1-0
      </div>

      <div className="flex-1 flex flex-row-reverse items-center gap-[10px] py-[11px] px-5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[1.2rem] flex-shrink-0 bg-[rgba(30,20,14,0.6)] border border-[rgba(255,255,255,0.08)]">
          ♟
        </div>
        <div className="flex flex-col items-end">
          <span className="font-display font-semibold text-[0.8rem] tracking-[0.06em]">
            Votybe
          </span>
          <span className="font-serif text-[0.78rem] text-text-muted italic">
            247 ELO · {t('player.black')}
          </span>
        </div>
      </div>
    </div>
  )
}
