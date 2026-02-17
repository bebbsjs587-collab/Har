
import React, { useState } from 'react';
import { X, Home, Bot, Ruler, Palette, Flame, Trophy, ShieldCheck, MapPin, Phone, Instagram, ChevronLeft, Wrench, Sparkles, Lock, Unlock, KeyRound, ArrowRight, BarChart3, LogOut, Film } from 'lucide-react';
import { useAppContext } from '../AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate }) => {
  const { isAdmin, setIsAdmin, currentUser, logout } = useAppContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState(false);

  const MenuItem = ({ icon, label, onClick, gold = false, highlight = false }: any) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-[20px] transition-all duration-300 active:scale-[0.97] group ${
        gold 
        ? 'bg-gold-luxury text-black font-black mb-4 shadow-[0_15px_30px_rgba(184,134,11,0.3)] hover:brightness-110' 
        : highlight 
          ? 'bg-purple-600/10 text-purple-400 border border-purple-500/30 mb-2 hover:bg-purple-600/20'
          : 'hover:bg-white/5 text-white/70 border border-transparent hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={`${gold ? 'text-black' : highlight ? 'text-purple-400' : 'text-amber-500 group-hover:scale-110 transition-transform'}`}>{icon}</span>
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {!gold && <ChevronLeft size={16} className={`opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all ${highlight ? 'text-purple-400' : 'text-gold-luxury'}`} />}
    </button>
  );

  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdmin(false);
      onNavigate('home');
      onClose();
    } else {
      setShowAuthModal(true);
      setPinCode('');
      setError(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const verifyPin = () => {
    if (pinCode === '24402') {
      setIsAdmin(true);
      setShowAuthModal(false);
      onNavigate('admin');
      onClose(); 
    } else {
      setError(true);
      setPinCode('');
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-500" 
          onClick={onClose} 
        />
      )}
      
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
           <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
              <button 
                onClick={() => setShowAuthModal(false)} 
                className="absolute top-4 left-4 p-2 bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center mb-8">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 text-gold-luxury">
                    <Lock size={32} />
                 </div>
                 <h3 className="text-xl font-black text-white">الوصول المحمي</h3>
                 <p className="text-xs text-white/40 mt-1 font-bold">يرجى إدخال رمز الحماية الخاص بالإدارة</p>
              </div>

              <div className="space-y-4">
                 <div className={`flex items-center bg-white/5 border rounded-2xl px-4 py-3 transition-colors ${error ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus-within:border-gold-luxury'}`}>
                    <KeyRound size={20} className={error ? "text-red-500" : "text-white/20"} />
                    <input 
                      autoFocus
                      type="tel" 
                      maxLength={5}
                      placeholder="*****"
                      className="bg-transparent border-none outline-none w-full text-center text-xl font-black tracking-[0.5em] text-white placeholder:text-white/10"
                      value={pinCode}
                      onChange={(e) => {
                        if (e.target.value.length <= 5 && /^\d*$/.test(e.target.value)) {
                           setPinCode(e.target.value);
                           setError(false);
                        }
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && verifyPin()}
                    />
                 </div>
                 
                 {error && (
                   <p className="text-red-500 text-[10px] font-black text-center animate-pulse">
                     ⚠️ رمز المرور غير صحيح
                   </p>
                 )}

                 <button 
                   onClick={verifyPin}
                   className="w-full py-4 bg-gold-luxury text-black rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                   دخول
                   <ArrowRight size={16} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 right-0 w-[88%] max-w-sm bg-[#080808] border-l border-white/5 z-[70] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]`}>
        
        {/* Top Handle */}
        <div className="h-1.5 w-12 bg-white/10 rounded-full mx-auto mt-4 mb-2 shrink-0" />

        {/* Brand Header */}
        <div className="p-8 pb-6 flex justify-between items-start border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold-luxury rounded-2xl flex items-center justify-center text-black shadow-xl">
              <Wrench size={24} />
            </div>
            <div className="flex flex-col">
              <h2 className="font-black text-white text-xl tracking-tighter leading-none">المامو الذكي</h2>
              <span className="text-[10px] text-gold-luxury font-bold uppercase tracking-[0.2em] mt-1">
                {currentUser ? `Welcome, ${currentUser.name.split(' ')[0]}` : 'Aleppo Edition'}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-white/5 rounded-2xl text-white/30 hover:text-white transition-all border border-white/5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10 overscroll-contain scroll-smooth">
          
          <nav className="space-y-2">
            <MenuItem icon={<Home size={20}/>} label="الرئيسية" onClick={() => onNavigate('home')} />
            <MenuItem icon={<BarChart3 size={20}/>} label="تقارير استخدامي" onClick={() => onNavigate('reports')} />
            
            <div className="pt-6">
              <div className="flex items-center gap-3 px-6 mb-4">
                <div className="h-px flex-1 bg-white/5"></div>
                <p className="text-[10px] text-gold-luxury opacity-40 uppercase font-black tracking-widest whitespace-nowrap">الذكاء الاصطناعي</p>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className="space-y-2">
                <MenuItem icon={<Bot size={20}/>} label="مساعد المامو الفني" onClick={() => onNavigate('ai')} gold />
                <MenuItem icon={<Sparkles size={20}/>} label="استوديو التصميم AI" onClick={() => onNavigate('studio')} />
                <MenuItem icon={<Ruler size={20}/>} label="رادار المامو (متر AI)" onClick={() => onNavigate('meter')} />
                <MenuItem icon={<Palette size={20}/>} label="مستشار الدهان AR" onClick={() => onNavigate('paint')} />
              </div>
            </div>

            <div className="pt-6">
              <div className="flex items-center gap-3 px-6 mb-4">
                <div className="h-px flex-1 bg-white/5"></div>
                <p className="text-[10px] text-gold-luxury opacity-40 uppercase font-black tracking-widest whitespace-nowrap">المتجر</p>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className="space-y-2">
                <MenuItem icon={<Film size={20}/>} label="صور متحركة (جديد)" onClick={() => onNavigate('animated')} highlight />
                <MenuItem icon={<Flame size={20}/>} label="عروض اليوم" onClick={() => onNavigate('offers')} />
                <MenuItem icon={<Trophy size={20}/>} label="المسابقات والجوائز" onClick={() => onNavigate('competitions')} />
              </div>
            </div>

            <div className="pt-6 pb-8">
              <div className="flex items-center gap-3 px-6 mb-4">
                <div className="h-px flex-1 bg-white/5"></div>
                <p className="text-[10px] text-gold-luxury opacity-40 uppercase font-black tracking-widest whitespace-nowrap">النظام</p>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <MenuItem 
                icon={isAdmin ? <Unlock size={20} className="text-green-500" /> : <ShieldCheck size={20}/>} 
                label={isAdmin ? "خروج من لوحة الإدارة" : "دخول الإدارة"} 
                onClick={handleAdminClick} 
              />
              <MenuItem 
                icon={<LogOut size={20} className="text-red-500" />} 
                label="تسجيل خروج" 
                onClick={handleLogout} 
              />
            </div>
          </nav>
        </div>

        {/* Bottom Status Bar */}
        <div className="p-6 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
            © 2026 Al-Mamo Tools
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] text-white/40 font-bold">SERVER ACTIVE</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
