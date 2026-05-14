import { PokeballIcon } from './PokeballIcon'

interface Props {
  onReset: () => void
}

export function EmptyState({ onReset }: Props) {
  return (
    <div className="col-span-full flex flex-col items-center gap-4 py-20 text-center">
      <PokeballIcon size={56} muted />
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold text-text-primary">
          Nenhum jogo com esse filtro
        </p>
        <p className="font-body text-sm text-text-muted">
          Tente outro console ou apague a busca.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="h-11 rounded-pill border border-accent px-5 font-display text-sm font-semibold text-text-primary active:scale-[0.97]"
      >
        Limpar filtros
      </button>
    </div>
  )
}
