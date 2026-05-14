import type { Console } from '../types'

interface ConsoleMeta {
  short: string
  colorVar: string
  /** Android emulator recommended for this console. */
  emulator: string
  emulatorUrl: string
  /** ROM file extensions the emulator expects. */
  fileFormat: string
  /** One-line setup note specific to this console. */
  setupNote: string
}

export const CONSOLE_META: Record<Console, ConsoleMeta> = {
  'Game Boy': {
    short: 'Game Boy',
    colorVar: 'var(--color-gb)',
    emulator: 'Lemuroid',
    emulatorUrl: 'https://github.com/Swordfish90/Lemuroid',
    fileFormat: '.gb',
    setupNote: 'Coloque o arquivo numa pasta e o Lemuroid o detecta ao escanear.',
  },
  'Game Boy Color': {
    short: 'GBC',
    colorVar: 'var(--color-gbc)',
    emulator: 'Lemuroid',
    emulatorUrl: 'https://github.com/Swordfish90/Lemuroid',
    fileFormat: '.gbc',
    setupNote: 'Coloque o arquivo numa pasta e o Lemuroid o detecta ao escanear.',
  },
  'Game Boy Advance': {
    short: 'GBA',
    colorVar: 'var(--color-gba)',
    emulator: 'Lemuroid',
    emulatorUrl: 'https://github.com/Swordfish90/Lemuroid',
    fileFormat: '.gba',
    setupNote: 'Roda direto no Lemuroid, sem BIOS. Basta escanear a pasta da ROM.',
  },
  'Nintendo DS': {
    short: 'DS',
    colorVar: 'var(--color-ds)',
    emulator: 'Lemuroid',
    emulatorUrl: 'https://github.com/Swordfish90/Lemuroid',
    fileFormat: '.nds',
    setupNote: 'Coloque o arquivo numa pasta e o Lemuroid o detecta ao escanear.',
  },
  'Nintendo 3DS': {
    short: '3DS',
    colorVar: 'var(--color-3ds)',
    emulator: 'Lime3DS',
    emulatorUrl: 'https://github.com/Lime3DS/Lime3DS',
    fileFormat: '.3ds / .cia',
    setupNote: 'O Lemuroid não roda 3DS — use o Lime3DS e aponte a pasta da ROM.',
  },
  'Nintendo Switch': {
    short: 'Switch',
    colorVar: 'var(--color-switch)',
    emulator: 'Sudachi',
    emulatorUrl: 'https://sudachi.en.uptodown.com/android',
    fileFormat: '.nsp / .xci',
    setupNote: 'Precisa de prod.keys e firmware instalados no Sudachi antes de abrir.',
  },
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
