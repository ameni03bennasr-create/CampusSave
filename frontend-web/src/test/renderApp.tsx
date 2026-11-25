
import { render } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import AppRoutes from '@/app/AppRoutes';
import { CartProvider } from '@/context/CartContext';
import {
  AuthContext,
  type AuthContextType,
  type UserRole,
} from '@/context/AuthContext';

export const ANONYMOUS: AuthContextType = {
  status: 'unauthenticated',
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
};

export const asRole = (role: UserRole): AuthContextType => ({
  status: 'authenticated',
  user: { uid: `test-${role}`, role, email: null },
  login: vi.fn(),
  logout: vi.fn(),
});

function Where() {
  return <output data-testid="where">{useLocation().pathname}</output>;
}

export function renderApp(
  path: string,
  auth: AuthContextType = ANONYMOUS
) {
  localStorage.removeItem('campusSaveCart');

  return render(
    <AuthContext.Provider value={auth}>
      <CartProvider>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
          <Where />
        </MemoryRouter>
      </CartProvider>
    </AuthContext.Provider>
  );
}
