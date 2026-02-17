
import React, { useState } from 'react';
import { ArrowRight, Wrench, ShieldCheck, Smartphone, User, Loader2 } from 'lucide-react';
import { useAppContext } from '../AppContext';

const LoginPage: React.FC = () => {
  const { login } = useAppContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2 || phone.trim().length < 8) return;

    setIsLoading(true);
    // Simulate API delay for better UX
    setTimeout(() => {
      login(name, phone);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans" dir="rtl">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
      <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-gold-luxury/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom duration-700">
        <div className="text-center mb-10">
          <div className="w-28 h-28 bg-gradient-to-br from-gold-luxury to-amber-600 rounded-[35px] flex items-center justify-center mx-auto mb-6 shadow-[0_0_60px_rgba(212,175,55,0.3)] rotate-3">
            <Wrench size={56} className="text-black drop-shadow-md" />
          </div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">المامو</h1>
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
             <p className="text-gold-luxury font-black uppercase tracking-[0.3em] text-[10px]">خردوات ذكية • حلب</p>
          </div>
        </div>

        <div className="bg-[#0a0a0a]/80 border border-white/10 rounded-[40px] p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-luxury to-transparent opacity-50"></div>
           
           <h2 className="text-xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             تسجيل دخول الزبائن
           </h2>
           
           <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
               <label className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-2">الاسم الكريم</label>
               <div className="relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-luxury transition-colors">
                   <User size={20} />
                 </div>
                 <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-gold-luxury text-white placeholder:text-white/20 transition-all font-bold text-right"
                   placeholder="مثلاً: محمد الحلبي"
                   required
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-[10px] text-white/40 font-black uppercase tracking-widest mr-2">رقم الموبايل</label>
               <div className="relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold-luxury transition-colors">
                   <Smartphone size={20} />
                 </div>
                 <input 
                   type="tel" 
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-gold-luxury text-white placeholder:text-white/20 transition-all font-bold font-mono dir-ltr text-right"
                   placeholder="09xx xxx xxx"
                   required
                 />
               </div>
             </div>

             <div className="pt-4">
               <button 
                 type="submit"
                 disabled={isLoading}
                 className="w-full py-5 bg-gold-luxury text-black rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(184,134,11,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                 ) : (
                    <>
                      ابدأ التسوق
                      <ArrowRight size={20} className="rotate-180" />
                    </>
                 )}
               </button>
             </div>
           </form>

           <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-white/30 bg-white/5 py-3 rounded-xl border border-white/5">
              <ShieldCheck size={12} className="text-green-500" />
              <span>بياناتك محفوظة محلياً بأمان تام</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
