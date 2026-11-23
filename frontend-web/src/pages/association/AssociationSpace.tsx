import { useAssociationWorkspace } from '@/hooks/useAssociationWorkspace';
import { AssociationLayout } from '@/layouts/AssociationLayout';
import { AssociationAuthLayout } from '@/layouts/AssociationAuthLayout';
import { AssociationHomePage } from './AssociationHomePage';
import { AssociationRegisterPage } from './AssociationRegisterPage';
import { AssociationLoginPage } from './AssociationLoginPage';
import { AssociationProfilePage } from './AssociationProfilePage';
import { AssociationExplorePage } from './AssociationExplorePage';
import { AssociationOrdersPage } from './AssociationOrdersPage';

// Reuse the student pages that already support the shared cart.
import CartPage from '@/pages/student/CartPage';
import CheckoutPage from '@/pages/student/CheckoutPage';
import { OfferDetailsPage } from '@/pages/student/OfferDetailsPage';
import { EmptyState } from '@/components/common/EmptyState';
import { Tag } from 'lucide-react';
import type { ComponentProps } from 'react';

export default function AssociationSpace() {
  const ws = useAssociationWorkspace();
  const { currentPage, navigateTo, selectedOffer, getRestaurant, draftQuantity, setDraftQuantity } = ws;

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
      
      {/* Reuse the student offer details page, which supports adding items to the cart. */}
      {(currentPage as string) === 'offer-details' && (selectedOffer && selectedRestaurant ? (
        <OfferDetailsPage 
          offer={selectedOffer as ComponentProps<typeof OfferDetailsPage>['offer']} 
          restaurant={selectedRestaurant as ComponentProps<typeof OfferDetailsPage>['restaurant']} 
          quantity={draftQuantity} 
          setQuantity={setDraftQuantity} 
          onNavigate={navigateTo as ComponentProps<typeof OfferDetailsPage>['onNavigate']} 
        />
      ) : (
        <EmptyState icon={Tag} title="No offer selected" description="Return to the catalog." />
      ))}

      {/* Reuse the student cart and checkout pages. */}
      {currentPage === 'cart' && <CartPage onNavigate={navigateTo as ComponentProps<typeof CartPage>['onNavigate']} />}
      {currentPage === 'checkout' && <CheckoutPage onNavigate={navigateTo as ComponentProps<typeof CheckoutPage>['onNavigate']} />}
      
      {currentPage === 'orders' && <AssociationOrdersPage />}
      
      {currentPage === 'profile' && <AssociationProfilePage ws={ws} />}
    </AssociationLayout>
  );
}