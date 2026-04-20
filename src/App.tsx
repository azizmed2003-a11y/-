/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Reviews from './pages/Reviews';
import Admin from './pages/Admin';
import AIAssistant from './components/AIAssistant';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { TestimonialProvider } from './context/TestimonialContext';
import { AdminProvider } from './context/AdminContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ShippingBar() {
  return (
    <div className="bg-brand-shipping-bg border-t border-[#faebcc] py-3 px-10 flex justify-center items-center text-[13px] text-brand-shipping-text gap-4 sm:gap-6 flex-wrap">
      <span className="flex items-center gap-1">🚛 شحن مجاني للطلبات فوق ٤٠$</span>
      <span className="hidden sm:inline opacity-30">•</span>
      <span className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1"></span>
        الدفع عبر Bankily متاح
      </span>
      <span className="hidden sm:inline opacity-30">•</span>
      <span className="flex items-center gap-1">🎟️ استخدم الكود BOOK10 لخصم ١٠٪</span>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AdminProvider>
        <CartProvider>
          <WishlistProvider>
            <TestimonialProvider>
            <div className="min-h-screen bg-brand-bg font-sans text-brand-text selection:bg-orange-100 selection:text-orange-900 flex flex-col">
              <ScrollToTop />
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </main>
              <Footer />
              <ShippingBar />
              <AIAssistant />
            </div>
          </TestimonialProvider>
        </WishlistProvider>
      </CartProvider>
      </AdminProvider>
    </Router>
  );
}
