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

export default function StudentSpace() {
  const ws = useStudentWorkspace();
  const { login } = useAuth(); 
  
  const {
    currentPage, isAuthPage, isKnownPage, setStudent, showToast, navigateTo, student,
    restaurants, offers, orders, exploreSearchProduct, exploreSearchRestaurant,
    exploreCategory, selectedOffer, getRestaurant, draftQuantity, setDraftQuantity,
    handleCreatePendingOrder, activeOrder, notifications, setNotifications, handleCartCheckout
  } = ws;

  useDocumentTitle(ALL_14_PAGES.find((p) => p.id === currentPage)?.label ?? '');

  const selectedRestaurant = selectedOffer ? getRestaurant(selectedOffer.restaurantId) : undefined;
  const activeRestaurant = activeOrder ? getRestaurant(activeOrder.restaurantId) : undefined;

  const noOffer = (
    <EmptyState icon={Tag} title="Aucune offre sélectionnée" description="Choisissez une offre dans la liste pour consulter son détail et la réserver." action={{ label: 'Explorer les offres', onClick: () => navigateTo('explore') }} />
  );
  const noOrder = (
    <EmptyState icon={ShoppingBag} title="Aucune commande sélectionnée" description="Ouvrez une commande depuis la liste de vos réservations pour en voir le détail." action={{ label: 'Voir mes commandes', onClick: () => navigateTo('orders') }} />
  );

  const authView = (
    <StudentAuthLayout>
      {currentPage === 'register' ? (
        <StudentRegisterPage onSubmit={async (form) => { await authService.signUpStudent(form); await login('student', form.email, form.password); navigateTo('home'); }} onGoLogin={() => navigateTo('login')} />
      ) : (
        <StudentLoginPage onSubmit={async (email, password) => { await login('student', email, password); navigateTo('home'); }} onForgotPassword={(email) => authService.sendPasswordReset(email)} onGoRegister={() => navigateTo('register')} />
      )}
    </StudentAuthLayout>
  );

  const appView = (
    <StudentLayout ws={ws}>
      {currentPage === 'home' && <StudentHomePage student={student} offers={offers} restaurants={restaurants} orders={orders} onNavigate={navigateTo} />}
      {currentPage === 'cart' && <CartPage onNavigate={navigateTo} />}
      
      {/* ON PASSE LA FONCTION ICI */}
      {currentPage === 'checkout' && <CheckoutPage onNavigate={(page) => navigateTo(page as Parameters<typeof navigateTo>[0])} onCheckoutSuccess={handleCartCheckout} />}
      
      {currentPage === 'explore' && <ExploreOffersPage offers={offers} restaurants={restaurants} initialSearchProduct={exploreSearchProduct} initialSearchRestaurant={exploreSearchRestaurant} initialCategory={exploreCategory} onNavigate={navigateTo} />}
      {currentPage === 'offer-details' && (selectedOffer && selectedRestaurant ? <OfferDetailsPage offer={selectedOffer} restaurant={selectedRestaurant} quantity={draftQuantity} setQuantity={setDraftQuantity} onNavigate={navigateTo} onShowToast={showToast} /> : noOffer)}
      {currentPage === 'reservation' && (selectedOffer && selectedRestaurant ? <ReservationPage offer={selectedOffer} restaurant={selectedRestaurant} quantity={draftQuantity} setQuantity={setDraftQuantity} student={student} onConfirmReservation={() => handleCreatePendingOrder(selectedOffer, draftQuantity)} onNavigate={navigateTo} /> : noOffer)}
      {currentPage === 'order-summary' && (activeOrder && activeRestaurant ? <OrderSummaryPage order={activeOrder} restaurant={activeRestaurant} student={student} onNavigate={navigateTo} /> : noOrder)}
      {currentPage === 'payment' && (activeOrder ? <ElectronicPaymentPage order={activeOrder} onPay={async (method) => { const { paymentUrl } = await paymentService.startPayment(activeOrder.id, method); window.location.assign(paymentUrl); }} onNavigate={navigateTo} /> : <EmptyState icon={CreditCard} title="Aucun paiement en attente" description="Réservez une offre pour pouvoir la régler en ligne." action={{ label: 'Explorer les offres', onClick: () => navigateTo('explore') }} />)}
      {currentPage === 'confirmation-qr' && (activeOrder && activeRestaurant ? <ReservationConfirmationQRPage order={activeOrder} restaurant={activeRestaurant} onNavigate={navigateTo} /> : <EmptyState icon={QrCode} title="Aucun QR Code à afficher" description="Votre QR Code de retrait apparaît ici une fois le paiement confirmé." action={{ label: 'Voir mes commandes', onClick: () => navigateTo('orders') }} />)}
      {currentPage === 'orders' && <MyOrdersPage orders={orders} onNavigate={navigateTo} />}
      {currentPage === 'order-details' && (activeOrder && activeRestaurant ? <OrderDetailsPage order={activeOrder} restaurant={activeRestaurant} onNavigate={navigateTo} /> : noOrder)}
      {currentPage === 'profile' && <StudentProfilePage student={student} onUpdateStudent={(updated) => { setStudent(updated); showToast('Profil mis à jour.'); }} />}
      {currentPage === 'notifications' && <NotificationsPage notifications={notifications} onMarkAllRead={() => { setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))); showToast('Notifications lues.'); }} onToggleRead={(id) => { setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))); }} onOpenOrder={(orderId) => navigateTo('order-details', { orderId })} />}
      {currentPage === 'statistics' && <StudentStatisticsPage student={student} orders={orders} offers={offers} restaurants={restaurants} onNavigate={(page) => navigateTo(page as Parameters<typeof navigateTo>[0])} />}
    </StudentLayout>
  );

  return (
    <SpaceGate role="student" basePath={STUDENT_BASE_PATH} defaultPage={STUDENT_DEFAULT_PAGE} isKnownPage={isKnownPage} isAuthPage={isAuthPage} authView={authView} appView={appView} />
  );
}