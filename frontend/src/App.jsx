import React from 'react';
import MainLayout from './layouts/MainLayout';
import Card from './components/Card';
import Button from './components/Button';
import { Clock, MapPin } from 'lucide-react';

function App() {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-stone-900">Bonjour, Yasmine 👋</h1>
        <p className="text-sm text-stone-500 mt-1">Découvrez les invendus du jour autour de l'ESSECT.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Exemple de Carte */}
        <Card>
          <div className="h-40 bg-stone-200 relative">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" 
              alt="Plat" 
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 bg-terracotta text-white text-xs font-bold px-2 py-1 rounded-lg">-54%</span>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-stone-900">Escalope Grillée & Riz</h3>
            <p className="text-xs text-orange font-bold mt-1">Bistro Montfleury</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-lg font-extrabold text-olive">5,50 DT</span>
              <span className="text-xs text-stone-400 line-through">12,00 DT</span>
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs text-stone-500">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> 14h - 15h30</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> 120m</span>
            </div>
            <Button className="w-full mt-4">Réserver</Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default App;