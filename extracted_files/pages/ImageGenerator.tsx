
import React, { useState, useMemo } from 'react';
import { Sparkles, Image as ImageIcon, Download, Share2, Loader2, Wand2, Maximize, Layout, Info, Grid, Box, Search, ShoppingCart, CheckCircle2, X } from 'lucide-react';
import { generateAIImage } from '../services/gemini';
import { trackEvent } from '../services/analytics';
import { useAppContext } from '../AppContext';
import { Product, Category } from '../types';

// --- REAL SHOWROOM DATA (Curated High-Quality Images) ---
const REAL_PRODUCTS_DATA = [
  {
    id: 'real_1',
    name: 'شنيور بوش احترافي GSB 18V',
    category: 'كهرباء',
    price: 1850000,
    image: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1000&auto=format&fit=crop',
    desc: 'محرك جبار بدون فحمات، بطارية ليثيوم تدوم طويلاً، عزم دوران عالي للمهام الشاقة.'
  },
  {
    id: 'real_2',
    name: 'طقم مفكات عزل كامل Wiha',
    category: 'يدوية',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=1000&auto=format&fit=crop',
    desc: 'مقابض مريحة مانعة للانزلاق، رؤوس مغناطيسية، عزل حتى 1000 فولت.'
  },
  {
    id: 'real_3',
    name: 'منشار دائري ماكيتا 7 بوصة',
    category: 'كهرباء',
    price: 2100000,
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1000&auto=format&fit=crop',
    desc: 'قص دقيق للخشب والألمنيوم، قاعدة قابلة للميلان، نظام شفط الغبار.'
  },
  {
    id: 'real_4',
    name: 'خوذة سلامة هندسية مع حماية أذن',
    category: 'سلامة',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
    desc: 'تصميم مريح قابل للتعديل، مقاومة للصدمات العالية، واقيات أذن مدمجة.'
  },
  {
    id: 'real_5',
    name: 'متر ليزري بوش 50 متر',
    category: 'قياس',
    price: 650000,
    image: 'https://images.unsplash.com/photo-1594950346369-236b283f3898?q=80&w=1000&auto=format&fit=crop',
    desc: 'دقة متناهية، شاشة مضيئة، ذاكرة لحفظ القياسات، مقاوم للغبار والماء.'
  },
  {
    id: 'real_6',
    name: 'حقيبة عدة معدنية 5 طبقات',
    category: 'تخزين',
    price: 375000,
    image: 'https://images.unsplash.com/photo-1542838686-37da4a9fd1b3?q=80&w=1000&auto=format&fit=crop',
    desc: 'هيكل فولاذي متين، مساحة تخزين واسعة، سهلة الحمل والتنظيم.'
  },
  {
    id: 'real_7',
    name: 'صاروخ جلخ ديوالت 4.5 إنش',
    category: 'كهرباء',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1508872558182-ffcabb2f88dd?q=80&w=1000&auto=format&fit=crop',
    desc: 'مفتاح أمان، مقبض جانبي لتقليل الاهتزاز، محرك نحاسي 100%.'
  },
  {
    id: 'real_8',
    name: 'ميزان مياه رقمي احترافي',
    category: 'قياس',
    price: 225000,
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1000&auto=format&fit=crop',
    desc: 'شاشة رقمية لقراءة الزوايا، مغناطيس قوي للتثبيت، دقة 0.1 درجة.'
  }
];

const ImageGenerator: React.FC = () => {
  const { addToCart } = useAppContext();
  const [activeTab, setActiveTab] = useState<'gallery' | 'generator'>('gallery');
  
  // Generator State
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");

  // Gallery State
  const [filterCat, setFilterCat] = useState('All');
  const [gallerySearch, setGallerySearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<typeof REAL_PRODUCTS_DATA[0] | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    trackEvent('image_generate_click', {
      prompt_length: prompt.length,
      aspect_ratio: aspectRatio
    });

    setLoading(true);
    setGeneratedImage(null);
    const result = await generateAIImage(prompt, aspectRatio);
    
    if (result) {
      trackEvent('image_generate_success', { aspect_ratio: aspectRatio });
    } else {
      trackEvent('image_generate_fail', {});
    }

    setGeneratedImage(result);
    setLoading(false);
  };

  const handleAddToCart = (item: any) => {
    // Convert generic item to Product type expected by context
    const product: Product = {
      id: item.id,
      name: item.name,
      category: Category.ELECTRICITY, // Default mapping
      priceSYP: item.price,
      priceUSD: item.price / 15000,
      image: item.image,
      description: item.desc,
      brand: 'Al-Mamo Select',
      rating: 5,
      stock: 10
    };
    addToCart(product);
    alert('تمت إضافة المنتج للسلة بنجاح!');
    if (selectedProduct) setSelectedProduct(null);
  };

  const suggestions = [
    "مطبخ حلبي عصري مع إضاءة دافئة",
    "تصميم ورشة نجارة منظمة بأدوات بوش",
    "غرفة معيشة فاخرة بألوان المامو الرمادية",
    "خزانة ملابس مدمجة بتصميم ذكي"
  ];

  const filteredGallery = useMemo(() => {
    return REAL_PRODUCTS_DATA.filter(item => {
      const matchesCat = filterCat === 'All' || item.category === filterCat;
      const matchesSearch = item.name.toLowerCase().includes(gallerySearch.toLowerCase()) || 
                            item.desc.toLowerCase().includes(gallerySearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [filterCat, gallerySearch]);

  const categories = ['All', ...Array.from(new Set(REAL_PRODUCTS_DATA.map(p => p.category)))];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-700 pb-20">
      
      {/* Page Header */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-3 bg-gold-luxury/10 border border-gold-luxury/20 px-6 py-2 rounded-full backdrop-blur-xl">
           <Sparkles size={18} className="text-gold-luxury" />
           <span className="text-xs font-black uppercase tracking-widest text-gold-luxury">استوديو المامو</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white">معرض <span className="text-gold-luxury text-glow">الواقع</span></h2>
      </div>

      {/* Tabs Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex gap-2">
           <button 
             onClick={() => setActiveTab('gallery')}
             className={`px-6 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'gallery' ? 'bg-gold-luxury text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
           >
             <Grid size={16} />
             كتالوج المنتجات الحقيقية
           </button>
           <button 
             onClick={() => setActiveTab('generator')}
             className={`px-6 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'generator' ? 'bg-gold-luxury text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
           >
             <Wand2 size={16} />
             مصمم الديكور AI
           </button>
        </div>
      </div>

      {/* --- CONTENT: GENERATOR (AI) --- */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-right duration-500">
          {/* Controls */}
          <div className="space-y-8 glass-card p-10 rounded-[40px] border-white/5">
            <div className="flex items-center gap-2 mb-4">
               <Wand2 className="text-gold-luxury" size={24} />
               <h3 className="text-xl font-bold text-white">تخيل مساحتك</h3>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs font-black text-white/60 uppercase tracking-widest mr-2">وصف التصميم</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثلاً: تصميم مطبخ واسع برخام أسود وإضاءة مخفية..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-[30px] p-6 text-sm outline-none focus:border-gold-luxury/50 transition-all resize-none placeholder:text-white/10"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-white/60 uppercase tracking-widest mr-2">نسبة العرض للارتفاع</label>
              <div className="flex gap-4">
                {[
                  { label: 'مربع (1:1)', val: '1:1', icon: <Layout size={16}/> },
                  { label: 'سينمائي (16:9)', val: '16:9', icon: <Maximize size={16}/> },
                  { label: 'طولي (9:16)', val: '9:16', icon: <Layout size={16} className="rotate-90"/> }
                ].map((ratio) => (
                  <button
                    key={ratio.val}
                    onClick={() => setAspectRatio(ratio.val as any)}
                    className={`flex-1 py-4 rounded-2xl border transition-all flex flex-col items-center gap-2 text-[10px] font-black ${
                      aspectRatio === ratio.val 
                      ? 'bg-gold-luxury text-black border-gold-luxury' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                    }`}
                  >
                    {ratio.icon}
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-white/60 uppercase tracking-widest mr-2">اقتراحات سريعة</label>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setPrompt(s)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] text-white/50 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-6 bg-gold-luxury text-black rounded-[28px] font-black shadow-[0_20px_50px_rgba(184,134,11,0.3)] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Wand2 size={24} />}
              توليد التصميم الآن
            </button>
          </div>

          {/* Preview */}
          <div className="relative aspect-square lg:aspect-auto min-h-[500px] glass-card rounded-[40px] border-white/5 overflow-hidden flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-6">
                 <div className="relative">
                   <Loader2 className="animate-spin text-gold-luxury" size={60} />
                   <div className="absolute inset-0 blur-2xl bg-gold-luxury/20 animate-pulse"></div>
                 </div>
                 <div className="space-y-2 text-center">
                   <p className="text-gold-luxury font-black text-xs uppercase tracking-[0.3em]">AI is Drawing...</p>
                   <p className="text-white/20 text-[10px]">نجهز لك تحفة فنية يا غالي</p>
                 </div>
              </div>
            ) : generatedImage ? (
              <div className="absolute inset-0 group animate-in fade-in duration-1000">
                <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10">
                   <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          trackEvent('image_download', {});
                          const link = document.createElement('a');
                          link.href = generatedImage;
                          link.download = 'Al-Mamo-Design.png';
                          link.click();
                        }}
                        className="flex-1 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-xs hover:bg-gold-luxury hover:text-black transition-all"
                      >
                        <Download size={18} /> حفظ الصورة
                      </button>
                      <button className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-gold-luxury hover:text-black transition-all">
                        <Share2 size={18} />
                      </button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 opacity-20 group">
                <div className="w-24 h-24 bg-white/5 rounded-[35px] flex items-center justify-center mx-auto border border-white/10 group-hover:scale-110 transition-transform">
                  <ImageIcon size={40} />
                </div>
                <p className="text-sm font-bold">بانتظار خيالك يا غالي...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CONTENT: REAL GALLERY --- */}
      {activeTab === 'gallery' && (
        <div className="animate-in slide-in-from-left duration-500">
          
          {/* Gallery Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/5 p-4 rounded-3xl border border-white/10">
             <div className="relative w-full md:w-auto flex-1 max-w-md">
                <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  placeholder="ابحث عن منتج..."
                  value={gallerySearch}
                  onChange={(e) => setGallerySearch(e.target.value)}
                  className="w-full bg-black/30 border border-white/5 rounded-2xl pr-12 pl-4 py-3 text-sm text-white outline-none focus:border-gold-luxury/50 transition-all"
                />
             </div>
             <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {categories.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setFilterCat(cat)}
                     className={`px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap border transition-all ${
                       filterCat === cat 
                       ? 'bg-white text-black border-white' 
                       : 'bg-white/5 text-white/50 border-white/5 hover:border-white/20'
                     }`}
                   >
                     {cat === 'All' ? 'الكل' : cat}
                   </button>
                ))}
             </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {filteredGallery.map((item, index) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedProduct(item)}
                  className="group relative bg-white/5 rounded-[32px] overflow-hidden border border-white/5 hover:border-gold-luxury/50 transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 animate-in zoom-in duration-500 flex flex-col"
                  style={{ animationDelay: `${index % 10 * 50}ms` }}
                >
                   {/* Image Area */}
                   <div className="relative aspect-square overflow-hidden bg-white/5">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                          <span className="text-[10px] font-black text-green-400 uppercase tracking-widest flex items-center gap-1">
                             <CheckCircle2 size={10} /> Real Stock
                          </span>
                      </div>
                   </div>

                   {/* Content Area */}
                   <div className="p-5 flex-1 flex flex-col">
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">{item.category}</p>
                      <h4 className="text-white font-bold text-sm line-clamp-2 mb-4 leading-relaxed">{item.name}</h4>
                      
                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                         <div className="flex flex-col">
                            <span className="text-gold-luxury font-black text-lg">{item.price.toLocaleString()}</span>
                            <span className="text-[9px] text-white/30">ليرة سورية</span>
                         </div>
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             handleAddToCart(item);
                           }}
                           className="w-10 h-10 rounded-full bg-gold-luxury text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                         >
                            <ShoppingCart size={18} />
                         </button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
          
          {filteredGallery.length === 0 && (
             <div className="text-center py-20 text-white/30">
                <Box size={48} className="mx-auto mb-4 opacity-50" />
                <p>لا توجد منتجات مطابقة للبحث</p>
             </div>
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
           <div className="bg-[#111] border border-white/10 w-full max-w-3xl rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-red-500 rounded-full text-white transition-all backdrop-blur-md"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-black relative">
                 <img 
                   src={selectedProduct.image} 
                   className="w-full h-full object-cover" 
                   alt={selectedProduct.name} 
                 />
              </div>

              <div className="w-full md:w-1/2 p-8 flex flex-col">
                 <div className="mb-auto">
                    <p className="text-gold-luxury text-xs font-black uppercase tracking-[0.2em] mb-2">{selectedProduct.category}</p>
                    <h2 className="text-2xl font-black text-white mb-4 leading-snug">{selectedProduct.name}</h2>
                    <p className="text-white/60 text-sm leading-relaxed mb-6">
                      {selectedProduct.desc}
                    </p>
                    
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-6">
                       <span className="block text-[10px] text-white/40 font-bold uppercase mb-1">السعر النهائي</span>
                       <span className="text-2xl font-black text-gold-luxury">{selectedProduct.price.toLocaleString()} ل.س</span>
                    </div>
                 </div>
                 
                 <div className="flex gap-3">
                    <button 
                       onClick={() => handleAddToCart(selectedProduct)}
                       className="flex-1 py-4 bg-gold-luxury text-black rounded-2xl font-black text-xs hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl"
                    >
                       <ShoppingCart size={16} />
                       إضافة للسلة
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-6 mt-8">
          <div className="w-12 h-12 bg-gold-luxury/10 rounded-2xl flex items-center justify-center shrink-0">
            <Info className="text-gold-luxury" size={20} />
          </div>
          <div>
            <h4 className="font-black text-white text-xs mb-1">معرض المامو المعتمد</h4>
            <p className="text-[10px] text-white/40 leading-relaxed">
              كافة الصور في المعرض حقيقية ومطابقة للمنتجات الموجودة في مستودعاتنا بحلب. الأسعار شاملة الضمان.
            </p>
          </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
