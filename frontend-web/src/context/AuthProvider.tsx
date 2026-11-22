import { useState, type ReactNode } from 'react';
import { AuthContext, type AuthUser, type AuthStatus, type UserRole } from './AuthContext';
import { authService } from '@/services/authService';

export function AuthProvider({ children }: { children: ReactNode }) {
  // L'initialisation paresseuse évite l'erreur "setState in useEffect"
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('campusSave_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [status, setStatus] = useState<AuthStatus>(() => {
    const savedUser = localStorage.getItem('campusSave_session');
    return savedUser ? 'authenticated' : 'unauthenticated';
  });

  const login = async (role: UserRole, email: string, password: string) => {
    const loggedUser = await authService.signIn(role, email, password);
    setUser(loggedUser);
    setStatus('authenticated');
    localStorage.setItem('campusSave_session', JSON.stringify(loggedUser));
  };

  const logout = () => {
    setUser(null);
    setStatus('unauthenticated');
    localStorage.removeItem('campusSave_session');
  };

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}