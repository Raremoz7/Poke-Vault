export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-bg-card">
      <div className="skeleton-pulse aspect-[3/4] w-full bg-bg-card-hover" />
      <div className="space-y-2 p-3">
        <div className="skeleton-pulse h-3 w-3/4 rounded-chip bg-bg-card-hover" />
        <div className="skeleton-pulse h-3 w-1/3 rounded-chip bg-bg-card-hover" />
        <div className="skeleton-pulse mt-3 h-9 w-full rounded-pill bg-bg-card-hover" />
      </div>
    </div>
  )
}
