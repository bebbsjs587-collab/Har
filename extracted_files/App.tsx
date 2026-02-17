
import { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import AIChat from './pages/AIChat';
import SmartMeter from './pages/SmartMeter';
import PaintVisualizer from './pages/PaintVisualizer';
import ImageGenerator from './pages/ImageGenerator';
import AdminPanel from './pages/AdminPanel';
import Offers from './pages/Offers';
import Competitions from './pages/Competitions';
import LoginPage from './pages/LoginPage';
import UserReports from './services/UserReports';
import Profile from './pages/Profile';
import AnimatedGallery from './pages/AnimatedGallery';
import DraggableFab from './components/DraggableFab';
import { Category, ThemeType } from './types';
import PullToRefresh from './components/PullToRefresh';
import { trackEvent } from './services/analytics';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { theme, refreshData, currentUser, isLoading } = useAppContext();
  const [page, setPage] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
        trackEvent('page_view', {
          page_name: page,
          category_filter: selectedCategory || 'none'
        });
    }
  }, [page, selectedCategory, currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6">
         <Loader2 size={48} className="text-gold-luxury animate-spin" />
         <p className="text-white/40 text-xs font-black uppercase tracking-widest">جاري الاتصال بالسيرفر...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  const navigate = (target: string) => {
    setPage(target);
    setMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${theme === ThemeType.GOLD_BLACK ? 'bg-neutral-950 text-amber-50' : 'bg-black text-white'} transition-colors duration-500`} dir="rtl">
      <Header 
        onMenuClick={() => setMenuOpen(true)} 
        onHomeClick={() => setPage('home')} 
        onCartClick={() => setPage('cart')}
        onProfileClick={() => setPage('profile')}
      />
      
      <Sidebar 
        isOpen={isMenuOpen} 
        onClose={() => setMenuOpen(false)} 
        onNavigate={navigate} 
      />
      
      <PullToRefresh onRefresh={refreshData}>
        <main className="max-w-6xl mx-auto p-4 pb-24 min-h-[90vh]">
          {page === 'home' && (
            <Home onCategorySelect={(c) => { 
              setSelectedCategory(c); 
              setPage('category'); 
            }} />
          )}
          {page === 'category' && selectedCategory && (
            <CategoryPage category={selectedCategory} onBack={() => setPage('home')} />
          )}
          {page === 'ai' && <AIChat onBack={() => setPage('home')} />}
          {page === 'meter' && <SmartMeter onBack={() => setPage('home')} />}
          {page === 'paint' && <PaintVisualizer onBack={() => setPage('home')} />}
          {page === 'studio' && <ImageGenerator />}
          {page === 'animated' && <AnimatedGallery />}
          {page === 'admin' && <AdminPanel />}
          {page === 'offers' && <Offers />}
          {page === 'competitions' && <Competitions />}
          {page === 'reports' && <UserReports onBack={() => setPage('home')} />}
          {page === 'profile' && <Profile onBack={() => setPage('home')} />}
        </main>
      </PullToRefresh>

      <DraggableFab 
        onClick={() => {
          trackEvent('fab_click', { destination: 'ai_chat' });
          setPage('ai');
        }}
      />
    </div>
  );
};

export default () => <AppProvider><AppContent /></AppProvider>;
