import React, { useState } from 'react';
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

// Import de vos composants G3 et données mock
import OfferCard from './features/offers/components/OfferCard';
import MerchantCard from './features/merchants/components/MerchantCard';
import { mockOffers } from './features/offers/data/mockOffers';
import { mockMerchants } from './features/merchants/data/mockMerchants';

// --- PAGES AVEC INTÉGRATION DES COMPOSANTS G3 ---

// 1. Page Explorer (Étudiant)
const ExplorePage = () => {
  // On simule que l'étudiant voit les offres
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Explorer les offres 🔍</h1>
      {mockOffers.length === 0 ? (
        <p className="text-stone-500">Aucune offre disponible pour le moment.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {mockOffers.map((offer) => (
            <OfferCard 
              key={offer.id} 
              offer={offer} 
              userRole="student" 
              onView={(id) => alert(`Voir l'offre ${id}`)} 
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

// 2. Dashboard Commerçant
const MerchantDashboard = () => {
  const currentMerchant = mockMerchants[0]; // On simule que Karim est le premier commerçant
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Espace Commerçant 🏪</h1>
      
      {/* Affichage de la carte commerçant */}
      <h2 className="text-xl font-semibold mb-4">Ma Fiche Établissement</h2>
      <MerchantCard merchant={currentMerchant} />

      {/* Affichage des offres du commerçant */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Mes Offres Publiées</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {mockOffers.map((offer) => (
          <OfferCard 
            key={offer.id} 
            offer={offer} 
            userRole="merchant" 
            onEdit={(id) => alert(`Modifier l'offre ${id}`)}
            onDelete={(id) => alert(`Supprimer l'offre ${id}`)}
          />
        ))}
      </div>
    </MainLayout>
  );
};

const AdminDashboard = () => <MainLayout><h1 className="text-2xl font-bold">Espace Administrateur 🛡️</h1><p className="mt-2 text-stone-500">Supervision de la plateforme.</p></MainLayout>;
const StudentDashboard = () => <MainLayout><h1 className="text-2xl font-bold">Espace Étudiant 🎓</h1><p className="mt-2 text-stone-500">Bienvenue sur votre tableau de bord.</p><Button className="mt-4" onClick={() => window.location.href='/profile'}>Mon Profil</Button></MainLayout>;
const OrdersPage = () => <MainLayout><h1 className="text-2xl font-bold">Mes Commandes 📦</h1><p className="mt-2 text-stone-500">Cette page affichera l'historique de vos commandes.</p></MainLayout>;
const Unauthorized = () => <div className="p-10 text-center"><h1 className="text-2xl font-bold text-red-600">Accès Refusé 🚫</h1><Button onClick={() => window.location.href='/'} className="mt-4">Retour à l'accueil</Button></div>;

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