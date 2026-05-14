import { CONSOLE_META, CONSOLE_ORDER, GAME_TYPES } from '../data/consoles'
import type { ConsoleFilter, TypeFilter } from '../hooks/useGames'

interface Props {
  consoleFilter: ConsoleFilter
  setConsoleFilter: (value: ConsoleFilter) => void
  typeFilter: TypeFilter
  setTypeFilter: (value: TypeFilter) => void
  showTypeFilter?: boolean
}

export function FilterBar({
  consoleFilter,
  setConsoleFilter,
  typeFilter,
  setTypeFilter,
  showTypeFilter = true,
}: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* console — color-coded chips, horizontally scrollable */}
      <div
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4"
        role="group"
        aria-label="Filtrar por console"
      >
        <ConsoleChip
          label="Todos"
          active={consoleFilter === 'Todos'}
          onClick={() => setConsoleFilter('Todos')}
        />
        {CONSOLE_ORDER.map((c) => (
          <ConsoleChip
            key={c}
            label={CONSOLE_META[c].short}
            color={CONSOLE_META[c].colorVar}
            active={consoleFilter === c}
            onClick={() => setConsoleFilter(c)}
          />
        ))}
      </div>

      {/* type — secondary, smaller, separated by spacing hierarchy */}
      {showTypeFilter && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
          <TypeChip
            label="Todos os tipos"
            active={typeFilter === 'Todos'}
            onClick={() => setTypeFilter('Todos')}
          />
          {GAME_TYPES.map((t) => (
            <TypeChip
              key={t}
              label={t}
              active={typeFilter === t}
              onClick={() => setTypeFilter(t)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ConsoleChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string
  color?: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex h-11 shrink-0 items-center gap-2 rounded-chip border px-3.5 font-mono text-sm font-medium uppercase tracking-wide transition-colors active:scale-[0.97]"
      style={{
        borderColor: active ? color ?? 'var(--color-accent)' : 'var(--color-border)',
        backgroundColor: active ? 'var(--color-bg-card-hover)' : 'var(--color-bg-card)',
        color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color ?? 'var(--color-text-muted)' }}
      />
      {label}
    </button>
  )
}

function TypeChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-9 rounded-pill border px-3.5 font-body text-[13px] transition-colors active:scale-[0.97] ${
        active
          ? 'border-accent bg-accent-soft text-text-primary'
          : 'border-border bg-bg-card text-text-muted'
      }`}
    >
      {label}
    </button>
  )
}
