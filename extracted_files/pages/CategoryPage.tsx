
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowRight, Search, ShoppingCart, SlidersHorizontal, Star, Sparkles, Eye, X, Check, ShieldCheck, Box } from 'lucide-react';
import { Category, Product } from '../types';
import { useAppContext } from '../AppContext';
import { trackEvent } from '../services/analytics';

interface CategoryPageProps {
  category: Category;
  onBack: () => void;
}

const QuickViewModal: React.FC<{ product: Product; isOpen: boolean; onClose: () => void; addToCart: (p: Product) => void; exchangeRate: number }> = ({ product, isOpen, onClose, addToCart, exchangeRate }) => {
  if (!isOpen) return null;

  // Track product view when modal opens
  useEffect(() => {
    trackEvent('product_view', {
      product_id: product.id,
      name: product.name,
      category: product.category,
      price_syp: product.priceSYP,
      brand: product.brand,
      currency: 'SYP'
    });
  }, [product.id]);

  const handleAddToCart = () => {
    addToCart(product);
    trackEvent('add_to_cart', {
      product_id: product.id,
      name: product.name,
      price: product.priceSYP,
      category: product.category,
      location: 'quick_view_modal'
    });
    onClose();
  };

  // Helper to get high resolution image for the modal display
  const getHighResImage = (url: string) => {
    // If it's an Unsplash URL (used in mock data), upgrade the resolution
    if (url.includes('images.unsplash.com')) {
      return url.replace(/w=\d+/, 'w=1200');
    }
    // Return original for uploaded images (base64) or other sources
    return url;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container: Added max-h-[90vh] and overflow-y-auto to enable scrolling */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col md:flex-row animate-in zoom-in duration-500">
        
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-3 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all border border-white/10 sticky top-6 float-right">
          <X size={20} />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 bg-neutral-900 flex items-center justify-center relative group overflow-hidden min-h-[350px] md:min-h-full">
          <img src={getHighResImage(product.image)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-6 left-6 flex items-center gap-2 pointer-events-none">
             <div className="bg-gold-luxury px-3 py-1 rounded-full text-[10px] font-black text-black uppercase tracking-widest">
               Al-Mamo Original
             </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#0a0a0a]">
          <div className="flex items-center gap-2 text-gold-luxury text-[10px] font-black uppercase tracking-[0.3em] mb-4">
             <Sparkles size={14} />
             تصميم احترافي
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">{product.name}</h2>
          <div className="flex items-center gap-4 mb-6">
             <span className="text-white/40 font-bold uppercase tracking-wider text-xs">{product.brand}</span>
             <div className="h-4 w-px bg-white/10"></div>
             <div className="flex items-center gap-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-white/80">{product.rating}</span>
             </div>
          </div>

          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            {product.description || "هذا المنتج مختار بعناية من قبل خبراء خردوات المامو لضمان أفضل جودة وموثوقية في حلب. مصمم للأعمال الشاقة والمحترفين."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <span className="block text-[10px] text-white/40 font-bold uppercase mb-1">المخزون</span>
                <span className="text-lg font-black text-white flex items-center gap-2">
                  <Box size={16} className="text-gold-luxury" />
                  {product.stock} قطع
                </span>
             </div>
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <span className="block text-[10px] text-white/40 font-bold uppercase mb-1">الضمان</span>
                <span className="text-lg font-black text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-gold-luxury" />
                  سنتين
                </span>
             </div>
          </div>

          <div className="flex flex-col mb-8">
            <span className="text-4xl font-black text-gold-luxury mb-1">
              {product.priceSYP.toLocaleString()} ل.س
            </span>
            <span className="text-sm text-white/20 font-bold uppercase tracking-widest">
              Price Est: {(product.priceSYP / exchangeRate).toFixed(2)} USD
            </span>
          </div>

          <button 
            onClick={handleAddToCart}
            className="ripple w-full py-5 bg-gold-luxury text-black rounded-2xl font-black text-base shadow-[0_20px_40px_rgba(184,134,11,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <ShoppingCart size={20} />
            أضف لسلة المشتريات
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; index: number; addToCart: (p: Product) => void; onQuickView: (p: Product) => void; exchangeRate: number }> = ({ product, index, addToCart, onQuickView, exchangeRate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleQuickViewClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    trackEvent('quick_view_clicked', {
      product_id: product.id,
      name: product.name,
      location: 'product_card'
    });
    onQuickView(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    trackEvent('add_to_cart', {
      product_id: product.id,
      name: product.name,
      price: product.priceSYP,
      category: product.category,
      location: 'product_card'
    });
  };

  return (
    <div 
      ref={cardRef}
      style={{ 
        transitionDelay: `${(index % 4) * 120}ms`,
        perspective: '1200px'
      }}
      className={`bg-white/5 border border-white/10 rounded-3xl overflow-hidden group hover:border-amber-500 transition-all flex flex-col shadow-lg duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100 rotate-0' 
          : 'opacity-0 translate-y-24 scale-90 -rotate-3 blur-[2px]'
      }`}
    >
      <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={handleQuickViewClick}>
        <img 
          src={product.image} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          alt={product.name} 
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button 
            onClick={handleQuickViewClick}
            className="p-4 bg-white text-black rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 ease-out"
          >
            <Eye size={22} />
          </button>
        </div>

        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold border border-white/10">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          {product.rating}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-bold text-sm mb-1 line-clamp-1 text-white">{product.name}</h4>
        <p className="text-[10px] opacity-40 mb-3 font-bold uppercase tracking-wider">{product.brand}</p>
        
        <div className="mt-auto">
          <div className="flex flex-col gap-0.5 mb-4">
            <span className="text-gold-luxury font-black text-lg">
              {product.priceSYP.toLocaleString()} ل.س
            </span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className="ripple flex-1 py-2.5 bg-white/5 border border-white/10 hover:bg-gold-luxury hover:text-black rounded-xl text-[10px] font-black transition-all active:scale-95"
            >
              أضف للسلة
            </button>
            <button 
              onClick={handleQuickViewClick}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-gold-luxury transition-all md:hidden"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryPage: React.FC<CategoryPageProps> = ({ category, onBack }) => {
  const { products, addToCart, exchangeRate } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('rating');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.category === category && p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceSYP - b.priceSYP;
        if (sortBy === 'price-desc') return b.priceSYP - a.priceSYP;
        return b.rating - a.rating;
      });
  }, [category, products, debouncedSearchTerm, sortBy]);

  return (
    <div className="animate-in slide-in-from-left duration-700 ease-out">
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          isOpen={!!quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
          addToCart={addToCart}
          exchangeRate={exchangeRate}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="ripple p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10">
          <ArrowRight size={20} className="text-gold-luxury" />
        </button>
        <div className="text-center">
            <h2 className="text-2xl font-black text-white">{category}</h2>
            <p className="text-[9px] text-gold-luxury font-black uppercase tracking-[0.3em]">Al-Mamo Premium Collection</p>
        </div>
        <div className="flex gap-2">
          <button className="ripple p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10 text-white/40"><Search size={20} /></button>
          <button className="ripple p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10 text-white/40"><ShoppingCart size={20} /></button>
        </div>
      </div>

      {/* Dynamic Header Banner */}
      <div className="relative h-48 md:h-64 rounded-[40px] overflow-hidden mb-12 group shadow-2xl animate-in fade-in zoom-in duration-1000">
        <div className="absolute inset-0 bg-neutral-900">
            <img 
              src={`https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop`} 
              className="w-full h-full object-cover opacity-40 transition-transform duration-2000 group-hover:scale-110" 
              alt={category} 
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10">
          <div className="inline-flex items-center gap-2 bg-gold-luxury/20 border border-gold-luxury/30 px-3 py-1 rounded-full backdrop-blur-md mb-3 w-fit">
            <Sparkles size={12} className="text-gold-luxury" />
            <span className="text-[9px] text-gold-luxury font-black uppercase tracking-widest">عرض خاص لفترة محدودة</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-2">أدوات احترافية لكل مشروع</h3>
          <p className="text-white/40 text-sm font-medium">نضمن لك الجودة والاعتمادية في كل قطعة من خردوات المامو.</p>
        </div>
      </div>

      {/* Filters HUD */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-12 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-2xl px-5 py-3 flex-1 max-w-sm focus-within:border-gold-luxury/50 transition-all">
          <Search size={18} className="text-white/20" />
          <input 
            type="text" 
            placeholder="ابحث عن قطعة محددة..." 
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/10 font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm !== debouncedSearchTerm && (
            <div className="w-4 h-4 border-2 border-gold-luxury/30 border-t-gold-luxury rounded-full animate-spin"></div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gold-luxury/10 rounded-lg border border-gold-luxury/20">
            <SlidersHorizontal size={14} className="text-gold-luxury" />
            <span className="text-[10px] font-black text-gold-luxury uppercase tracking-widest">تصفية</span>
          </div>
          <select 
            className="bg-black/40 border border-white/5 rounded-2xl px-6 py-3 text-xs font-black outline-none focus:border-gold-luxury/50 transition-all text-white/60 appearance-none cursor-pointer hover:text-white"
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
          >
            <option value="rating">الأفضل تقييماً</option>
            <option value="price-asc">السعر: تصاعدي</option>
            <option value="price-desc">السعر: تنازلي</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {filteredProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index} 
            addToCart={addToCart} 
            onQuickView={setQuickViewProduct}
            exchangeRate={exchangeRate} 
          />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="py-32 text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 opacity-20">
            <Search size={40} />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-black text-white/40">لم نجد طلبك يا غالي</p>
            <p className="text-sm text-white/20">جرب البحث بكلمات مختلفة أو تواصل معنا مباشرة</p>
          </div>
          <button 
            onClick={() => setSearchTerm('')}
            className="px-8 py-3 bg-gold-luxury text-black rounded-xl font-black text-xs hover:scale-105 transition-transform"
          >
            مسح البحث
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
