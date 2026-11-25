
import { onIdTokenChanged } from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'

import { auth, functions } from '@/config/firebase'
import type { Restaurant, StudentOffer } from '@/types/student'

interface BackendCommerce {
  nomCommerce?: string
  adresse?: string
  specialite?: string
  description?: string
  logo?: string
}

interface BackendOffer {
  id: string
  titre?: string
  description?: string
  prixInitial?: number
  prixReduit?: number
  quantiteDisponible?: number
  horaireRecuperation?: string
  photo?: string
  commercantId?: string
  nomCommerce?: string
  estSurpriseBasket?: boolean
  dateCreation?: string
  commerce?: BackendCommerce
}

interface ListerOffresResponse {
  offres: BackendOffer[]
}

export interface PublicOffersData {
  offers: StudentOffer[]
  restaurants: Restaurant[]
}

const listerOffres = httpsCallable<Record<string, never>, ListerOffresResponse>(
  functions,
  'listerOffres'
)

function toNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : fallback
}

function isRecentOffer(dateCreation?: string): boolean {
  if (!dateCreation) return false

  const timestamp = new Date(dateCreation).getTime()

  if (!Number.isFinite(timestamp)) return false

  const sevenDays = 7 * 24 * 60 * 60 * 1000

  return Date.now() - timestamp <= sevenDays &&
    Date.now() - timestamp >= 0
}

function mapOffers(data: BackendOffer[]): PublicOffersData {
  const restaurantsById = new Map<string, Restaurant>()

  const offers = data.map((item): StudentOffer => {
    const restaurantId = item.commercantId || `commerce-${item.id}`
    const commerce = item.commerce || {}
    const isSurpriseBasket = item.estSurpriseBasket === true

    const restaurantName =
      commerce.nomCommerce ||
      item.nomCommerce ||
      'Commerce partenaire'

    if (!restaurantsById.has(restaurantId)) {
      restaurantsById.set(restaurantId, {
        id: restaurantId,
        name: restaurantName,
        type: commerce.specialite || '',
        address: commerce.adresse || '',
        distanceMeters: 0,
        rating: 0,
        reviewsCount: 0,
        pickupHours: item.horaireRecuperation || '',
        phone: '',
        coords: { x: 0, y: 0 },
        activeOffersCount: 0,
      })
    }

    const restaurant = restaurantsById.get(restaurantId)!

    restaurant.activeOffersCount += 1

    if (!restaurant.pickupHours && item.horaireRecuperation) {
      restaurant.pickupHours = item.horaireRecuperation
    }

    return {
      id: item.id,
      title: item.titre || '',
      description: item.description || '',
      category: isSurpriseBasket
        ? 'Panier Surprise'
        : commerce.specialite || 'Autres',
      restaurantId,
      initialPrice: toNumber(item.prixInitial),
      reducedPrice: toNumber(item.prixReduit),
      quantity: toNumber(item.quantiteDisponible),
      pickupHours: item.horaireRecuperation || '',
      image: item.photo || '',
      featured: false,
      isRecent: isRecentOffer(item.dateCreation),
      isSurpriseBasket,
      weightKg: 0,
    }
  })

  return {
    offers,
    restaurants: Array.from(restaurantsById.values()),
  }
}

/**
 * Charge les offres dès que Firebase confirme une session utilisateur.
 * Réagit aussi aux connexions et déconnexions sans nécessiter de recharger la page.
 */
export function subscribeToPublicOffers(
  onData: (data: PublicOffersData) => void,
  onError: (error: unknown) => void
): () => void {
  let active = true
  let requestId = 0

  const unsubscribe = onIdTokenChanged(auth, async (user) => {
    const currentRequest = ++requestId

    if (!user) {
      if (active) {
        onData({ offers: [], restaurants: [] })
      }
      return
    }

    try {
      const result = await listerOffres({})
      if (!active || currentRequest !== requestId) return

      onData(mapOffers(result.data.offres || []))
    } catch (error) {
      if (active && currentRequest === requestId) {
        onError(error)
      }
    }
  })

  return () => {
    active = false
    unsubscribe()
  }
}
