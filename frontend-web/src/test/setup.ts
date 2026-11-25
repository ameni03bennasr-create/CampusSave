
import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup, configure } from '@testing-library/react'

// Configuration React Testing Library
configure({ asyncUtilTimeout: 8000 })

afterEach(() => cleanup())

// jsdom ne prend pas en charge le défilement.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo

// Firebase est isolé pendant les tests.
// La vraie configuration Firebase reste utilisée en production.
vi.mock('@/config/firebase', () => ({
  auth: { currentUser: null },
  db: {},
  functions: {},
}))

// Simule l'écoute de l'état d'authentification Firebase.
vi.mock('firebase/auth', () => ({
  onIdTokenChanged: vi.fn((_auth, callback) => {
    callback(null)
    return vi.fn()
  }),
}))

// Empêche httpsCallable d'initialiser une vraie fonction Firebase.
vi.mock('firebase/functions', () => ({
  httpsCallable: vi.fn(() => vi.fn()),
}))
