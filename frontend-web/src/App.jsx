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

// --- PAGES FACTICES POUR TESTER LES RÔLES ---
const StudentDashboard = () => <MainLayout><h1 className="text-2xl font-bold">Espace Étudiant 🎓</h1><p className="mt-2 text-stone-500">Bienvenue sur votre tableau de bord.</p><Button className="mt-4" onClick={() => window.location.href='/profile'}>Mon Profil</Button></MainLayout>;
const MerchantDashboard = () => <MainLayout><h1 className="text-2xl font-bold">Espace Commerçant 🏪</h1><p className="mt-2 text-stone-500">Gérez vos offres ici.</p></MainLayout>;
const AdminDashboard = () => <MainLayout><h1 className="text-2xl font-bold">Espace Administrateur 🛡️</h1><p className="mt-2 text-stone-500">Supervision de la plateforme.</p></MainLayout>;
const Unauthorized = () => <div className="p-10 text-center"><h1 className="text-2xl font-bold text-red-600">Accès Refusé 🚫</h1><p>Vous n'avez pas les permissions pour voir cette page.</p><Button onClick={() => window.location.href='/'} className="mt-4">Retour à l'accueil</Button></div>;

// --- ROUTEUR PRINCIPAL ---
const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Route de démo pour G3 */}
      <Route path="/demo" element={<ComponentsDemo />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
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

      {/* Redirection par défaut */}
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