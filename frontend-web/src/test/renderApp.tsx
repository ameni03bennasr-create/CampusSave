import { render } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import AppRoutes from '@/app/AppRoutes'
import type { AuthState } from '@/context/AuthContext'
import { AuthProvider } from '@/context/AuthProvider'

export const ANONYMOUS: AuthState = { status: 'unauthenticated', user: null }
export const asRole = (role: 'student' | 'merchant' | 'admin'): AuthState => ({
  status: 'authenticated',
  user: { uid: `test-${role}`, role, email: null },
})

function Where() {
  return <output data-testid="where">{useLocation().pathname}</output>
}

export function renderApp(path: string, auth: AuthState = ANONYMOUS) {
  return render(
    <AuthProvider value={auth}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
        <Where />
      </MemoryRouter>
    </AuthProvider>
  )
}
