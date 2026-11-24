import { useAssociationWorkspace } from '@/hooks/useAssociationWorkspace';
import { AssociationLayout } from '@/layouts/AssociationLayout';
import { AssociationAuthLayout } from '@/layouts/AssociationAuthLayout';
import { AssociationHomePage } from './AssociationHomePage';
import { AssociationRegisterPage } from './AssociationRegisterPage';
import { AssociationLoginPage } from './AssociationLoginPage';
import { AssociationProfilePage } from './AssociationProfilePage';
import { AssociationExplorePage } from './AssociationExplorePage';
import { AssociationOrdersPage } from './AssociationOrdersPage';

import CartPage from '@/pages/student/CartPage';
import CheckoutPage from '@/pages/student/CheckoutPage';
import { OfferDetailsPage } from '@/pages/student/OfferDetailsPage';
import { EmptyState } from '@/components/common/EmptyState';
import { Tag } from 'lucide-react';
import type { ComponentProps } from 'react';

export default function AssociationSpace() {
  const ws = useAssociationWorkspace();
  const { currentPage, navigateTo, selectedOffer, getRestaurant, draftQuantity, setDraftQuantity, showToast, handleCartCheckout } = ws;

  if (currentPage === 'login' || currentPage === 'register') {
    return (
      <AssociationAuthLayout>
        {currentPage === 'register' ? (
          <AssociationRegisterPage onGoLogin={() => navigateTo('login')} />
        ) : (
          <AssociationLoginPage onGoRegister={() => navigateTo('register')} onLogin={() => navigateTo('home')} />
        )}
      </AssociationAuthLayout>
    );
  }

  const selectedRestaurant = selectedOffer ? getRestaurant(selectedOffer.restaurantId) : undefined;

  return (
    <AssociationLayout ws={ws}>
      {currentPage === 'home' && <AssociationHomePage ws={ws} />}
      {currentPage === 'explore' && <AssociationExplorePage ws={ws} />}
      
      {(currentPage as string) === 'offer-details' && (selectedOffer && selectedRestaurant ? (
        <OfferDetailsPage 
          offer={selectedOffer as ComponentProps<typeof OfferDetailsPage>['offer']} 
          restaurant={selectedRestaurant as ComponentProps<typeof OfferDetailsPage>['restaurant']} 
          quantity={draftQuantity} 
          setQuantity={setDraftQuantity} 
          onNavigate={navigateTo as ComponentProps<typeof OfferDetailsPage>['onNavigate']} 
          onShowToast={showToast}
        />
      ) : (
        <EmptyState icon={Tag} title="Aucune offre sélectionnée" description="Retournez au catalogue." />
      ))}

      {currentPage === 'cart' && <CartPage onNavigate={navigateTo as ComponentProps<typeof CartPage>['onNavigate']} />}
      
      {/* ON PASSE LA FONCTION ICI AUSSI */}
      {currentPage === 'checkout' && <CheckoutPage onNavigate={navigateTo as ComponentProps<typeof CheckoutPage>['onNavigate']} onCheckoutSuccess={handleCartCheckout} />}
      
      {currentPage === 'orders' && <AssociationOrdersPage />}
      {currentPage === 'profile' && <AssociationProfilePage ws={ws} />}
    </AssociationLayout>
  );
}