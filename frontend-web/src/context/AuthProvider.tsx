import type { ReactNode } from 'react'
import { AuthContext, type AuthState } from '@/context/AuthContext'

interface AuthProviderProps {
  value: AuthState
  children: ReactNode
}

/** Thin provider: Step 4 replaces the `value` source with a Firebase auth listener. */
export function AuthProvider({ value, children }: AuthProviderProps) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
