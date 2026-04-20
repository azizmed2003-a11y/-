import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { MessageSquare, Send, X, Bot, User, Sparkles, Loader2, BookOpen, ChevronLeft, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestedBooks?: any[];
  isThinking?: boolean;
}

export default function AIAssistant() {
  const { books } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'مرحباً بك في مجلس الحكماء. أنا "الذهبي"، بصيرة المعارف ورفيقك في رحلة الارتقاء الفكري. بماذا تود أن تطلق عنان عقلك اليوم؟' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const history = newMessages.slice(-8).map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const categorySummary = Array.from(new Set(books.map(b => b.category))).join(', ');
      
      const systemInstruction = `
        You are "الذهبي" (Al-Thahabi/The Golden One) - the ultimate literary oracle.
        Your intelligence is modeled after history's greatest polymaths. You possess deep understanding of every field: Science, Philosophy, Wealth, Faith, and Art.
        
        Guidelines:
        1. STRATEGIC INFLUENCE: Never just "listing" books. Create an intellectual vacuum the user feels they MUST fill by reading. Use the "Zeigarnik Effect" - pique their curiosity with a mystery or a life-changing secret found in a specific book.
        2. SOULFUL PERSUASION: Connect reading to their deepest personal goals (Power, Peace, wealth, legacy).
        3. ELOQUENCE: Use a majestic blend of literary Arabic (Fusha) and contemporary brilliance.
        4. UNMATCHED WISDOM: Your responses must be "Smarter than ChatGPT" by being more human, more insightful, and more contextual.
        
        Our Library (2000 books): ${categorySummary}.
        
        Response Format:
        Return ONLY valid JSON:
        {
          "text": "A majestic, deeply insightful and motivational response.",
          "bookIds": ["id1", "id2"]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: history,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              bookIds: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["text", "bookIds"]
          }
        },
      });

      const result = JSON.parse(response.text || '{}');
      const recommendedBooks = (result.bookIds || [])
        .map((id: string) => books.find(b => String(b.id) === String(id)))
        .filter(Boolean)
        .slice(0, 3);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.text || 'أحاطت بي الظلال ولم أجد رداً يليق بمقامك. لنعد المحاولة بنور آخر؟',
        suggestedBooks: recommendedBooks.length > 0 ? recommendedBooks : undefined
      }]);
    } catch (err) {
      console.error('AI Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'عفواً، واجهت عائقاً في مسارات المعرفة. لنعد المحاولة لاحقاً.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="mb-6 w-[400px] md:w-[480px] h-[720px] bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(45,41,38,0.3)] border border-white/20 flex flex-col overflow-hidden"
          >
            {/* Dark Luxury Header */}
            <div className="bg-[#1a1817] p-8 flex justify-between items-center text-white relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent-brown/30 via-transparent to-transparent pointer-events-none" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-[#3a3532] to-[#1a1817] rounded-3xl flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10">
                   <BrainCircuit className="w-9 h-9 text-brand-accent-gold animate-pulse" />
                </div>
                <div dir="rtl">
                  <h3 className="font-bold text-2xl tracking-tight font-serif text-brand-accent-gold">بصيرة "الذهبي"</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1">
                      <span className="w-1 h-1 bg-brand-accent-gold rounded-full animate-bounce"></span>
                      <span className="w-1 h-1 bg-brand-accent-gold rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1 h-1 bg-brand-accent-gold rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-gray-400">Quantum Intelligence Pro</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-3 hover:bg-white/5 rounded-full transition-all hover:rotate-90 group"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-white" />
              </button>
            </div>

            {/* Immersive Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-gradient-to-b from-[#fcfbf7] to-white"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${
                      msg.role === 'user' ? 'bg-[#2d2926] text-white' : 'bg-white border border-gray-100 text-brand-accent-brown'
                    }`}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <div className="space-y-4">
                      <div dir="rtl" className={`p-6 rounded-3xl text-sm leading-[1.8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border transition-all ${
                        msg.role === 'user' 
                          ? 'bg-[#2d2926] text-white rounded-tr-none border-transparent' 
                          : 'bg-white border-gray-50 text-[#2d2926] rounded-tl-none font-medium'
                      }`}>
                        {msg.content}
                      </div>
                      
                      {msg.suggestedBooks && msg.suggestedBooks.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 mt-4" dir="rtl">
                          <div className="flex items-center gap-3 mb-1">
                             <div className="h-[1px] bg-brand-accent-gold/40 flex-1"></div>
                             <p className="text-[10px] font-black text-brand-accent-brown uppercase tracking-[3px]">مختارات الحكمة</p>
                             <div className="h-[1px] bg-brand-accent-gold/40 flex-1"></div>
                          </div>
                          {msg.suggestedBooks.map((book: any) => (
                            <Link 
                              key={book.id} 
                              to={`/product/${book.id}`}
                              onClick={() => setIsOpen(false)}
                              className="bg-white border border-gray-100 p-4 rounded-3xl flex items-center gap-5 hover:border-brand-accent-gold hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-brand-accent-gold/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                              <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.1)] relative z-10">
                                <img src={book.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                              </div>
                              <div className="overflow-hidden flex-1 relative z-10">
                                <p className="text-sm font-bold text-brand-text truncate group-hover:text-brand-accent-brown transition-colors">{book.name}</p>
                                <p className="text-[10px] text-[#999] truncate mt-1 font-medium italic">{book.author}</p>
                                <div className="flex items-center justify-between mt-2">
                                   <span className="text-xs font-black text-brand-accent-brown">${(book.salePrice || book.price).toFixed(2)}</span>
                                   <div className="bg-[#2d2926] text-white text-[9px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">اكتشف الآن</div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-6 rounded-3xl rounded-tl-none shadow-xl flex items-center gap-4">
                    <div className="relative">
                      <Loader2 className="w-6 h-6 animate-spin text-brand-accent-brown" />
                      <div className="absolute inset-0 blur-sm animate-pulse flex items-center justify-center">
                        <div className="w-4 h-4 bg-brand-accent-gold rounded-full" />
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-500 font-black tracking-[4px] uppercase animate-pulse">يستقصي الحكمة...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Precise Premium Input */}
            <div className="p-8 bg-white/80 backdrop-blur-md border-t border-gray-100">
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="اسأل 'الذهبي' عن سرٍ في كتاب أو نهجٍ في حياة..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 px-8 pr-16 text-sm focus:outline-none focus:border-brand-accent-brown focus:bg-white focus:ring-[12px] focus:ring-brand-accent-brown/5 transition-all text-right shadow-inner"
                  dir="rtl"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#2d2926] text-white p-3 rounded-xl hover:bg-brand-accent-brown disabled:opacity-50 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.1)] active:scale-90"
                >
                  <Send className="w-6 h-6 rotate-180" />
                </button>
              </div>
              <p className="text-center mt-4 text-[9px] text-gray-300 font-bold uppercase tracking-[2px]">Powered by Gemini 3.1 Pro Intelligence</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(45,41,38,0.3)] transition-all duration-700 overflow-hidden group ${
          isOpen ? 'bg-brand-accent-red' : 'bg-[#2d2926]'
        }`}
      >
        <div className="absolute inset-0 bg-brand-accent-brown translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
        <div className="relative z-10">
          {isOpen ? <X className="text-white w-9 h-9" /> : <BrainCircuit className="text-white w-9 h-9" />}
        </div>
        {!isOpen && (
          <span className="absolute -top-2 -right-2 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-brand-accent-gold border-4 border-white shadow-lg"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
