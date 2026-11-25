import { CreditCard, QrCode, ShoppingBag, Tag } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { ElectronicPaymentPage } from '@/pages/student/ElectronicPaymentPage';
import { ExploreOffersPage } from '@/pages/student/ExploreOffersPage';
import { MyOrdersPage } from '@/pages/student/MyOrdersPage';
import { NotificationsPage } from '@/pages/student/NotificationsPage';
import { OfferDetailsPage } from '@/pages/student/OfferDetailsPage';
import { OrderDetailsPage } from '@/pages/student/OrderDetailsPage';
import { OrderSummaryPage } from '@/pages/student/OrderSummaryPage';
import { ReservationConfirmationQRPage } from '@/pages/student/ReservationConfirmationQRPage';
import { ReservationPage } from '@/pages/student/ReservationPage';
import { StudentHomePage } from '@/pages/student/StudentHomePage';
import { StudentLoginPage } from '@/pages/student/StudentLoginPage';
import { StudentProfilePage } from '@/pages/student/StudentProfilePage';
import { StudentRegisterPage } from '@/pages/student/StudentRegisterPage';
import { StudentStatisticsPage } from '@/pages/student/StudentStatisticsPage';
import { StudentAuthLayout } from '@/layouts/StudentAuthLayout';
import { StudentLayout } from '@/layouts/StudentLayout';
import { useStudentWorkspace } from '@/hooks/useStudentWorkspace';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ALL_14_PAGES, STUDENT_BASE_PATH, STUDENT_DEFAULT_PAGE } from '@/config/studentPages';
import { SpaceGate } from '@/routes/SpaceGate';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { paymentService } from '@/services/paymentService';

import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import { registerStudent } from '@/services/registrationService';
export default function StudentSpace() {
  const ws = useStudentWorkspace();
  const { login } = useAuth(); 
  
  const {
    currentPage, isAuthPage, isKnownPage, setStudent, showToast, navigateTo, student,
    restaurants, offers, orders, exploreSearchProduct, exploreSearchRestaurant,
    exploreCategory, selectedOffer, getRestaurant, draftQuantity, setDraftQuantity,
    handleCreatePendingOrder, isCreatingOrder, activeOrder, notifications, setNotifications
  } = ws;

  useDocumentTitle(ALL_14_PAGES.find((p) => p.id === currentPage)?.label ?? '');

  const selectedRestaurant = selectedOffer ? getRestaurant(selectedOffer.restaurantId) : undefined;
  const activeRestaurant = activeOrder ? getRestaurant(activeOrder.restaurantId) : undefined;

  const noOffer = (
    <EmptyState icon={Tag} title="Aucune offre sélectionnée" description="Choisissez une offre dans la liste pour consulter son dÃ©tail et la rÃ©server." action={{ label: 'Explorer les offres', onClick: () => navigateTo('explore') }} />
  );
  const noOrder = (
    <EmptyState icon={ShoppingBag} title="Aucune commande sÃ©lectionnÃ©e" description="Ouvrez une commande depuis la liste de vos rÃ©servations pour en voir le dÃ©tail." action={{ label: 'Voir mes commandes', onClick: () => navigateTo('orders') }} />
  );

  const authView = (
    <StudentAuthLayout>
      {currentPage === 'register' ? (
        <StudentRegisterPage
  onSubmit={async (form) => {
    await registerStudent(form);
    await login('student', form.email, form.password);
    navigateTo('home');
  }}
  onGoLogin={() => navigateTo('login')}
     />
      ) : (
        <StudentLoginPage onSubmit={async (email, password) => { await login('student', email, password); navigateTo('home'); }} onForgotPassword={(email) => authService.sendPasswordReset(email)} onGoRegister={() => navigateTo('register')} />
      )}
    </StudentAuthLayout>
  );

  const appView = (
    <StudentLayout ws={ws}>
      {currentPage === 'home' && <StudentHomePage student={student} offers={offers} restaurants={restaurants} orders={orders} onNavigate={navigateTo} />}
      {currentPage === 'cart' && <CartPage onNavigate={navigateTo} />}
      {currentPage === 'checkout' && <CheckoutPage onNavigate={navigateTo} />}
      {currentPage === 'explore' && <ExploreOffersPage offers={offers} restaurants={restaurants} initialSearchProduct={exploreSearchProduct} initialSearchRestaurant={exploreSearchRestaurant} initialCategory={exploreCategory} onNavigate={navigateTo} />}
      
      {/* Ajout de onShowToast ici */}
      {currentPage === 'offer-details' && (selectedOffer && selectedRestaurant ? (
        <OfferDetailsPage 
          offer={selectedOffer} 
          restaurant={selectedRestaurant} 
          quantity={draftQuantity} 
          setQuantity={setDraftQuantity} 
          onNavigate={navigateTo} 
          onShowToast={showToast} 
        />
      ) : noOffer)}

      {currentPage === 'reservation' && (selectedOffer && selectedRestaurant ? <ReservationPage offer={selectedOffer} restaurant={selectedRestaurant} quantity={draftQuantity} setQuantity={setDraftQuantity} student={student} onConfirmReservation={() => handleCreatePendingOrder(selectedOffer, draftQuantity)} isSubmitting={isCreatingOrder} onNavigate={navigateTo} /> : noOffer)}
      {currentPage === 'order-summary' && (activeOrder && activeRestaurant ? <OrderSummaryPage order={activeOrder} restaurant={activeRestaurant} student={student} onNavigate={navigateTo} /> : noOrder)}
      {currentPage === 'payment' && (activeOrder ? <ElectronicPaymentPage order={activeOrder} onPay={async (method) => { const { paymentUrl } = await paymentService.startPayment(activeOrder.id, method); window.location.assign(paymentUrl); }} onNavigate={navigateTo} /> : <EmptyState icon={CreditCard} title="Aucun paiement en attente" description="RÃ©servez une offre pour pouvoir la rÃ©gler en ligne." action={{ label: 'Explorer les offres', onClick: () => navigateTo('explore') }} />)}
      {currentPage === 'confirmation-qr' && (activeOrder && activeRestaurant ? <ReservationConfirmationQRPage order={activeOrder} restaurant={activeRestaurant} onNavigate={navigateTo} /> : <EmptyState icon={QrCode} title="Aucun QR Code Ã  afficher" description="Votre QR Code de retrait apparaÃ®t ici une fois le paiement dâ€™une rÃ©servation confirmÃ©." action={{ label: 'Voir mes commandes', onClick: () => navigateTo('orders') }} />)}
      {currentPage === 'orders' && <MyOrdersPage orders={orders} onNavigate={navigateTo} />}
      {currentPage === 'order-details' && (activeOrder && activeRestaurant ? <OrderDetailsPage order={activeOrder} restaurant={activeRestaurant} onNavigate={navigateTo} /> : noOrder)}
      {currentPage === 'profile' && <StudentProfilePage student={student} onUpdateStudent={(updated) => { setStudent(updated); showToast('Vos informations personnelles ont Ã©tÃ© mises Ã  jour.'); }} />}
      {currentPage === 'notifications' && <NotificationsPage notifications={notifications} onMarkAllRead={() => { setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))); showToast('Toutes les notifications ont Ã©tÃ© marquÃ©es comme lues.'); }} onToggleRead={(id) => { setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))); }} onOpenOrder={(orderId) => navigateTo('order-details', { orderId })} />}
      {currentPage === 'statistics' && <StudentStatisticsPage student={student} orders={orders} offers={offers} restaurants={restaurants} onNavigate={(page, options) => navigateTo(page as typeof currentPage, options)} />}
    </StudentLayout>
  );

  return (
    <SpaceGate role="student" basePath={STUDENT_BASE_PATH} defaultPage={STUDENT_DEFAULT_PAGE} isKnownPage={isKnownPage} isAuthPage={isAuthPage} authView={authView} appView={appView} />
  );
}
