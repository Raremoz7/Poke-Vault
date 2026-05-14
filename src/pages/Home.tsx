import { Header } from '../components/Header'
import { SearchField } from '../components/SearchField'
import { FilterBar } from '../components/FilterBar'
import { GameGrid } from '../components/GameGrid'
import { CollectionToggle } from '../components/CollectionToggle'
import type { useGames } from '../hooks/useGames'

type Props = ReturnType<typeof useGames>

export function Home({
  filtered,
  total,
  collection,
  setCollection,
  search,
  setSearch,
  consoleFilter,
  setConsoleFilter,
  typeFilter,
  setTypeFilter,
  reset,
}: Props) {
  return (
    <>
      <Header visibleCount={filtered.length} total={total} />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-4">
        <div className="flex flex-col gap-3">
          <CollectionToggle collection={collection} setCollection={setCollection} />
          <SearchField value={search} onChange={setSearch} />
          <FilterBar
            consoleFilter={consoleFilter}
            setConsoleFilter={setConsoleFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            showTypeFilter={collection === 'oficiais'}
          />
        </div>

        <div className="mt-6">
          <GameGrid games={filtered} onReset={reset} />
        </div>
      </main>
    </>
  )
}
