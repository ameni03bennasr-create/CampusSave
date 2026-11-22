import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import OfferCard from '../../features/offers/components/OfferCard';
import { mockOffers } from '../../features/offers/data/mockOffers';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [offers, setOffers] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchOffers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'offers'));
      const offersData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setOffers(offersData);
    } catch (error) {
      console.error("Erreur lors de la récupération des offres:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchOffers();
}, []);


  // Liste unique des catégories pour le filtre
  const categories = ['Tous', ...new Set(offers.map(o => o.category))];

  // Logique de filtrage
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-800 mb-2">Explorer les offres 🔍</h1>
        <p className="text-stone-500">Trouvez les meilleures offres près de chez vous.</p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-2xl border border-[#E9C98B] shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Rechercher un plat, un commerce..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 rounded-xl border border-stone-200 focus:border-[#D98245] outline-none"
        />
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-stone-200 focus:border-[#D98245] outline-none bg-white text-stone-700"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Grille d'offres */}
      {filteredOffers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
          <p className="text-lg text-stone-500">Aucune offre ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <OfferCard 
              key={offer.id} 
              offer={offer} 
              userRole="student" 
              onView={() => navigate(`/offer/${offer.id}`)} 
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default ExplorePage;