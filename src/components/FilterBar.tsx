import { useEffect, useRef, useState } from 'react'
import { CaretDown, Check } from '@phosphor-icons/react'
import { CONSOLE_META, CONSOLE_ORDER, GAME_TYPES } from '../data/consoles'
import type { ConsoleFilter, TypeFilter } from '../hooks/useGames'

interface Props {
  consoleFilter: ConsoleFilter
  setConsoleFilter: (value: ConsoleFilter) => void
  typeFilter: TypeFilter
  setTypeFilter: (value: TypeFilter) => void
  showTypeFilter?: boolean
}

interface Option {
  value: string
  label: string
  color?: string
}

const consoleOptions: Option[] = [
  { value: 'Todos', label: 'Todos' },
  ...CONSOLE_ORDER.map((c) => ({
    value: c,
    label: CONSOLE_META[c].short,
    color: CONSOLE_META[c].colorVar,
  })),
]

const typeOptions: Option[] = [
  { value: 'Todos', label: 'Todos' },
  ...GAME_TYPES.map((t) => ({ value: t, label: t })),
]

export function FilterBar({
  consoleFilter,
  setConsoleFilter,
  typeFilter,
  setTypeFilter,
  showTypeFilter = true,
}: Props) {
  return (
    <div className="flex gap-2">
      <Dropdown
        label="Console"
        options={consoleOptions}
        value={consoleFilter}
        onChange={(v) => setConsoleFilter(v as ConsoleFilter)}
      />
      {showTypeFilter && (
        <Dropdown
          label="Tipo"
          options={typeOptions}
          value={typeFilter}
          onChange={(v) => setTypeFilter(v as TypeFilter)}
        />
      )}
    </div>
  )
}

function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: Option[]
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-11 w-full items-center gap-2 rounded-pill border border-border bg-bg-card px-3.5 text-left transition-colors active:scale-[0.99]"
      >
        {selected.color && (
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: selected.color }}
          />
        )}
        <span className="flex min-w-0 flex-1 flex-col leading-none">
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-text-muted">
            {label}
          </span>
          <span className="mt-0.5 truncate font-mono text-sm font-medium uppercase tracking-wide text-text-primary">
            {selected.label}
          </span>
        </span>
        <CaretDown
          size={14}
          weight="bold"
          className={`shrink-0 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-card border border-border bg-bg-card py-1 shadow-lg shadow-black/40"
        >
          {options.map((opt) => {
            const active = opt.value === value
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={`flex h-10 w-full items-center gap-2 px-3.5 text-left font-mono text-sm uppercase tracking-wide transition-colors ${
                    active
                      ? 'bg-bg-card-hover text-text-primary'
                      : 'text-text-muted active:bg-bg-card-hover'
                  }`}
                >
                  {opt.color ? (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: opt.color }}
                    />
                  ) : (
                    <span className="h-2 w-2 shrink-0" />
                  )}
                  <span className="flex-1 truncate">{opt.label}</span>
                  {active && <Check size={14} weight="bold" className="text-accent" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
