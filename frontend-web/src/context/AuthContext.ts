
import { createContext, useContext } from 'react'

export type UserRole =
  | 'student'
  | 'merchant'
  | 'merchant_pending'
  | 'association'
  | 'admin'

export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated'

export interface AuthUser {
  uid: string
  role: UserRole
  email: string | null
  name?: string
}

export interface AuthContextType {
  status: AuthStatus
  user: AuthUser | null
  login: (role: UserRole, email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider')
  }

  return context
}
