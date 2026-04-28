import { useEffect } from 'react'
import { useReplayStore } from '../store/replayStore'

export function useKeyboardNav() {
  const next = useReplayStore((s) => s.next)
  const prev = useReplayStore((s) => s.prev)
  const first = useReplayStore((s) => s.first)
  const last = useReplayStore((s) => s.last)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Home') { e.preventDefault(); first() }
      else if (e.key === 'End') { e.preventDefault(); last() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, first, last])
}
