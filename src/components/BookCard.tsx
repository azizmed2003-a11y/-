import { Book } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface BookCardProps {
  book: Book;
  key?: string | number;
}

export default function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(book.id);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Religious': return 'bg-[#f8f4e1]';
      case 'Science': return 'bg-[#e1f5fe]';
      case 'Motivation': return 'bg-[#fff3e0]';
      case 'Magazines': return 'bg-[#fce4ec]';
      case 'Money & Investment': return 'bg-[#e8f5e9]';
      default: return 'bg-[#fdfaf3]';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group ${getCategoryColor(book.category)} rounded-lg overflow-hidden shadow-sm border border-[#eee] transition-all relative p-2.5 flex flex-col h-full hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className="relative aspect-[3/4.1] overflow-hidden rounded-md bg-[#f9f8f4] mb-2.5">
        <Link to={`/product/${book.id}`} className="block h-full">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent z-10 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/5 z-20 pointer-events-none" />
          <img
            src={book.image}
            alt={book.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </Link>
        
        {book.salePrice && (
          <div className="absolute top-1.5 right-1.5 bg-brand-accent-red text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full z-10">
            {Math.round((1 - book.salePrice / book.price) * 100)}%
          </div>
        )}
      </div>

      <div className="space-y-0.5 flex-1 text-right" dir="rtl">
        <Link to={`/product/${book.id}`} className="block">
          <h3 className="text-[13px] font-bold text-brand-text leading-tight group-hover:text-brand-accent-brown transition-colors line-clamp-2">
            {book.name}
          </h3>
          <p className="text-[9px] text-[#999] mt-0.5 font-medium truncate">
            {book.author}
          </p>
        </Link>
        
        <div className="mt-2.5 flex items-center justify-between gap-1">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-brand-text">
              ${(book.salePrice || book.price).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleWishlist(book)}
              className={`p-1.5 rounded-full transition-colors ${
                isWishlisted ? 'text-red-500' : 'text-gray-300 hover:text-red-500'
              }`}
            >
              <Heart className={`w-3 h-3 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => addToCart(book)}
              className="bg-brand-text text-white text-[9px] font-bold py-1 px-2.5 rounded-md hover:opacity-90 transition-opacity"
            >
              شراء
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
