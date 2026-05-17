import express from 'express'; // Restart trigger 5
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Mengizinkan request dari frontend (React)
app.use(express.json()); // Mem-parsing JSON payload

// Inisialisasi Google Gemini AI Client
// Pastikan GEMINI_API_KEY sudah ada di file .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'API_KEY_ANDA_DI_SINI');

// ==========================================
// ENDPOINT 0: Root Check (Untuk memastikan server nyala di browser)
// ==========================================
app.get('/', (req, res) => {
  res.send('SnapCheat Backend API is running successfully! 🚀');
});

// ==========================================
// ENDPOINT 1: Chatbot AI (Untuk pojok kanan bawah)
// ==========================================
app.post('/api/chat', async (req, res) => {
  try {
    const { message, audioBase64 } = req.body;
    
    if (!message && !audioBase64) {
      return res.status(400).json({ error: "Pesan atau audio tidak boleh kosong" });
    }

    // Gunakan model Gemini 1.5 Flash (sangat cepat dan cocok untuk chat/teks)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // System prompt untuk memberikan "kepribadian" pada bot dan informasi template jawaban
    const systemPrompt = `Kamu adalah SnapCheat AI, asisten virtual yang ramah untuk mahasiswa. 
Tugasmu adalah membantu menjelaskan apa itu SnapCheat, cara kerjanya, dan menjawab pertanyaan seputar fitur-fiturnya.
Gunakan bahasa Indonesia yang santai, gaul, dan bersahabat seperti anak muda/Gen Z.
Jangan gunakan markdown seperti bintang-bintang ganda untuk bold berlebihan jika tidak perlu.

INFORMASI PENTING (Template Jawaban):
- Jika ada yang bertanya "Siapa yang membuatmu?", "Siapa yang buat SnapCheat?", atau pertanyaan serupa tentang penciptamu, kamu WAJIB menjawab dengan: "Aku dibuat oleh Ahmad Alwan, seorang Web Developer keren yang juga punya ketertarikan besar di bidang UI/UX!" (Kamu bisa memodifikasi kalimatnya sedikit agar tetap luwes, tapi pastikan menyebutkan nama dan profesinya tersebut).`;

    const parts = [
      systemPrompt,
      message ? `Pertanyaan pengguna: "${message}"` : `Pengguna mengirimkan pesan suara. Silakan dengarkan dan jawab pertanyaan/pernyataan dari suara tersebut.`
    ];

    if (audioBase64) {
      parts.push({
        inlineData: {
          data: audioBase64,
          mimeType: "audio/webm"
        }
      });
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("Error di /api/chat:", error);
    res.status(500).json({ error: error.message || "Terjadi kesalahan saat memproses pesan." });
  }
});

// ==========================================
// ENDPOINT 2: Generate Flashcard (Fitur Utama)
// ==========================================
app.post('/api/flashcards', async (req, res) => {
  try {
    const { text_content } = req.body;
    
    if (!text_content) {
      return res.status(400).json({ error: "Teks materi tidak boleh kosong" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Prompt khusus untuk memaksa AI merespons HANYA dalam format JSON Array
    const prompt = `Ubah teks materi pelajaran berikut menjadi 3 buah flashcard (Tanya & Jawab) untuk bahan belajar mahasiswa.
    PENTING: Kamu WAJIB mengembalikan respons HANYA dalam format JSON array of objects yang valid, tanpa teks awalan/akhiran apapun, tanpa markdown formatting (\`\`\`json).
    Format yang diminta:
    [
      { "question": "pertanyaan 1", "answer": "jawaban 1" },
      ...
    ]
    
    Materi pelajaran:
    "${text_content}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // AI kadang membandel mengembalikan string dengan backticks ```json ... ```, jadi kita bersihkan
    const cleanedJsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const flashcardsData = JSON.parse(cleanedJsonString);

    res.json({ flashcards: flashcardsData });

  } catch (error) {
    console.error("Error di /api/flashcards:", error);
    res.status(500).json({ error: error.message || "Gagal membuat flashcard. Pastikan materi cukup panjang dan jelas." });
  }
});

// Jalankan Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend SnapCheat berjalan di port ${PORT}`);
  console.log(`🤖 Menunggu koneksi dari Frontend...`);
});
