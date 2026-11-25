
import { useEffect, useState, type ReactNode } from 'react'
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut,
  getIdTokenResult,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import {
  AuthContext,
  type AuthUser,
  type AuthStatus,
  type UserRole,
} from './AuthContext'
import { auth, db } from '@/config/firebase'

function mapBackendRole(role: unknown): UserRole | null {
  switch (role) {
    case 'etudiant':
    case 'student':
      return 'student'
    case 'commercant':
    case 'merchant':
      return 'merchant'
    case 'commercant_en_attente':
    case 'merchant_pending':
      return 'merchant_pending'
    case 'association':
      return 'association'
    case 'admin':
      return 'admin'
    default:
      return null
  }
}

async function getAuthenticatedUser(
  firebaseUser: FirebaseUser
): Promise<AuthUser | null> {
  const tokenResult = await getIdTokenResult(firebaseUser)
  let backendRole: unknown = tokenResult.claims.role
  let name: string | undefined

  const userDocument = await getDoc(doc(db, 'users', firebaseUser.uid))

  if (userDocument.exists()) {
    const userData = userDocument.data()

    if (!backendRole) backendRole = userData.role

    name = userData.nom || userData.name
  }

  const role = mapBackendRole(backendRole)

  if (!role) return null

  return {
    uid: firebaseUser.uid,
    role,
    email: firebaseUser.email,
    name,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setStatus('unauthenticated')
        return
      }

      setStatus('loading')

      try {
        const authenticatedUser = await getAuthenticatedUser(firebaseUser)

        if (!authenticatedUser) {
          // Le profil peut être en cours de création pendant l'inscription.
          // On ne déconnecte donc pas automatiquement l'utilisateur.
          setUser(null)
          setStatus('unauthenticated')
          return
        }

        setUser(authenticatedUser)
        setStatus('authenticated')
      } catch (error) {
        console.error(
          'Erreur de récupération de la session Firebase :',
          error
        )
        setUser(null)
        setStatus('unauthenticated')
      }
    })

    return unsubscribe
  }, [])

  const login = async (
    role: UserRole,
    email: string,
    password: string
  ) => {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    try {
      const authenticatedUser = await getAuthenticatedUser(credential.user)

      if (!authenticatedUser) {
        await signOut(auth)
        throw new Error("Le rôle de ce compte n'est pas reconnu.")
      }

      if (authenticatedUser.role !== role) {
        await signOut(auth)

        if (authenticatedUser.role === 'merchant_pending') {
          throw new Error(
            "Votre compte commerçant est en attente de validation par l'administrateur."
          )
        }

        throw new Error("Ce compte ne correspond pas à l'espace demandé.")
      }

      setUser(authenticatedUser)
      setStatus('authenticated')
    } catch (error) {
      if (auth.currentUser) {
        await signOut(auth)
      }

      throw error
    }
  }

  const logout = () => {
    void signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
