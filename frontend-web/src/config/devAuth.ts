/**
 * DEVELOPMENT ONLY: lets each space be opened and tested without a backend.
 * Enabled only when running `npm run dev` with VITE_DEV_BYPASS_AUTH=true in `.env.development.local`.
 * `import.meta.env.DEV` is a build-time constant, so this whole code path is removed from production
 * bundles: in production, access always depends on the authenticated role.
 */
export const DEV_BYPASS_AUTH = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true'
