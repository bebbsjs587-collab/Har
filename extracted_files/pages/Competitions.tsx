
import React, { useState, useRef } from 'react';
import { Trophy, Star, Users, Medal, ChevronLeft, Upload, FileVideo, CheckCircle2, X, Loader2 } from 'lucide-react';

const Competitions: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-700">
      <div className="text-center mb-12">
        <Trophy className="mx-auto text-amber-500 mb-4" size={64} />
        <h2 className="text-4xl font-black text-gold-luxury">مسابقات المامو الشهرية</h2>
        <p className="opacity-60">شارك واربح جوائز قيمة من حرفيي حلب</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Competition */}
        <div className="lg:col-span-2 bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-black mb-4 uppercase tracking-widest">
              <Star size={14} fill="currentColor" />
              مسابقة شهر آذار ٢٠٢٦
            </div>
            <h3 className="text-3xl font-black mb-4">أفضل إصلاح منزلي ذكي</h3>
            <p className="opacity-60 text-sm mb-8 leading-relaxed text-right">
              صور فيديو قصير (أقل من دقيقة) لعملية إصلاح قمت بها في منزلك باستخدام أدوات خردوات المامو. 
              سيتم اختيار ٣ فائزين بناءً على مهارة الإصلاح وجودة النتيجة.
            </p>
            
            {/* Prize Board */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 p-4 rounded-2xl text-center">
                <Medal className="mx-auto text-yellow-400 mb-2" />
                <span className="block font-black text-sm">١,٠٠٠,٠٠٠</span>
                <span className="text-[10px] opacity-40">ليرة سورية</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/10">
                <Medal className="mx-auto text-gray-400 mb-2" />
                <span className="block font-black text-sm">٥٠٠,٠٠٠</span>
                <span className="text-[10px] opacity-40">ليرة سورية</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl text-center">
                <Medal className="mx-auto text-amber-700 mb-2" />
                <span className="block font-black text-sm">٢٥٠,٠٠٠</span>
                <span className="text-[10px] opacity-40">ليرة سورية</span>
              </div>
            </div>

            {/* Upload Section */}
            {!uploadedFile ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="ripple w-full py-6 bg-gold-luxury text-black rounded-2xl font-black shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
              >
                <Upload size={24} />
                ارفع فيديوك الآن (MP4, MOV)
              </button>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-in zoom-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-gold-luxury">
                      <FileVideo size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-[150px]">{uploadedFile.name}</p>
                      <p className="text-[10px] text-white/40">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button onClick={removeFile} className="p-2 hover:bg-white/10 rounded-full text-white/30 hover:text-red-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                {uploading ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gold-luxury">
                      <span>جاري الرفع...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gold-luxury transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                    <CheckCircle2 size={16} />
                    تم الرفع بنجاح! أنت الآن في المنافسة.
                  </div>
                )}
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="video/*,image/*" 
              onChange={handleFileChange} 
            />
          </div>
        </div>

        {/* Hall of Fame */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <Users size={20} className="text-amber-500" />
            لوحة الشرف
          </h3>
          <div className="space-y-6">
            {[
              { name: 'أحمد الحلبي', prize: 'فائز شهر شباط', avatar: '👤' },
              { name: 'محمد ميسر', prize: 'فائز شهر كانون الثاني', avatar: '👷' },
              { name: 'ياسين كوجك', prize: 'فائز شهر كانون الأول', avatar: '👨‍🔧' },
            ].map((winner, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl border border-white/20">
                  {winner.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{winner.name}</h4>
                  <p className="text-[10px] text-amber-500 font-bold">{winner.prize}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="ripple mt-8 w-full py-3 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            مشاهدة جميع الفائزين
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Competitions;
