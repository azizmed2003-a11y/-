import { motion } from 'motion/react';
import { ArrowRight, Star, Truck, ShieldCheck, Clock, Users, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import BookCard from '../components/BookCard';
import SmallBookCard from '../components/SmallBookCard';
import { useAdmin } from '../context/AdminContext';
import { useTestimonials } from '../context/TestimonialContext';

export default function Home() {
  const { books } = useAdmin();
  const visibleBooks = books.filter(b => b.isVisible);
  const bestSellers = visibleBooks.slice(0, 4);
  const recommendedBooks = visibleBooks.slice(20, 32);
  const featuredOffer = visibleBooks.find(b => b.salePrice);
  const { testimonials } = useTestimonials();
  const featuredTestimonials = testimonials.filter(t => t.isFeatured).slice(0, 3);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-10 mt-10">
        <div className="bg-[#1a1817] text-white rounded-[60px] p-12 md:p-32 flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-accent-brown/10 blur-[150px] -mr-[400px] -mt-[400px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent-gold/5 blur-[100px] -ml-48 -mb-48 rounded-full pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="max-w-3xl text-center md:text-right relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 flex-row-reverse"
            >
              <Sparkles className="w-4 h-4 text-brand-accent-gold" />
              <span className="text-[11px] font-bold uppercase tracking-[4px] text-brand-accent-gold">الإصدار الذهبي ٢٠٢٦</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black font-serif leading-[0.95] mb-8 tracking-tighter">
               مَمْلَكةُ <br />
               <span className="bg-gradient-to-l from-brand-accent-gold via-white to-brand-accent-brown bg-clip-text text-transparent">الذَّهَبِ المَعْرِفي</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-60 mb-14 max-w-xl mx-auto md:mr-0 leading-relaxed font-medium">
              حيثُ لا نبيعُ الكُتب، بل نُبضِعُ لكَ مَفاتيحَ العُلا، وسُبُلَ الثَّراءِ، وآفاقَ الحِكْمَةِ الخالِدَة.
            </p>
            <div className="flex flex-wrap gap-8 justify-center md:justify-start flex-row-reverse">
              <Link 
                to="/shop" 
                className="group bg-brand-accent-gold text-[#1a1817] px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-[0_20px_50px_rgba(197,160,89,0.3)] flex items-center gap-3"
              >
                <span>ابدأ رحلة الارتقاء</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/contact" 
                className="bg-white/5 backdrop-blur-xl text-white border border-white/10 px-12 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all"
              >
                مجلس الاستشارة
              </Link>
            </div>
          </motion.div>
          
          <div className="relative hidden xl:block">
             <div className="absolute inset-0 bg-brand-accent-gold/20 blur-3xl animate-pulse" />
             <div className="relative w-80 h-[450px] bg-[#2d2926] rounded-3xl border border-white/10 shadow-2xl rotate-12 flex flex-col items-center justify-center p-8 text-center group hover:rotate-0 transition-transform duration-1000">
                <BookOpen className="w-24 h-24 text-brand-accent-gold mb-8 group-hover:scale-125 transition-transform" />
                <h4 className="text-2xl font-serif font-black mb-4 tracking-tight">نور المعرفة</h4>
                <div className="h-1 w-12 bg-brand-accent-gold mx-auto" />
             </div>
          </div>
        </div>
      </section>

      {/* Categories Horizontal */}
      <section className="container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#eee] bg-white hover:border-brand-accent-brown hover:text-brand-accent-brown transition-all group"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#999] group-hover:text-inherit mb-1">{cat.labelEn}</span>
              <span className="text-sm font-bold">{cat.labelAr}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="w-12 h-1 bg-brand-accent-brown mb-4"></div>
            <h2 className="text-3xl font-bold font-serif text-brand-text">الأكثر مبيعاً</h2>
            <p className="text-[#888] mt-1">تصفح الكتب الأكثر طلباً لهذا الشهر</p>
          </div>
          <Link to="/shop?category=Best Sellers" className="text-brand-accent-brown font-bold flex items-center space-x-2 hover:underline">
            <span>عرض الكل</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Recommended Books - Small Display */}
      <section className="bg-brand-shipping-bg py-16">
        <div className="container mx-auto px-4 md:px-10">
          <div className="flex items-center justify-between mb-8 flex-row-reverse">
            <div className="text-right">
              <h2 className="text-2xl font-bold font-serif text-brand-text">الكتب التي قد تعجبك</h2>
              <p className="text-brand-shipping-text/70 mt-1">مختارات من صنعنا خصيصاً لذوقك</p>
            </div>
            <Link to="/shop" className="text-brand-accent-brown font-bold hover:underline flex items-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>اكتشف المزيد</span>
            </Link>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-6 custom-scrollbar scroll-smooth">
            {recommendedBooks.map((book) => (
              <SmallBookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid (Bento style) */}
      <section className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center font-serif">اكتشف الأقسام</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 h-[800px] md:h-[600px] text-right" dir="rtl">
          {CATEGORIES.slice(0, 8).map((cat, i) => (
            <Link 
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className={`relative overflow-hidden group rounded-3xl ${
                i === 0 ? 'md:col-span-3 md:row-span-2' : 
                i === 1 ? 'md:col-span-3' : 
                i === 2 ? 'md:col-span-2 md:row-span-2' :
                'md:col-span-1'
              }`}
            >
              <img 
                src={`https://picsum.photos/seed/${cat.id}/1000/1000`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <span className="text-white text-2xl font-black tracking-tight">{cat.labelEn}</span>
                <span className="text-orange-400 font-medium">{cat.labelAr}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Styled Testimonials */}
      <section className="container mx-auto px-4 md:px-10">
        <div className="text-center mb-16">
          <div className="w-12 h-1 bg-brand-accent-brown mx-auto mb-4"></div>
          <h2 className="text-3xl font-bold font-serif text-brand-text">آراء القراء</h2>
          <p className="text-[#888] mt-1">ماذا يقول عملاؤنا عن تجربتهم معنا</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTestimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl border border-[#eee] shadow-sm flex flex-col h-full"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < testimonial.rating ? 'fill-brand-accent-brown text-brand-accent-brown' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <p className="text-[15px] text-[#444] leading-relaxed mb-6 flex-1 italic">
                "{testimonial.content}"
              </p>
              <div className="pt-6 border-t border-[#f0f0f0] flex items-center justify-between">
                <span className="font-bold text-brand-text">— {testimonial.userName}</span>
                <span className="text-[10px] text-[#999] uppercase font-bold tracking-widest">{testimonial.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/reviews" className="text-brand-accent-brown font-bold hover:underline text-sm uppercase tracking-wider">
            عرض كافة المراجعات أو أضف مراجعتك
          </Link>
        </div>
      </section>

      {/* Offers Banner */}
      {featuredOffer && (
        <section className="container mx-auto px-4">
          <Link to={`/product/${featuredOffer.id}`} className="block relative h-96 rounded-[40px] overflow-hidden group">
            <img 
              src={featuredOffer.image} 
              className="w-full h-full object-cover brightness-50 transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
               <span className="bg-white text-orange-500 px-4 py-1 rounded-full text-xs font-black uppercase mb-4">Limited Offer</span>
               <h3 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-4">{featuredOffer.name}</h3>
               <p className="text-xl text-gray-200 mb-8 max-w-xl">{featuredOffer.shortDescription}</p>
               <div className="flex items-center space-x-4">
                 <span className="text-4xl font-black text-white">${featuredOffer.salePrice}</span>
                 <span className="text-2xl text-white/50 line-through">${featuredOffer.price}</span>
               </div>
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
