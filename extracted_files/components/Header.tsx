
import { useEffect, useState } from 'react';
import { Menu, Bell, ShoppingCart, User, Search, Mic, Wifi, WifiOff } from 'lucide-react';
import { useAppContext } from '../AppContext';

interface HeaderProps {
  onMenuClick: () => void;
  onHomeClick: () => void;
  onCartClick: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onHomeClick, onCartClick, onProfileClick }) => {
  const { cart } = useAppContext();
  const [isOnline, setIsOnline] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Check backend health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/80 border-b border-white/5 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={onMenuClick} className="p-2 hover:bg-white/5 rounded-2xl transition-all">
          <Menu size={24} className="text-gold-luxury" />
        </button>

        <div onClick={onHomeClick} className="flex flex-col items-center cursor-pointer group">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gold-luxury group-hover:scale-105 transition-transform">
              خردوات المامو
            </h1>
            {isOnline ? (
              <Wifi size={12} className="text-green-500 animate-pulse" />
            ) : (
              <WifiOff size={12} className="text-red-500" />
            )}
          </div>
          <span className="text-[9px] opacity-40 uppercase tracking-[0.2em] font-bold">حلب • الميسر</span>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 relative hover:bg-white/5 rounded-2xl">
            <Bell size={20} className="text-white/60" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
          <button onClick={onCartClick} className="p-2 relative hover:bg-white/5 rounded-2xl transition-all">
            <ShoppingCart size={20} className="text-white/60" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={onProfileClick} className="p-2 hover:bg-white/5 rounded-2xl transition-all hover:text-gold-luxury">
            <User size={20} className="text-white/60" />
          </button>
        </div>
      </div>
      
      <div className="px-4 pb-4 max-w-xl mx-auto">
        <div className="relative flex items-center bg-white/5 rounded-2xl border border-white/10 px-4 py-2.5 focus-within:border-amber-500/50 transition-all">
          <Search size={18} className="text-white/30" />
          <input 
            type="text" 
            placeholder="ابحث عن أدواتك..." 
            className="bg-transparent border-none outline-none flex-1 px-3 text-sm placeholder:text-white/20"
          />
          <button className="p-1 text-white/30 hover:text-amber-500 transition-colors">
            <Mic size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
