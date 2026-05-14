import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretRight } from '@phosphor-icons/react'
import type { Game, RomHack } from '../types'
import { CONSOLE_META } from '../data/consoles'
import { resolveCover } from '../utils/resolveCover'
import { PokeballIcon } from './PokeballIcon'

interface Props {
  game: Game | RomHack
  /** index within the visible grid, drives the staggered reveal */
  index: number
}

type CoverState = 'loading' | 'ready' | 'error'

function isHack(game: Game | RomHack): game is RomHack {
  return 'description' in game
}

export function GameCard({ game, index }: Props) {
  const meta = CONSOLE_META[game.console]
  const coverSrc = resolveCover(game.coverUrl)
  const hasCover = coverSrc !== ''
  const [cover, setCover] = useState<CoverState>(hasCover ? 'loading' : 'error')
  const hack = isHack(game) ? game : null

  // cap the stagger so a long list never feels slow
  const delay = `${Math.min(index, 11) * 35}ms`

  return (
    <Link
      to={`/jogo/${game.id}`}
      aria-label={`Ver ${game.title}`}
      className="card-reveal flex flex-col overflow-hidden rounded-card border border-border bg-bg-card transition-transform active:scale-[0.98]"
      style={{ animationDelay: delay }}
    >
      <div className="relative aspect-[3/4] w-full bg-bg-card-hover">
        {/* console identity: static colored stripe (replaces the banned glow) */}
        <span
          className="absolute left-0 top-0 z-10 h-full w-1"
          style={{ backgroundColor: meta.colorVar }}
          aria-hidden
        />
        <span
          className="absolute right-2 top-2 z-10 rounded-chip px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-bg-primary"
          style={{ backgroundColor: meta.colorVar }}
        >
          {meta.short}
        </span>
        <span className="absolute right-2 top-[26px] z-10 rounded-chip border border-border bg-bg-primary/90 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-text-muted">
          {meta.emulator}
        </span>

        {cover === 'loading' && (
          <div className="skeleton-pulse absolute inset-0 bg-bg-card-hover" />
        )}

        {cover === 'error' ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-muted">
            <PokeballIcon size={48} muted />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Sem capa
            </span>
          </div>
        ) : (
          <img
            src={coverSrc}
            alt={`Capa de ${game.title}`}
            width={300}
            height={400}
            loading="lazy"
            onLoad={() => setCover('ready')}
            onError={() => setCover('error')}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              cover === 'ready' ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h2 className="font-display text-[15px] font-semibold leading-snug text-text-primary">
          {game.title}
        </h2>
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <span className="tabular-nums">{game.year}</span>
          <span aria-hidden>·</span>
          <span className="truncate">
            {isHack(game) ? `base: ${game.baseGame}` : game.type}
          </span>
        </div>

        {hack && (
          <p className="mt-1 line-clamp-3 font-body text-xs leading-snug text-text-muted">
            {hack.description}
          </p>
        )}

        <div className="mt-2 flex items-center gap-1 font-mono text-[11px] uppercase tracking-wide text-accent">
          {game.downloads.length}{' '}
          {game.downloads.length === 1 ? 'fonte' : 'fontes'}
          <CaretRight size={12} weight="bold" />
        </div>
      </div>
    </Link>
  )
}
