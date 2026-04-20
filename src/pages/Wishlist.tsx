import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10 text-gray-200" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900">Your wishlist is empty</h2>
          <p className="text-gray-500 mt-2">Save your favorite books to read them later!</p>
        </div>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-600 transition-colors"
        >
          Explore Books
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-black text-gray-900">My Wishlist</h1>
        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">
          {wishlist.length} Items Saved
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {wishlist.map((book) => (
          <div key={book.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden">
               <img src={book.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               <button 
                  onClick={() => toggleWishlist(book)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white text-orange-500 shadow-md hover:bg-orange-50 transition-colors"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                 <Link to={`/product/${book.id}`} className="font-bold text-gray-900 hover:text-orange-500 block line-clamp-1">
                   {book.name}
                 </Link>
                 <p className="text-lg font-black text-gray-900 mt-2">${book.salePrice || book.price}</p>
              </div>
              <button 
                onClick={() => {
                  addToCart(book);
                  toggleWishlist(book);
                }}
                className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center space-x-2 hover:bg-black transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
