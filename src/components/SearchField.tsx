import { MagnifyingGlass, X } from '@phosphor-icons/react'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function SearchField({ value, onChange }: Props) {
  return (
    <div className="relative">
      <MagnifyingGlass
        size={18}
        weight="bold"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        type="search"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por título…"
        aria-label="Buscar jogos por título"
        className="h-12 w-full rounded-input border border-border bg-bg-card pl-10 pr-10 font-body text-base text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-input text-text-muted active:scale-90"
        >
          <X size={18} weight="bold" />
        </button>
      )}
    </div>
  )
}
