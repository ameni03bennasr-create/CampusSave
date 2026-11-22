/** Temporary client-side identifier for records created in memory before the backend assigns a real one. */
export function localId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

/** "Aujourd’hui, 14:18" — label for events created in this session. */
export function nowLabel(date: Date = new Date()): string {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `Aujourd’hui, ${hh}:${mm}`
}
