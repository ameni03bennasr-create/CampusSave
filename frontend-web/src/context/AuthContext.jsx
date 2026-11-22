import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Écouteur de l'état de connexion Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Si l'utilisateur est connecté, on récupère ses infos (rôle, nom) dans Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setUser({ uid: firebaseUser.uid, ...userDocSnap.data() });
          } else {
            // Fallback si le profil n'est pas encore créé dans Firestore
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'etudiant', name: 'Utilisateur' });
          }
        } catch (error) {
          console.error("Erreur de récupération du profil:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Fonction de déconnexion
  const logout = () => {
    return signOut(auth);
  };

  // (Optionnel) Fonction de mise à jour du profil
  const updateProfile = async (data) => {
    // À implémenter avec updateDoc si besoin
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};