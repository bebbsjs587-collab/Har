
import { useEffect, useState } from 'react';
import { Activity, ShoppingBag, Eye, Brain, Zap, Clock, Calendar, ArrowRight, BarChart3, Bot, Layout } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { getUserUsageReport } from '../services/analytics';

const UserReports: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { currentUser } = useAppContext();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      const report = getUserUsageReport(currentUser.id);
      setStats(report);
    }
  }, [currentUser]);

  if (!currentUser || !stats) return null;

  const StatCard = ({ icon, label, value, sublabel, color }: any) => (
    <div className={`bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-${color}-500/50 transition-all`}>
       <div className={`absolute top-0 left-0 w-24 h-24 bg-${color}-500/10 rounded-full -ml-8 -mt-8 blur-2xl group-hover:bg-${color}-500/20 transition-all`}></div>
       <div className="relative z-10 flex flex-col">
          <div className={`w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center mb-4 text-${color}-500 border border-white/5`}>
            {icon}
          </div>
          <span className="text-3xl font-black text-white mb-1">{value}</span>
          <span className="text-xs font-bold text-white/60 mb-2">{label}</span>
          {sublabel && <span className="text-[9px] text-white/30">{sublabel}</span>}
       </div>
    </div>
  );

  return (
    <div className="animate-in slide-in-from-bottom duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="ripple p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10">
          <ArrowRight size={20} className="text-gold-luxury" />
        </button>
        <h2 className="text-2xl font-black text-white">تقرير النشاط الشخصي</h2>
      </div>

      {/* User Profile Summary */}
      <div className="bg-gradient-to-br from-gold-luxury/20 to-neutral-900 border border-gold-luxury/20 p-8 rounded-[40px] mb-8 flex items-center gap-6 shadow-2xl relative overflow-hidden">
         <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold-luxury/10 rounded-full blur-3xl animate-pulse"></div>
         <div className="w-20 h-20 bg-gold-luxury rounded-full flex items-center justify-center text-3xl font-black text-black shadow-lg z-10">
            {currentUser.name.charAt(0)}
         </div>
         <div className="z-10">
            <h3 className="text-2xl font-black text-white mb-1">{currentUser.name}</h3>
            <p className="text-gold-luxury text-xs font-bold uppercase tracking-widest mb-1">عضو مميز في المامو</p>
            <div className="flex items-center gap-2 text-white/40 text-[10px]">
               <Calendar size={12} />
               <span>انضم منذ {new Date(currentUser.joinDate).toLocaleDateString('ar-SY')}</span>
            </div>
         </div>
      </div>

      <div className="mb-6 flex items-center gap-2 px-2">
         <Activity size={18} className="text-gold-luxury" />
         <h3 className="font-bold text-white">ملخص الاستخدام</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         <StatCard 
            icon={<ShoppingBag />} 
            label="الطلبات والسلة" 
            value={stats.cartAdditions} 
            sublabel="عمليات إضافة للسلة"
            color="amber"
         />
         <StatCard 
            icon={<Eye />} 
            label="المنتجات المشاهدة" 
            value={stats.productsViewed} 
            sublabel="نظرة على منتجاتنا"
            color="blue"
         />
         <StatCard 
            icon={<Bot />} 
            label="محادثات الذكاء" 
            value={stats.aiUsageCount} 
            sublabel="استشارات فنية وذكية"
            color="purple"
         />
         <StatCard 
            icon={<Zap />} 
            label="التفاعل الكلي" 
            value={stats.totalInteractions} 
            sublabel="نقرة وتفاعل"
            color="green"
         />
      </div>

      <div className="mb-6 flex items-center gap-2 px-2">
         <Brain size={18} className="text-gold-luxury" />
         <h3 className="font-bold text-white">استخدام الأدوات الذكية</h3>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
         <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-lg ${stats.toolsUsed.meter ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-white/20'}`}>
                  <Layout size={20} />
               </div>
               <div>
                  <p className="text-sm font-bold text-white">رادار القياس (Smart Meter)</p>
                  <p className="text-[10px] text-white/40">{stats.toolsUsed.meter ? 'تم الاستخدام' : 'لم يجرب بعد'}</p>
               </div>
            </div>
            {stats.toolsUsed.meter && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
         </div>

         <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-lg ${stats.toolsUsed.paint ? 'bg-purple-500/20 text-purple-500' : 'bg-white/5 text-white/20'}`}>
                  <Layout size={20} />
               </div>
               <div>
                  <p className="text-sm font-bold text-white">مستشار الدهان (Paint AI)</p>
                  <p className="text-[10px] text-white/40">{stats.toolsUsed.paint ? 'تم الاستخدام' : 'لم يجرب بعد'}</p>
               </div>
            </div>
            {stats.toolsUsed.paint && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
         </div>

         <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-lg ${stats.toolsUsed.studio ? 'bg-pink-500/20 text-pink-500' : 'bg-white/5 text-white/20'}`}>
                  <Layout size={20} />
               </div>
               <div>
                  <p className="text-sm font-bold text-white">استوديو التصميم (AI Studio)</p>
                  <p className="text-[10px] text-white/40">{stats.toolsUsed.studio ? 'تم الاستخدام' : 'لم يجرب بعد'}</p>
               </div>
            </div>
            {stats.toolsUsed.studio && <div className="w-2 h-2 bg-pink-500 rounded-full"></div>}
         </div>
      </div>

      <div className="mt-8 text-center">
         <p className="text-[10px] text-white/30 flex items-center justify-center gap-2">
            <Clock size={12} />
            آخر نشاط: {stats.lastActive ? new Date(stats.lastActive).toLocaleString('ar-SY') : 'الآن'}
         </p>
      </div>
    </div>
  );
};

export default UserReports;
