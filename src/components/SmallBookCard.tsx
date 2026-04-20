import { Link } from 'react-router-dom';
import { Book } from '../types';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface SmallBookCardProps {
  book: Book;
  key?: string | number;
}

export default function SmallBookCard({ book }: SmallBookCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  return (
    <div className="group relative bg-[#fdfaf3] rounded-2xl border border-[#e8dfc4] p-3 hover:shadow-2xl transition-all duration-500 w-48 shrink-0 flex flex-col hover:-translate-y-2">
      <Link to={`/product/${book.id}`} className="block flex-1">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-3 shadow-[5px_5px_15px_rgba(0,0,0,0.1)] group-hover:shadow-[10px_10px_25px_rgba(0,0,0,0.15)] transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10 pointer-events-none" />
          <img 
            src={book.image} 
            alt={book.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {book.salePrice && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              SALE
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                addToCart(book);
              }}
              className="p-2 bg-white rounded-full text-brand-text hover:bg-brand-accent-brown hover:text-white transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                addToWishlist(book);
              }}
              className={`p-2 bg-white rounded-full transition-colors ${
                isInWishlist(book.id) ? 'text-red-500' : 'text-brand-text hover:bg-brand-accent-brown hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(book.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        <div className="text-right" dir="rtl">
          <h3 className="text-sm font-bold text-gray-900 truncate mb-0.5">{book.name}</h3>
          <p className="text-[11px] text-gray-500 truncate mb-2">{book.author}</p>
          <div className="flex items-center justify-between flex-row-reverse">
            <span className="text-sm font-black text-brand-accent-brown">${book.salePrice || book.price}</span>
            {book.salePrice && (
              <span className="text-[10px] text-gray-400 line-through">${book.price}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
