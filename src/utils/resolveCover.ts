// remote covers are absolute URLs; local ones live under public/ and need the base path
export function resolveCover(url: string): string {
  const u = url.trim()
  if (u === '' || u.startsWith('http')) return u
  return import.meta.env.BASE_URL + u
}
