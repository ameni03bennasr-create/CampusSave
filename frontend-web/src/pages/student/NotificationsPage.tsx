import {
  Bell,
  ChevronRight,
  Clock,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import type { StudentNotification } from '@/types/student';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 13 – NOTIFICATIONS
// ============================================================================
interface NotificationsPageProps {
  notifications: StudentNotification[];
  onMarkAllRead: () => void;
  onToggleRead: (id: string) => void;
  onOpenOrder: (orderId: string) => void;
}

export function NotificationsPage({ notifications, onMarkAllRead, onToggleRead, onOpenOrder }: NotificationsPageProps) {
  const getIconConfig = (type: string) => {
    switch (type) {
      case 'payment':
        return { icon: CreditCard, bg: 'bg-[#4C6749]/15', color: 'text-[#4C6749]', label: 'Paiement' };
      case 'pickup':
        return { icon: Clock, bg: 'bg-[#D98245]/15', color: 'text-[#D98245]', label: 'Rappel retrait' };
      case 'reservation':
        return { icon: ShoppingBag, bg: 'bg-[#E9C98B]/50', color: 'text-[#A84F32]', label: 'Réservation' };
      default:
        return { icon: Bell, bg: 'bg-stone-100', color: 'text-stone-700', label: 'Mise à jour' };
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Notifications</h1>
          <p className="text-sm text-stone-500 mt-1">
            Alertes de réservation, confirmations de paiement et rappels de récupération.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E9C98B] hover:bg-[#F8F1E7] text-stone-800 text-xs font-bold"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {notifications.length === 0 && (
        <EmptyState
          icon={Bell}
          title="Aucune notification pour le moment."
          description="Vos alertes de réservation, de paiement et de retrait apparaîtront ici."
        />
      )}

      <div className="space-y-3">
        {notifications.map((notif) => {
          const cfg = getIconConfig(notif.type);
          const Icon = cfg.icon;
          return (
            <div
              key={notif.id}
              className={`rounded-2xl p-5 border transition-all flex items-start justify-between gap-4 ${
                notif.read
                  ? 'bg-white/80 border-stone-200/80'
                  : 'bg-white border-[#A84F32]/40 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F8F1E7] text-stone-700">
                      {cfg.label}
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

                  {notif.orderId && (
                    <button
                      onClick={() => onOpenOrder(notif.orderId)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#A84F32] hover:underline"
                    >
                      Consulter la commande {notif.orderId}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => onToggleRead(notif.id)}
                className="text-xs font-semibold text-stone-400 hover:text-stone-700 shrink-0"
                title={notif.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
              >
                {notif.read ? 'Non lu' : 'Lu ✓'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
