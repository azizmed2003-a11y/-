import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-brand-text pt-16 pb-8 border-t border-[#eee]">
      <div className="container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight font-serif text-brand-text">متجر الكُتب</span>
            </div>
            <p className="text-[#888] text-sm leading-relaxed">
              Your ultimate destination for curated books. We bring you the best in self-development, finance, and storytelling to inspire your journey.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-[#eee] flex items-center justify-center hover:bg-brand-accent-brown hover:text-white transition-colors text-[#999]">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[12px] uppercase tracking-[1px] text-[#999] mb-6 font-semibold">تصفح الروابط</h4>
            <ul className="space-y-4 text-[#666] text-sm">
              {['Home', 'Shop', 'Categories', 'Offers', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-brand-accent-brown transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[12px] uppercase tracking-[1px] text-[#999] mb-6 font-semibold">أقسام مختارة</h4>
            <ul className="space-y-4 text-[#666] text-sm">
              {['Self Development', 'Money & Investment', 'Novels', 'Children'].map((item) => (
                <li key={item}>
                  <Link to={`/shop?category=${item}`} className="hover:text-brand-accent-brown transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-[12px] uppercase tracking-[1px] text-[#999] mb-6 font-semibold">النشرة البريدية</h4>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 pr-12 text-sm focus:outline-none focus:border-brand-accent-brown transition-colors"
              />
              <button className="absolute right-2 top-1.5 p-1.5 text-[#999] hover:text-brand-accent-brown transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </form>
            <div className="space-y-3 text-sm text-[#666]">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brand-accent-brown" />
                <span>+222 42204545</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#f0f0f0] flex flex-col md:flex-row justify-between items-center text-[#999] text-[11px] space-y-4 md:space-y-0 font-medium uppercase tracking-[0.5px]">
          <p>© 2026 Golden Library. All rights reserved.</p>
          <div className="flex space-x-8">
            <Link to="/admin" className="hover:text-brand-accent-brown">Admin Panel</Link>
            <a href="#" className="hover:text-brand-accent-brown">Privacy Policy</a>
            <a href="#" className="hover:text-brand-accent-brown">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
