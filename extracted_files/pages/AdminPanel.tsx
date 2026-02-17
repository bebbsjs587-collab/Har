
import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, Users, Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon, Calculator, Activity, Clock, Bot, Sparkles, Send, Command, Cpu, Terminal, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Category, Product } from '../types';
import { AnalyticsEvent, getAnalyticsHistory, clearAnalyticsHistory } from '../services/analytics';
import { processAdminAgent } from '../services/gemini';

const ProductModal: React.FC<{ 
  product?: Product | null; 
  onClose: () => void; 
  onSave: (p: Product) => void;
  currentRate: number;
}> = ({ product, onClose, onSave, currentRate }) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      category: Category.ELECTRICITY,
      priceUSD: 0, 
      priceSYP: 0,
      brand: '',
      description: '',
      stock: 0,
      image: '',
      rating: 5.0
    }
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formData.priceUSD !== undefined) {
      setFormData(prev => ({
        ...prev,
        priceSYP: Math.ceil((prev.priceUSD! * currentRate) / 100) * 100
      }));
    }
  }, [formData.priceUSD, currentRate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.image) {
      onSave({
        ...formData,
        id: product?.id || Math.random().toString(36).substr(2, 9),
      } as Product);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gold-luxury">
          <h3 className="text-black font-black text-xl">{product ? 'تعديل قطعة' : 'إضافة قطعة جديدة'}</h3>
          <button onClick={onClose} className="p-2 bg-black/10 hover:bg-black/20 rounded-full text-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-2">صورة المنتج</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video rounded-3xl border-2 border-dashed border-white/10 hover:border-gold-luxury/50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-white/5 group"
            >
              {formData.image ? (
                <>
                  <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="text-white" size={32} />
                  </div>
                </>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-gold-luxury">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-xs text-white/40 font-bold">اضغط لرفع صورة من المعرض</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-2">اسم القطعة</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-gold-luxury/50 text-sm"
                placeholder="مثلاً: مفتاح شق ١٢مم"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-2">الفئة</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-gold-luxury/50 text-sm appearance-none"
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat} className="bg-neutral-900">{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-2 flex items-center gap-1">
                 السعر بالدولار ($)
                 <span className="text-gold-luxury">* أساسي</span>
              </label>
              <input 
                required
                type="number" 
                step="0.01"
                value={formData.priceUSD}
                onChange={e => setFormData({...formData, priceUSD: parseFloat(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-gold-luxury/50 text-sm text-amber-500 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-2 flex items-center gap-1">
                 السعر بالليرة (ل.س) 
                 <span className="text-white/20 px-1 py-0.5 bg-white/5 rounded">تلقائي</span>
              </label>
              <div className="relative">
                <input 
                  disabled
                  type="text" 
                  value={formData.priceSYP?.toLocaleString()}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white/50 cursor-not-allowed"
                />
                <Calculator size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-2">المخزون</label>
              <input 
                required
                type="number" 
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-gold-luxury/50 text-sm"
              />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-2">الماركة</label>
               <input 
                 type="text" 
                 value={formData.brand}
                 onChange={e => setFormData({...formData, brand: e.target.value})}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-gold-luxury/50 text-sm"
                 placeholder="Bosch, Makita, etc."
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-2">وصف قصير</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-gold-luxury/50 text-sm h-24 resize-none"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-5 bg-gold-luxury text-black rounded-2xl font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Save size={20} />
              حفظ وتحديث السعر
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AnalyticsTab: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    setEvents(getAnalyticsHistory());
  }, []);

  const handleClear = () => {
    if (confirm('هل أنت متأكد من مسح سجل التحليلات؟')) {
      clearAnalyticsHistory();
      setEvents([]);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl min-h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Activity className="text-blue-500" />
          تتبع خطوات المستخدمين (Analytics)
        </h3>
        <button 
          onClick={handleClear}
          className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all"
        >
          مسح السجل
        </button>
      </div>

      <div className="overflow-hidden">
        {events.length === 0 ? (
           <div className="text-center py-20 opacity-30">
             <Activity size={48} className="mx-auto mb-4" />
             <p>لا يوجد نشاط مسجل حتى الآن</p>
           </div>
        ) : (
          <div className="space-y-3">
             {events.map((event) => (
                <div key={event.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-gold-luxury/30 transition-all">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-black font-black text-xs
                        ${event.event.includes('click') ? 'bg-amber-500' : 
                          event.event.includes('page') ? 'bg-blue-500' : 
                          event.event.includes('fail') ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      >
                         {event.event.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                         <p className="font-bold text-sm text-white">{event.event.replace('_', ' ').toUpperCase()}</p>
                         <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(event.properties).map(([key, val]) => (
                               <span key={key} className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-white/50 border border-white/5">
                                 {key}: {String(val)}
                               </span>
                            ))}
                         </div>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                      <span className="flex items-center gap-1 text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded-full">
                         <Clock size={10} />
                         {formatTime(event.metadata.timestamp)}
                      </span>
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
    actionType?: string;
    timestamp: Date;
}

const AdminPanel: React.FC = () => {
  const { products, exchangeRate, setExchangeRate, addProduct, updateProduct, deleteProduct } = useAppContext();
  const [newRate, setNewRate] = useState(exchangeRate.toString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'analytics'>('products');
  
  // AI Command Center State
  const [aiCommand, setAiCommand] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    // Load chat history from local storage
    try {
        const saved = localStorage.getItem('admin_ai_chat');
        return saved ? JSON.parse(saved) : [{ 
            role: 'ai', 
            content: 'أهلاً بك يا معلم. أنا مساعدك الإداري الذكي. بقدر ضيف منتجات، عدل أسعار، احذف قطع، أو غير سعر الصرف. بس أمرني!',
            timestamp: new Date()
        }];
    } catch(e) { return []; }
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('admin_ai_chat', JSON.stringify(chatHistory));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleUpdateRate = () => {
    const rate = parseFloat(newRate);
    if (!isNaN(rate) && rate > 0) {
      setExchangeRate(rate);
      alert(`تم تحديث سعر الصرف إلى ${rate.toLocaleString()} ل.س. تم إعادة تسعير جميع المنتجات.`);
    }
  };

  const handleSaveProduct = (p: Product) => {
    if (editingProduct) {
      updateProduct(p);
    } else {
      addProduct(p);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleAICommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCommand.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: aiCommand, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg]);
    setAiCommand('');
    setIsProcessingAI(true);

    // Call the advanced AI agent with current context
    const result = await processAdminAgent(userMsg.content, products, exchangeRate);
    
    setIsProcessingAI(false);

    let aiResponseMsg = result.response;
    let actionType = result.action;

    // Execute Actions
    if (result.action === 'ADD_PRODUCT' && result.payload) {
        const getPlaceholderImage = (cat: string) => {
            switch(cat) {
               case 'كهرباء': return 'https://images.unsplash.com/photo-1558317374-a3594743e527?q=80&w=1000';
               case 'بناء': return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000';
               case 'مياه': return 'https://images.unsplash.com/photo-1608424403337-3315a6914b3d?q=80&w=1000';
               case 'دهانات': return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000';
               default: return 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1000';
            }
        };

        const newProduct: Product = {
            id: Math.random().toString(36).substr(2, 9),
            name: result.payload.name || "منتج جديد",
            category: (result.payload.category as Category) || Category.ELECTRICITY,
            priceUSD: result.payload.priceUSD || 10,
            priceSYP: 0, // Calculated by addProduct
            description: result.payload.description || "",
            brand: result.payload.brand || "Generic",
            stock: result.payload.stock || 10,
            rating: 5.0,
            image: getPlaceholderImage(result.payload.category)
        };
        addProduct(newProduct);
        aiResponseMsg += `\n(تمت الإضافة: ${newProduct.name})`;

    } else if (result.action === 'UPDATE_PRODUCT' && result.payload) {
        const productToUpdate = products.find(p => p.id === result.payload.id);
        if (productToUpdate) {
            const updated = { ...productToUpdate, ...result.payload.updates };
            updateProduct(updated);
            aiResponseMsg += `\n(تم التحديث: ${updated.name})`;
        } else {
            aiResponseMsg = "ما قدرت لاقي المنتج المطلوب يا غالي. تأكد من الاسم.";
            actionType = 'ERROR';
        }

    } else if (result.action === 'DELETE_PRODUCT' && result.payload) {
        const productToDelete = products.find(p => p.id === result.payload.id);
        if (productToDelete) {
            deleteProduct(productToDelete.id);
            aiResponseMsg += `\n(تم الحذف: ${productToDelete.name})`;
        } else {
            aiResponseMsg = "المنتج مو موجود بالقائمة يا طيب.";
            actionType = 'ERROR';
        }

    } else if (result.action === 'SET_RATE' && result.payload) {
        setExchangeRate(result.payload.rate);
        setNewRate(result.payload.rate.toString());
        aiResponseMsg += `\n(السعر الجديد: ${result.payload.rate})`;
    }

    setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content: aiResponseMsg, 
        actionType: actionType,
        timestamp: new Date() 
    }]);
  };

  const totalSales = 12500000; 
  const totalOrders = 84; 

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-amber-500" size={32} />
          <h2 className="text-3xl font-black text-gold-luxury">لوحة تحكم المامو</h2>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           <button 
             onClick={() => setActiveTab('products')}
             className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'products' ? 'bg-gold-luxury text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
           >
             المنتجات
           </button>
           <button 
             onClick={() => setActiveTab('analytics')}
             className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'analytics' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
           >
             التحليلات
           </button>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} 
          onSave={handleSaveProduct}
          currentRate={exchangeRate}
        />
      )}

      {/* AI Command Center - High Tech Chat Interface */}
      <div className="mb-12 bg-black/40 border border-gold-luxury/30 rounded-[32px] overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.05)] flex flex-col h-[500px]">
        {/* Header */}
        <div className="bg-[#080808] p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-luxury/10 rounded-xl flex items-center justify-center border border-gold-luxury/20">
                    <Bot size={20} className="text-gold-luxury" />
                </div>
                <div>
                    <h3 className="text-white font-black text-sm flex items-center gap-2">
                        مركز القيادة الذكي
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    </h3>
                    <p className="text-[10px] text-white/30 font-mono">SYSTEM: ONLINE | ACCESS: FULL</p>
                </div>
            </div>
            <button 
                onClick={() => setChatHistory([])}
                className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-red-500 transition-colors" title="مسح السجل"
            >
                <Trash2 size={16} />
            </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
            {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-gold-luxury/20 text-gold-luxury' : 'bg-white/10 text-white'}`}>
                        {msg.role === 'ai' ? <Sparkles size={14} /> : <Users size={14} />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm font-bold leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-white/5 text-white border border-white/10 rounded-tr-none' 
                        : 'bg-gold-luxury/5 text-amber-50 border border-gold-luxury/10 rounded-tl-none'
                    }`}>
                        {msg.content}
                        {msg.actionType && msg.actionType !== 'QUERY' && msg.actionType !== 'ERROR' && (
                            <div className="mt-2 flex items-center gap-2 text-[10px] text-green-400 bg-green-900/20 px-2 py-1 rounded w-fit border border-green-500/20">
                                <CheckCircle size={10} />
                                تم تنفيذ الأمر: {msg.actionType}
                            </div>
                        )}
                        {msg.actionType === 'ERROR' && (
                            <div className="mt-2 flex items-center gap-2 text-[10px] text-red-400 bg-red-900/20 px-2 py-1 rounded w-fit border border-red-500/20">
                                <AlertTriangle size={10} />
                                فشل التنفيذ
                            </div>
                        )}
                        <span className="block text-[9px] opacity-30 mt-2 text-right dir-ltr">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            ))}
            {isProcessingAI && (
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-luxury/20 flex items-center justify-center shrink-0">
                        <Cpu size={14} className="text-gold-luxury animate-spin" />
                    </div>
                    <div className="bg-gold-luxury/5 text-amber-50 border border-gold-luxury/10 rounded-2xl rounded-tl-none p-4 flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gold-luxury rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gold-luxury rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-gold-luxury rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            )}
            <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#080808] border-t border-white/5">
            <form onSubmit={handleAICommand} className="relative group">
                <Terminal size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-luxury transition-colors" />
                <input 
                    type="text" 
                    value={aiCommand}
                    onChange={(e) => setAiCommand(e.target.value)}
                    placeholder="اطلب أي شيء: 'نزل سعر الشنيور 5 دولارات'، 'كم قطعة عندي؟'، 'احذف القداحة'..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pr-12 pl-14 py-4 outline-none focus:border-gold-luxury/50 transition-all text-sm font-bold text-white placeholder:text-white/20"
                    disabled={isProcessingAI}
                />
                <button 
                    type="submit"
                    disabled={isProcessingAI || !aiCommand.trim()}
                    className="absolute left-2 top-2 bottom-2 bg-gold-luxury text-black px-4 rounded-lg font-black text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
                >
                    <Send size={14} className="rotate-180" /> 
                    <span className="hidden md:inline">تنفيذ</span>
                </button>
            </form>
        </div>
      </div>

      {/* Stats Cards - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl">
          <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold mb-1">مبيعات اليوم</p>
          <p className="text-3xl font-black text-amber-500">{totalSales.toLocaleString()} ل.س</p>
          <div className="mt-2 text-xs text-green-500 flex items-center gap-1">
             <span>↑ 12% منذ أمس</span>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl">
          <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold mb-1">سعر الدولار الحالي</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black">{exchangeRate.toLocaleString()} ل.س</p>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign className="text-green-500" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl">
          <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold mb-1">إجمالي الطلبات</p>
          <p className="text-3xl font-black">{totalOrders}</p>
          <div className="mt-2 text-xs text-blue-500">٤ طلبات قيد التجهيز</div>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <AnalyticsTab />
      ) : (
        <>
          {/* Exchange Rate Management */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -ml-10 -mt-10"></div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
              <DollarSign className="text-amber-500" />
              تحديث سعر الصرف (المركزي للمتجر)
            </h3>
            <div className="flex flex-col md:flex-row gap-4 items-end relative z-10">
              <div className="flex-1 space-y-2">
                <label className="text-xs opacity-60">سعر الدولار مقابل الليرة السورية</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors font-mono text-lg"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                />
              </div>
              <button 
                onClick={handleUpdateRate}
                className="bg-gold-luxury text-black px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                تحديث وإعادة التسعير
              </button>
            </div>
          </section>

          {/* Product Management */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Package className="text-amber-500" />
                إدارة المنتجات
              </h3>
              <button 
                onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors"
              >
                <Plus size={16} />
                إضافة منتج جديد
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs opacity-40 uppercase tracking-widest font-bold">
                    <th className="py-4 px-2">المنتج</th>
                    <th className="py-4 px-2">التصنيف</th>
                    <th className="py-4 px-2">السعر ($)</th>
                    <th className="py-4 px-2">السعر (ل.س)</th>
                    <th className="py-4 px-2">المخزون</th>
                    <th className="py-4 px-2 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <img src={product.image} className="w-10 h-10 rounded-lg object-cover bg-black/40" alt="" />
                          <span className="font-bold text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-xs opacity-60">{product.category}</td>
                      <td className="py-4 px-2 font-mono text-green-500 font-bold">${product.priceUSD.toFixed(2)}</td>
                      <td className="py-4 px-2 font-mono text-amber-500 font-bold">{product.priceSYP.toLocaleString()}</td>
                      <td className="py-4 px-2 text-xs">
                        <span className={`px-2 py-1 rounded-md ${product.stock > 10 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                            className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => deleteProduct(product.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
