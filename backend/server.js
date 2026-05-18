import express from 'express'; // Restart trigger 5
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

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

// Inisialisasi Koneksi Database PostgreSQL via Prisma
const prisma = new PrismaClient();

// ==========================================
// ENDPOINT: REGISTER (Buat Akun Baru)
// ==========================================
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Semua kolom harus diisi!" });
    }

    // Cek apakah email sudah dipakai
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "Email sudah terdaftar!" });
    }

    // Acak (Hash) password agar aman
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan data user ke database PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({ message: "Registrasi berhasil!", user: { name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// ==========================================
// ENDPOINT: LOGIN (Masuk Akun)
// ==========================================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Email tidak ditemukan!" });
    }

    // Cocokkan password yang diinput dengan password asli di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password salah!" });
    }

    // Buat "Tiket Masuk" (JWT Token)
    const jwtSecret = process.env.JWT_SECRET || "rahasia_snapcheat_2026";
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });

    res.json({ message: "Login berhasil!", token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
});

// ==========================================
// ENDPOINT: LOGIN VIA GOOGLE
// ==========================================
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    // 1. Verifikasi token asli dengan mengambil data dari Google
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!googleRes.ok) {
      return res.status(401).json({ error: "Autentikasi Google gagal atau token kadaluarsa." });
    }
    
    const userInfo = await googleRes.json();
    const { email, name } = userInfo;

    // 2. Cari apakah user sudah ada di database kita
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // 3. Jika belum pernah daftar, kita buatkan akun otomatis dengan password acak yang di-hash
      const randomPassword = Math.random().toString(36).slice(-8) + Date.now();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      
      user = await prisma.user.create({
        data: { name, email, password: hashedPassword }
      });
    }

    // 4. Buatkan "Tiket Masuk" JWT seperti biasa
    const jwtSecret = process.env.JWT_SECRET || "rahasia_snapcheat_2026";
    const jwtToken = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '7d' });

    res.json({ message: "Login Google berhasil!", token: jwtToken, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
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
