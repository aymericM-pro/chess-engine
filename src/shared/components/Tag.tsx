import type { TagType } from '@/shared/types/chess'

interface Props {
  variant: TagType
  children: React.ReactNode
}

const variantClasses: Record<TagType, string> = {
  attack:
    'bg-danger/10 border border-danger/22 text-danger',
  defense:
    'bg-accent/9 border border-accent/20 text-accent',
  strategy:
    'bg-gold/9 border border-gold/20 text-gold',
  tactic:
    'bg-purple/9 border border-purple/20 text-purple',
  opening:
    'bg-success/9 border border-success/20 text-success',
  blunder:
    'bg-danger/15 border border-danger/30 text-[#ff6b6b]',
}

export function Tag({ variant, children }: Props) {
  return (
    <span
      className={`font-display text-[0.55rem] font-semibold tracking-[0.08em] uppercase py-[2px] px-[9px] rounded-full ${variantClasses[variant]}`}
    >
      {children}
    </span>
  )
}
