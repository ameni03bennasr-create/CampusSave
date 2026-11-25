
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  ASSOCIATION_BASE_PATH,
  ASSOCIATION_PAGE_IDS,
  ASSOCIATION_DEFAULT_PAGE,
} from '@/config/associationPages'
import { resolveSpacePage } from '@/routes/spaceRouting'
import type { AssociationPageId } from '@/config/associationPages'
import type { ToastKind, ToastState } from '@/types/ui'
import type { StudentNavigateOptions } from '@/types/navigation'
import type { Restaurant, StudentOffer } from '@/types/student'
import { subscribeToPublicOffers } from '@/services/offerService'

export function useAssociationWorkspace() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { page: currentPage, isKnownPage } = resolveSpacePage(
    pathname,
    ASSOCIATION_BASE_PATH,
    ASSOCIATION_PAGE_IDS,
    ASSOCIATION_DEFAULT_PAGE
  )

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const [offers, setOffers] = useState<StudentOffer[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  const [draftQuantity, setDraftQuantity] = useState(1)

  const [association, setAssociation] = useState({
    name: 'Club Informatique ESSECT',
    memberCount: 45,
    university: 'Université de Tunis',
    email: 'contact@ci-essect.tn',
    avatar: null as string | null,
  })

  const showToast = (message: string, type: ToastKind = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3800)
  }

  useEffect(() => {
    return subscribeToPublicOffers(
      ({ offers: loadedOffers, restaurants: loadedRestaurants }) => {
        setOffers(loadedOffers)
        setRestaurants(loadedRestaurants)
      },
      (error) => {
        console.error('Erreur de chargement des offres Association :', error)
      }
    )
  }, [])

  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === selectedOfferId),
    [offers, selectedOfferId]
  )

  const getRestaurant = (restaurantId: string) =>
    restaurants.find((restaurant) => restaurant.id === restaurantId)

  const navigateTo = (
    page: AssociationPageId,
    options: StudentNavigateOptions = {}
  ) => {
    if (options.offerId) {
      setSelectedOfferId(options.offerId)
      setDraftQuantity(options.quantity || 1)
    }

    navigate(`${ASSOCIATION_BASE_PATH}/${page}`)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    currentPage,
    isKnownPage,
    mobileMenuOpen,
    setMobileMenuOpen,
    toast,
    showToast,
    navigateTo,
    offers,
    restaurants,
    selectedOffer,
    getRestaurant,
    draftQuantity,
    setDraftQuantity,
    association,
    setAssociation,
  }
}

export type AssociationWorkspace = ReturnType<typeof useAssociationWorkspace>