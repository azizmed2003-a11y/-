import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types';
import { useAdmin } from './AdminContext';

interface WishlistContextType {
  wishlist: Book[];
  toggleWishlist: (book: Book) => void;
  isInWishlist: (bookId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logActivity } = useAdmin();
  const [wishlist, setWishlist] = useState<Book[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (book: Book) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === book.id);
      if (exists) {
        return prev.filter(item => item.id !== book.id);
      }
      logActivity({ type: 'add_to_wishlist', bookId: book.id, bookName: book.name });
      return [...prev, book];
    });
  };

  const isInWishlist = (bookId: string) => wishlist.some(item => item.id === bookId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
