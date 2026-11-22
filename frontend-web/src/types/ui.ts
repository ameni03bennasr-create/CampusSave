/** Shared UI types (toasts, page registry entries). */

export type ToastKind = 'success' | 'info' | 'error' | 'warning';

export interface ToastState {
  message: string;
  type: ToastKind;
}

/** One entry of a space's page registry (see config/*Pages.ts). */
export interface PageMeta {
  readonly id: string;
  readonly code: string;
  readonly label: string;
}

/** Inline feedback message (e.g. password change result). */
export interface FeedbackMessage {
  type: 'success' | 'error';
  text: string;
}
