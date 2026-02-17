
import { GoogleGenAI, Type } from "@google/genai";

// ملاحظة: يفضل دائماً ضبط API_KEY في إعدادات Netlify (Environment Variables)
const API_KEY = process.env.API_KEY || "AIzaSyBXqyEIw_DX3WgTP6cFRM5FY3ZpSi88vN0";
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const handler = async (event, context) => {
  // ترويسات الاستجابة الموحدة (CORS & JSON)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // التعامل مع طلبات Pre-flight الخاصة بـ CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // استخراج المسار الفرعي (مثلاً: /ai/advice)
  // Netlify يمرر المسار الكامل، لذا نحتاج لتنظيفه
  const path = event.path.replace("/.netlify/functions/api", "").replace("/api", "");
  const method = event.httpMethod;

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    // 1. مساعد المامو الفني (استشارة فنية)
    if (path === "/ai/advice" && method === "POST") {
      const { message, image, mimeType } = body;
      
      const contents = {
        role: "user",
        parts: [{ text: message || "مرحبا" }]
      };

      if (image) {
        contents.parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: image
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [contents],
        config: {
          systemInstruction: "أنت 'مساعد المامو الفني' الخبير في حلب. تحدث بلهجة حلبية عريقة ومحببة. قدم حلولاً هندسية وفنية دقيقة واقترح الأدوات المتوفرة في محل المامو.",
          temperature: 0.7,
        },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ text: response.text })
      };
    }

    // 2. توليد صور (تصميم ديكور)
    if (path === "/ai/image" && method === "POST") {
      const { prompt, aspectRatio } = body;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          imageConfig: {
            aspectRatio: aspectRatio || "1:1"
          }
        },
      });

      const part = response.candidates[0].content.parts.find(p => p.inlineData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          image: part ? `data:image/png;base64,${part.inlineData.data}` : null 
        })
      };
    }

    // 3. مدير المتجر الذكي (Admin AI)
    if (path === "/ai/admin" && method === "POST") {
      const { command, products, rate } = body;
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ 
          role: 'user', 
          parts: [{ text: `Rate: ${rate}, Command: ${command}, Data: ${JSON.stringify(products?.slice(0, 10))}` }] 
        }],
        config: {
          responseMimeType: "application/json",
          systemInstruction: "أنت مدير متجر المامو. حلل الأمر ونفذ إجراءات إدارية. رد بصيغة JSON حصراً.",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              response: { type: Type.STRING },
              action: { type: Type.STRING },
              payload: { type: Type.OBJECT }
            },
            required: ["response", "action"]
          }
        },
      });

      return {
        statusCode: 200,
        headers,
        body: response.text
      };
    }

    // 4. فحص الصحة (Health Check)
    if (path === "/health") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          status: "online", 
          server: "Netlify Edge",
          timestamp: new Date().toISOString() 
        })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "المسار غير موجود" })
    };

  } catch (error) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "حدث خطأ في السيرفر",
        details: error.message 
      })
    };
  }
};
