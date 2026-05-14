import type { Game, RomHack } from '../types'
import { GameCard } from './GameCard'
import { EmptyState } from './EmptyState'

interface Props {
  games: (Game | RomHack)[]
  onReset: () => void
}

export function GameGrid({ games, onReset }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {games.length === 0 ? (
        <EmptyState onReset={onReset} />
      ) : (
        games.map((game, i) => <GameCard key={game.id} game={game} index={i} />)
      )}
    </div>
  )
}
