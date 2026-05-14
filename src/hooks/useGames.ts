import { useMemo, useState } from 'react'
import type { Console, Game, GameType, RomHack } from '../types'
import gamesData from '../data/games.json'
import hacksData from '../data/hacks.json'

const games = gamesData as Game[]
const hacks = hacksData as RomHack[]

export type Collection = 'oficiais' | 'hacks'
export type ConsoleFilter = Console | 'Todos'
export type TypeFilter = GameType | 'Todos'

export function useGames() {
  const [collection, setCollectionState] = useState<Collection>('oficiais')
  const [search, setSearch] = useState('')
  const [consoleFilter, setConsoleFilter] = useState<ConsoleFilter>('Todos')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Todos')

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
    return source
      .filter((item) => consoleFilter === 'Todos' || item.console === consoleFilter)
      .filter(
        (item) =>
          collection === 'hacks' ||
          typeFilter === 'Todos' ||
          (item as Game).type === typeFilter,
      )
      .filter((item) => q === '' || item.title.toLowerCase().includes(q))
  }, [collection, search, consoleFilter, typeFilter])

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
    reset,
  }
}
