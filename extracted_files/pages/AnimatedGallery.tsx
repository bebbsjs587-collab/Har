
import React, { useState } from 'react';
import { Film, Zap, ArrowRight, Play, Pause, Sparkles, AlertCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';

const AnimatedGallery: React.FC = () => {
  const { products } = useAppContext();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Filter only high-value items for the showcase
  const showcaseItems = products.slice(0, 6);

  return (
    <div className="animate-in slide-in-from-bottom duration-700 pb-20">
      
      {/* Header */}
      <div className="text-center mb-10 pt-4">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full mb-4">
           <Film size={16} className="text-purple-400" />
           <span className="text-[10px] font-black uppercase tracking-widest text-purple-300">New Feature</span>
        </div>
        <h2 className="text-4xl font-black text-white mb-2">معرض <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">الحركة الحية</span></h2>
        <p className="text-white/40 text-sm">شاهد أدوات المامو وهي تنبض بالحياة</p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {showcaseItems.map((item, idx) => (
          <div 
            key={item.id}
            className="group relative bg-[#0a0a0a] rounded-[40px] overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all shadow-2xl"
            onMouseEnter={() => setActiveId(item.id)}
            onMouseLeave={() => setActiveId(null)}
          >
             {/* Animation Stage */}
             <div className="relative h-80 w-full bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center overflow-hidden">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                
                {/* Product Image with CSS Animation Logic */}
                <img 
                   src={item.image} 
                   alt={item.name}
                   className={`w-3/4 h-3/4 object-contain transition-all duration-500 relative z-10 drop-shadow-2xl 
                   ${activeId === item.id ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}
                   ${activeId === item.id && idx % 2 === 0 ? 'animate-[wiggle_1s_ease-in-out_infinite]' : ''}
                   ${activeId === item.id && idx % 2 !== 0 ? 'animate-pulse' : ''}
                   `} 
                />

                {/* Simulated Particles/Sparks for Active State */}
                {activeId === item.id && (
                   <>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500/10 blur-3xl animate-pulse"></div>
                      <Sparkles className="absolute top-10 right-10 text-yellow-400 animate-spin" size={24} />
                      <Zap className="absolute bottom-10 left-10 text-blue-400 animate-bounce" size={24} />
                   </>
                )}

                {/* Overlay Controls */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                   <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                      {activeId === item.id ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
                   </div>
                </div>

                {/* Live Badge */}
                <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 z-20">
                   <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Preview</span>
                </div>
             </div>

             {/* Item Info */}
             <div className="p-6 relative bg-white/5 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                <p className="text-xs text-white/40 mb-4">{item.category}</p>
                <div className="flex items-center justify-between">
                   <span className="text-2xl font-black text-purple-400">{item.priceSYP.toLocaleString()} <span className="text-xs text-white/40">ل.س</span></span>
                   <button className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs transition-colors shadow-lg">
                      تفاصيل
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 flex items-start gap-4">
         <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 shrink-0">
            <AlertCircle size={24} />
         </div>
         <div>
            <h4 className="font-bold text-white mb-1">تقنية العرض الديناميكي</h4>
            <p className="text-xs text-white/50 leading-relaxed">
               تستخدم هذه الصفحة محرك CSS3 متطور لمحاكاة حركة المعدات. قريباً سيتم إضافة دعم لمقاطع الفيديو الحقيقية (GIF/WebM) لكل منتج مباشرة من لوحة التحكم.
            </p>
         </div>
      </div>

    </div>
  );
};

export default AnimatedGallery;
