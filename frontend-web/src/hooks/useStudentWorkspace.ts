
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  STUDENT_BASE_PATH,
  STUDENT_PAGE_IDS,
  STUDENT_DEFAULT_PAGE,
  STUDENT_AUTH_PAGES,
} from '@/config/studentPages'
import { resolveSpacePage } from '@/routes/spaceRouting'
import type { StudentPageId } from '@/config/studentPages'
import type { StudentNavigateOptions } from '@/types/navigation'
import type {
  Restaurant,
  StudentNotification,
  StudentOffer,
  StudentOrder,
  StudentProfile,
} from '@/types/student'
import { createOrder } from '@/services/orderService'
import { errorMessage } from '@/services/errors'
import type { ToastKind, ToastState } from '@/types/ui'
import { subscribeToPublicOffers } from '@/services/offerService'

const EMPTY_STUDENT: StudentProfile = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  filiere: '',
  etablissement: '',
  avatar: '',
  ecoPoints: 0,
  memberSince: '',
}

export function useStudentWorkspace() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { page: currentPage, isKnownPage } = resolveSpacePage(
    pathname,
    STUDENT_BASE_PATH,
    STUDENT_PAGE_IDS,
    STUDENT_DEFAULT_PAGE
  )

  const isAuthPage = STUDENT_AUTH_PAGES.includes(currentPage)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [student, setStudent] = useState<StudentProfile>(EMPTY_STUDENT)

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [offers, setOffers] = useState<StudentOffer[]>([])

  const [orders, setOrders] = useState<StudentOrder[]>([])
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const creatingOrderRef = useRef(false)
  const [notifications, setNotifications] = useState<StudentNotification[]>([])

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  const [draftQuantity, setDraftQuantity] = useState(1)
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)

  const [exploreSearchProduct, setExploreSearchProduct] = useState('')
  const [exploreSearchRestaurant, setExploreSearchRestaurant] = useState('')
  const [exploreCategory, setExploreCategory] = useState('Tous')

  const [toast, setToast] = useState<ToastState | null>(null)

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
        console.error('Erreur de chargement des offres Ã‰tudiant :', error)
      }
    )
  }, [])

  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === selectedOfferId),
    [offers, selectedOfferId]
  )

  const activeOrder = useMemo(
    () => orders.find((order) => order.id === activeOrderId),
    [orders, activeOrderId]
  )

  const getRestaurant = (restaurantId: string) =>
    restaurants.find((restaurant) => restaurant.id === restaurantId)

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  )

  const activeOrdersCount = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.orderStatus.includes('ConfirmÃ©e') ||
          order.orderStatus.includes('attente')
      ).length,
    [orders]
  )

  const navigateTo = (
    page: StudentPageId,
    options: StudentNavigateOptions = {}
  ) => {
    if (options.offerId) {
      setSelectedOfferId(options.offerId)
      setDraftQuantity(options.quantity || 1)
    }

    if (options.orderId) {
      setActiveOrderId(options.orderId)
    }

    if (options.searchProduct !== undefined) {
      setExploreSearchProduct(options.searchProduct)
    }

    if (options.searchRestaurant !== undefined) {
      setExploreSearchRestaurant(options.searchRestaurant)
    }

    if (options.category !== undefined) {
      setExploreCategory(options.category)
    }

    navigate(`${STUDENT_BASE_PATH}/${page}`)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCreatePendingOrder = async (offer: StudentOffer, qty: number) => {
    if (creatingOrderRef.current) return

    const restaurant = getRestaurant(offer.restaurantId)

    if (!restaurant) {
      showToast('Impossible de retrouver le commerçant de cette offre.', 'error')
      return
    }

    if (!Number.isInteger(qty) || qty < 1 || qty > offer.quantity) {
      showToast('La quantité demandée est invalide ou indisponible.', 'error')
      return
    }

    creatingOrderRef.current = true
    setIsCreatingOrder(true)

    try {
      const result = await createOrder([
        {
          offreId: offer.id,
          quantite: qty,
        },
      ])

      const newId = result.commandeId

      const newOrder: StudentOrder = {
        id: newId,
        offerId: offer.id,
        productTitle: offer.title,
        productImage: offer.image,
        restaurantId: offer.restaurantId,
        restaurantName: restaurant.name,
        restaurantAddress: restaurant.address,
        quantity: qty,
        initialUnitPrice: offer.initialPrice,
        unitPrice: offer.reducedPrice,
        totalAmount: result.total,
        pickupHours: offer.pickupHours,
        createdAt: 'À l’instant',
        paymentStatus: 'En attente',
        orderStatus: 'En attente de paiement',
        paymentMethod: 'En cours de sélection',
        qrToken: null,
        weightKg: Number(((offer.weightKg ?? 0) * qty).toFixed(2)),
      }

      setOrders((previous) => [newOrder, ...previous])
      setActiveOrderId(newId)

      setNotifications((previous) => [
        {
          id: `notif-${Date.now()}`,
          type: 'reservation',
          title: `Réservation créée (${newId})`,
          message: `Vous avez réservé ${qty}x « ${offer.title} » chez ${restaurant.name}. Finalisez le paiement pour générer votre QR Code.`,
          timestamp: 'À l’instant',
          read: false,
          orderId: newId,
        },
        ...previous,
      ])

      showToast('Votre réservation a bien été créée.', 'success')
      navigateTo('order-summary', { orderId: newId })
    } catch (error) {
      console.error('Erreur lors de la création de la réservation :', error)
      showToast(errorMessage(error), 'error')
    } finally {
      creatingOrderRef.current = false
      setIsCreatingOrder(false)
    }
  }
  return {
    currentPage,
    isAuthPage,
    isKnownPage,
    mobileMenuOpen,
    setMobileMenuOpen,
    student,
    setStudent,
    restaurants,
    offers,
    orders,
    notifications,
    setNotifications,
    draftQuantity,
    setDraftQuantity,
    exploreSearchProduct,
    exploreSearchRestaurant,
    exploreCategory,
    toast,
    showToast,
    selectedOffer,
    activeOrder,
    getRestaurant,
    unreadNotificationsCount,
    activeOrdersCount,
    navigateTo,
    handleCreatePendingOrder,
    isCreatingOrder,
  }
}

export type StudentWorkspace = ReturnType<typeof useStudentWorkspace>

