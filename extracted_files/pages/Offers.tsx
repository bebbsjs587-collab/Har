
import React from 'react';
import { Flame, Gift, Clock, Star, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../AppContext';

const Offers: React.FC = () => {
  const { products, addToCart } = useAppContext();
  const dealProducts = products.slice(0, 4);

  return (
    <div className="animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-gold-luxury mb-2 flex items-center justify-center gap-3">
          <Flame className="text-red-500 animate-pulse" />
          عروض المامو اليومية
          <Flame className="text-red-500 animate-pulse" />
        </h2>
        <p className="opacity-60">عروض حصرية تنتهي قريباً - لا تفوت الفرصة</p>
      </div>

      {/* Featured Offer */}
      <div className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-br from-amber-600 to-amber-900 p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="flex-1 text-right space-y-4">
          <div className="inline-block bg-black text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            عرض القمة
          </div>
          <h3 className="text-3xl font-black">طقم سباكة ألماني كامل</h3>
          <p className="text-white/80">احصل على خصم ٤٠٪ على طقم السباكة المتكامل لفترة محدودة جداً.</p>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="block text-3xl font-black">١٢</span>
              <span className="text-[10px] opacity-60 uppercase">ساعة</span>
            </div>
            <span className="text-2xl opacity-20">:</span>
            <div className="text-center">
              <span className="block text-3xl font-black">٤٥</span>
              <span className="text-[10px] opacity-60 uppercase">دقيقة</span>
            </div>
            <span className="text-2xl opacity-20">:</span>
            <div className="text-center">
              <span className="block text-3xl font-black">٠٨</span>
              <span className="text-[10px] opacity-60 uppercase">ثانية</span>
            </div>
          </div>
          <button className="bg-black text-amber-500 px-8 py-3 rounded-2xl font-black hover:scale-105 transition-transform">
            اطلب الآن
          </button>
        </div>
        <div className="w-full md:w-1/3 aspect-square bg-white/10 rounded-3xl backdrop-blur-md flex items-center justify-center">
          <span className="text-8xl">🔧</span>
        </div>
      </div>

      {/* Grid of smaller offers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dealProducts.map(product => (
          <div key={product.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group hover:border-red-500 transition-all">
            <div className="relative aspect-square">
              <img src={product.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                OFF 25%
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm mb-1">{product.name}</h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500 font-black">{Math.floor(product.priceSYP * 0.75).toLocaleString()} ل.س</span>
                <span className="text-[10px] opacity-40 line-through">{product.priceSYP.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => addToCart(product)}
                className="w-full py-2 bg-white/10 rounded-xl text-xs font-bold hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={14} />
                أضف للسلة
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-3xl text-center">
        <Gift className="mx-auto text-amber-500 mb-4" size={48} />
        <h3 className="text-xl font-black mb-2">برنامج الولاء الذهبي</h3>
        <p className="text-sm opacity-60 mb-6 max-w-md mx-auto">اجمع النقاط مع كل عملية شراء واستبدلها بخصومات وهدايا فورية من متجرنا في الميسر.</p>
        <button className="text-amber-500 font-bold underline">تعرف على المزيد</button>
      </div>
    </div>
  );
};

export default Offers;
