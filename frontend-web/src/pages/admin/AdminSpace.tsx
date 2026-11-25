
import { ClipboardList, Store, Users } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminOrderDetailsPage } from '@/pages/admin/AdminOrderDetailsPage';
import { AdminProfileSettingsPage } from '@/pages/admin/AdminProfileSettingsPage';
import { MerchantDetailsPage } from '@/pages/admin/MerchantDetailsPage';
import { MerchantManagementPage } from '@/pages/admin/MerchantManagementPage';
import { MerchantValidationPage } from '@/pages/admin/MerchantValidationPage';
import { OffersSupervisionPage } from '@/pages/admin/OffersSupervisionPage';
import { OrdersSupervisionPage } from '@/pages/admin/OrdersSupervisionPage';
import { PlatformStatisticsPage } from '@/pages/admin/PlatformStatisticsPage';
import { UserDetailsPage } from '@/pages/admin/UserDetailsPage';
import { UserManagementPage } from '@/pages/admin/UserManagementPage';
import { AdminAuthLayout } from '@/layouts/AdminAuthLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { useAdminWorkspace } from '@/hooks/useAdminWorkspace';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  ADMIN_BASE_PATH,
  ADMIN_DEFAULT_PAGE,
  ALL_12_PAGES,
} from '@/config/adminPages';
import { SpaceGate } from '@/routes/SpaceGate';
import { authService } from '@/services/authService';

export default function AdminSpace() {
  const ws = useAdminWorkspace();
  const { login, logout } = useAuth();

  const {
    currentPage,
    isAuthPage,
    isKnownPage,
    showToast,
    navigateTo,
    adminProfile,
    users,
    merchants,
    offers,
    orders,
    activities,
    handleToggleUserStatus,
    selectedUserId,
    pendingMerchantsCount,
    handleMerchantDecision,
    selectedMerchantId,
    selectedOrderId,
    setAdminProfile,
  } = ws;

  useDocumentTitle(
    ALL_12_PAGES.find((p) => p.id === currentPage)?.label ?? ''
  );

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const selectedMerchant = merchants.find((m) => m.id === selectedMerchantId);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const authView = (
    <AdminAuthLayout>
      <AdminLoginPage
        onSubmit={async (email, password) => {
          await login('admin', email, password);
          navigateTo('dashboard');
        }}
        onForgotPassword={(email) =>
          authService.sendPasswordReset(email)
        }
      />
    </AdminAuthLayout>
  );

  const appView = (
    <AdminLayout ws={ws}>
      {currentPage === 'dashboard' && (
        <AdminDashboardPage
          adminProfile={adminProfile}
          users={users}
          merchants={merchants}
          offers={offers}
          orders={orders}
          activities={activities}
          onNavigate={navigateTo}
        />
      )}

      {currentPage === 'users' && (
        <UserManagementPage
          users={users}
          onToggleStatus={handleToggleUserStatus}
          onNavigate={navigateTo}
        />
      )}

      {currentPage === 'user-details' &&
        (selectedUser ? (
          <UserDetailsPage
            user={selectedUser}
            onToggleStatus={handleToggleUserStatus}
            onNavigate={navigateTo}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="Aucun utilisateur sélectionné"
            description="Ouvrez un compte depuis la liste des utilisateurs pour en voir le détail."
            action={{
              label: 'Voir les utilisateurs',
              onClick: () => navigateTo('users'),
            }}
          />
        ))}

      {currentPage === 'merchants' && (
        <MerchantManagementPage
          merchants={merchants}
          pendingCount={pendingMerchantsCount}
          onNavigate={navigateTo}
        />
      )}

      {currentPage === 'merchant-validation' && (
        <MerchantValidationPage
          merchants={merchants}
          onDecision={handleMerchantDecision}
          onNavigate={navigateTo}
        />
      )}

      {currentPage === 'merchant-details' &&
        (selectedMerchant ? (
          <MerchantDetailsPage
            merchant={selectedMerchant}
            offers={offers.filter(
              (o) => o.merchantId === selectedMerchant.id
            )}
            onDecision={handleMerchantDecision}
            onNavigate={navigateTo}
          />
        ) : (
          <EmptyState
            icon={Store}
            title="Aucun commerçant sélectionné"
            description="Ouvrez un établissement depuis la liste des commerçants pour en voir le détail."
            action={{
              label: 'Voir les commerçants',
              onClick: () => navigateTo('merchants'),
            }}
          />
        ))}

      {currentPage === 'offers-supervision' && (
        <OffersSupervisionPage offers={offers} merchants={merchants} />
      )}

      {currentPage === 'orders-supervision' && (
        <OrdersSupervisionPage
          orders={orders}
          onNavigate={navigateTo}
        />
      )}

      {currentPage === 'order-details' &&
        (selectedOrder ? (
          <AdminOrderDetailsPage
            order={selectedOrder}
            onNavigate={navigateTo}
          />
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="Aucune commande sélectionnée"
            description="Ouvrez une commande depuis le suivi des commandes pour en voir le détail."
            action={{
              label: 'Voir les commandes',
              onClick: () => navigateTo('orders-supervision'),
            }}
          />
        ))}

      {currentPage === 'statistics' && (
        <PlatformStatisticsPage
          users={users}
          merchants={merchants}
          offers={offers}
          orders={orders}
        />
      )}

      {currentPage === 'settings' && (
        <AdminProfileSettingsPage
          adminProfile={adminProfile}
          onSave={(updated) => {
            setAdminProfile(updated);
            showToast('Paramètres administrateur enregistrés avec succès.');
          }}
          onLogout={() => {
            logout();
            navigateTo('login');
          }}
        />
      )}
    </AdminLayout>
  );

  return (
    <SpaceGate
      role="admin"
      basePath={ADMIN_BASE_PATH}
      defaultPage={ADMIN_DEFAULT_PAGE}
      isKnownPage={isKnownPage}
      isAuthPage={isAuthPage}
      authView={authView}
      appView={appView}
    />
  );
}
