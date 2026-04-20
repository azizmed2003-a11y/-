import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Package, Users, Activity as ActivityIcon, 
  Search, Plus, Trash2, CheckCircle, Clock, 
  Eye, LogOut, ChevronRight, LayoutDashboard,
  ShoppingCart, Landmark, CreditCard, ExternalLink,
  Edit, EyeOff, Tag, Calendar, AlertCircle, MessageCircle, Phone
} from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Book, Order, Offer, OrderStatus } from '../types';

export default function Admin() {
  const { 
    books, orders, activities, offers, messages,
    addBook, deleteBook, updateBook, toggleBookVisibility,
    updateOrderStatus, addOffer, toggleOffer, deleteOffer, deleteMessage
  } = useAdmin();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'books' | 'orders' | 'offers' | 'logs' | 'messages'>('dashboard');
  
  // Modals / Selection
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const [newBook, setNewBook] = useState<Partial<Book>>({
    name: '',
    author: '',
    price: 0,
    category: 'Self-Development',
    image: 'https://picsum.photos/seed/book/400/600',
    shortDescription: '',
    description: '',
    stock: 10,
    sku: `BK-${Math.floor(Math.random()*1000)}`,
    weight: 1,
    isVisible: true
  });

  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '',
    discountPercentage: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    isActive: true,
    target: 'all',
    bookIds: []
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: credentials.username, pass: credentials.password })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        alert('بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      alert('حدث خطأ أثناء تسجيل الدخول');
    }
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    addBook(newBook as any);
    setShowAddBook(false);
    setNewBook({ name: '', author: '', price: 0, category: 'Self-Development', image: 'https://picsum.photos/seed/book/400/600', shortDescription: '', description: '', stock: 10, sku: `BK-${Math.floor(Math.random()*1000)}`, weight: 1, isVisible: true });
  };

  const handleUpdateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      updateBook(editingBook);
      setEditingBook(null);
    }
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    addOffer(newOffer as any);
    setShowAddOffer(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-xl shadow-2xl border border-[#eee] w-full max-w-md"
        >
          <div className="w-16 h-16 bg-[#2d2926] text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-serif mb-2 text-center text-[#2d2926]">لوحة تحكم المكتبة الذهبية</h1>
          <p className="text-[#888] mb-8 text-sm text-center">يرجى تسجيل الدخول بنظام المدير</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#999] uppercase tracking-widest pl-1">اسم المستخدم</label>
              <input 
                type="text" 
                required
                value={credentials.username}
                onChange={e => setCredentials({...credentials, username: e.target.value})}
                className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown transition-colors"
                placeholder="Manager Username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#999] uppercase tracking-widest pl-1">كلمة المرور</label>
              <input 
                type="password" 
                required
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})}
                className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-[#2d2926] text-white font-bold py-3 rounded-md hover:opacity-90 transition-all mt-4">
              تسجيل الدخول
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const revenue = orders.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="min-h-screen bg-[#f9f8f4] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#eee] flex flex-col pt-10">
        <div className="px-8 mb-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2d2926] text-white rounded flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold font-serif text-[#2d2926]">مكتبة الذهبية</span>
        </div>
        
          <nav className="flex-1 space-y-1 px-4">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
              { id: 'orders', icon: ShoppingCart, label: 'الطلبات' },
              { id: 'books', icon: Package, label: 'إدارة الكتب' },
              { id: 'offers', icon: Tag, label: 'العروض' },
              { id: 'messages', icon: MessageCircle, label: 'الرسائل' },
              { id: 'logs', icon: ActivityIcon, label: 'سجل النشاط' },
            ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-[#2d2926] text-white shadow-md' 
                  : 'text-[#666] hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#eee]">
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-h-screen custom-scrollbar">
        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'إجمالي المبيعات', value: `$${revenue.toFixed(2)}`, icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'الطلبات الجديدة', value: orders.filter(o => o.status === 'New').length, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'رسائل العملاء', value: messages?.length || 0, icon: MessageCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                { label: 'المخزون الكلي', value: books.length, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'نشاط الزوار', value: activities.length, icon: ActivityIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-[#eee] shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center shrink-0`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-[#999] font-bold">{stat.label}</p>
                    <p className="text-2xl font-bold text-brand-text">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {/* Recent Orders */}
               <div className="bg-white rounded-xl border border-[#eee] shadow-sm overflow-hidden">
                  <div className="bg-white p-6 border-b border-[#eee] flex items-center justify-between">
                    <h3 className="font-bold font-serif flex items-center gap-2">
                       <ShoppingCart className="w-5 h-5 text-blue-600" />
                       <span>آخر الطلبات</span>
                    </h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-brand-accent-brown hover:underline">عرض الكل</button>
                  </div>
                  <div className="divide-y divide-[#f0f0f0]">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="space-y-1">
                          <p className="font-bold text-brand-text">{order.customer.fullName}</p>
                          <p className="text-xs text-[#999] flex items-center gap-2">
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{order.items.length} كتب</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-text">${(order.total || 0).toFixed(2)}</p>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            order.status === 'New' ? 'bg-red-100 text-red-600' : 
                            order.status === 'Review' ? 'bg-orange-100 text-orange-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {order.status === 'New' ? 'طلب جديد' : 
                             order.status === 'Review' ? 'قيد المراجعة' : 'مكتمل'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && <div className="p-10 text-center text-[#ccc]">لا توجد طلبات بعد</div>}
                  </div>
               </div>

               {/* Recent activity */}
               <div className="bg-white rounded-xl border border-[#eee] shadow-sm overflow-hidden">
                  <div className="bg-white p-6 border-b border-[#eee] flex items-center justify-between">
                    <h3 className="font-bold font-serif flex items-center gap-2">
                       <ActivityIcon className="w-5 h-5 text-purple-600" />
                       <span>نشاط الزوار</span>
                    </h3>
                  </div>
                  <div className="divide-y divide-[#f0f0f0] max-h-[400px] overflow-y-auto">
                    {activities.slice(0, 10).map(activity => (
                      <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <ActivityIcon className="w-4 h-4 text-[#999]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-bold text-brand-text">زائر </span>
                            {activity.type === 'visit' ? 'دخل المتجر' : 
                             activity.type === 'add_to_cart' ? `أضاف "${activity.bookName}" للسلة` : 
                             `شاهد "${activity.bookName}"`}
                          </p>
                          <p className="text-[10px] text-[#999] mt-0.5">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        { activeTab === 'books' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-3xl font-bold font-serif text-[#2d2926]">إدارة الكتب</h2>
              <button 
                onClick={() => setShowAddBook(true)}
                className="bg-brand-accent-brown text-white font-bold px-6 py-3 rounded-md flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة كتاب جديد</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-[#eee] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-[#f9f8f4] border-b border-[#eee]">
                    <tr>
                      <th className="p-4 font-bold text-brand-text">الكتاب</th>
                      <th className="p-4 font-bold text-brand-text font-serif">السعر</th>
                      <th className="p-4 font-bold text-brand-text font-serif">المخزون</th>
                      <th className="p-4 font-bold text-brand-text font-serif">الحالة</th>
                      <th className="p-4 font-bold text-brand-text font-serif">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f0]">
                    {books.map(book => (
                      <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={book.image} className="w-10 h-14 object-cover rounded shadow-sm" />
                            <div className="flex flex-col">
                              <span className="font-bold text-brand-text">{book.name}</span>
                              <span className="text-[10px] text-[#999]">{book.author}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#2d2926]">${book.price}</span>
                            {book.salePrice && <span className="text-[10px] text-green-600 font-bold opacity-80">Discounted: ${book.salePrice}</span>}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-[#666]">{book.stock}</td>
                        <td className="p-4">
                           <button 
                            onClick={() => toggleBookVisibility(book.id)}
                            className={`p-1 px-3 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                              book.isVisible ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}
                           >
                             {book.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                             <span>{book.isVisible ? 'عرض' : 'إخفاء'}</span>
                           </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => setEditingBook(book)}
                               className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                             >
                               <Edit className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => deleteBook(book.id)}
                               className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        { activeTab === 'orders' && (
          <div className="animate-in fade-in duration-300 space-y-6 text-right" dir="rtl">
            <h2 className="text-3xl font-bold font-serif text-[#2d2926]">إدارة الطلبات</h2>
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl border border-[#eee] shadow-sm overflow-hidden">
                   <div className="bg-[#f9f8f4] p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-white bg-brand-text px-3 py-1 rounded-full uppercase tracking-widest">{order.id}</span>
                        <span className="text-xs text-[#999] font-bold">{new Date(order.date).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="flex bg-white rounded-md border border-[#eee] p-0.5">
                            {(['New', 'Review', 'Paid', 'Completed', 'Rejected'] as OrderStatus[]).map(s => (
                              <button 
                                key={s}
                                onClick={() => updateOrderStatus(order.id, s)}
                                className={`text-[9px] px-3 py-1 rounded font-black uppercase transition-all ${
                                  order.status === s ? 'bg-brand-accent-brown text-white' : 'hover:bg-gray-50 text-[#999]'
                                }`}
                              >
                                {s === 'New' ? 'جديد' : s === 'Review' ? 'مراجعة' : s === 'Paid' ? 'تم الدفع' : s === 'Completed' ? 'مكتمل' : 'مرفوض'}
                              </button>
                            ))}
                         </div>
                        <span className="text-lg font-bold text-brand-text">${(order.total || 0).toFixed(2)}</span>
                      </div>
                   </div>
                   
                   <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                      <div className="space-y-4">
                        <h4 className="text-[12px] uppercase tracking-[1px] text-[#999] font-bold border-r-2 border-brand-accent-brown pr-2">معلومات العميل</h4>
                        <div className="space-y-2 text-sm">
                           <p><span className="text-[#999]">الاسم:</span> {order.customer.fullName}</p>
                           <p><span className="text-[#999]">الهاتف/واتساب:</span> <a href={`https://wa.me/${order.customer.phone}`} target="_blank" className="text-blue-600 hover:underline">{order.customer.phone}</a></p>
                           <p><span className="text-[#999]">المدينة:</span> {order.customer.city}</p>
                           <p><span className="text-[#999]">العنوان:</span> {order.customer.address}</p>
                           {order.customer.notes && <p><span className="text-[#999]">ملاحظات:</span> {order.customer.notes}</p>}
                        </div>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-[12px] uppercase tracking-[1px] text-[#999] font-bold border-r-2 border-brand-accent-brown pr-2">إثبات الدفع</h4>
                         {order.paymentDetails?.proofImage ? (
                            <div className="relative group cursor-pointer" onClick={() => window.open(order.paymentDetails?.proofImage, '_blank')}>
                               <img 
                                src={order.paymentDetails.proofImage} 
                                className="w-full h-40 object-cover rounded-lg border border-[#eee] transition-all group-hover:opacity-80" 
                               />
                               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                    <ExternalLink className="w-5 h-5 text-brand-accent-brown" />
                                  </div>
                               </div>
                               <p className="text-[9px] mt-2 text-[#999] font-bold text-center">اضغط للتكبير</p>
                            </div>
                         ) : (
                           <div className="h-40 bg-gray-50 border-2 border-dashed border-[#eee] rounded-lg flex flex-col items-center justify-center text-[#ccc] space-y-2">
                              <Landmark className="w-8 h-8 opacity-20" />
                              <p className="text-xs font-bold">لم يتم رفع إثبات بعد</p>
                           </div>
                         )}
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-[12px] uppercase tracking-[1px] text-[#999] font-bold border-r-2 border-brand-accent-brown pr-2">الكتب المطلوبة</h4>
                         <div className="space-y-3">
                            {order.items.map(item => (
                              <div key={item.id} className="flex gap-2 text-sm border-b border-[#f9f8f4] pb-2 last:border-0">
                                 <img src={item.image} className="w-8 h-10 object-cover rounded" />
                                 <div className="flex-1">
                                   <p className="font-bold text-xs">{item.name}</p>
                                   <p className="text-[10px] text-[#999]">الكمية: {item.quantity}</p>
                                 </div>
                                 <span className="font-bold text-xs">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                         </div>

                         <div className="mt-8 pt-6 border-t border-[#f9f8f4] space-y-2">
                            <div className="flex justify-between text-xs text-[#888]">
                               <span>المجموع الفرعي</span>
                               <span>${(order.subtotal || 0).toFixed(2)}</span>
                            </div>
                            {(order.discount || 0) > 0 && (
                               <div className="flex justify-between text-xs text-brand-accent-red font-bold">
                                  <span>الخصم</span>
                                  <span>-${(order.discount || 0).toFixed(2)}</span>
                               </div>
                            )}
                            {(order.shipping || 0) > 0 && (
                               <div className="flex justify-between text-xs text-[#888]">
                                  <span>الشحن</span>
                                  <span>${(order.shipping || 0).toFixed(2)}</span>
                               </div>
                            )}
                            <div className="flex justify-between text-sm font-black text-brand-text pt-2 border-t border-dashed border-gray-200">
                               <span>الإجمالي النهائي</span>
                               <span>${(order.total || 0).toFixed(2)}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
              {orders.length === 0 && <div className="p-20 text-center text-[#ccc]">لا توجد طلبات للمراجعة</div>}
            </div>
          </div>
        )}

        { activeTab === 'offers' && (
           <div className="animate-in fade-in duration-300 space-y-6 text-right" dir="rtl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold font-serif text-[#2d2926]">إدارة العروض والخصومات</h2>
                <button 
                  onClick={() => setShowAddOffer(true)}
                  className="bg-green-600 text-white font-bold px-6 py-3 rounded-md flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  <span>إنشاء عرض جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map(offer => (
                   <div key={offer.id} className="bg-white p-6 rounded-xl border border-[#eee] shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-green-600" />
                            <h3 className="font-bold text-lg">{offer.title}</h3>
                         </div>
                         <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleOffer(offer.id)}
                              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                offer.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                               {offer.isActive ? 'مفعل' : 'معطل'}
                            </button>
                            <button onClick={() => deleteOffer(offer.id)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                         <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-[#999] mb-1">نسبة الخصم</p>
                            <p className="text-xl font-black text-green-600">{offer.discountPercentage}%</p>
                         </div>
                         <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-[#999] mb-1">الجمهور المستهدف</p>
                            <p className="text-sm font-bold uppercase">{offer.target === 'all' ? 'جميع الكتب' : 'كتب محددة'}</p>
                            {offer.target === 'specific' && offer.bookIds && (
                               <div className="mt-1 text-[10px] text-brand-accent-brown font-medium line-clamp-1">
                                  {books.filter(b => offer.bookIds?.includes(b.id)).map(b => b.name).join(', ')}
                               </div>
                            )}
                         </div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#999] font-bold">
                         <Calendar className="w-4 h-4" />
                         <span>من {offer.startDate} إلى {offer.endDate}</span>
                      </div>
                   </div>
                ))}
                {offers.length === 0 && <div className="col-span-2 p-20 text-center border-2 border-dashed border-[#eee] rounded-xl text-[#ccc] font-bold font-serif text-2xl">لا توجد عروض حالياً</div>}
              </div>
           </div>
        )}

        { activeTab === 'messages' && (
          <div className="animate-in fade-in duration-300 space-y-6 text-right" dir="rtl">
            <h2 className="text-3xl font-bold font-serif text-[#2d2926]">رسائل العملاء</h2>
            <div className="bg-white rounded-xl border border-[#eee] shadow-sm overflow-hidden">
               <div className="divide-y divide-[#f0f0f0]">
                  {messages?.map(msg => (
                    <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="font-bold text-brand-text">{msg.name}</p>
                                <p className="text-xs text-[#999]">{new Date(msg.date).toLocaleString()}</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => deleteMessage?.(msg.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                       <div className="bg-[#f9f8f4] p-4 rounded-lg space-y-2">
                          <p className="text-sm font-bold flex items-center gap-2">
                             <Phone className="w-3 h-3 text-green-600" />
                             <span>رقم الهاتف:</span>
                             <a href={`https://wa.me/${msg.phone}`} target="_blank" className="text-blue-600 hover:underline">{msg.phone}</a>
                          </p>
                          <p className="text-sm text-[#444] leading-relaxed">
                             {msg.message}
                          </p>
                       </div>
                    </div>
                  ))}
                  {(!messages || messages.length === 0) && (
                    <div className="p-20 text-center text-[#ccc]">
                       <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
                       <p className="text-xl font-serif">لا توجد رسائل حالياً</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        { activeTab === 'logs' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <h2 className="text-3xl font-bold font-serif text-[#2d2926]">سجل النشاط الكامل</h2>
            <div className="bg-white rounded-xl border border-[#eee] shadow-sm overflow-hidden">
               <div className="divide-y divide-[#f0f0f0]">
                  {activities.map(activity => (
                    <div key={activity.id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            activity.type === 'visit' ? 'bg-blue-50 text-blue-500' :
                            activity.type === 'add_to_cart' ? 'bg-orange-50 text-orange-500' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {activity.type === 'visit' ? <Users className="w-5 h-5" /> :
                             activity.type === 'add_to_cart' ? <ShoppingCart className="w-5 h-5" /> :
                             <ActivityIcon className="w-5 h-5" />}
                          </div>
                          <div className="space-y-0.5 text-right md:text-left">
                            <p className="font-bold text-[#2d2926]">
                              {activity.type === 'visit' ? 'زيارة جديدة للمتجر' :
                               activity.type === 'add_to_cart' ? `إضافة للسلة: ${activity.bookName}` :
                               `شاهد منتج: ${activity.bookName}`}
                            </p>
                            <p className="text-xs text-[#999] uppercase tracking-wide">{new Date(activity.timestamp).toLocaleString()}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Book Modals */}
      <AnimatePresence>
        {(showAddBook || editingBook) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowAddBook(false); setEditingBook(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh] custom-scrollbar text-right"
              dir="rtl"
            >
              <h2 className="text-3xl font-bold font-serif mb-8 text-[#2d2926]">{editingBook ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}</h2>
              <form onSubmit={editingBook ? handleUpdateBook : handleAddBook} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">اسم الكتاب</label>
                      <input 
                        required type="text" 
                        value={editingBook ? editingBook.name : newBook.name}
                        onChange={e => editingBook ? setEditingBook({...editingBook, name: e.target.value}) : setNewBook({...newBook, name: e.target.value})}
                        className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">الكاتب</label>
                      <input 
                        required type="text" 
                        value={editingBook ? editingBook.author : newBook.author}
                        onChange={e => editingBook ? setEditingBook({...editingBook, author: e.target.value}) : setNewBook({...newBook, author: e.target.value})}
                        className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown" 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">السعر الأصلي ($)</label>
                      <input 
                        required type="number" step="0.01"
                        value={editingBook ? editingBook.price : newBook.price}
                        onChange={e => editingBook ? setEditingBook({...editingBook, price: Number(e.target.value)}) : setNewBook({...newBook, price: Number(e.target.value)})}
                        className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown font-bold" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">سعر الخصم (اختياري)</label>
                      <input 
                        type="number" step="0.01"
                        value={editingBook ? editingBook.salePrice : (newBook.salePrice || '')}
                        onChange={e => editingBook ? setEditingBook({...editingBook, salePrice: Number(e.target.value) || undefined}) : setNewBook({...newBook, salePrice: Number(e.target.value) || undefined})}
                        className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown font-bold text-green-600" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">المخزون</label>
                      <input 
                        required type="number"
                        value={editingBook ? editingBook.stock : newBook.stock}
                        onChange={e => editingBook ? setEditingBook({...editingBook, stock: Number(e.target.value)}) : setNewBook({...newBook, stock: Number(e.target.value)})}
                        className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown" 
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">التصنيف</label>
                      <select 
                        required
                        value={editingBook ? editingBook.category : newBook.category}
                        onChange={e => editingBook ? setEditingBook({...editingBook, category: e.target.value as any}) : setNewBook({...newBook, category: e.target.value as any})}
                        className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown font-bold"
                      >
                        {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.labelAr}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">رابط الصورة</label>
                      <input 
                        type="text" 
                        value={editingBook ? editingBook.image : newBook.image}
                        onChange={e => editingBook ? setEditingBook({...editingBook, image: e.target.value}) : setNewBook({...newBook, image: e.target.value})}
                        className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown" 
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">وصف قصير</label>
                   <input 
                     required type="text"
                     value={editingBook ? editingBook.shortDescription : newBook.shortDescription}
                     onChange={e => editingBook ? setEditingBook({...editingBook, shortDescription: e.target.value}) : setNewBook({...newBook, shortDescription: e.target.value})}
                     className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown" 
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">الوصف الكامل</label>
                   <textarea 
                     required rows={4}
                     value={editingBook ? editingBook.description : newBook.description}
                     onChange={e => editingBook ? setEditingBook({...editingBook, description: e.target.value}) : setNewBook({...newBook, description: e.target.value})}
                     className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown" 
                   />
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                     type="button"
                     onClick={() => { setShowAddBook(false); setEditingBook(null); }}
                     className="flex-1 border border-[#eee] py-4 rounded-md font-bold text-[#666] hover:bg-gray-50"
                    >
                      إلغاء
                    </button>
                   <button 
                     type="submit"
                     className="flex-[2] bg-[#2d2926] text-white font-bold py-4 rounded-md hover:opacity-90 shadow-xl"
                    >
                      {editingBook ? 'حفظ التعديلات' : 'إضافة الكتاب'}
                    </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Offer Modal */}
        {showAddOffer && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowAddOffer(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-xl bg-white rounded-2xl p-8 shadow-2xl text-right" dir="rtl">
                 <h2 className="text-3xl font-bold font-serif mb-8">إنشاء عرض جديد</h2>
                 <form onSubmit={handleAddOffer} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">عنوان العرض</label>
                       <input 
                         required type="text" placeholder="مثلاً: خصم الشتاء"
                         value={newOffer.title}
                         onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                         className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 focus:outline-none focus:border-brand-accent-brown"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">نسبة الخصم (%)</label>
                          <input 
                             required type="number" min="5" max="90"
                             value={newOffer.discountPercentage}
                             onChange={e => setNewOffer({...newOffer, discountPercentage: Number(e.target.value)})}
                             className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">المستهدف</label>
                          <select 
                             value={newOffer.target}
                             onChange={e => setNewOffer({...newOffer, target: e.target.value as any, bookIds: []})}
                             className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4"
                          >
                             <option value="all">كل المتجر</option>
                             <option value="specific">كتب محددة</option>
                          </select>
                       </div>
                    </div>

                    {newOffer.target === 'specific' && (
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">اختر الكتب المشمولة بالعرض ( {newOffer.bookIds?.length || 0} )</label>
                          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-4 border border-[#eee] rounded-lg bg-[#fcfcfc]">
                             {books.map(book => (
                                <label key={book.id} className="flex items-center gap-2 text-xs p-2 hover:bg-white rounded cursor-pointer border border-transparent hover:border-[#eee] transition-all">
                                   <input 
                                      type="checkbox"
                                      checked={newOffer.bookIds?.includes(book.id)}
                                      onChange={(e) => {
                                         const ids = newOffer.bookIds || [];
                                         setNewOffer({
                                            ...newOffer,
                                            bookIds: e.target.checked 
                                               ? [...ids, book.id] 
                                               : ids.filter(id => id !== book.id)
                                         });
                                      }}
                                      className="rounded text-brand-accent-brown focus:ring-brand-accent-brown"
                                   />
                                   <span className="truncate flex-1">{book.name}</span>
                                </label>
                             ))}
                          </div>
                       </div>
                    )}
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">تاريخ البدء</label>
                          <input 
                             required type="date"
                             value={newOffer.startDate}
                             onChange={e => setNewOffer({...newOffer, startDate: e.target.value})}
                             className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#999]">تاريخ الانتهاء</label>
                          <input 
                             required type="date"
                             value={newOffer.endDate}
                             onChange={e => setNewOffer({...newOffer, endDate: e.target.value})}
                             className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4"
                          />
                       </div>
                    </div>
                    <button className="w-full bg-green-600 text-white font-bold py-4 rounded-md shadow-lg hover:bg-green-700 transition-all">تفعيل العرض</button>
                 </form>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
