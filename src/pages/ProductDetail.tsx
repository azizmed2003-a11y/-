import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Star, Truck, ShieldCheck, Heart, ShoppingBag, ArrowRight, Check, Share2, Info } from 'lucide-react';
import { motion } from 'motion/react';
import BookCard from '../components/BookCard';
import { useAdmin } from '../context/AdminContext';
import { useEffect } from 'react';
import { STORE_NAME } from '../constants';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { books, logActivity } = useAdmin();
  
  const book = books.find(b => b.id === id);
  const relatedBooks = books.filter(b => b.category === book?.category && b.id !== id && b.isVisible).slice(0, 4);

  useEffect(() => {
    if (book) {
      logActivity({ type: 'view_product', bookId: book.id, bookName: book.name });
    }
  }, [id, book]);

  if (!book || !book.isVisible) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-3xl font-bold font-serif">الكتاب غير متوفر حالياً</h2>
        <p className="text-[#888]">عذراً، هذا الكتاب غير متاح للعرض في الوقت الحالي.</p>
        <button onClick={() => navigate('/shop')} className="bg-brand-accent-brown text-white px-8 py-3 rounded-md font-bold hover:opacity-90 transition-opacity">
          العودة للمتجر
        </button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(book.id);

  return (
    <div className="pb-24 text-right" dir="rtl">
      {/* Breadcrumbs / Back */}
      <div className="container mx-auto px-4 py-8 md:px-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-brand-accent-brown transition-colors font-bold uppercase text-[11px] tracking-widest"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </button>
      </div>

      <div className="container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[3/4.5] bg-[#f9f8f4] rounded-3xl overflow-hidden shadow-2xl relative border border-[#eee]"
          >
            <img 
              src={book.image} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {book.salePrice && (
              <span className="absolute top-8 right-8 bg-red-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                عرض خاص
              </span>
            )}
          </motion.div>

          {/* Info */}
          <div className="space-y-10 flex flex-col justify-center">
            <div className="space-y-4">
              <span className="bg-brand-bg text-brand-accent-brown px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">
                {book.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-brand-text leading-tight font-serif">
                {book.name}
              </h1>
              <p className="text-xl text-[#999] font-medium">{book.author}</p>
              
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-1 text-brand-accent-brown">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'fill-current' : 'opacity-20'}`} />
                  ))}
                </div>
                <div className="w-[1px] h-4 bg-[#eee]" />
                <div className="flex items-center gap-2 text-green-600 font-bold text-xs">
                  <Check className="w-4 h-4" />
                  <span>متوفر في المخزون ({book.stock})</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black text-brand-text">
                ${(book.salePrice || book.price).toFixed(2)}
              </span>
              {book.salePrice && (
                <span className="text-2xl text-[#ccc] line-through font-medium">
                  ${book.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="p-6 bg-brand-bg rounded-2xl border-r-4 border-brand-accent-brown space-y-2">
               <div className="flex items-center gap-2 text-brand-accent-brown font-bold text-xs uppercase tracking-widest">
                  <Info className="w-4 h-4" />
                  <span>لمحة سريعة</span>
               </div>
               <p className="text-brand-text leading-relaxed font-medium">
                {book.shortDescription}
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => addToCart(book)}
                className="flex-1 bg-[#2d2926] text-white font-bold py-5 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-2xl active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>إضافة إلى سلة المشتريات</span>
              </button>
              <button 
                onClick={() => toggleWishlist(book)}
                className={`w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all shrink-0 ${
                  isWishlisted ? 'bg-red-50 border-red-100 text-red-500' : 'border-[#eee] text-[#ccc] hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-[#eee]">
              <div className="flex items-center gap-4">
                <div className="bg-gray-50 p-3 rounded-xl text-[#999]">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-[#ccc] tracking-widest">الوزن</p>
                  <p className="font-bold text-brand-text">{book.weight} lb</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-gray-50 p-3 rounded-xl text-[#999]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-[#ccc] tracking-widest">المعرف (SKU)</p>
                  <p className="font-bold text-brand-text">{book.sku}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-serif text-brand-text border-b border-[#eee] pb-4">وصف الكتاب</h3>
              <p className="text-[#666] leading-relaxed text-lg">
                {book.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedBooks.length > 0 && (
          <section className="mt-40">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <div className="w-12 h-1 bg-brand-accent-brown mb-6" />
                <h2 className="text-4xl font-bold font-serif text-brand-text">كتب قد تعجبك</h2>
                <p className="text-[#999] mt-2">استكشف المزيد من التصنيف نفسه</p>
              </div>
              <button onClick={() => navigate('/shop')} className="text-brand-accent-brown font-bold hover:underline">عرض المتجر كاملاً</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedBooks.map(b => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
