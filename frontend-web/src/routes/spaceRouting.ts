/**
 * Resolve the active page of a space from the URL.
 * "/student/explore" -> { page: 'explore', isKnownPage: true }
 * "/student" or "/student/unknown" -> { page: fallback, isKnownPage: false } (the Space redirects to the default page).
 */
export function resolveSpacePage<T extends string>(
  pathname: string,
  basePath: string,
  ids: readonly T[],
  fallback: T
): { page: T; isKnownPage: boolean } {
  const segment = pathname.slice(basePath.length).replace(/^\/+|\/+$/g, '').split('/')[0] ?? '';
  const isKnownPage = (ids as readonly string[]).includes(segment);
  return { page: isKnownPage ? (segment as T) : fallback, isKnownPage };
}
