import { useReplayStore } from '../store/replayStore'
import { ANALYSIS } from '../data/analysis'
import { Tag } from '@/shared/components/Tag'
import type { Phase, TagType } from '@/shared/types/chess'
import { useThemeStore } from '@/shared/theme/useThemeStore'

const phaseClasses: Record<Phase, string> = {
  opening: 'bg-[rgba(118,150,86,0.14)] border border-[rgba(118,150,86,0.28)] text-success',
  middle: 'bg-[rgba(88,166,255,0.12)] border border-[rgba(88,166,255,0.24)] text-accent',
  end: 'bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.24)] text-danger',
}

const phaseLabel: Record<Phase, string> = {
  opening: 'Ouverture',
  middle: 'Milieu de jeu',
  end: 'Fin de partie',
}

export function AnalysisCard() {
  const step = useReplayStore((s) => s.step)
  const entry = ANALYSIS[Math.min(step, ANALYSIS.length - 1)]
  const { theme } = useThemeStore()

  return (
    <div
      id="analysis"
      className="bg-bg-2 border border-border rounded-xl overflow-hidden flex flex-col flex-shrink-0 gap-[11px]"
      style={{ padding: '18px 20px 16px' }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-[10px] flex-1">
          <span
            className="font-display font-bold tracking-[0.05em]"
            style={{
              fontSize: '1.55rem',
              background: theme === 'dark'
                ? 'linear-gradient(135deg,#f5ead6,#d4a84b)'
                : 'linear-gradient(135deg,#a8731e,#7c5010)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {entry.san}
          </span>
          <span className="font-serif text-[0.92rem] text-text-muted italic">
            {entry.who}
          </span>
        </div>
        <span
          className={`font-display text-[0.6rem] font-semibold tracking-[0.12em] uppercase py-[3px] px-[10px] rounded-full transition-all duration-250 ${phaseClasses[entry.phase]}`}
        >
          {phaseLabel[entry.phase]}
        </span>
      </div>

      <p
        className="font-serif text-[1.18rem] leading-[1.78] text-text-primary opacity-93 tracking-[0.01em] [&_strong]:text-[var(--color-emphasis)] [&_strong]:font-semibold [&_strong]:not-italic"
        dangerouslySetInnerHTML={{ __html: entry.text }}
      />

      <div className="flex flex-wrap gap-[5px]">
        {entry.tags.map(([type, label], i) => (
          <Tag key={i} variant={type as TagType}>
            {label}
          </Tag>
        ))}
      </div>
    </div>
  )
}
