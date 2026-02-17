
import React, { useState } from 'react';
import { User, Phone, MapPin, Calendar, LogOut, Settings, ChevronLeft, Package, Clock, ShieldCheck, Server, Save } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { getUserUsageReport } from '../services/analytics';
import { BackendAPI } from '../services/backend';

const Profile: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { currentUser, logout } = useAppContext();
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [serverUrl, setServerUrl] = useState(BackendAPI.getServerUrl());

  if (!currentUser) return null;

  const stats = getUserUsageReport(currentUser.id);
  const recentDate = stats.lastActive ? new Date(stats.lastActive).toLocaleDateString('ar-SY', { weekday: 'long', hour: '2-digit', minute: '2-digit' }) : 'الآن';

  const handleSaveServer = () => {
    BackendAPI.setServerUrl(serverUrl);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="ripple p-3 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/10 transition-all">
          <ChevronLeft className="text-gold-luxury" size={24} />
        </button>
        <h2 className="text-2xl font-black text-white">الملف الشخصي</h2>
        <div className="w-12"></div> {/* Spacer */}
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-[40px] p-8 mb-8 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-luxury to-transparent opacity-50"></div>
         <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold-luxury/5 rounded-full blur-3xl"></div>
         
         <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center text-4xl font-black text-gold-luxury mb-4 border-2 border-gold-luxury/20 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative">
               {currentUser.name.charAt(0)}
               <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-black"></div>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{currentUser.name}</h3>
            <div className="flex items-center gap-2 text-white/40 text-sm mb-6 dir-ltr bg-white/5 px-4 py-1 rounded-full border border-white/5">
               <span className="font-mono">{currentUser.phone}</span>
               <Phone size={14} />
            </div>

            <div className="flex gap-4 w-full">
               <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center">
                  <span className="block text-2xl font-black text-white mb-1">{stats.totalInteractions}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">تفاعل</span>
               </div>
               <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center">
                  <span className="block text-2xl font-black text-white mb-1">{stats.cartAdditions}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">طلبات</span>
               </div>
            </div>
         </div>
      </div>

      {/* Menu Options */}
      <div className="space-y-4">
         
         {/* Server Config Toggle */}
         <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
             <button 
                onClick={() => setShowServerConfig(!showServerConfig)}
                className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group"
             >
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                     <Server size={20} />
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-white text-sm">إعدادات الخادم (مطور)</p>
                     <p className="text-[10px] text-white/40">تكوين اتصال الشبكة</p>
                  </div>
               </div>
               <Settings size={18} className="text-white/20 group-hover:text-gold-luxury transition-colors" />
            </button>
            
            {showServerConfig && (
                <div className="p-6 pt-0 animate-in slide-in-from-top duration-300">
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-4">
                        <label className="text-[10px] font-black text-white/40 uppercase">رابط الخادم (Server IP)</label>
                        <input 
                            type="text" 
                            dir="ltr"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-white/20 outline-none focus:border-gold-luxury"
                            placeholder="http://192.168.1.5:3001"
                            value={serverUrl}
                            onChange={(e) => setServerUrl(e.target.value)}
                        />
                        <button 
                            onClick={handleSaveServer}
                            className="w-full bg-gold-luxury text-black font-black py-3 rounded-xl text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={14} />
                            حفظ وإعادة تشغيل
                        </button>
                        <p className="text-[9px] text-white/30 leading-relaxed">
                            * إذا كنت تستخدم التطبيق على الهاتف، أدخل عنوان IP لجهاز الكمبيوتر (مثلاً: http://192.168.1.x:3001).
                        </p>
                    </div>
                </div>
            )}
         </div>

         <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors border-b border-white/5 group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                     <Package size={20} />
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-white text-sm">طلباتي السابقة</p>
                     <p className="text-[10px] text-white/40">تتبع حالة الشحن</p>
                  </div>
               </div>
               <ChevronLeft size={18} className="text-white/20 group-hover:text-gold-luxury transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                     <ShieldCheck size={20} />
                  </div>
                  <div className="text-right">
                     <p className="font-bold text-white text-sm">الخصوصية والأمان</p>
                     <p className="text-[10px] text-white/40">تغيير كلمة المرور</p>
                  </div>
               </div>
               <ChevronLeft size={18} className="text-white/20 group-hover:text-gold-luxury transition-colors" />
            </button>
         </div>

         <button 
           onClick={() => logout()}
           className="w-full flex items-center justify-center gap-2 p-6 rounded-3xl bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/50"
         >
            <LogOut size={18} />
            تسجيل خروج
         </button>
      </div>

      <div className="mt-8 text-center bg-white/5 rounded-2xl p-4 inline-block w-full border border-white/5">
         <p className="text-[10px] text-white/30 flex items-center justify-center gap-2 font-mono">
            <Clock size={12} />
            Last Active: {recentDate}
         </p>
      </div>
    </div>
  );
};

export default Profile;
