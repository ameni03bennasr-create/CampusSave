import { ServiceUnavailableError } from '@/services/errors'
import type { UserRole } from '@/context/AuthContext'
import type { MerchantRegistrationForm } from '@/types/merchant'
import type { StudentRegistrationForm } from '@/types/student'

/**
 * Authentication contract used by the login / registration screens.
 * Step 4 replaces `authService` with the Firebase Authentication + backend implementation.
 * Until then every call fails honestly: no authentication or account creation is ever simulated.
 */
export interface AuthService {
  signIn(role: UserRole, email: string, password: string): Promise<void>
  signUpStudent(input: StudentRegistrationForm): Promise<void>
  /** Merchant account request: stays "pending" until an administrator approves it. */
  requestMerchantAccount(input: MerchantRegistrationForm): Promise<void>
  sendPasswordReset(email: string): Promise<void>
  signOut(): Promise<void>
}

const unavailable = () =>
  Promise.reject(new ServiceUnavailableError('Le service d’authentification n’est pas encore connecté. Veuillez réessayer plus tard.'))

export const authService: AuthService = {
  signIn: unavailable,
  signUpStudent: unavailable,
  requestMerchantAccount: unavailable,
  sendPasswordReset: unavailable,
  // Nothing to revoke while no session can exist.
  signOut: () => Promise.resolve(),
}
