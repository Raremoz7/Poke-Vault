import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowSquareOut,
  CaretLeft,
  CaretRight,
  DownloadSimple,
  GameController,
  Translate,
  X,
} from '@phosphor-icons/react'
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

  // open every game page scrolled to the top, even when coming from a scrolled list
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

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

        {/* PT-BR translations — always shown, with an empty state when none found */}
        <section className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text-primary">
            <Translate size={20} weight="bold" className="text-accent" />
            Traduções PT-BR
          </h2>

          {game.translations && game.translations.length > 0 ? (
            <>
              <p className="mt-1 font-body text-sm text-text-muted">
                Patches de tradução feitos por fãs. Aplique sobre a ROM original.
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {game.translations.map((t) => (
                  <li key={t.source}>
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-card border border-border bg-bg-card px-4 py-3.5 transition-colors active:scale-[0.99]"
                    >
                      <div className="flex flex-col">
                        <span className="font-display text-base font-semibold text-text-primary">
                          {t.source}
                        </span>
                        <span className="font-mono text-[11px] text-text-muted">
                          Tradução PT-BR
                        </span>
                      </div>
                      <span className="flex h-10 items-center gap-1.5 rounded-pill bg-accent px-4 font-display text-sm font-semibold text-text-primary">
                        Abrir
                        <ArrowSquareOut size={15} weight="bold" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="mt-3 rounded-card border border-dashed border-border bg-bg-card px-4 py-5 text-center">
              <p className="font-body text-sm text-text-muted">
                Nenhuma tradução PT-BR encontrada para este jogo ainda.
              </p>
            </div>
          )}
        </section>

        {/* how to run */}
        <section className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-text-primary">
            <GameController size={20} weight="bold" className="text-accent" />
            Como rodar
          </h2>

          <div className="mt-4 rounded-card border border-border bg-bg-card p-4">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col">
                <dt className="font-mono text-[11px] uppercase tracking-wide text-text-muted">
                  Emulador (Android)
                </dt>
                <dd className="mt-0.5 font-display text-base font-semibold text-text-primary">
                  {meta.emulator}
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="font-mono text-[11px] uppercase tracking-wide text-text-muted">
                  Formato do arquivo
                </dt>
                <dd className="mt-0.5 font-mono text-base text-text-primary">
                  {meta.fileFormat}
                </dd>
              </div>
            </dl>

            <p className="mt-3 border-t border-border pt-3 font-body text-sm leading-relaxed text-text-muted">
              {meta.setupNote}
            </p>

            <a
              href={meta.emulatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-pill border border-accent px-4 font-display text-sm font-semibold text-text-primary active:scale-[0.97]"
            >
              Baixar {meta.emulator}
              <ArrowSquareOut size={15} weight="bold" />
            </a>
          </div>
        </section>
      </main>
    </>
  )
}

function ScreenshotGrid({ sources, title }: { sources: string[]; title: string }) {
  // remote image URLs occasionally 404 — drop any that fail to load.
  const [broken, setBroken] = useState<string[]>([])
  // index of the image open in the lightbox, or null when closed
  const [active, setActive] = useState<number | null>(null)
  const valid = sources.filter((src) => !broken.includes(src))

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') setActive((i) => (i! + 1) % valid.length)
      if (e.key === 'ArrowLeft')
        setActive((i) => (i! - 1 + valid.length) % valid.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, valid.length])

  if (valid.length === 0) return null

  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold text-text-primary">
        Imagens do jogo
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {valid.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ampliar imagem ${i + 1}`}
            className="overflow-hidden rounded-card border border-border bg-bg-card-hover active:scale-[0.98]"
          >
            <img
              src={src}
              alt={`${title} — imagem ${i + 1}`}
              loading="lazy"
              onError={() => setBroken((b) => [...b, src])}
              className="aspect-video w-full object-cover"
            />
          </button>
        ))}
      </div>

      {active !== null && valid[active] && (
        <Lightbox
          sources={valid}
          index={active}
          title={title}
          onClose={() => setActive(null)}
          onNavigate={setActive}
        />
      )}
    </section>
  )
}

function Lightbox({
  sources,
  index,
  title,
  onClose,
  onNavigate,
}: {
  sources: string[]
  index: number
  title: string
  onClose: () => void
  onNavigate: (index: number) => void
}) {
  const prev = () => onNavigate((index - 1 + sources.length) % sources.length)
  const next = () => onNavigate((index + 1) % sources.length)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — imagem ${index + 1}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary/95 p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-pill border border-border bg-bg-card text-text-primary active:scale-90"
      >
        <X size={20} weight="bold" />
      </button>

      <img
        src={sources[index]}
        alt={`${title} — imagem ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] max-w-full rounded-card object-contain"
      />

      {sources.length > 1 && (
        <div
          className="mt-4 flex items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={prev}
            aria-label="Imagem anterior"
            className="flex h-11 w-11 items-center justify-center rounded-pill border border-border bg-bg-card text-text-primary active:scale-90"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <span className="font-mono text-sm tabular-nums text-text-muted">
            {index + 1} / {sources.length}
          </span>
          <button
            type="button"
            onClick={next}
            aria-label="Próxima imagem"
            className="flex h-11 w-11 items-center justify-center rounded-pill border border-border bg-bg-card text-text-primary active:scale-90"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      )}
    </div>
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
