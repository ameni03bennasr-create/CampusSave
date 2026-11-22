/** Raised by a service whose backend integration does not exist yet (Step 3+). */
export class ServiceUnavailableError extends Error {
  constructor(message = 'Ce service n’est pas encore disponible. Veuillez réessayer plus tard.') {
    super(message)
    this.name = 'ServiceUnavailableError'
  }
}

/** User-facing message for any error thrown by a service call. */
export function errorMessage(err: unknown): string {
  if (err instanceof ServiceUnavailableError) return err.message
  if (err instanceof Error && err.message) return err.message
  return 'Une erreur est survenue. Veuillez réessayer.'
}
