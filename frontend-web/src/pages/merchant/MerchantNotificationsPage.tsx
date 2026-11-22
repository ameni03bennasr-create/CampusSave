import { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  ChevronRight,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import type { MerchantNotification } from '@/types/merchant';
import type { MerchantPageId } from '@/config/merchantPages';

// ============================================================================
// PAGE 12 – NOTIFICATIONS COMMERÇANT
// ============================================================================
interface MerchantNotificationsPageProps {
  notifications: MerchantNotification[];
  onMarkAllRead: () => void;
  onToggleRead: (id: string) => void;
  onOpenTarget: (page: MerchantPageId, targetId: string) => void;
}

export function MerchantNotificationsPage({
  notifications,
  onMarkAllRead,
  onToggleRead,
  onOpenTarget
}: MerchantNotificationsPageProps) {
  const [filter, setFilter] = useState('all');

  const visibleNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  );

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'payment':
        return {
          icon: CreditCard,
          bg: 'bg-[#4C6749]/15',
          color: 'text-[#4C6749]',
          tag: 'Paiement confirmé'
        };
      case 'low_stock':
        return {
          icon: AlertTriangle,
          bg: 'bg-[#E9C98B]/50',
          color: 'text-[#8A4B1C]',
          tag: 'Stock faible'
        };
      case 'reservation':
        return {
          icon: ShoppingBag,
          bg: 'bg-[#D98245]/15',
          color: 'text-[#A84F32]',
          tag: 'Nouvelle réservation'
        };
      default:
        return {
          icon: Bell,
          bg: 'bg-stone-100',
          color: 'text-stone-700',
          tag: 'Mise à jour'
        };
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Notifications</h1>
          <p className="text-sm text-stone-500 mt-1">
            Nouvelles réservations, confirmations de paiement et alertes de stock faible.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700"
          >
            {filter === 'all' ? 'Afficher non lues' : 'Afficher toutes'}
          </button>
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2 rounded-xl bg-[#A84F32] text-white text-xs font-bold"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {visibleNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-sm text-stone-500 border border-[#E9C98B]/50">
            Aucune notification non lue.
          </div>
        ) : (
          visibleNotifications.map((notif) => {
            const cfg = getBadgeStyle(notif.type);
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                className={`rounded-2xl p-5 border transition-all flex items-start justify-between gap-4 ${
                  notif.read
                    ? 'bg-white/80 border-stone-200/80'
                    : 'bg-white border-[#A84F32]/45 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#F8F1E7] text-stone-700 text-[11px] font-bold">
                        {cfg.tag}
                      </span>
                      <span className="text-xs text-stone-400">{notif.timestamp}</span>
                      {!notif.read && (
                        <span className="px-2 py-0.5 rounded-full bg-[#A84F32] text-white text-[10px] font-bold">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">{notif.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.targetPage && (
                      <button
                        onClick={() => onOpenTarget(notif.targetPage, notif.targetId)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#A84F32] hover:underline"
                      >
                        Voir les détails ({notif.targetId})
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onToggleRead(notif.id)}
                  className="text-xs font-semibold text-stone-400 hover:text-stone-700 shrink-0"
                >
                  {notif.read ? 'Non lu' : 'Lu ✓'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
