import { useMemo, useState } from 'react'
import type { Console, Game, GameType, RomHack } from '../types'
import gamesData from '../data/games.json'
import hacksData from '../data/hacks.json'
import { CONSOLE_ORDER } from '../data/consoles'

const games = gamesData as Game[]
const hacks = hacksData as RomHack[]

export type Collection = 'oficiais' | 'hacks'
export type ConsoleFilter = Console | 'Todos'
export type TypeFilter = GameType | 'Todos'
export type SortKey = 'lancamento' | 'alfabetica' | 'geracao' | 'console'
export type SortDir = 'asc' | 'desc'

export function useGames() {
  const [collection, setCollectionState] = useState<Collection>('oficiais')
  const [search, setSearch] = useState('')
  const [consoleFilter, setConsoleFilter] = useState<ConsoleFilter>('Todos')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Todos')
  const [sort, setSort] = useState<SortKey>('lancamento')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const toggleSortDir = () =>
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))

  const reset = () => {
    setSearch('')
    setConsoleFilter('Todos')
    setTypeFilter('Todos')
  }

  // switching collections clears filters so a stale console/type can't hide everything
  const setCollection = (next: Collection) => {
    setCollectionState(next)
    reset()
  }

  const filtered = useMemo<(Game | RomHack)[]>(() => {
    const q = search.trim().toLowerCase()
    const source: (Game | RomHack)[] = collection === 'hacks' ? hacks : games
    const result = source
      .filter((item) => consoleFilter === 'Todos' || item.console === consoleFilter)
      .filter(
        (item) =>
          collection === 'hacks' ||
          typeFilter === 'Todos' ||
          (item as Game).type === typeFilter,
      )
      .filter((item) => q === '' || item.title.toLowerCase().includes(q))

    const cmp = (a: Game | RomHack, b: Game | RomHack) => {
      switch (sort) {
        case 'alfabetica':
          return a.title.localeCompare(b.title)
        case 'geracao': {
          // games carry `generation`; hacks fall back to release year
          const ga = 'generation' in a ? a.generation : a.year
          const gb = 'generation' in b ? b.generation : b.year
          return ga - gb || a.year - b.year
        }
        case 'console': {
          const ca = CONSOLE_ORDER.indexOf(a.console)
          const cb = CONSOLE_ORDER.indexOf(b.console)
          return ca - cb || a.year - b.year
        }
        case 'lancamento':
        default:
          return a.year - b.year || a.title.localeCompare(b.title)
      }
    }
    const sign = sortDir === 'desc' ? -1 : 1
    return [...result].sort((a, b) => cmp(a, b) * sign)
  }, [collection, search, consoleFilter, typeFilter, sort, sortDir])

  return {
    filtered,
    total: collection === 'hacks' ? hacks.length : games.length,
    collection,
    setCollection,
    search,
    setSearch,
    consoleFilter,
    setConsoleFilter,
    typeFilter,
    setTypeFilter,
    sort,
    setSort,
    sortDir,
    toggleSortDir,
    reset,
  }
}
