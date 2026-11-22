/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// 1. Le type d'un article dans le panier
export interface CartItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  initialPrice: number;
  discountedPrice: number;
  quantity: number;
  maxQuantity: number;
}

// 2. Le type de l'offre quand on l'ajoute (elle n'a pas encore de maxQuantity)
export type IncomingOffer = Omit<CartItem, 'maxQuantity'> & { quantity: number };

// 3. Le type de notre Contexte
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (offer: IncomingOffer, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('campusSaveCart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('campusSaveCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (offer: IncomingOffer, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === offer.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === offer.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxQuantity) }
            : item
        );
      }
      return [...prevItems, { ...offer, maxQuantity: offer.quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};