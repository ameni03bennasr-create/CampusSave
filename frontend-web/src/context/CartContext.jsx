import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // On initialise le panier en regardant s'il y a déjà des données dans le localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('campusSaveCart');
    return saved ? JSON.parse(saved) : [];
  });

  // Sauvegarde automatique dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('campusSaveCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (offer, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === offer.id);
      if (existingItem) {
        // Si l'article existe déjà, on augmente la quantité
        return prevItems.map(item =>
          item.id === offer.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, offer.quantity) }
            : item
        );
      }
      // Sinon, on l'ajoute au panier
      return [...prevItems, { ...offer, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};