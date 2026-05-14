import type { Console } from '../types'

interface ConsoleMeta {
  short: string
  colorVar: string
}

export const CONSOLE_META: Record<Console, ConsoleMeta> = {
  'Game Boy': { short: 'Game Boy', colorVar: 'var(--color-gb)' },
  'Game Boy Color': { short: 'GBC', colorVar: 'var(--color-gbc)' },
  'Game Boy Advance': { short: 'GBA', colorVar: 'var(--color-gba)' },
  'Nintendo DS': { short: 'DS', colorVar: 'var(--color-ds)' },
  'Nintendo 3DS': { short: '3DS', colorVar: 'var(--color-3ds)' },
  'Nintendo Switch': { short: 'Switch', colorVar: 'var(--color-switch)' },
}

export const CONSOLE_ORDER: Console[] = [
  'Game Boy',
  'Game Boy Color',
  'Game Boy Advance',
  'Nintendo DS',
  'Nintendo 3DS',
  'Nintendo Switch',
]

export const GAME_TYPES = ['Principal', 'Remake', 'Spin-off'] as const
