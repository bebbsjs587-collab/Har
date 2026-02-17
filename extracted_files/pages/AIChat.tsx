
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Trash2, X, Paperclip, FileVideo, Undo2, ArrowRight } from 'lucide-react';
import { generateTechnicalAdvice } from '../services/gemini';
import { trackEvent } from '../services/analytics';

interface AIChatProps {
  onBack: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'أهلاً بك يا عيوني! معك مساعد المامو الفني. شو في عندك أعطال اليوم بالبيت؟ احكيلي شو صاير معك أو ابعتلي صورة وتكرم عيونك.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ url: string, isVideo: boolean, mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || loading) return;

    trackEvent('ai_chat_sent', { has_text: !!input.trim(), has_image: !!selectedFile });

    const userMessage: any = { 
      role: 'user', 
      content: input, 
      image: selectedFile?.url || undefined,
      isVideo: selectedFile?.isVideo
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Keep reference to current file to send, then clear UI
    const fileToSend = selectedFile;
    setSelectedFile(null);

    const base64Data = fileToSend?.url ? fileToSend.url.split(',')[1] : undefined;
    
    try {
        const responseText = await generateTechnicalAdvice(
            userMessage.content || (fileToSend?.isVideo ? "تحليل فيديو" : "تحليل صورة"), 
            base64Data,
            fileToSend?.mimeType
        );
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (e) {
        setMessages(prev => [...prev, { role: 'assistant', content: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً." }]);
    } finally {
        setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({ 
          url: reader.result as string, 
          isVideo,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050505] animate-in slide-in-from-bottom duration-500">
      {/* Header */}
      <div className="bg-gold-luxury p-4 pt-[env(safe-area-inset-top)] flex items-center justify-between shadow-lg relative z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-black/10 hover:bg-black/20 rounded-xl transition-all active:scale-95">
            <ArrowRight size={24} className="text-black" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black/90 rounded-xl flex items-center justify-center text-xl shadow-xl">🛠️</div>
            <div>
              <h3 className="font-black text-black text-base leading-tight">مساعد المامو الفني</h3>
              <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 bg-green-900 rounded-full animate-pulse"></span>
                 <span className="text-[9px] text-black/60 font-black uppercase tracking-widest">متصل الآن</span>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setMessages([messages[0]])} className="p-2 bg-black/5 rounded-xl"><Trash2 size={20}/></button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[#0a0a0a] pb-32">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-md shrink-0 ${m.role === 'user' ? 'bg-amber-600' : 'bg-neutral-800 border border-white/10'}`}>
               {m.role === 'user' ? <User size={14}/> : 'M'}
            </div>
            <div className={`max-w-[85%] p-4 rounded-3xl shadow-xl leading-relaxed text-sm ${
              m.role === 'user' 
                ? 'bg-amber-600 text-white rounded-br-none' 
                : 'bg-[#151515] border border-white/5 text-amber-50 rounded-bl-none'
            }`}>
              {m.image && (
                <div className="relative rounded-2xl overflow-hidden mb-3 border border-white/10 bg-black/20">
                  {m.isVideo ? (
                    <div className="flex flex-col items-center justify-center p-8 gap-2">
                       <FileVideo size={48} className="text-white/40" />
                       <span className="text-[10px] font-black uppercase">مقطع فيديو مرفوع</span>
                    </div>
                  ) : (
                    <img src={m.image} alt="Upload" className="w-full max-h-64 object-cover" />
                  )}
                </div>
              )}
              <p className="whitespace-pre-wrap text-right">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs">M</div>
             <div className="bg-[#151515] border border-white/5 p-4 rounded-3xl rounded-bl-none">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gold-luxury rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gold-luxury rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-gold-luxury rounded-full animate-bounce [animation-delay:-0.5s]" />
                </div>
             </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-black/60 border-t border-white/5 backdrop-blur-xl absolute bottom-0 left-0 right-0 z-30 pb-[env(safe-area-inset-bottom)]">
        {selectedFile && (
          <div className="relative inline-block mb-3 animate-in zoom-in">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gold-luxury bg-neutral-900 flex items-center justify-center">
              {selectedFile.isVideo ? <FileVideo size={24} className="text-gold-luxury" /> : <img src={selectedFile.url} className="w-full h-full object-cover" />}
            </div>
            <button onClick={() => setSelectedFile(null)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"><X size={12} /></button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/5 rounded-2xl text-gold-luxury"><Paperclip size={20} /></button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
          
          <input 
            type="text" 
            placeholder="اكتب سؤالك هنا..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-gold-luxury/50 text-white text-right"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />

          <button onClick={handleSend} disabled={loading || (!input.trim() && !selectedFile)} className="p-3.5 bg-gold-luxury text-black rounded-2xl shadow-lg disabled:opacity-30">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
