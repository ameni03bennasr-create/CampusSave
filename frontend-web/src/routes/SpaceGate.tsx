import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { UserRole } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth'
import { RequireRole } from '@/routes/RequireRole'

interface SpaceGateProps {
  role: UserRole
  basePath: string
  defaultPage: string
  isKnownPage: boolean
  /** True on the login / registration pages of the space (public). */
  isAuthPage: boolean
  /** Public authentication screens. */
  authView: ReactNode
  /** Protected application (sidebar layout + pages). */
  appView: ReactNode
}

/**
 * Decides what a space shows for the current URL:
 * - unknown page            -> the space's default page (itself guarded)
 * - login / register        -> public (an already signed-in user of this role is sent to their home)
 * - everything else         -> only for an authenticated user holding the space's role
 */
export function SpaceGate({ role, basePath, defaultPage, isKnownPage, isAuthPage, authView, appView }: SpaceGateProps) {
  const { status, user } = useAuth()
  if (!isKnownPage) return <Navigate to={`${basePath}/${defaultPage}`} replace />
  if (isAuthPage) {
    if (status === 'authenticated' && user?.role === role) return <Navigate to={`${basePath}/${defaultPage}`} replace />
    return <>{authView}</>
  }
  return (
    <RequireRole role={role} loginPath={`${basePath}/login`}>
      {appView}
    </RequireRole>
  )
}
