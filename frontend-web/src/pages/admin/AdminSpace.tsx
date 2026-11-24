import { useAdminWorkspace } from '@/hooks/useAdminWorkspace';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminAuthLayout } from '@/layouts/AdminAuthLayout';
import { EmptyState } from '@/components/common/EmptyState';
import { LayoutDashboard } from 'lucide-react';
import { SpaceGate } from '@/routes/SpaceGate';
import { ADMIN_BASE_PATH, ADMIN_DEFAULT_PAGE } from '@/config/adminPages';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminMerchantValidationPage } from './MerchantValidationPage';

export default function AdminSpace() {
  const ws = useAdminWorkspace();
  const { currentPage, isKnownPage } = ws;

  // Determine whether the current page is an authentication page.
  const isAuthPage = currentPage === 'login';

  // Login page view.
  const authView = (
    <AdminAuthLayout>
      <AdminLoginPage onSubmit={async () => {}} onForgotPassword={async () => {}} />
    </AdminAuthLayout>
  );

  // View for authenticated admin pages.
  const appView = (
    <AdminLayout ws={ws}>
      
      {/* 1. Dashboard */}
      {currentPage === 'dashboard' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-extrabold text-stone-900">Admin Dashboard</h1>
          <EmptyState 
            icon={LayoutDashboard} 
            title="Welcome to your workspace" 
            description="Select an option from the left menu to manage the platform."
          />
        </div>
      )}
      
      {/* 2. Merchant validation */}
      {currentPage === 'merchant-validation' && <AdminMerchantValidationPage ws={ws} />}
      
      {/* 3. Other pages (under construction) */}
      {['users', 'merchants', 'offers-supervision', 'orders-supervision', 'statistics', 'settings'].includes(currentPage) && (
         <EmptyState 
           icon={LayoutDashboard} 
           title="Page under construction" 
           description="This feature will be available soon."
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