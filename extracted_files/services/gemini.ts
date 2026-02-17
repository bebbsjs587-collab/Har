
import { Product } from "../types";
import { BackendAPI } from "./backend";

// هذا الملف الآن يعمل كوسيط (Proxy) يطلب من السيرفر الخاص بنا تنفيذ عمليات الـ AI
// وهذا يضمن أمان المفتاح وعدم تحميل مكتبات ثقيلة في المتصفح

export const generateTechnicalAdvice = async (userMessage: string, base64Image?: string, mimeType: string = 'image/jpeg') => {
  try {
    const response = await fetch(`${BackendAPI.API_URL}/ai/advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, image: base64Image, mimeType })
    });
    const data = await response.json();
    return data.text || "يا غالي السيرفر مشغول شوي، جرب مرة تانية.";
  } catch (error) {
    return "في مشكلة بالاتصال مع المعلم المامو، تأكد من النت عندك.";
  }
};

export const generateAIImage = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") => {
  try {
    const response = await fetch(`${BackendAPI.API_URL}/ai/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, aspectRatio })
    });
    const data = await response.json();
    return data.image || null;
  } catch (error) {
    return null;
  }
};

export const estimateDimensions = async (base64Image: string) => {
  // نقوم باستدعاء نفس دالة النصيحة مع أمر محدد للقياس
  return generateTechnicalAdvice("حلل هذه الصورة وقدر الأبعاد (الطول والعرض) بالسنتمتر بدقة. أعطِ النتائج بلهجة حلبية ودودة.", base64Image);
};

export const analyzeRoomPaint = async (base64Image: string, colorName: string) => {
  return generateTechnicalAdvice(`المستخدم اختار لون ${colorName}. حلل إضاءة الغرفة في الصورة وأعطِ نصيحة حلبية إذا كان اللون مناسباً أو يحتاج تعديل.`, base64Image);
};

// Fix the return type signature to include 'payload' which resolves property access errors in AdminPanel.tsx
export const processAdminAgent = async (userCommand: string, currentProducts: Product[], currentRate: number): Promise<{ response: string; action: string; payload?: any }> => {
  try {
    const response = await fetch(`${BackendAPI.API_URL}/ai/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: userCommand, products: currentProducts, rate: currentRate })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { response: "ميزة الإدارة الذكية ستتوفر قريباً عبر السيرفر الآمن.", action: "QUERY" };
  }
};
