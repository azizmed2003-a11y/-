import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { CONTACT_INFO, STORE_NAME } from '../constants';
import { useAdmin } from '../context/AdminContext';
import { useState } from 'react';

export default function Contact() {
  const { sendMessage } = useAdmin();
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="pb-24 text-right" dir="rtl">
      {/* Hero */}
      <section className="bg-[#2d2926] py-32 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent-brown/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6">تواصل معنا</h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">للمساعدة، الاستفسارات، أو طلب كتاب خاص؛ فريق {STORE_NAME} دائماً في خدمتكم.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details */}
          <div className="space-y-6">
            {[
              { icon: Phone, label: 'اتصل بنا / واتساب', value: CONTACT_INFO.phone, color: 'bg-green-50 text-green-600', link: `https://wa.me/${CONTACT_INFO.phoneFull}` },
              { icon: Mail, label: 'البريد الإلكتروني', value: CONTACT_INFO.email, color: 'bg-blue-50 text-blue-600', link: `mailto:${CONTACT_INFO.email}` },
              { icon: MapPin, label: 'الموقع', value: CONTACT_INFO.address, color: 'bg-purple-50 text-purple-600', link: '#' },
            ].map((item, i) => (
              <motion.a 
                href={item.link}
                target={item.link.startsWith('http') ? "_blank" : "_self"}
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-[#eee] flex items-start gap-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className={`${item.color} p-4 rounded-xl shrink-0`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[#999] text-[10px] uppercase font-black tracking-widest">{item.label}</h4>
                  <p className="text-lg font-bold text-brand-text mt-1 group-hover:text-brand-accent-brown transition-colors">{item.value}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white p-10 md:p-16 rounded-[40px] border border-[#eee] shadow-xl">
             {isSubmitted ? (
               <div className="text-center py-10 space-y-4">
                 <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                   <Send className="w-10 h-10" />
                 </div>
                 <h3 className="text-3xl font-bold font-serif">تم إرسال رسالتك بنجاح!</h3>
                 <p className="text-gray-500">شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.</p>
                 <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-brand-accent-brown font-bold underline"
                 >
                   إرسال رسالة أخرى
                 </button>
               </div>
             ) : (
               <>
                 <h3 className="text-3xl font-bold font-serif mb-10">أرسل لنا رسالة</h3>
                 <form className="space-y-8" onSubmit={async (e) => {
                   e.preventDefault();
                   const formData = new FormData(e.currentTarget);
                   const name = formData.get('name') as string;
                   const phone = formData.get('phone') as string;
                   const message = formData.get('message') as string;
                   
                   try {
                     await sendMessage({ name, phone, message });
                     setIsSubmitted(true);
                   } catch (err) {
                     alert('حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً');
                   }
                 }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase text-[#999] tracking-widest pr-2">الاسم بالكامل</label>
                        <input type="text" name="name" required placeholder="مثال: أحمد محمود" className="w-full bg-[#f9f8f4] border border-[#eee] rounded-xl py-4 px-6 focus:outline-none focus:border-brand-accent-brown transition-colors" />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[11px] font-black uppercase text-[#999] tracking-widest pr-2">رقم الهاتف</label>
                        <input type="text" name="phone" required placeholder="00000000" className="w-full bg-[#f9f8f4] border border-[#eee] rounded-xl py-4 px-6 focus:outline-none focus:border-brand-accent-brown transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase text-[#999] tracking-widest pr-2">الرسالة</label>
                      <textarea name="message" required rows={6} placeholder="كيف يمكننا مساعدتك؟" className="w-full bg-[#f9f8f4] border border-[#eee] rounded-xl py-4 px-6 focus:outline-none focus:border-brand-accent-brown transition-colors resize-none"></textarea>
                    </div>
                    <button type="submit" className="w-full md:w-auto bg-[#2d2926] text-white font-bold px-12 py-5 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl active:scale-95">
                      <span>إرسال الرسالة</span>
                      <Send className="w-5 h-5 -scale-x-100" />
                    </button>
                 </form>
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
