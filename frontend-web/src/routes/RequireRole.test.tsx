import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { AuthState } from '@/context/AuthContext'
import { AuthProvider } from '@/context/AuthProvider'
import { RequireRole } from '@/routes/RequireRole'

function renderAt(auth: AuthState) {
  return render(
    <AuthProvider value={auth}>
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/dashboard" element={<RequireRole role="admin"><p>admin area</p></RequireRole>} />
          <Route path="/admin/login" element={<p>admin login</p>} />
          <Route path="/student" element={<p>student home</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('RequireRole', () => {
  it('sends unauthenticated visitors to the space login', () => {
    renderAt({ status: 'unauthenticated', user: null })
    expect(screen.getByText('admin login')).toBeInTheDocument()
    expect(screen.queryByText('admin area')).not.toBeInTheDocument()
  })
  it('never shows protected content while loading', () => {
    const { container } = renderAt({ status: 'loading', user: null })
    expect(screen.queryByText('admin area')).not.toBeInTheDocument()
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull()
  })
  it('redirects a user with the wrong role to their own space', () => {
    renderAt({ status: 'authenticated', user: { uid: 'u1', role: 'student', email: null } })
    expect(screen.getByText('student home')).toBeInTheDocument()
    expect(screen.queryByText('admin area')).not.toBeInTheDocument()
  })
  it('renders children for the right role', () => {
    renderAt({ status: 'authenticated', user: { uid: 'a1', role: 'admin', email: null } })
    expect(screen.getByText('admin area')).toBeInTheDocument()
  })
})
