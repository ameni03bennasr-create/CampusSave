import { ServiceUnavailableError } from '@/services/errors'

export interface PaymentService {
  /** Creates a payment request on the backend and returns the provider's hosted payment URL. */
  startPayment(orderId: string, method: string): Promise<{ paymentUrl: string }>
}

/**
 * Step 5 implements this against the Konnect API (card / e-Dinar, sandbox first).
 * Payment is only ever confirmed by the provider's webhook, never by the browser.
 */
export const paymentService: PaymentService = {
  startPayment: () =>
    Promise.reject(new ServiceUnavailableError('Le paiement en ligne n’est pas encore activé sur la plateforme.')),
}
