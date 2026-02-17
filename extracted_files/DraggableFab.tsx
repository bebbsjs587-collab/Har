
import { useState, useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';

interface DraggableFabProps {
  onClick: () => void;
}

const DraggableFab: React.FC<DraggableFabProps> = ({ onClick }) => {
  const [position, setPosition] = useState({ x: 24, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Set initial position to bottom-left area once mounted
    if (typeof window !== 'undefined') {
      setPosition({ x: 24, y: window.innerHeight - 120 });
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      // Prevent scrolling while dragging
      if (e.cancelable) e.preventDefault();

      setHasMoved(true);
      
      // Calculate new position ensuring it stays within screen bounds
      const w = window.innerWidth;
      const h = window.innerHeight;
      const btnSize = 64;

      let newX = clientX - offset.current.x;
      let newY = clientY - offset.current.y;

      // Boundaries
      newX = Math.max(0, Math.min(newX, w - btnSize));
      newY = Math.max(0, Math.min(newY, h - btnSize));

      setPosition({ x: newX, y: newY });
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMove, { passive: false });
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchend', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    offset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };

    setIsDragging(true);
    setHasMoved(false);
  };

  if (!initialized) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 100,
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onClick={(e) => {
        if (!hasMoved) onClick();
      }}
    >
      <button
        className={`w-16 h-16 bg-gold-luxury rounded-full shadow-[0_0_40px_rgba(212,175,55,0.6)] flex items-center justify-center text-black relative transition-transform duration-100 border-2 border-white/20 ${isDragging ? 'scale-110' : 'animate-bounce'}`}
      >
        <Bot size={32} />
        <div className="absolute top-0 right-0">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>
      </button>
    </div>
  );
};

export default DraggableFab;
