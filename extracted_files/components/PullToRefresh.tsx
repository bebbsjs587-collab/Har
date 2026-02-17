
import { useState, useRef, useEffect } from 'react';
import { RefreshCw, ArrowDown, CheckCircle2 } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const THRESHOLD = 80;
  const MAX_PULL = 150;

  useEffect(() => {
    if (completed) {
      const timer = setTimeout(() => {
        setCompleted(false);
        setPullDistance(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [completed]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !refreshing && !completed) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY > 0 && window.scrollY === 0 && !refreshing && !completed) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      
      if (diff > 0) {
        // Add resistance
        const resistance = diff * 0.4;
        const newDistance = Math.min(resistance, MAX_PULL);
        setPullDistance(newDistance);
        
        // Prevent default only if we are pulling down to avoid native scroll conflict
        if (e.cancelable && diff < MAX_PULL) {
           // e.preventDefault(); // Commented out to allow natural scroll if needed, but in strict PWA usually needed.
        }
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDistance(THRESHOLD); // Snap to threshold
      
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(50);

      await onRefresh();
      
      setRefreshing(false);
      setCompleted(true);
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    } else {
      setPullDistance(0);
      setStartY(0);
    }
  };

  return (
    <div 
      ref={contentRef}
      className="min-h-screen relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading Indicator Container */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
        style={{ 
          height: `${Math.max(pullDistance, 0)}px`,
          opacity: Math.min(pullDistance / 40, 1),
          transition: refreshing || completed || pullDistance === 0 ? 'height 0.3s ease-out, opacity 0.3s' : 'none'
        }}
      >
        <div className="flex flex-col items-center gap-2 pb-4">
          {completed ? (
            <div className="flex items-center gap-2 text-green-500 animate-in zoom-in duration-300">
               <CheckCircle2 size={24} />
               <span className="text-xs font-black uppercase">تم التحديث</span>
            </div>
          ) : refreshing ? (
            <div className="relative">
               <RefreshCw size={28} className="text-gold-luxury animate-spin" />
               <div className="absolute inset-0 bg-gold-luxury/20 blur-xl animate-pulse"></div>
            </div>
          ) : (
             <>
               <div 
                 className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${pullDistance > THRESHOLD ? 'bg-gold-luxury text-black rotate-180' : 'bg-white/5 text-gold-luxury'}`}
                 style={{ transform: `rotate(${pullDistance * 2}deg)` }}
               >
                 <ArrowDown size={20} />
               </div>
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                 {pullDistance > THRESHOLD ? 'حرر للتحديث' : 'اسحب للأسفل'}
               </span>
             </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="relative z-10 transition-transform duration-200 ease-out"
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          transition: refreshing || completed || pullDistance === 0 ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
