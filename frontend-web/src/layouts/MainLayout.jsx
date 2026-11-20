import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8F1E7] flex flex-col font-sans">
      {/* La nouvelle barre de navigation horizontale */}
      <Navbar />

      {/* Contenu principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      
      {/* Footer simple */}
      <footer className="bg-white border-t border-[#E9C98B] py-6 text-center text-sm text-stone-500">
        <p>CampusSave © 2026 • Projet Intégrateur ESSECT Tunis</p>
        <p className="text-xs mt-1">Moins de gaspillage, plus de partage.</p>
      </footer>
    </div>
  );
};

export default MainLayout;