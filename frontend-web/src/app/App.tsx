import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/app/AppRoutes'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { AuthProvider } from '@/context/AuthProvider'
import { CartProvider } from '@/context/CartContext'; // <-- Ajoutez ceci


/** No session exists until Step 4 (Firebase Authentication): everyone starts unauthenticated. */
const NO_SESSION = { status: 'unauthenticated', user: null } as const

export default function App() {
  return (
   <ErrorBoundary>
  <AuthProvider value={NO_SESSION}>
    <CartProvider> {/* <-- Ajoutez ceci */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </CartProvider> {/* <-- Et ceci */}
  </AuthProvider>
</ErrorBoundary>)
}
