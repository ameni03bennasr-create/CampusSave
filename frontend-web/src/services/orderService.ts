import { httpsCallable } from 'firebase/functions'
import { functions } from '@/config/firebase'

export interface CreateOrderLine {
  offreId: string
  quantite: number
}

export interface CreateOrderResponse {
  commandeId: string
  total: number
}

const createOrderCallable = httpsCallable<
  { lignes: CreateOrderLine[] },
  CreateOrderResponse
>(functions, 'creerCommande')

export async function createOrder(
  lignes: CreateOrderLine[],
): Promise<CreateOrderResponse> {
  if (!lignes.length) {
    throw new Error('Le panier est vide.')
  }

  const result = await createOrderCallable({ lignes })
  const data = result.data

  if (
    !data ||
    typeof data.commandeId !== 'string' ||
    !data.commandeId ||
    typeof data.total !== 'number'
  ) {
    throw new Error(
      'Réponse invalide du serveur lors de la création de la commande.',
    )
  }

  return data
}
