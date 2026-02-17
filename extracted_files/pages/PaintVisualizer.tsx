
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Palette, ArrowRight, Camera, Check, Sparkles, Loader2, X, Download, ShoppingCart, Wand2, RefreshCw, ShieldAlert, Settings, HelpCircle, Lock, Video, Play, AlertCircle, Lightbulb, Maximize2, ScanSearch, Focus } from 'lucide-react';
import { analyzeRoomPaint } from '../services/gemini';
import { useAppContext } from '../AppContext';

const PAINT_COLORS = [
  { name: 'أبيض ملكي', hex: '#F9F9F9', id: 'p_white' },
  { name: 'بيج رملي', hex: '#E5D3B3', id: 'p_beige' },
  { name: 'رمادي عصري', hex: '#9E9E9E', id: 'p_gray' },
  { name: 'أزرق سماوي', hex: '#87CEEB', id: 'p_blue' },
  { name: 'أخضر زيتوني', hex: '#808000', id: 'p_green' },
  { name: 'كريمي دافئ', hex: '#FFFDD0', id: 'p_cream' }
];

const PaintVisualizer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToCart, products } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [selectedColor, setSelectedColor] = useState(PAINT_COLORS[0]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Helper for manual stop
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
          console.log("Playback failed (likely waiting for user interaction)", e);
        }
      }
      setHasPermission(true);
      setErrorType(null);
    } catch (err) {
      throw err;
    }
  };

  const requestCameraPermission = useCallback(async () => {
    setIsInitializing(true);
    setShowIntro(false);
    setHasPermission(null);
    setErrorType(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      setErrorType('NOT_SUPPORTED');
      setIsInitializing(false);
      return;
    }

    try {
      // First attempt
      await startStream({ video: { facingMode: 'environment' } });
    } catch (e: any) {
      // Don't retry if permission was explicitly denied
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError' || e.message?.includes('denied')) {
        console.warn("Camera permission denied by user.");
        setHasPermission(false);
        setErrorType('PERMISSION_DENIED');
        setStream(null);
        setIsInitializing(false);
        return;
      }

      console.warn("Primary camera failed, trying fallback...", e);
      try {
        // Fallback
        await startStream({ video: true });
      } catch (err2: any) {
        console.error("Camera request error:", err2);
        setHasPermission(false);
        setStream(null);
        if (err2.name === 'NotAllowedError' || err2.name === 'PermissionDeniedError') {
          setErrorType('PERMISSION_DENIED');
        } else {
          setErrorType('UNKNOWN');
        }
      }
    } finally {
      setIsInitializing(false);
    }
  }, [stream]);

  // Safe cleanup for effect
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (hasPermission !== true || !videoRef.current || !overlayCanvasRef.current) return;

    let requestId: number;
    const updateOverlay = () => {
      const video = videoRef.current!;
      const canvas = overlayCanvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx || video.paused || video.ended) {
        requestId = requestAnimationFrame(updateOverlay);
        return;
      }

      if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
      if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply the color overlay
      ctx.save();
      ctx.fillStyle = selectedColor.hex;
      ctx.globalAlpha = 0.40; 
      ctx.globalCompositeOperation = 'multiply'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw high-tech UI indicators
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const boxSize = Math.min(canvas.width, canvas.height) * 0.4;

      ctx.save();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.setLineDash([20, 10]);
      
      // Draw focus corners
      const cornerLen = 40;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(centerX - boxSize/2, centerY - boxSize/2 + cornerLen);
      ctx.lineTo(centerX - boxSize/2, centerY - boxSize/2);
      ctx.lineTo(centerX - boxSize/2 + cornerLen, centerY - boxSize/2);
      ctx.stroke();

      // Top Right
      ctx.beginPath();
      ctx.moveTo(centerX + boxSize/2 - cornerLen, centerY - boxSize/2);
      ctx.lineTo(centerX + boxSize/2, centerY - boxSize/2);
      ctx.lineTo(centerX + boxSize/2, centerY - boxSize/2 + cornerLen);
      ctx.stroke();

      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(centerX - boxSize/2, centerY + boxSize/2 - cornerLen);
      ctx.lineTo(centerX - boxSize/2, centerY + boxSize/2);
      ctx.lineTo(centerX - boxSize/2 + cornerLen, centerY + boxSize/2);
      ctx.stroke();

      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(centerX + boxSize/2 - cornerLen, centerY + boxSize/2);
      ctx.lineTo(centerX + boxSize/2, centerY + boxSize/2);
      ctx.lineTo(centerX + boxSize/2, centerY + boxSize/2 - cornerLen);
      ctx.stroke();
      
      // Center Dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#d4af37';
      ctx.fill();
      
      ctx.restore();

      requestId = requestAnimationFrame(updateOverlay);
    };

    requestId = requestAnimationFrame(updateOverlay);
    return () => cancelAnimationFrame(requestId);
  }, [hasPermission, selectedColor]);

  const handleDeepAnalysis = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);
    setLoading(true);
    setAdvice(null);
    
    // Smooth delay for dramatic effect
    await new Promise(r => setTimeout(r, 1500));

    const canvas = canvasRef.current;
    // Set canvas to full video resolution for high-quality analysis
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      // High quality JPEG for better AI perception
      const base64 = canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
      const res = await analyzeRoomPaint(base64, selectedColor.name);
      setAdvice(res);
    }
    setLoading(false);
    setIsScanning(false);
  };

  const handleSaveImage = () => {
    if (!videoRef.current || !overlayCanvasRef.current) return;
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = videoRef.current.videoWidth;
    finalCanvas.height = videoRef.current.videoHeight;
    const ctx = finalCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      ctx.globalAlpha = 0.5;
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = selectedColor.hex;
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      const link = document.createElement('a');
      link.download = `Al-Mamo-Room-${selectedColor.name}.png`;
      link.href = finalCanvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleAddToCart = () => {
    const paintProduct = products.find(p => p.category === 'دهانات') || products[0];
    addToCart(paintProduct);
    alert(`تكرم عيونك! تم حجز اللون "${selectedColor.name}" في سلتك يا غالي.`);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden animate-in fade-in duration-500">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header HUD */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/95 to-transparent">
        <button onClick={onBack} className="p-3 glass-card rounded-2xl hover:bg-white/10 transition-all">
          <ArrowRight className="text-white" />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-black text-gold-luxury tracking-widest uppercase">AL-MAMO PAINT AI</h2>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${hasPermission === true ? 'bg-green-500 animate-pulse' : hasPermission === false ? 'bg-red-500' : 'bg-white/20'}`}></div>
            <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">
              {hasPermission === true ? 'ULTRA-RES ANALYZER' : hasPermission === false ? 'CAMERA BLOCKED' : 'AWAITING SENSORS'}
            </span>
          </div>
        </div>
        <button 
          onClick={requestCameraPermission} 
          className="p-3 glass-card rounded-2xl text-gold-luxury active:scale-90 transition-all"
        >
          <RefreshCw size={18} className={isInitializing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex-1 relative bg-neutral-900">
        {showIntro ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#050505]">
             <div className="w-24 h-24 bg-gold-luxury/10 rounded-[40px] flex items-center justify-center mb-10 border border-gold-luxury/20 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative">
                <Palette size={48} className="text-gold-luxury relative z-10" />
                <div className="absolute inset-0 bg-gold-luxury/5 rounded-[40px] animate-ping opacity-20"></div>
             </div>
             <h3 className="text-3xl font-black text-white mb-4">مستشار الدهان الذكي</h3>
             <p className="text-white/50 mb-12 text-sm leading-relaxed max-w-xs mx-auto">
                رح نحلل إضاءة غرفتك وزواياها بدقة عالية ونعطيك النصيحة الحلبية الصح بخصوص اللون المختار.
             </p>
             <button 
                onClick={requestCameraPermission}
                className="w-full max-w-xs bg-gold-luxury text-black py-6 rounded-3xl font-black shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 text-lg"
             >
                <Play size={24} fill="currentColor" />
                ابدأ التجربة الحلبية
             </button>
          </div>
        ) : hasPermission === true ? (
          <div className="relative w-full h-full">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            <canvas 
              ref={overlayCanvasRef} 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
            />
            
            {/* Real-time Overlay Stats */}
            <div className="absolute top-28 left-6 flex flex-col gap-2 pointer-events-none">
                <div className="glass-card px-3 py-1.5 rounded-lg flex items-center gap-2 border-white/5">
                    <Focus size={12} className="text-gold-luxury" />
                    <span className="text-[9px] text-white/60 font-black tracking-widest uppercase">HD MODE: ON</span>
                </div>
                <div className="glass-card px-3 py-1.5 rounded-lg flex items-center gap-2 border-white/5">
                    <Lightbulb size={12} className="text-yellow-400" />
                    <span className="text-[9px] text-white/60 font-black tracking-widest uppercase">AUTO LIGHT: ACTIVE</span>
                </div>
            </div>

            {/* Scanning Animation */}
            {isScanning && (
                <div className="absolute inset-0 pointer-events-none z-30">
                    <div className="w-full h-1 bg-gold-luxury/50 shadow-[0_0_30px_rgba(212,175,55,1)] animate-scan"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="glass-card p-6 rounded-3xl border-gold-luxury/30 flex flex-col items-center gap-4 animate-pulse">
                            <ScanSearch size={40} className="text-gold-luxury" />
                            <p className="text-gold-luxury text-[10px] font-black uppercase tracking-[0.3em]">Capturing High-Res Data...</p>
                        </div>
                    </div>
                </div>
            )}
            
            {advice && (
              <div className="absolute inset-x-6 top-32 glass-card p-8 rounded-[40px] border-gold-luxury/30 animate-in slide-in-from-top duration-700 shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-[100] max-h-[50vh] flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-luxury rounded-xl flex items-center justify-center text-black shadow-lg">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <p className="text-gold-luxury text-[11px] font-black uppercase tracking-widest">مستشار المامو</p>
                        <p className="text-white/40 text-[9px] font-bold">حلب - حي الميسر</p>
                    </div>
                  </div>
                  <button onClick={() => setAdvice(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 transition-colors">
                    <X size={20}/>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <p className="text-white text-base font-bold leading-relaxed italic text-right">"{advice}"</p>
                </div>
                <div className="mt-8 flex gap-3">
                    <button onClick={handleDeepAnalysis} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60">إعادة التحليل</button>
                    <button onClick={handleAddToCart} className="flex-2 py-4 bg-gold-luxury text-black rounded-2xl text-xs font-black shadow-xl">حجز اللون فوراً</button>
                </div>
              </div>
            )}
          </div>
        ) : hasPermission === false ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#050505] overflow-y-auto">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20 shadow-2xl">
              <ShieldAlert size={40} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">تعذر تشغيل الكاميرا</h3>
            <div className="space-y-6 max-w-xs mt-4">
                <p className="text-white/40 text-sm leading-relaxed">
                  يرجى السماح للكاميرا من إعدادات المتصفح أو قم بإعادة المحاولة.
                </p>
              </div>
            <button onClick={requestCameraPermission} className="w-full max-w-xs bg-gold-luxury text-black py-5 rounded-2xl font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all mt-8">
              <RefreshCw size={20} className={isInitializing ? 'animate-spin' : ''} />
              منح الإذن وإعادة المحاولة
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-neutral-900">
             <div className="relative">
                <Loader2 className="animate-spin text-gold-luxury" size={48} />
                <div className="absolute inset-0 blur-xl bg-gold-luxury opacity-20"></div>
             </div>
             <p className="text-gold-luxury/50 text-[10px] font-black tracking-widest uppercase mt-8 animate-pulse">Requesting Media Stream...</p>
          </div>
        )}
      </div>

      {/* Control Panel Bottom */}
      <div className="bg-black/95 backdrop-blur-3xl p-6 pb-12 z-50 border-t border-white/10 space-y-8 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">لون الدهان المختار</p>
            <p className="text-xs text-white font-black">{selectedColor.name}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleSaveImage} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-gold-luxury transition-all">
                <Download size={20}/>
            </button>
            <button 
                onClick={handleDeepAnalysis} 
                disabled={loading || hasPermission !== true || isScanning}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-lg ${
                    advice 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'bg-gold-luxury/10 text-gold-luxury border border-gold-luxury/30 hover:bg-gold-luxury hover:text-black'
                } disabled:opacity-30`}
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                {advice ? 'تحليل مجدداً' : 'تحليل الإضاءة والزوايا'}
            </button>
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide px-2 items-center">
          {PAINT_COLORS.map(color => (
            <button 
              key={color.id} 
              onClick={() => {
                  setSelectedColor(color);
                  setAdvice(null);
              }} 
              disabled={hasPermission !== true || isScanning}
              className="flex-shrink-0 flex flex-col items-center gap-4 group disabled:opacity-50"
            >
              <div 
                className={`w-14 h-14 rounded-2xl border-2 transition-all duration-500 relative flex items-center justify-center ${
                  selectedColor.id === color.id 
                    ? 'border-gold-luxury scale-125 shadow-[0_0_25px_rgba(212,175,55,0.4)]' 
                    : 'border-white/5 opacity-60 grayscale-[0.2] hover:opacity-100 hover:grayscale-0'
                }`} 
                style={{ backgroundColor: color.hex }}
              >
                {selectedColor.id === color.id && (
                  <Check size={20} className="text-black drop-shadow-md" strokeWidth={4} />
                )}
              </div>
              <span className={`text-[9px] font-black tracking-tight transition-colors ${selectedColor.id === color.id ? 'text-gold-luxury' : 'text-white/30'}`}>
                {color.name}
              </span>
            </button>
          ))}
        </div>

        <button 
            onClick={handleAddToCart}
            disabled={hasPermission !== true || isScanning}
            className="w-full py-5 bg-gold-luxury text-black rounded-[24px] font-black shadow-[0_20px_40px_rgba(184,134,11,0.3)] flex items-center justify-center gap-4 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
        >
            <ShoppingCart size={22} />
            إضافة للسلة والحجز
        </button>
      </div>
    </div>
  );
};

export default PaintVisualizer;
