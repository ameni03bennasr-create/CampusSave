
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Development only: skip role guards. */
  readonly VITE_DEV_BYPASS_AUTH?: string

  /** Allowed student email domains. */
  readonly VITE_STUDENT_EMAIL_DOMAINS?: string

  /** Firebase Web configuration. */
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
