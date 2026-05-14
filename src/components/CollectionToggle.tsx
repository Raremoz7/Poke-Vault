import type { Collection } from '../hooks/useGames'

interface Props {
  collection: Collection
  setCollection: (value: Collection) => void
}

const OPTIONS: { value: Collection; label: string }[] = [
  { value: 'oficiais', label: 'Oficiais' },
  { value: 'hacks', label: 'ROM Hacks' },
]

export function CollectionToggle({ collection, setCollection }: Props) {
  return (
    <div
      className="flex gap-2"
      role="group"
      aria-label="Alternar entre ROMs oficiais e ROM hacks"
    >
      {OPTIONS.map((opt) => {
        const active = collection === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setCollection(opt.value)}
            aria-pressed={active}
            className={`h-11 flex-1 rounded-pill border px-4 font-display text-sm font-semibold transition-colors active:scale-[0.97] ${
              active
                ? 'border-accent bg-accent text-text-primary'
                : 'border-border bg-bg-card text-text-muted'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
