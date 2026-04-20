import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, MessageCircle, Menu, X, BookOpen, Search } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'motion/react';
import { CONTACT_INFO, STORE_NAME } from '../constants';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { nameEn: 'Home', nameAr: 'الرئيسية', path: '/' },
    { nameEn: 'Shop', nameAr: 'المتجر', path: '/shop' },
    { nameEn: 'Offers', nameAr: 'العروض', path: '/shop?category=Offers' },
    { nameEn: 'Contact', nameAr: 'تواصل معنا', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#eee]">
      {/* Top Banner */}
      <div className="bg-[#2d2926] text-white py-2 text-[10px] font-bold uppercase tracking-widest text-center hidden md:block">
         توصيل سريع لكافة أنحاء موريتانيا عبر تطبيقات الدفع
      </div>

      <div className="container mx-auto px-4 md:px-10 h-[70px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-accent-brown text-white flex items-center justify-center rounded">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-text font-serif">{STORE_NAME}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path + link.nameEn}
              to={link.path}
              className={`text-[12px] font-bold uppercase tracking-[1px] transition-colors hover:text-brand-accent-brown ${
                location.pathname === link.path ? 'text-brand-accent-brown' : 'text-[#666]'
              }`}
            >
              {link.nameEn}
            </Link>
          ))}
        </nav>

        {/* Global Search Bar - Premium/Elegant */}
        <div className="hidden lg:flex items-center relative group ml-auto mr-10">
           <Search className="absolute right-4 w-4 h-4 text-gray-300 group-focus-within:text-brand-accent-gold transition-colors z-10" />
           <input 
            type="text" 
            placeholder="ابحث في مملكـة المعرفـة..."
            dir="rtl"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/shop?q=${(e.target as HTMLInputElement).value}`);
              }
            }}
            className="bg-[#1a1817] border border-white/5 text-white/90 rounded-2xl py-3 pr-12 pl-6 text-[13px] focus:outline-none focus:border-brand-accent-gold focus:ring-4 focus:ring-brand-accent-gold/10 transition-all w-72 focus:w-[450px] placeholder:text-gray-600 text-right shadow-2xl shadow-black/20"
           />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-5">
          <a 
            href={`https://wa.me/${CONTACT_INFO.phone}`} 
            target="_blank" 
            className="flex items-center gap-2 text-green-600 hover:opacity-70 transition-opacity hidden md:flex"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-bold">{CONTACT_INFO.phone}</span>
          </a>

          <Link to="/wishlist" className="relative text-[#2d2926] hover:opacity-70 transition-opacity">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-accent-red text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-[#2d2926] hover:opacity-70 transition-opacity">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-accent-red text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button 
            className="md:hidden text-brand-text"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col space-y-4 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path + link.nameEn}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-semibold text-gray-900 hover:text-orange-500"
                >
                  {link.nameEn} <span className="text-sm font-normal text-gray-400 ml-2">{link.nameAr}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
