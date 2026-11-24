/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CartItem {
  id: string; title: string; category: string; imageUrl: string; initialPrice: number; discountedPrice: number; quantity: number; maxQuantity: number;
}

export type IncomingOffer = Omit<CartItem, 'maxQuantity'> & { quantity: number };

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (offer: IncomingOffer, quantityToAdd: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  return context;
};

const playPing = () => {
  try {
    const AudioContext = window.AudioContext || (window as Window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    return;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('campusSaveCart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('campusSaveCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (offer: IncomingOffer, quantityToAdd: number) => {
    playPing();
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === offer.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === offer.id ? { ...item, quantity: Math.min(item.quantity + quantityToAdd, item.maxQuantity) } : item
        );
      }
      // Correction ici : on sépare bien la quantité ajoutée et la quantité max
      return [...prevItems, { 
        id: offer.id, title: offer.title, category: offer.category, imageUrl: offer.imageUrl, 
        initialPrice: offer.initialPrice, discountedPrice: offer.discountedPrice, 
        quantity: quantityToAdd, // Quantité choisie (ex: 1)
        maxQuantity: offer.quantity // Stock total (ex: 10)
      }];
    });
  };

  const removeFromCart = (id: string) => setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  const updateQuantity = (id: string, newQuantity: number) => setCartItems(prevItems => prevItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  const clearCart = () => setCartItems([]);
  const getCartTotal = () => cartItems.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
  const getCartCount = () => cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};