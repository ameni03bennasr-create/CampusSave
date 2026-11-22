import { createContext } from 'react'

export type UserRole = 'student' | 'merchant' | 'admin'
export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated'

export interface AuthUser {
  uid: string
  role: UserRole
  email: string | null
}

export interface AuthState {
  status: AuthStatus
  user: AuthUser | null
}

/**
 * Authentication state contract. Step 4 provides the real value from Firebase Authentication
 * (+ the role claim verified by the backend). Until then nobody is authenticated by default.
 */
export const AuthContext = createContext<AuthState>({ status: 'unauthenticated', user: null })
