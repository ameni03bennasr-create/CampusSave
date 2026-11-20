import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import MerchantOrdersPage from './pages/merchant/MerchantOrdersPage';

// Pages publiques
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import Unauthorized from './pages/auth/Unauthorized'; // (Si vous l'avez dans un fichier séparé)
import AdminDashboard from './pages/admin/AdminDashboard';

// Pages communes
import Profile from './pages/common/Profile';
import ComponentsDemo from './pages/common/ComponentsDemo';
import MainLayout from './layouts/MainLayout';
import Button from './components/Button';

// Pages Étudiant
import StudentDashboard from './pages/student/StudentDashboard';
import ExplorePage from './pages/student/ExplorePage';
import OfferDetails from './pages/student/OfferDetails';
import CartPage from './pages/student/CartPage';
import CheckoutPage from './pages/student/CheckoutPage';
import OrdersPage from './pages/student/OrdersPage';

// Pages Commerçant
import OfferFormPage from './pages/merchant/OfferFormPage';
import MerchantCard from './features/merchants/components/MerchantCard';
import OfferCard from './features/offers/components/OfferCard';
import { mockOffers } from './features/offers/data/mockOffers';
import { mockMerchants } from './features/merchants/data/mockMerchants';

// Dashboard Commerçant
const MerchantDashboard = () => {
  const navigate = useNavigate();
  const currentMerchant = mockMerchants[0];
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Espace Commerçant 🏪</h1>
        <Button onClick={() => navigate('/merchant/offer/new')} className="bg-[#4C6749] hover:bg-[#3d543a] text-white">
          + Ajouter une offre
        </Button>
      </div>
      <h2 className="text-xl font-semibold mb-4 text-stone-700">Ma Fiche Établissement</h2>
      <MerchantCard merchant={currentMerchant} />
      <h2 className="text-xl font-semibold mt-10 mb-4 text-stone-700">Mes Offres Publiées</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} userRole="merchant" onEdit={(id) => navigate(`/merchant/offer/edit/${id}`)} onDelete={(id) => alert(`Supprimer ${id}`)} />
        ))}
      </div>
    </MainLayout>
  );
};

// Dashboard Admin
<Route element={<ProtectedRoute allowedRoles={['admin']} />}>
  <Route path="/admin" element={<AdminDashboard />} />
</Route>

const AppRoutes = () => {
  return (
    <Routes>
      {/* ROUTES PUBLIQUES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ROUTES COMMUNES (Connecté, peu importe le rôle) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<OrdersPage />} /> {/* L'historique s'adapte au rôle */}
      </Route>

      {/* ROUTES ÉTUDIANT UNIQUEMENT */}
      <Route element={<ProtectedRoute allowedRoles={['etudiant']} />}>
        <Route path="/etudiant" element={<StudentDashboard />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/offer/:id" element={<OfferDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      {/* ROUTES COMMERÇANT UNIQUEMENT */}
       <Route element={<ProtectedRoute allowedRoles={['commercant']} />}>
        <Route path="/commercant" element={<MerchantDashboard />} />
        <Route path="/merchant/offer/new" element={<OfferFormPage />} />
        <Route path="/merchant/offer/edit/:id" element={<OfferFormPage />} />
        {/* Ajoutez cette ligne */}
        <Route path="/merchant/orders" element={<MerchantOrdersPage />} />
      </Route>

      {/* ROUTES ADMIN UNIQUEMENT */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* REDIRECTIONS */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;