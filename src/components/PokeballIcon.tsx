interface Props {
  size?: number
  className?: string
  /** Renders a flat, muted version used as the cover fallback. */
  muted?: boolean
}

export function PokeballIcon({ size = 24, className, muted = false }: Props) {
  const top = muted ? '#2a2a3a' : '#e63946'
  const shell = muted ? '#1a1a24' : '#13131a'
  const core = muted ? '#2a2a3a' : '#f0f0f5'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Pokébola"
    >
      <circle cx="32" cy="32" r="29" fill={shell} stroke="#2a2a3a" strokeWidth="2.5" />
      <path d="M3 32a29 29 0 0 1 58 0Z" fill={top} />
      <rect x="3" y="29" width="58" height="6" fill="#0a0a0f" />
      <circle cx="32" cy="32" r="9.5" fill="#0a0a0f" />
      <circle cx="32" cy="32" r="5" fill={core} />
    </svg>
  )
}
