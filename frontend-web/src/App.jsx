import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import des pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/common/Profile';
import ComponentsDemo from './pages/common/ComponentsDemo';
import MainLayout from './layouts/MainLayout';
import Button from './components/Button';

// Import des nouvelles pages Étudiant
import ExplorePage from './pages/student/ExplorePage';
import OfferDetails from './pages/student/OfferDetails';

// Import composants pour le Dashboard Commerçant
import MerchantCard from './features/merchants/components/MerchantCard';
import OfferCard from './features/offers/components/OfferCard';
import { mockOffers } from './features/offers/data/mockOffers';
import { mockMerchants } from './features/merchants/data/mockMerchants';

// --- PAGES FACTICES ---
const MerchantDashboard = () => {
  const currentMerchant = mockMerchants[0];
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Espace Commerçant 🏪</h1>
      <h2 className="text-xl font-semibold mb-4">Ma Fiche Établissement</h2>
      <MerchantCard merchant={currentMerchant} />
      <h2 className="text-xl font-semibold mt-10 mb-4">Mes Offres Publiées</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOffers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} userRole="merchant" onEdit={(id) => alert(`Modifier ${id}`)} onDelete={(id) => alert(`Supprimer ${id}`)} />
        ))}
      </div>
    </MainLayout>
  );
};

const StudentDashboard = () => <MainLayout><h1 className="text-2xl font-bold">Espace Étudiant 🎓</h1><p className="mt-2 text-stone-500">Bienvenue sur votre tableau de bord.</p><Button className="mt-4" onClick={() => window.location.href='/profile'}>Mon Profil</Button></MainLayout>;
const AdminDashboard = () => <MainLayout><h1 className="text-2xl font-bold">Espace Administrateur 🛡️</h1></MainLayout>;
const OrdersPage = () => <MainLayout><h1 className="text-2xl font-bold">Mes Commandes 📦</h1><p className="mt-2 text-stone-500">Historique de vos commandes (à venir).</p></MainLayout>;
const Unauthorized = () => <div className="p-10 text-center"><h1 className="text-2xl font-bold text-red-600">Accès Refusé 🚫</h1><Button onClick={() => window.location.href='/'} className="mt-4">Retour</Button></div>;

// --- ROUTEUR PRINCIPAL ---
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/demo" element={<ComponentsDemo />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/offer/:id" element={<OfferDetails />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['etudiant']} />}>
        <Route path="/etudiant" element={<StudentDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['commercant']} />}>
        <Route path="/commercant" element={<MerchantDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;