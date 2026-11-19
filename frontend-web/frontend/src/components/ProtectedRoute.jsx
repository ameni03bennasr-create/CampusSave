import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // 1. Si pas connecté -> redirection vers login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si connecté mais rôle non autorisé -> redirection vers une page "Accès refusé" ou son propre dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Sinon, on affiche la page demandée
  return <Outlet />;
};

export default ProtectedRoute;