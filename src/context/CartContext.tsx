import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Book } from '../types';
import { useAdmin } from './AdminContext';
import { SHIPPING_RULES, COUPONS } from '../constants';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  appliedCoupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logActivity } = useAdmin();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book: Book, quantity = 1) => {
    logActivity({ type: 'add_to_cart', bookId: book.id, bookName: book.name });
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item => 
          item.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...book, quantity }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart(prev => prev.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === bookId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const coupon = COUPONS.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (coupon && (coupon.minSpend || 0) <= subtotal) {
      setAppliedCoupon({ code: coupon.code, discount: coupon.value });
      return true;
    }
    return false;
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0)
  , [cart]);

  const discount = useMemo(() => 
    appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0
  , [subtotal, appliedCoupon]);

  const shipping = useMemo(() => 
    subtotal >= SHIPPING_RULES.freeThreshold || subtotal === 0 ? 0 : SHIPPING_RULES.flatRate
  , [subtotal]);

  const total = useMemo(() => 
    subtotal - discount + shipping
  , [subtotal, discount, shipping]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal,
      shipping, discount, total, appliedCoupon, applyCoupon, removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
