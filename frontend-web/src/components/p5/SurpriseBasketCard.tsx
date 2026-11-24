import Countdown from './Countdown';

interface SurpriseBasket {
  titre?: string;
  nomCommerce?: string;
  description?: string;
  prixInitial?: number | string;
  prixReduit?: number | string;
  quantiteDisponible?: number | string;
  horaireRecuperation?: string;
  dateExpiration?: string | number | Date;
}

export default function SurpriseBasketCard({ basket, onOrder }: { basket: SurpriseBasket, onOrder?: (b: SurpriseBasket) => void }) {
  if (!basket) return null;
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 max-w-sm hover:shadow-lg transition-shadow duration-300">
      <div className="relative bg-green-50 p-4 text-center">
        <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">🎁 Panier Surprise</span>
        <h3 className="text-lg font-bold text-gray-800 mt-2">{basket.titre || "Panier Anti-Gaspi"}</h3>
        <p className="text-sm text-gray-600">{basket.nomCommerce || "Commerçant partenaire"}</p>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">{basket.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400 line-through mr-2">{basket.prixInitial} TND</span>
            <span className="text-xl font-extrabold text-green-600">{basket.prixReduit} TND</span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Stock : {basket.quantiteDisponible}</span>
        </div>
        <div className="text-xs text-gray-500 bg-orange-50 p-2 rounded-md">📍 Retrait : {basket.horaireRecuperation}</div>
        <div className="pt-2">
          <Countdown
            targetDate={
              basket.dateExpiration
                ? typeof basket.dateExpiration === "number"
                  ? new Date(basket.dateExpiration)
                  : typeof basket.dateExpiration === "string"
                    ? basket.dateExpiration
                    : basket.dateExpiration
                : new Date()
            }
          />
        </div>
        <button onClick={() => onOrder && onOrder(basket)} className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
          Commander ce panier
        </button>
      </div>
    </div>
  );
}