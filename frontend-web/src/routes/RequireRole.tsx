import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { DEV_BYPASS_AUTH } from '@/config/devAuth'
import type { UserRole } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth'

interface RequireRoleProps {
  role: UserRole
  children: ReactNode
  /** Where to send unauthenticated visitors (default: the space's login page). */
  loginPath?: string
}

/**
 * Route guard: renders `children` only for an authenticated user holding `role`.
 * - loading         -> loading screen (no flash of protected content)
 * - unauthenticated -> that space's login page
 * - wrong role      -> the user's own space (never the requested one)
 * This is a UX guard only: every API call is re-authorized by the backend (Step 3).
 */
export function RequireRole({ role, children, loginPath }: RequireRoleProps) {
  const { status, user } = useAuth()
  if (DEV_BYPASS_AUTH) return <>{children}</>
  if (status === 'loading') return <LoadingScreen />
  if (status !== 'authenticated' || !user) return <Navigate to={loginPath ?? `/${role}/login`} replace />
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />
  return <>{children}</>
}
