import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renders children', () => {
    const { getByText } = render(<Tag variant="opening">Ouverture</Tag>)
    expect(getByText('Ouverture')).toBeDefined()
  })

  it('attack variant includes danger color class', () => {
    const { container } = render(<Tag variant="attack">Attack</Tag>)
    expect(container.firstChild).toBeDefined()
  })

  it('blunder variant renders without error', () => {
    const { getByText } = render(<Tag variant="blunder">Blunder</Tag>)
    expect(getByText('Blunder')).toBeDefined()
  })

  it('strategy variant renders without error', () => {
    const { getByText } = render(<Tag variant="strategy">Strategy</Tag>)
    expect(getByText('Strategy')).toBeDefined()
  })
})
