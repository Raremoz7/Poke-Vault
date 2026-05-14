export type Console =
  | 'Game Boy'
  | 'Game Boy Color'
  | 'Game Boy Advance'
  | 'Nintendo DS'
  | 'Nintendo 3DS'
  | 'Nintendo Switch'

export type Generation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type GameType = 'Principal' | 'Remake' | 'Spin-off'

export type Region = 'USA' | 'EUR' | 'JPN' | 'Multi'

export interface DownloadSource {
  url: string
  source: string
}

export interface Game {
  id: string
  title: string
  console: Console
  generation: Generation
  year: number
  type: GameType
  coverUrl: string
  screenshots?: string[]
  downloads: DownloadSource[]
  region: Region
}

export interface RomHack {
  id: string
  title: string
  console: Console
  baseGame: string
  year: number
  description: string
  coverUrl: string
  screenshots?: string[]
  downloads: DownloadSource[]
}
