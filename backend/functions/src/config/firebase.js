import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration copiée depuis votre console Firebase (Image 4)
const firebaseConfig = {
  apiKey: "AIzaSyBF86z0ItsNu-7WskAzM-KmOLgA6Og7g-A",
  authDomain: "campussave-815dd.firebaseapp.com",
  projectId: "campussave-815dd",
  storageBucket: "campussave-815dd.firebasestorage.app",
  messagingSenderId: "863246053977",
  appId: "1:863246053977:web:e020c624ef2971e5067748"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Exportation des services pour les utiliser dans React
export const auth = getAuth(app);
export const db = getFirestore(app);