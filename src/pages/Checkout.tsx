import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Check, ShieldCheck, Truck, CreditCard, ChevronRight, Upload, Landmark, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { CONTACT_INFO, STORE_NAME } from '../constants';

export default function Checkout() {
  const { cart, subtotal, clearCart, shipping, discount, total } = useCart();
  const { placeOrder, uploadFile } = useAdmin();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    notes: ''
  });

  const [proofImage, setProofImage] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!bookingData.fullName || !bookingData.phone || !proofImage) return;

    setIsProcessing(true);
    
    try {
      await placeOrder({
        items: cart,
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        customer: bookingData,
        paymentMethod: 'Bankily',
        paymentDetails: {
          proofImage: proofImage
        }
      });
      
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      alert('حدث خطأ أثناء إتمام الطلب، يرجى المحاولة لاحقاً');
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessing(true);
        const path = await uploadFile(file);
        setProofImage(path);
        setIsProcessing(false);
      } catch (err) {
        alert('فشل رفع الصورة، يرجى المحاولة مرة أخرى');
        setIsProcessing(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-brand-text leading-tight font-serif shrink-0">شكراً لك! <br /> <span className="text-gray-400 font-light">Order Successful</span></h2>
          <p className="text-[#888] mt-4 max-w-lg mx-auto">لقد تم استلام طلبك بنجاح. سيقوم مدير {STORE_NAME} بمراجعة إثبات الدفع وتأكيد طلبك قريباً.</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#2d2926] text-white font-bold px-10 py-4 rounded-md hover:opacity-90 transition-opacity shadow-lg"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:px-10 text-right" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold font-serif text-brand-text mb-12">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            {/* Steps Indicator */}
            <div className="flex items-center gap-4 justify-end">
               {[1, 2].map(s => (
                 <div key={s} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      step >= s ? 'bg-brand-accent-brown text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step > s ? <Check className="w-5 h-5" /> : s}
                    </div>
                    {s < 2 && <ChevronRight className="w-4 h-4 text-gray-300 rotate-180" />}
                 </div>
               ))}
            </div>

            {/* Form Sections */}
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <h3 className="text-2xl font-bold font-serif flex items-center gap-3">
                  <span className="w-10 h-10 bg-brand-bg rounded-lg flex items-center justify-center text-brand-accent-brown"><FileText className="w-6 h-6" /></span>
                  <span>معلومات التوصيل</span>
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[12px] uppercase tracking-[1px] text-[#999] font-bold">الاسم الكامل</label>
                     <input 
                       type="text" 
                       required
                       value={bookingData.fullName}
                       onChange={e => setBookingData({...bookingData, fullName: e.target.value})}
                       placeholder="الاسم الثلاثي المكتمل"
                       className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-4 px-6 focus:outline-none focus:border-brand-accent-brown transition-colors" 
                      />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[12px] uppercase tracking-[1px] text-[#999] font-bold">رقم الهاتف / واتساب</label>
                      <input 
                        type="text" 
                        required
                        value={bookingData.phone}
                        onChange={e => setBookingData({...bookingData, phone: e.target.value})}
                        placeholder="00000000"
                        className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-4 px-6 focus:outline-none focus:border-brand-accent-brown transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[12px] uppercase tracking-[1px] text-[#999] font-bold">المدينة</label>
                       <input 
                         type="text" 
                         value={bookingData.city}
                         onChange={e => setBookingData({...bookingData, city: e.target.value})}
                         placeholder="نواكشوت، نواذيبو..."
                         className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-4 px-6 focus:outline-none focus:border-brand-accent-brown transition-colors" 
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[12px] uppercase tracking-[1px] text-[#999] font-bold">العنوان (اختياري)</label>
                     <input 
                       type="text" 
                       value={bookingData.address}
                       onChange={e => setBookingData({...bookingData, address: e.target.value})}
                       placeholder="الحي، المعلم القريب..."
                       className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-4 px-6 focus:outline-none focus:border-brand-accent-brown transition-colors" 
                      />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[12px] uppercase tracking-[1px] text-[#999] font-bold">ملاحظات إضافية (اختياري)</label>
                     <textarea 
                       value={bookingData.notes}
                       onChange={e => setBookingData({...bookingData, notes: e.target.value})}
                       placeholder="أي تفاصيل أخرى تريد إضافتها..."
                       rows={3}
                       className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-4 px-6 focus:outline-none focus:border-brand-accent-brown transition-colors" 
                      />
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!bookingData.fullName || !bookingData.phone}
                  className="w-full md:w-auto bg-[#2d2926] text-white font-bold px-12 py-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
                >
                  المتابعة للدفع
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <h3 className="text-2xl font-bold font-serif flex items-center gap-3">
                  <span className="w-10 h-10 bg-brand-bg rounded-lg flex items-center justify-center text-brand-accent-brown"><Landmark className="w-6 h-6" /></span>
                  <span>إتمام الدفع اليدوي</span>
                </h3>

                <div className="bg-white p-8 rounded-xl border border-[#eee] space-y-8 shadow-sm">
                  <div className="bg-brand-shipping-bg p-6 rounded-lg text-brand-shipping-text border border-[#faebcc] space-y-3">
                    <p className="font-bold text-lg">تعليمات الدفع عبر Bankily:</p>
                    <p className="text-sm">يرجى تحويل مبلغ <span className="font-black text-xl underline underline-offset-4">${total.toFixed(2)}</span> إلى الرقم التالي:</p>
                    <div className="bg-white/50 p-4 rounded-md text-center">
                       <span className="text-3xl font-black tracking-widest text-brand-text">{CONTACT_INFO.bankilyNumber}</span>
                    </div>
                    <p className="text-xs opacity-80 pt-2 font-medium">سيقوم المدير بمراجعة إثبات الدفع وتأكيد الطلب بمجرد التحقق.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[12px] uppercase tracking-[1px] text-[#999] font-bold block">يرجى رفع صورة إثبات الدفع (Screenshot)</label>
                    <div className="flex items-center justify-center w-full">
                      <label className={`w-full h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                        proofImage ? 'border-green-500 bg-green-50' : 'border-[#eee] hover:bg-gray-50'
                      }`}>
                        {proofImage ? (
                          <div className="flex flex-col items-center gap-2">
                             <Check className="w-10 h-10 text-green-600" />
                             <p className="text-sm font-bold text-green-700">تم رفع الإثبات بنجاح</p>
                             <button onClick={(e) => { e.preventDefault(); setProofImage(null); }} className="text-[10px] underline text-green-600 font-bold mt-2">تغيير الصورة</button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 text-[#bbb] mb-3" />
                            <p className="text-sm text-[#999] font-bold">اضغط أو اسحب صورة الإثبات هنا</p>
                          </div>
                        )}
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white border border-[#eee] text-[#666] font-bold py-4 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    رجوع
                  </button>
                  <button 
                    onClick={handleCheckout}
                    disabled={isProcessing || !proofImage}
                    className="flex-[2] bg-[#2d2926] text-white font-bold py-4 rounded-md hover:opacity-90 transition-opacity shadow-xl disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? 'جاري إرسال الطلب...' : 'تأكيد إتمام الطلب'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-[#eee] shadow-sm sticky top-32">
              <h3 className="text-xl font-bold font-serif mb-8 text-brand-text">ملخص الطلب</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 border-b border-[#f9f8f4] pb-4 last:border-0 last:pb-0">
                    <img src={item.image} className="w-12 h-16 object-cover rounded shadow-sm" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <p className="text-sm font-bold line-clamp-1 text-brand-text">{item.name}</p>
                      <p className="text-[11px] text-[#999]">الكمية: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-brand-text">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-[#f9f8f4] space-y-4">
                 {(shipping > 0 || discount > 0) && (
                   <div className="flex justify-between text-sm text-[#888]">
                      <span>المجموع الفرعي</span>
                      <span>${subtotal.toFixed(2)}</span>
                   </div>
                 )}
                 {shipping > 0 && (
                   <div className="flex justify-between text-sm text-[#888]">
                      <span>التوصيل</span>
                      <span>${shipping.toFixed(2)}</span>
                   </div>
                 )}
                 {discount > 0 && (
                   <div className="flex justify-between text-sm text-brand-accent-red">
                      <span>الخصم</span>
                      <span>-${discount.toFixed(2)}</span>
                   </div>
                 )}
                 <div className="flex justify-between text-lg font-bold text-brand-text font-serif pt-2 border-t border-dashed border-[#eee]">
                    <span>إجمالي المبلغ</span>
                    <span>${total.toFixed(2)}</span>
                 </div>
              </div>
            </div>
            
            <div className="p-6 bg-brand-shipping-bg text-brand-shipping-text border border-[#faebcc] rounded-xl flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <p className="text-[12px] font-medium leading-relaxed">تتم مراجعة طلبك ومعلوماتك بشكل يدوي بالكامل لضمان أعلى مستويات الأمان والدقة.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
