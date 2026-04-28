import { describe, it, expect, beforeEach } from 'vitest'
import { useReplayStore } from './replayStore'
import { TOTAL_MOVES } from '../data/moves'

beforeEach(() => {
  useReplayStore.setState({ step: 0, themeId: 'classic' })
})

describe('replayStore', () => {
  it('initial state', () => {
    const { step, themeId } = useReplayStore.getState()
    expect(step).toBe(0)
    expect(themeId).toBe('classic')
  })

  it('next() increments step', () => {
    useReplayStore.getState().next()
    expect(useReplayStore.getState().step).toBe(1)
  })

  it('prev() at 0 stays 0', () => {
    useReplayStore.getState().prev()
    expect(useReplayStore.getState().step).toBe(0)
  })

  it('prev() decrements when step > 0', () => {
    useReplayStore.setState({ step: 5 })
    useReplayStore.getState().prev()
    expect(useReplayStore.getState().step).toBe(4)
  })

  it('first() sets step to 0', () => {
    useReplayStore.setState({ step: 20 })
    useReplayStore.getState().first()
    expect(useReplayStore.getState().step).toBe(0)
  })

  it('last() sets step to TOTAL_MOVES', () => {
    useReplayStore.getState().last()
    expect(useReplayStore.getState().step).toBe(TOTAL_MOVES)
  })

  it('next() at TOTAL_MOVES stays at TOTAL_MOVES', () => {
    useReplayStore.setState({ step: TOTAL_MOVES })
    useReplayStore.getState().next()
    expect(useReplayStore.getState().step).toBe(TOTAL_MOVES)
  })

  it('goTo(15) sets step to 15', () => {
    useReplayStore.getState().goTo(15)
    expect(useReplayStore.getState().step).toBe(15)
  })

  it('goTo(-5) clamps to 0', () => {
    useReplayStore.getState().goTo(-5)
    expect(useReplayStore.getState().step).toBe(0)
  })

  it('goTo(100) clamps to TOTAL_MOVES', () => {
    useReplayStore.getState().goTo(100)
    expect(useReplayStore.getState().step).toBe(TOTAL_MOVES)
  })

  it('setTheme changes themeId', () => {
    useReplayStore.getState().setTheme('walnut')
    expect(useReplayStore.getState().themeId).toBe('walnut')
  })
})
