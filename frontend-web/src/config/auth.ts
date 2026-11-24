/**
 * Optional restriction of student sign-ups to specific e-mail domains.
 * Empty (default) = any valid e-mail may register. Example: VITE_STUDENT_EMAIL_DOMAINS="essect.u-tunis.tn"
 * Client-side hint only: the backend (Step 3) enforces the same rule.
 */
export const STUDENT_EMAIL_DOMAINS: string[] = (import.meta.env.VITE_STUDENT_EMAIL_DOMAINS ?? '')
  .split(',')
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean)

export function isAllowedStudentEmail(email: string): boolean {
  if (!STUDENT_EMAIL_DOMAINS.length) return true
  const domain = email.trim().toLowerCase().split('@')[1] ?? ''
  return STUDENT_EMAIL_DOMAINS.includes(domain)
}
