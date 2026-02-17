
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, Ruler, ArrowRight, RefreshCw, Loader2, Share2, Info, Scan, ShieldAlert, Settings, HelpCircle, Lock, Video, Play, AlertCircle, Image as ImageIcon, Upload } from 'lucide-react';
import { estimateDimensions } from '../services/gemini';

const SmartMeter: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Helper to stop all tracks and clear video ref manually
  const stopAllVideo = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
    if (videoRef.current && videoRef.current.srcObject) {
       const oldStream = videoRef.current.srcObject as MediaStream;
       if (oldStream && oldStream.getTracks) {
         oldStream.getTracks().forEach(t => t.stop());
       }
       videoRef.current.srcObject = null;
    }
  };

  const startStream = async (constraints: MediaStreamConstraints) => {
    // Stop previous stream before requesting new one to release hardware
    stopAllVideo();
    
    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('muted', 'true');
        try {
          await videoRef.current.play();
        } catch (e) {
          console.log("Play interrupted, waiting for user interaction or metadata", e);
        }
      }
      setHasPermission(true);
      setErrorType(null);
    } catch (err) {
      throw err;
    }
  };

  const requestCameraPermission = useCallback(async () => {
    setIsRefreshing(true);
    setShowIntro(false);
    setHasPermission(null);
    setErrorType(null);
    setPreviewImage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      setErrorType('NOT_SUPPORTED');
      setIsRefreshing(false);
      return;
    }

    try {
      // First attempt: Prefer environment camera
      await startStream({ video: { facingMode: 'environment' } });
    } catch (err: any) {
      // If permission is strictly denied, do NOT retry fallback as it causes double errors
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('denied')) {
        console.warn("Camera permission denied by user.");
        setHasPermission(false);
        setErrorType('PERMISSION_DENIED');
        setStream(null);
        setIsRefreshing(false);
        return;
      }

      console.warn("Primary camera failed, trying fallback...", err);
      try {
        // Second attempt: Any video camera (for other errors like OverconstrainedError)
        await startStream({ video: true });
      } catch (err2: any) {
        console.error("Camera fallback error:", err2);
        setHasPermission(false);
        setStream(null);
        if (err2.name === 'NotAllowedError' || err2.name === 'PermissionDeniedError') {
          setErrorType('PERMISSION_DENIED');
        } else {
          setErrorType('UNKNOWN');
        }
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [stream]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPreviewImage(base64);
        setShowIntro(false);
        setHasPermission(true); 
        stopAllVideo();
        setStream(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Safe cleanup that doesn't conflict with new streams
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [stream]);

  const handleMeasure = async () => {
    setIsAnalyzing(true);
    setResult(null);
    
    let base64 = '';
    
    if (previewImage) {
      base64 = previewImage.split(',')[1];
    } else if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        base64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
      }
    }

    if (base64) {
      const data = await estimateDimensions(base64);
      setResult(data);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden animate-in fade-in duration-500">
      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileUpload} 
      />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent">
        <button onClick={onBack} className="ripple p-3 glass-card rounded-2xl hover:bg-white/10 transition-all border-white/10">
          <ArrowRight className="text-white" />
        </button>
        <div className="flex flex-col items-center">
           <h2 className="text-lg font-black text-gold-luxury tracking-widest uppercase">AL-MAMO RADAR</h2>
           <div className="flex items-center gap-1.5">
             <div className={`w-1.5 h-1.5 rounded-full ${hasPermission === true ? 'bg-green-500 animate-ping' : hasPermission === false ? 'bg-red-500' : 'bg-white/20'}`}></div>
             <span className="text-[8px] text-white/40 font-bold uppercase tracking-[0.2em]">
               {previewImage ? 'FILE ANALYSIS' : hasPermission === true ? 'PRECISION SCANNING' : hasPermission === false ? 'SYSTEM ERROR' : 'INITIALIZING'}
             </span>
           </div>
        </div>
        <button 
          onClick={requestCameraPermission} 
          disabled={isRefreshing}
          className={`ripple p-3 glass-card rounded-2xl transition-all active:scale-90 ${isRefreshing ? 'opacity-50' : ''}`}
        >
          <RefreshCw size={18} className={`text-gold-luxury ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 relative bg-neutral-900">
        {showIntro ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#050505]">
             <div className="w-24 h-24 bg-gold-luxury/10 rounded-[32px] flex items-center justify-center mb-10 border border-gold-luxury/20 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                <Ruler size={48} className="text-gold-luxury" />
             </div>
             <h3 className="text-3xl font-black text-white mb-4">جاهز للمسح الذكي؟</h3>
             <p className="text-white/50 mb-12 text-sm leading-relaxed max-w-xs mx-auto">
                رادار المامو سيستخدم كاميرا هاتفك أو صورة من معرضك لتقدير أبعاد القطع بدقة الذكاء الاصطناعي.
             </p>
             
             <div className="w-full max-w-xs space-y-4">
               <button 
                  onClick={requestCameraPermission}
                  className="ripple w-full bg-gold-luxury text-black py-6 rounded-3xl font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 text-lg"
               >
                  <Play size={24} fill="currentColor" />
                  تشغيل الرادار الحي
               </button>
               
               <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="ripple w-full bg-white/5 border border-white/10 text-white py-5 rounded-3xl font-black transition-all flex items-center justify-center gap-4 text-base"
               >
                  <ImageIcon size={22} className="text-gold-luxury" />
                  رفع صورة من المعرض
               </button>
             </div>
          </div>
        ) : hasPermission === true ? (
          <>
            {previewImage ? (
              <img src={previewImage} className="w-full h-full object-contain bg-black" alt="Preview" />
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover grayscale brightness-50 contrast-125" 
              />
            )}
            
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="w-64 h-64 border border-gold-luxury/40 rounded-full"></div>
                    <div className="w-32 h-32 border-2 border-gold-luxury/20 rounded-full"></div>
                    <div className="absolute w-px h-full bg-gold-luxury/20"></div>
                    <div className="absolute h-px w-full bg-gold-luxury/20"></div>
                </div>
                {!previewImage && (
                  <div className="absolute inset-0 overflow-hidden">
                      <div className="w-full h-1 bg-gold-luxury/30 shadow-[0_0_15px_rgba(212,175,55,0.5)] animate-scan"></div>
                  </div>
                )}
            </div>

            {result && (
              <div className="absolute top-32 left-6 right-6 glass-card p-6 rounded-[32px] border-gold-luxury/30 animate-in zoom-in duration-500 max-h-[50vh] flex flex-col z-[60]">
                 <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3 shrink-0">
                    <Ruler size={18} className="text-gold-luxury" />
                    <h4 className="font-black text-white text-sm">نتائج القياس</h4>
                 </div>
                 <div className="text-white/80 text-xs leading-relaxed overflow-y-auto custom-scrollbar">
                    {result}
                 </div>
                 <div className="mt-4 flex gap-2 shrink-0">
                    <button onClick={() => setResult(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black">إغلاق</button>
                    <button className="flex-1 py-3 bg-gold-luxury text-black rounded-xl text-[10px] font-black flex items-center justify-center gap-2">
                        <Share2 size={12}/> مشاركة
                    </button>
                 </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-10 pb-16 flex justify-center items-center bg-gradient-to-t from-black to-transparent gap-6">
              <button 
                onClick={() => {
                  setPreviewImage(null);
                  requestCameraPermission();
                }}
                className="ripple p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-gold-luxury transition-all"
              >
                <RefreshCw size={24} />
              </button>
              
              <button 
                onClick={handleMeasure}
                disabled={isAnalyzing}
                className="ripple relative group p-6 rounded-full bg-white/5 border-4 border-gold-luxury/20 hover:border-gold-luxury transition-all active:scale-95 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gold-luxury rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                {isAnalyzing ? (
                  <Loader2 className="animate-spin text-gold-luxury" size={40} />
                ) : (
                  <Scan className="text-gold-luxury" size={40} />
                )}
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="ripple p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-gold-luxury transition-all"
              >
                <ImageIcon size={24} />
              </button>
            </div>
          </>
        ) : hasPermission === false ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#050505] overflow-y-auto">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20 shadow-lg">
                <ShieldAlert size={40} className="text-red-500" />
            </div>
            
            <h3 className="text-2xl font-black text-white mb-2">تعذر الوصول للكاميرا</h3>
            
            <p className="text-white/40 mb-8 text-sm leading-relaxed max-w-xs mx-auto">
              يا غالي، يرجى السماح للكاميرا من إعدادات المتصفح أو قم برفع صورة من المعرض.
            </p>
            
            <div className="w-full max-w-xs space-y-4">
              <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="ripple w-full bg-gold-luxury text-black py-5 rounded-2xl font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                  <Upload size={20} />
                  رفع صورة من المعرض
              </button>
              
              <button 
                  onClick={requestCameraPermission} 
                  className="ripple w-full bg-white/5 text-white/60 py-5 rounded-2xl font-black transition-all"
              >
                  إعادة المحاولة (تأكد من اختيار Allow)
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-neutral-900">
             <Loader2 className="animate-spin text-gold-luxury" size={60} />
             <p className="text-gold-luxury/50 text-[10px] font-black tracking-widest uppercase mt-8">Requesting Camera Access...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartMeter;
