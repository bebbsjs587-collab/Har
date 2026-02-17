
import React from 'react';
import { Category } from '../types';
import { Zap, Hammer, Droplets, Paintbrush, ChevronLeft, Star, TrendingUp, ShieldCheck, Box } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { trackEvent } from '../services/analytics';

interface HomeProps {
  onCategorySelect: (category: Category) => void;
}

const Home: React.FC<HomeProps> = ({ onCategorySelect }) => {
  const { exchangeRate } = useAppContext();
  
  const categories = [
    { id: Category.ELECTRICITY, title: 'كهرباء', icon: <Zap size={32} />, color: 'from-amber-400 to-yellow-600', count: '١٤٢ قطعة' },
    { id: Category.CONSTRUCTION, title: 'بناء', icon: <Hammer size={32} />, color: 'from-orange-500 to-red-700', count: '٨٩ قطعة' },
    { id: Category.WATER, title: 'تمديدات', icon: <Droplets size={32} />, color: 'from-blue-500 to-indigo-700', count: '٢١٠ قطعة' },
    { id: Category.PAINT, title: 'دهانات', icon: <Paintbrush size={32} />, color: 'from-pink-500 to-purple-800', count: '٥٥ لوناً' }
  ];

  // Dynamic price calculation for the Flash Deal (example: 5 USD item)
  const flashDealPriceUSD = 5;
  const flashDealPriceSYP = Math.ceil((flashDealPriceUSD * exchangeRate) / 100) * 100;

  const handleCategoryClick = (id: Category) => {
    trackEvent('category_select', { category_id: id });
    onCategorySelect(id);
  };

  const handleFlashDealClick = () => {
    trackEvent('flash_deal_click', { 
      item_name: 'طقم فحص الكهرباء', 
      price_syp: flashDealPriceSYP 
    });
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000">
      {/* Premium Hero Section */}
      <section className="relative h-[480px] flex items-center justify-center text-center overflow-hidden rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1530124560612-3df9a390dfa1?q=80&w=2070')] bg-cover bg-center scale-110 blur-[2px] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/80 to-neutral-950"></div>
        
        <div className="relative z-10 space-y-6 px-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-gold-luxury/10 border border-gold-luxury/20 px-5 py-2 rounded-full backdrop-blur-xl">
            <Star size={16} className="text-gold-luxury fill-gold-luxury" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gold-secondary">الجودة الحلبية منذ ١٩٨٥</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
            إتقان <span className="text-gold-luxury">حرفي</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-white/60 leading-relaxed italic">
            "من خردوات المامو.. الأدوات التي لا تخذلك أبداً."
          </p>
          <div className="flex items-center justify-center gap-10 pt-8">
             <div className="flex flex-col">
                <span className="text-3xl font-black text-white">٤٠+</span>
                <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">عاماً من الخبرة</span>
             </div>
             <div className="w-px h-12 bg-white/10"></div>
             <div className="flex flex-col">
                <span className="text-3xl font-black text-gold-luxury">١٥٠٠٠+</span>
                <span className="text-[10px] uppercase opacity-40 font-bold tracking-widest">منتج أصلي</span>
             </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div className="flex items-center justify-between mb-10 px-4">
           <div>
             <h2 className="text-3xl font-black text-white">الأقسام الرئيسية</h2>
             <p className="text-sm text-white/30 font-medium">اختر المجال الذي تريد البدء به</p>
           </div>
           <button className="ripple px-6 py-2.5 bg-white/5 hover:bg-gold-luxury hover:text-black rounded-2xl text-xs font-black transition-all border border-white/10">عرض الكل</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="ripple group relative overflow-hidden rounded-[40px] glass-card p-10 text-right flex items-center justify-between transition-all hover:scale-[1.03] active:scale-95 shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className={`w-20 h-20 rounded-[28px] bg-gradient-to-br ${cat.color} flex items-center justify-center mb-8 shadow-2xl group-hover:rotate-12 transition-transform text-white`}>
                  {cat.icon}
                </div>
                <h3 className="text-4xl font-black mb-2 text-white">{cat.title}</h3>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gold-luxury">
                  <Box size={14} />
                  {cat.count} متوفر حالياً
                </div>
              </div>
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-gold-luxury group-hover:text-black transition-all shadow-xl">
                <ChevronLeft size={32} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Interactive Feature: Order of the Day */}
      <section className="bg-gold-luxury p-1 rounded-[50px] shadow-[0_30px_60px_rgba(184,134,11,0.2)]">
        <div className="bg-neutral-950 rounded-[48px] p-12 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-luxury/10 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse"></div>
          <div className="relative z-10 space-y-6 flex-1">
             <span className="bg-red-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest animate-bounce inline-block">Flash Deal</span>
             <h2 className="text-5xl font-black text-white leading-tight">عرض اليوم: <br/><span className="text-gold-luxury">طقم فحص الكهرباء الاحترافي</span></h2>
             <p className="text-white/40 max-w-md font-medium">لا تتهاون في سلامة منزلك. طقم متكامل مع ضمان لمدة عامين وبسعر حصري لأهل حلب.</p>
             <button 
                onClick={handleFlashDealClick}
                className="ripple bg-gold-luxury text-black px-10 py-5 rounded-2xl font-black shadow-2xl hover:scale-110 transition-transform"
             >
                اطلب الآن - {flashDealPriceSYP.toLocaleString()} ل.س
             </button>
          </div>
          <div className="w-full md:w-1/3 aspect-square glass-card rounded-[40px] flex items-center justify-center text-8xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-tr from-gold-luxury/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             ⚡️
          </div>
        </div>
      </section>

      {/* Trust & Legacy */}
      <section className="py-20 border-t border-white/5 flex flex-wrap justify-center gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="flex items-center gap-3"><ShieldCheck size={28}/> <span className="font-black text-sm uppercase tracking-widest">Certified Partner</span></div>
         <div className="flex items-center gap-3"><TrendingUp size={28}/> <span className="font-black text-sm uppercase tracking-widest">Best in Aleppo 2024</span></div>
         <div className="flex items-center gap-3"><Star size={28}/> <span className="font-black text-sm uppercase tracking-widest">Premium Tools Only</span></div>
      </section>
    </div>
  );
};

export default Home;
