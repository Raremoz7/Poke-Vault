import { PokeballIcon } from './PokeballIcon'

interface Props {
  visibleCount: number
  total: number
}

export function Header({ visibleCount, total }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg-primary">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <PokeballIcon size={32} />
          <div className="leading-none">
            <h1 className="font-display text-xl font-bold tracking-tight text-text-primary">
              Poké<span className="text-accent">Vault</span>
            </h1>
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
              Biblioteca Pessoal
            </p>
          </div>
        </div>
        <div className="text-right leading-none">
          <span className="font-mono text-2xl font-semibold tabular-nums text-text-primary">
            {visibleCount}
          </span>
          <p className="mt-0.5 font-mono text-[11px] text-text-muted">de {total}</p>
        </div>
      </div>
      <div className="h-0.5 w-full bg-accent" />
    </header>
  )
}
