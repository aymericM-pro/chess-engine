import type { BoardTheme } from '@/shared/types/chess'

export const THEMES: BoardTheme[] = [
  { id: 'classic', name: 'Classic', light: '#eeeed2', dark: '#769656' },
  { id: 'walnut', name: 'Walnut', light: '#f0d9b5', dark: '#b58863' },
  { id: 'midnight', name: 'Midnight', light: '#dee3e6', dark: '#4a7fa5' },
  { id: 'tokyo', name: 'Tokyo Night', light: '#1a1b2e', dark: '#7aa2f7' },
  { id: 'crimson', name: 'Crimson', light: '#f5e6e6', dark: '#9b2335' },
  { id: 'forest', name: 'Forest', light: '#d8e8c8', dark: '#4a7c59' },
  { id: 'slate', name: 'Slate', light: '#d0d8e4', dark: '#4a5568' },
  { id: 'gold', name: 'Gold', light: '#fdf6e3', dark: '#b8860b' },
  { id: 'neon', name: 'Neon', light: '#0d1117', dark: '#39ff14' },
  { id: 'rose', name: 'Rose', light: '#fce4ec', dark: '#c2185b' },
]

export const DEFAULT_THEME_ID = 'classic'
