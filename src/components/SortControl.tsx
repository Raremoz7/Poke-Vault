import { useState } from 'react'
import {
  ArrowsDownUp,
  Check,
  SortAscending,
  SortDescending,
} from '@phosphor-icons/react'
import type { SortDir, SortKey } from '../hooks/useGames'

interface Props {
  sort: SortKey
  setSort: (value: SortKey) => void
  sortDir: SortDir
  toggleSortDir: () => void
}

const OPTIONS: { key: SortKey; label: string; hint: string }[] = [
  { key: 'lancamento', label: 'Lançamento', hint: 'Do mais antigo ao mais novo' },
  { key: 'alfabetica', label: 'A → Z', hint: 'Ordem alfabética do título' },
  { key: 'geracao', label: 'Geração', hint: 'Cronologia das gerações Pokémon' },
  { key: 'console', label: 'Console', hint: 'Game Boy até Switch' },
]

export function SortControl({ sort, setSort, sortDir, toggleSortDir }: Props) {
  const [open, setOpen] = useState(false)
  const current = OPTIONS.find((o) => o.key === sort) ?? OPTIONS[0]

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Ordenar: ${current.label}`}
          className="flex h-11 w-11 items-center justify-center rounded-pill border border-border bg-bg-card text-accent active:scale-[0.97]"
        >
          <ArrowsDownUp size={18} weight="bold" />
        </button>

        {open && (
          <>
            {/* tap-away backdrop */}
            <button
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-30 cursor-default"
            />
            <ul
              role="listbox"
              className="absolute right-0 z-40 mt-1.5 w-60 overflow-hidden rounded-card border border-border bg-bg-card"
            >
              {OPTIONS.map((o) => {
                const active = o.key === sort
                return (
                  <li key={o.key}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setSort(o.key)
                        setOpen(false)
                      }}
                      className="flex w-full items-center justify-between gap-3 border-b border-border px-3.5 py-3 text-left last:border-b-0 active:bg-bg-card-hover"
                    >
                      <span className="flex flex-col">
                        <span className="font-display text-sm font-semibold text-text-primary">
                          {o.label}
                        </span>
                        <span className="font-mono text-[11px] text-text-muted">
                          {o.hint}
                        </span>
                      </span>
                      {active && (
                        <Check size={16} weight="bold" className="shrink-0 text-accent" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={toggleSortDir}
        aria-label={
          sortDir === 'asc'
            ? 'Ordem crescente — tocar para inverter'
            : 'Ordem decrescente — tocar para inverter'
        }
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-border bg-bg-card text-text-primary active:scale-[0.97]"
      >
        {sortDir === 'asc' ? (
          <SortAscending size={18} weight="bold" />
        ) : (
          <SortDescending size={18} weight="bold" />
        )}
      </button>
    </div>
  )
}
