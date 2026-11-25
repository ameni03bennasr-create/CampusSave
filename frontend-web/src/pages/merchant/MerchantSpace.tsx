
import { ClipboardList, Tag } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { EstablishmentManagementPage } from '@/pages/merchant/EstablishmentManagementPage';
import { MerchantDashboardPage } from '@/pages/merchant/MerchantDashboardPage';
import { MerchantLoginPage } from '@/pages/merchant/MerchantLoginPage';
import { MerchantNotificationsPage } from '@/pages/merchant/MerchantNotificationsPage';
import { MerchantProfileSettingsPage } from '@/pages/merchant/MerchantProfileSettingsPage';
import { MerchantRegisterPage } from '@/pages/merchant/MerchantRegisterPage';
import { MerchantStatisticsPage } from '@/pages/merchant/MerchantStatisticsPage';
import { OfferFormPage } from '@/pages/merchant/OfferFormPage';
import { OffersManagementPage } from '@/pages/merchant/OffersManagementPage';
import { OrderDetailsPage } from '@/pages/merchant/OrderDetailsPage';
import { OrdersManagementPage } from '@/pages/merchant/OrdersManagementPage';
import { QrScannerValidationPage } from '@/pages/merchant/QrScannerValidationPage';
import { MerchantAuthLayout } from '@/layouts/MerchantAuthLayout';
import { MerchantLayout } from '@/layouts/MerchantLayout';
import { useMerchantWorkspace } from '@/hooks/useMerchantWorkspace';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ALL_13_PAGES, MERCHANT_BASE_PATH, MERCHANT_DEFAULT_PAGE } from '@/config/merchantPages';
import { SpaceGate } from '@/routes/SpaceGate';
import { useAuth } from '@/hooks/useAuth';
import { registerMerchant } from '@/services/registrationService';
import { authService } from '@/services/authService';


/** Merchant space: composes the workspace state, the layouts and the page switch. */
export default function MerchantSpace() {
  const ws = useMerchantWorkspace();
  const { login, logout } = useAuth();

  const {
    currentPage,
    isAuthPage,
    isKnownPage,
    navigateTo,
    merchant,
    setMerchant,
    showToast,
    establishment,
    offers,
    orders,
    setEstablishment,
    handleDeleteOffer,
    handleAddOffer,
    editingOfferId,
    setEditingOfferId,
    handleUpdateOffer,
    selectedOrderId,
    prefillQrCode,
    handleValidateQrCode,
    notifications,
    setNotifications
  } = ws;

  useDocumentTitle(ALL_13_PAGES.find((p) => p.id === currentPage)?.label ?? '');

  const editingOffer = offers.find((o) => o.id === editingOfferId);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const authView = (
    <MerchantAuthLayout>
      {currentPage === 'register' ? (
        <MerchantRegisterPage
          onSubmit={registerMerchant}
          onGoLogin={() => navigateTo('login')}
        />
      ) : (
        <MerchantLoginPage
          onSubmit={async (email, password) => {
            await login('merchant', email, password);
            navigateTo('dashboard');
          }}
          onForgotPassword={(email) => authService.sendPasswordReset(email)}
          onGoRegister={() => navigateTo('register')}
        />
      )}
    </MerchantAuthLayout>
  );

  const appView = (
    <MerchantLayout ws={ws}>
      {currentPage === 'dashboard' && (
        <MerchantDashboardPage
          merchant={merchant}
          establishment={establishment}
          offers={offers}
          orders={orders}
          onNavigate={navigateTo}
        />
      )}

      {currentPage === 'establishment' && (
        <EstablishmentManagementPage
          establishment={establishment}
          onSave={(updated) => {
            setEstablishment(updated);
            showToast('Les informations de votre établissement ont été mises à jour.');
          }}
        />
      )}

      {currentPage === 'offers' && (
        <OffersManagementPage
          offers={offers}
          onNavigate={navigateTo}
          onDeleteOffer={handleDeleteOffer}
        />
      )}

      {currentPage === 'add-offer' && (
        <OfferFormPage
          mode="create"
          onSubmit={handleAddOffer}
          onCancel={() => navigateTo('offers')}
        />
      )}

      {currentPage === 'edit-offer' &&
        (editingOffer ? (
          <OfferFormPage
            mode="edit"
            offersList={offers}
            initialOffer={editingOffer}
            onSelectOfferId={(id) => setEditingOfferId(id)}
            onSubmit={handleUpdateOffer}
            onCancel={() => navigateTo('offers')}
          />
        ) : (
          <EmptyState
            icon={Tag}
            title="Aucune offre à modifier"
            description="Sélectionnez une offre depuis « Mes offres » pour la modifier."
            action={{ label: 'Voir mes offres', onClick: () => navigateTo('offers') }}
          />
        ))}

      {currentPage === 'orders' && (
        <OrdersManagementPage orders={orders} onNavigate={navigateTo} />
      )}

      {currentPage === 'order-details' &&
        (selectedOrder ? (
          <OrderDetailsPage order={selectedOrder} onNavigate={navigateTo} />
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="Aucune commande sélectionnée"
            description="Ouvrez une commande depuis la liste des réservations pour en voir le détail."
            action={{ label: 'Voir les commandes', onClick: () => navigateTo('orders') }}
          />
        ))}

      {currentPage === 'qr-scanner' && (
        <QrScannerValidationPage
          initialCode={prefillQrCode}
          onValidateQr={handleValidateQrCode}
        />
      )}

      {currentPage === 'statistics' && (
        <MerchantStatisticsPage offers={offers} orders={orders} />
      )}

      {currentPage === 'notifications' && (
        <MerchantNotificationsPage
          notifications={notifications}
          onMarkAllRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            showToast('Toutes les notifications ont été marquées comme lues.');
          }}
          onToggleRead={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
            )
          }
          onOpenTarget={(page, targetId) => {
            if (page === 'order-details') navigateTo('order-details', { orderId: targetId });
            else if (page === 'edit-offer') navigateTo('edit-offer', { offerId: targetId });
          }}
        />
      )}

      {currentPage === 'settings' && (
        <MerchantProfileSettingsPage
          merchant={merchant}
          establishment={establishment}
          onUpdateMerchant={(updated) => {
            setMerchant(updated);
            showToast('Paramètres du compte commerçant enregistrés.');
          }}
          onLogout={async () => {
            await logout();
            navigateTo('login');
          }}
        />
      )}
    </MerchantLayout>
  );

  return (
    <SpaceGate
      role="merchant"
      basePath={MERCHANT_BASE_PATH}
      defaultPage={MERCHANT_DEFAULT_PAGE}
      isKnownPage={isKnownPage}
      isAuthPage={isAuthPage}
      authView={authView}
      appView={appView}
    />
  );
}
