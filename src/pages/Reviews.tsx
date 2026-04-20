import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import { useTestimonials } from '../context/TestimonialContext';

export default function Reviews() {
  const { testimonials, addTestimonial } = useTestimonials();
  const [formData, setFormData] = useState({ userName: '', content: '', rating: 5 });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.content) return;
    addTestimonial(formData);
    setSubmitted(true);
    setFormData({ userName: '', content: '', rating: 5 });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="container mx-auto px-4 md:px-10 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-12 h-1 bg-brand-accent-brown mx-auto mb-4"></div>
          <h1 className="text-4xl font-bold font-serif text-brand-text mb-4">آراء القراء وملاحظاتهم</h1>
          <p className="text-[#888]">نحن نقدر رأيك كثيراً، شاركنا تجربتك مع متجرنا.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Submission Form */}
          <div className="bg-white p-8 rounded-xl border border-[#eee] shadow-sm h-fit sticky top-24">
            <h2 className="text-xl font-bold font-serif mb-6">أضف مراجعتك</h2>
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-green-50 border border-green-100 p-6 rounded-lg text-center text-green-700"
                >
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-bold mb-2">تم الإرسال بنجاح!</p>
                  <p className="text-sm">شكراً لك على وقتك. مراجعتك تظهر الآن في صفحة المراجعات.</p>
                </motion.div>
              ) : (
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                >
                  <div>
                    <label className="text-[12px] uppercase tracking-[1px] text-[#999] mb-1.5 block font-bold">الاسم</label>
                    <input 
                      type="text" 
                      required
                      value={formData.userName}
                      onChange={e => setFormData({ ...formData, userName: e.target.value })}
                      placeholder="اسمك الكريم"
                      className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 text-sm focus:outline-none focus:border-brand-accent-brown transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] uppercase tracking-[1px] text-[#999] mb-1.5 block font-bold">التقييم</label>
                    <div className="flex gap-2 text-gray-200">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className={`transition-colors ${star <= formData.rating ? 'text-brand-accent-brown' : 'text-gray-200'}`}
                        >
                          <Star className={`w-6 h-6 ${star <= formData.rating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] uppercase tracking-[1px] text-[#999] mb-1.5 block font-bold">رسالتك</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                      placeholder="اكتب تجربتك هنا..."
                      className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-3 px-4 text-sm focus:outline-none focus:border-brand-accent-brown transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-brand-text text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال المراجعة</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* List of testimonials */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold font-serif mb-6">المراجعات ({testimonials.length})</h2>
            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="border-b border-[#f0f0f0] pb-6 last:border-0">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'fill-brand-accent-brown text-brand-accent-brown' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-[15px] text-[#444] mb-4 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                    <span className="text-brand-text">— {testimonial.userName}</span>
                    <span className="text-[#999]">{testimonial.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
