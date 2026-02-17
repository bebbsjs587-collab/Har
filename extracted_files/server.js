
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// استخدام مفتاحك الخاص مباشرة في حال لم يتم ضبطه في متغيرات البيئة
const KEY = process.env.API_KEY || "AIzaSyBXqyEIw_DX3WgTP6cFRM5FY3ZpSi88vN0";
const ai = new GoogleGenAI({ apiKey: KEY });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// تقديم ملفات الـ Frontend من مجلد dist بعد البناء (Build)
app.use(express.static(path.join(__dirname, 'dist')));

// --- MongoDB Connection ---
let db;
if (MONGO_URI) {
  const client = new MongoClient(MONGO_URI, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
  });
  client.connect().then(() => {
    db = client.db("mamoStore");
    console.log("✅ متصل بقاعدة بيانات المامو");
  }).catch(err => console.error("❌ فشل اتصال MongoDB:", err));
}

// --- AI Endpoints ---

app.post('/api/ai/advice', async (req, res) => {
  const { message, image, mimeType } = req.body;
  try {
    const parts = [{ text: message }];
    if (image) parts.push({ inlineData: { mimeType: mimeType || 'image/jpeg', data: image } });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction: `أنت "مساعد المامو الفني" خبير خردوات حلب. لهجتك حلبية أصيلة. ساعد الزبائن في حل مشاكلهم الفنية وشجعهم على شراء الأدوات من متجر المامو.`,
      },
    });
    res.json({ text: response.text });
  } catch (error) {
    res.status(500).json({ error: "فشل AI" });
  }
});

app.post('/api/ai/image', async (req, res) => {
  const { prompt, aspectRatio } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: { imageConfig: { aspectRatio: aspectRatio || "1:1" } },
    });
    const part = response.candidates[0].content.parts.find(p => p.inlineData);
    res.json({ image: part ? `data:image/png;base64,${part.inlineData.data}` : null });
  } catch (error) {
    res.status(500).json({ error: "فشل توليد الصورة" });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', version: '2.0.0', api_key: "SET" });
});

// توجيه كافة الطلبات الأخرى لملف الـ Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 تطبيق المامو جاهز على المنفذ ${PORT}`);
});
