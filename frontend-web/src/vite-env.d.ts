/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Development only: skip role guards so each space can be tested without a backend. Ignored in production builds. */
  readonly VITE_DEV_BYPASS_AUTH?: string
  /** Comma-separated e-mail domains allowed for student sign-up (empty = open registration). */
  readonly VITE_STUDENT_EMAIL_DOMAINS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
