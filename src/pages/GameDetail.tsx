import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowSquareOut, DownloadSimple } from '@phosphor-icons/react'
import type { Game, RomHack } from '../types'
import { CONSOLE_META } from '../data/consoles'
import { resolveCover } from '../utils/resolveCover'
import { PokeballIcon } from '../components/PokeballIcon'
import gamesData from '../data/games.json'
import hacksData from '../data/hacks.json'

const games = gamesData as Game[]
const hacks = hacksData as RomHack[]

type CoverState = 'loading' | 'ready' | 'error'

function isHack(item: Game | RomHack): item is RomHack {
  return 'description' in item
}

export function GameDetail() {
  const { id } = useParams()
  const game: Game | RomHack | undefined =
    games.find((g) => g.id === id) ?? hacks.find((h) => h.id === id)

  const coverSrc = game ? resolveCover(game.coverUrl) : ''
  const hasCover = coverSrc !== ''
  const [cover, setCover] = useState<CoverState>(hasCover ? 'loading' : 'error')

  if (!game) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
        <PokeballIcon size={56} muted />
        <p className="font-display text-lg font-semibold text-text-primary">
          Jogo não encontrado
        </p>
        <Link
          to="/"
          className="h-11 rounded-pill border border-accent px-5 font-display text-sm font-semibold leading-[2.75rem] text-text-primary active:scale-[0.97]"
        >
          Voltar à biblioteca
        </Link>
      </div>
    )
  }

  const meta = CONSOLE_META[game.console]

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-bg-primary">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link
            to="/"
            aria-label="Voltar à biblioteca"
            className="flex h-10 w-10 items-center justify-center rounded-pill border border-border text-text-primary active:scale-90"
          >
            <ArrowLeft size={20} weight="bold" />
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
            Biblioteca
          </span>
        </div>
        <div className="h-0.5 w-full" style={{ backgroundColor: meta.colorVar }} />
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
          {/* cover */}
          <div className="relative mx-auto aspect-[3/4] w-44 shrink-0 overflow-hidden rounded-card border border-border bg-bg-card-hover sm:mx-0 sm:w-52">
            <span
              className="absolute left-0 top-0 z-10 h-full w-1"
              style={{ backgroundColor: meta.colorVar }}
              aria-hidden
            />
            {cover === 'loading' && (
              <div className="skeleton-pulse absolute inset-0 bg-bg-card-hover" />
            )}
            {cover === 'error' ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-muted">
                <PokeballIcon size={56} muted />
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
                onLoad={() => setCover('ready')}
                onError={() => setCover('error')}
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  cover === 'ready' ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </div>

          {/* meta */}
          <div className="flex flex-1 flex-col gap-3">
            <div>
              <span
                className="inline-block rounded-chip px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-bg-primary"
                style={{ backgroundColor: meta.colorVar }}
              >
                {game.console}
              </span>
              <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-text-primary">
                {game.title}
              </h1>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-sm">
              <Fact label="Ano" value={String(game.year)} />
              {isHack(game) ? (
                <Fact label="Categoria" value="ROM Hack" />
              ) : (
                <>
                  <Fact label="Tipo" value={game.type} />
                  <Fact label="Geração" value={`Gen ${game.generation}`} />
                  <Fact label="Região" value={game.region} />
                </>
              )}
              {isHack(game) && <Fact label="Jogo base" value={game.baseGame} />}
            </dl>
          </div>
        </div>

        {isHack(game) && (
          <section className="mt-8">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              O que esta hack modifica
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-text-muted">
              {game.description}
            </p>
          </section>
        )}

        {game.screenshots && game.screenshots.length > 0 && (
          <ScreenshotGrid sources={game.screenshots} title={game.title} />
        )}

        {/* downloads */}
        <section className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text-primary">
            <DownloadSimple size={20} weight="bold" className="text-accent" />
            Fontes de download
          </h2>
          <p className="mt-1 font-body text-sm text-text-muted">
            {game.downloads.length === 1
              ? 'Uma fonte disponível. O download abre em outra aba.'
              : `${game.downloads.length} fontes. Se uma não funcionar, tente outra — abrem em nova aba.`}
          </p>

          <ul className="mt-4 flex flex-col gap-2.5">
            {game.downloads.map((d, i) => (
              <li key={d.source}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-card border border-border bg-bg-card px-4 py-3.5 transition-colors active:scale-[0.99]"
                  style={i === 0 ? { borderColor: 'var(--color-accent)' } : undefined}
                >
                  <div className="flex flex-col">
                    <span className="font-display text-base font-semibold text-text-primary">
                      {d.source}
                    </span>
                    <span className="font-mono text-[11px] text-text-muted">
                      {i === 0 ? 'Fonte principal' : 'Alternativa'}
                    </span>
                  </div>
                  <span className="flex h-10 items-center gap-1.5 rounded-pill bg-accent px-4 font-display text-sm font-semibold text-text-primary">
                    Baixar
                    <ArrowSquareOut size={15} weight="bold" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}

function ScreenshotGrid({ sources, title }: { sources: string[]; title: string }) {
  // remote image URLs occasionally 404 — drop any that fail to load.
  const [broken, setBroken] = useState<string[]>([])
  const valid = sources.filter((src) => !broken.includes(src))

  if (valid.length === 0) return null

  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold text-text-primary">
        Imagens do jogo
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {valid.map((src, i) => (
          <a
            key={src}
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="overflow-hidden rounded-card border border-border bg-bg-card-hover active:scale-[0.98]"
          >
            <img
              src={src}
              alt={`${title} — imagem ${i + 1}`}
              loading="lazy"
              onError={() => setBroken((b) => [...b, src])}
              className="aspect-video w-full object-cover"
            />
          </a>
        ))}
      </div>
    </section>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[11px] uppercase tracking-wide text-text-muted">{label}</dt>
      <dd className="tabular-nums text-text-primary">{value}</dd>
    </div>
  )
}
