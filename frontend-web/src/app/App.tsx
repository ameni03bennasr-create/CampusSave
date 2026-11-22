import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@/app/AppRoutes';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/context/AuthProvider';
import { CartProvider } from '@/context/CartContext'; // <-- N'oubliez pas votre panier

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}