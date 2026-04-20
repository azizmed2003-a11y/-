import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Order, Activity, Offer, OrderStatus, Message } from '../types';

interface AdminContextType {
  books: Book[];
  orders: Order[];
  activities: Activity[];
  offers: Offer[];
  messages: Message[];
  addBook: (book: Omit<Book, 'id' | 'reviews'>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
  toggleBookVisibility: (id: string) => Promise<void>;
  placeOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  logActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => Promise<void>;
  addOffer: (offer: Omit<Offer, 'id'>) => Promise<void>;
  toggleOffer: (id: string) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  uploadFile: (file: File) => Promise<string>;
  sendMessage: (message: Omit<Message, 'id' | 'date'>) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchData = async () => {
    try {
      const [booksRes, ordersRes, activitiesRes, offersRes, messagesRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/orders'),
        fetch('/api/activities'),
        fetch('/api/offers'),
        fetch('/api/messages')
      ]);
      
      if (booksRes.ok) setBooks(await booksRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (activitiesRes.ok) setActivities(await activitiesRes.json());
      if (offersRes.ok) setOffers(await offersRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    fetchData();
    logActivity({ type: 'visit' });
  }, []);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.path;
  };

  const addBook = async (bookData: Omit<Book, 'id' | 'reviews'>) => {
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bookData, reviews: [] })
    });
    if (res.ok) fetchData();
  };

  const deleteBook = async (id: string) => {
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const updateBook = async (updatedBook: Book) => {
    const res = await fetch(`/api/books/${updatedBook.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBook)
    });
    if (res.ok) fetchData();
  };

  const toggleBookVisibility = async (id: string) => {
    const book = books.find(b => b.id === id);
    if (book) {
      await updateBook({ ...book, isVisible: !book.isVisible });
    }
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Order failed');
    const order = await res.json();
    fetchData();
    return order.id;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) fetchData();
  };

  const logActivity = async (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity)
    });
    fetchData();
  };

  const addOffer = async (offerData: Omit<Offer, 'id'>) => {
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData)
    });
    if (res.ok) fetchData();
  };

  const toggleOffer = async (id: string) => {
    const res = await fetch(`/api/offers/${id}/toggle`, { method: 'PUT' });
    if (res.ok) fetchData();
  };

  const deleteOffer = async (id: string) => {
    const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };
  
  const sendMessage = async (messageData: Omit<Message, 'id' | 'date'>) => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });
    if (res.ok) fetchData();
  };

  const deleteMessage = async (id: string) => {
    const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  return (
    <AdminContext.Provider value={{ 
      books, orders, activities, offers, messages,
      addBook, deleteBook, updateBook, toggleBookVisibility,
      placeOrder, updateOrderStatus, logActivity,
      addOffer, toggleOffer, deleteOffer, uploadFile,
      sendMessage, deleteMessage
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
