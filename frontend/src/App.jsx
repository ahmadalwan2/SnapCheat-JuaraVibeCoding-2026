import React, { useState } from 'react';

function App() {
  // === HELPER UNTUK FORMAT MARKDOWN BOLD ===
  const formatMessage = (text) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-[#171717]">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  // === STATES UNTUK CHATBOT ===
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem("snapcheat_chat_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing chat history");
      }
    }
    return [{ role: "bot", content: "Halo! 👋 Ada yang bisa saya bantu terkait fitur SnapCheat?" }];
  });
  
  React.useEffect(() => {
    localStorage.setItem("snapcheat_chat_history", JSON.stringify(chatMessages));
  }, [chatMessages]);

  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // === STATES UNTUK VOICE NOTE ===
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);

  const handleToggleRecord = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            handleSendChat(base64String);
          };
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        alert("Gagal mengakses mikrofon. Pastikan izin mikrofon diberikan di browser Anda.");
      }
    }
  };

  const handleSendChat = async (audioBase64 = null) => {
    if (!chatInput.trim() && !audioBase64) return;
    
    const userMsg = audioBase64 ? "🎤 Pesan Suara (Voice Note)" : chatInput;
    const msgToSend = chatInput;
    
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    if (!audioBase64) setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgToSend, audioBase64: audioBase64 })
      });
      const data = await response.json();
      if (response.ok && data.reply) {
        setChatMessages(prev => [...prev, { role: "bot", content: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: "bot", content: `Pesan Error dari Backend: ${data.error || "Gagal terhubung."}` }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: "bot", content: "Maaf, server backend belum merespons." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // === STATES UNTUK MOCKUP FLASHCARD ===
  const [mockupInput, setMockupInput] = useState("Mitokondria adalah organel tempat berlangsungnya fungsi respirasi sel makhluk hidup. Fungsi utamanya adalah sebagai pabrik energi sel yang menghasilkan ATP. Organel ini banyak ditemukan pada sel yang butuh banyak energi seperti sel otot.");
  const [generatedFlashcards, setGeneratedFlashcards] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleGenerateFlashcard = async () => {
    if (!mockupInput.trim()) return;
    setIsGenerating(true);
    setGeneratedFlashcards(null);

    try {
      const response = await fetch("http://localhost:5000/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text_content: mockupInput })
      });
      const data = await response.json();
      if (response.ok && data.flashcards) {
        setGeneratedFlashcards(data.flashcards);
        setActiveCardIndex(0);
      } else {
        alert(`Error dari Backend: ${data.error || "Gagal membuat flashcard."}`);
      }
    } catch (error) {
      alert("Gagal menghubungi server AI. Pastikan backend menyala.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans selection:bg-[#2FA084] selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#fafafa]/80 backdrop-blur-xl border-b border-[#eaeaea]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/Snapcheat-logo.svg" 
              alt="SnapCheat Logo" 
              className="h-8 w-8 object-contain" 
              onError={(e) => { e.target.style.display = 'none' }} 
            />
            <span className="text-xl font-bold font-heading tracking-tight">
              Snap<span className="text-[#2FA084]">Cheat</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#666666]">
            <a href="#hero" className="hover:text-[#171717] transition-colors">Beranda</a>
            <a href="#about" className="hover:text-[#171717] transition-colors">Tentang</a>
            <a href="#goal" className="hover:text-[#171717] transition-colors">Tujuan</a>
            <a href="#features" className="hover:text-[#171717] transition-colors">Fitur</a>
            <a href="#faq" className="hover:text-[#171717] transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hidden md:block text-sm font-medium text-[#666666] hover:text-[#171717] transition-colors">Masuk</a>
            <button className="bg-[#2FA084] hover:bg-[#258069] text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer">
              Mulai Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-6 relative flex flex-col items-center text-center">
        {/* Soft background glow - extremely subtle */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2FA084]/5 blur-[100px] -z-10 rounded-[100%] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#eaeaea] text-xs font-medium text-[#666666] mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#2FA084]"></span>
            SnapCheat v1.0 telah rilis
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight mb-6 leading-[1.1] text-[#171717]">
            Berhenti Belajar Keras. <br className="hidden md:block" />
            <span className="text-[#2FA084]">Mulai Belajar Cerdas.</span>
          </h1>
          
          <p className="text-lg text-[#666666] mb-10 max-w-2xl mx-auto leading-relaxed">
            SnapCheat menyatukan PDF, slide dosen, dan catatanmu. Biarkan AI membuat flashcard dan kuis interaktif agar kamu bisa fokus menguasai materi tanpa lelah membaca.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="w-full sm:w-auto bg-[#2FA084] hover:bg-[#258069] text-white px-8 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
              Coba SnapCheat Gratis
            </button>
            <button className="w-full sm:w-auto bg-white hover:bg-[#f5f5f5] text-[#171717] border border-[#eaeaea] px-8 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Lihat Demo
            </button>
          </div>
        </div>

        {/* Hero Mockup Interface - SaaS Style */}
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-[#eaeaea] overflow-hidden">
          {/* Mockup Header */}
          <div className="h-12 border-b border-[#eaeaea] bg-[#fafafa] flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="mx-auto bg-white border border-[#eaeaea] rounded-md px-8 md:px-32 py-1 text-xs text-[#a3a3a3]">
              snapcheat.app
            </div>
          </div>
          {/* Mockup Content */}
          <div className="p-8 md:p-12 text-left flex flex-col md:flex-row gap-8 bg-white">
            <div className="flex-1">
              <div className="mb-4 text-sm font-medium text-[#666666] flex items-center gap-2">
                <svg className="w-4 h-4 text-[#2FA084]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Tempel materi kuliahmu (PDF/Teks)
              </div>
              <textarea 
                className="w-full h-48 bg-[#fafafa] border border-[#eaeaea] rounded-xl resize-none outline-none text-[#171717] placeholder-[#a3a3a3] p-5 text-sm focus:border-[#2FA084] transition-colors"
                placeholder="Paste teks materi kuliah di sini..."
                value={mockupInput}
                onChange={(e) => setMockupInput(e.target.value)}
              ></textarea>
              <button 
                onClick={handleGenerateFlashcard}
                disabled={isGenerating}
                className="mt-4 bg-[#171717] hover:bg-[#333333] disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                {isGenerating ? "Menganalisis dengan Gemini..." : "Buat Flashcard"}
              </button>
            </div>
            <div className="flex-1 border-t md:border-t-0 md:border-l border-[#eaeaea] pt-8 md:pt-0 md:pl-8">
              <div className="mb-4 text-sm font-medium text-[#666666]">Hasil Flashcard</div>
              <div className="space-y-3 h-64 overflow-y-auto pr-2">
                {generatedFlashcards ? (
                  generatedFlashcards.map((card, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-[#eaeaea] bg-white hover:border-[#2FA084] cursor-pointer transition-colors group">
                      <p className="text-sm font-bold text-[#171717] mb-2">{card.question}</p>
                      <p className="text-sm text-[#2FA084] font-medium hidden group-hover:block">{card.answer}</p>
                      <p className="text-xs text-[#a3a3a3] group-hover:hidden">Arahkan kursor untuk melihat jawaban</p>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-[#a3a3a3] text-sm text-center">
                    <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    <p>{isGenerating ? "Memproses teks..." : "Belum ada flashcard."}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden border border-[#eaeaea] bg-white p-2 shadow-sm">
                <div className="rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Students learning" className="w-full h-[350px] md:h-[450px] object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-[#2FA084] font-medium text-sm tracking-wider uppercase mb-3 block">Tentang SnapCheat</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-[#171717] mb-6 leading-tight">Asisten Belajar<br/>Generasi Z</h2>
              <p className="text-[#666666] text-lg leading-relaxed mb-8">
                SnapCheat lahir dari keluhan jutaan mahasiswa yang kelelahan membaca ratusan halaman jurnal dan slide dosen setiap malam. Kami hadir bukan sebagai alat untuk curang, melainkan sebagai "cheat-sheet" cerdas yang memanfaatkan kecerdasan buatan (AI) untuk merangkum dan mengekstraksi inti sari pembelajaran secara instan.
              </p>
              <div className="flex items-center gap-4 bg-white border border-[#eaeaea] p-4 rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#e6f4f1] text-[#2FA084] flex items-center justify-center shrink-0 text-xl">💡</div>
                <p className="text-[#171717] font-medium">Membantu mahasiswa menghemat hingga <span className="text-[#2FA084] font-bold">70% waktu belajar</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goal Section */}
      <section id="goal" className="py-24 px-6 bg-white border-t border-[#eaeaea]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#2FA084] font-medium text-sm tracking-wider uppercase mb-3 block">Tujuan Kami</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-[#171717] mb-6 leading-tight">Pendidikan Efisien,<br/>Tanpa Hambatan Biaya</h2>
              <p className="text-[#666666] text-lg leading-relaxed mb-8">
                Tujuan utama kami adalah mendemokratisasi akses pendidikan berkualitas. SnapCheat berkomitmen untuk selalu menyediakan platform pembelajaran interaktif berbasis AI secara gratis, memastikan bahwa setiap pelajar bisa meraih nilai maksimal tanpa hambatan finansial.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-[#171717] font-medium">
                  <div className="w-6 h-6 rounded-full bg-[#2FA084] text-white flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  Selalu 100% Gratis untuk Pelajar
                </li>
                <li className="flex items-center gap-3 text-[#171717] font-medium">
                  <div className="w-6 h-6 rounded-full bg-[#2FA084] text-white flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  Tanpa Iklan yang Mengganggu
                </li>
                <li className="flex items-center gap-3 text-[#171717] font-medium">
                  <div className="w-6 h-6 rounded-full bg-[#2FA084] text-white flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  Transparan & Didukung Komunitas
                </li>
              </ul>
            </div>
            <div>
              <div className="rounded-3xl overflow-hidden border border-[#eaeaea] bg-white p-2 shadow-sm">
                <div className="rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800" alt="Students goal" className="w-full h-[350px] md:h-[450px] object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2FA084] font-medium text-sm tracking-wider uppercase mb-2 block">Fitur Unggulan</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#171717] mb-4">Senjata Untuk Meningkatkan Nilaimu</h2>
            <p className="text-[#666666] max-w-2xl mx-auto">Semua yang kamu butuhkan untuk mencerna, menghafal, dan menguasai materi kuliah yang rumit tanpa stres berlebih.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#eaeaea] p-8 rounded-2xl flex flex-col items-start hover:border-[#2FA084]/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#fafafa] border border-[#eaeaea] flex items-center justify-center text-[#2FA084] mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-lg font-bold font-heading text-[#171717] mb-2">Rangkuman Pintar</h3>
              <p className="text-[#666666] text-sm leading-relaxed">Ringkas jurnal 50 halaman menjadi poin-poin singkat yang mudah dibaca dan dipahami dalam sekejap.</p>
            </div>
            <div className="bg-white border border-[#eaeaea] p-8 rounded-2xl flex flex-col items-start hover:border-[#2FA084]/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#fafafa] border border-[#eaeaea] flex items-center justify-center text-[#2FA084] mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-lg font-bold font-heading text-[#171717] mb-2">Pembuatan Flashcard</h3>
              <p className="text-[#666666] text-sm leading-relaxed">Ubah catatan kaku jadi flashcard 3D interaktif. Sempurna untuk metode belajar active recall dan ingatan jangka panjang.</p>
            </div>
            <div className="bg-white border border-[#eaeaea] p-8 rounded-2xl flex flex-col items-start hover:border-[#2FA084]/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#fafafa] border border-[#eaeaea] flex items-center justify-center text-[#2FA084] mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-lg font-bold font-heading text-[#171717] mb-2">Uji Dirimu (Kuis)</h3>
              <p className="text-[#666666] text-sm leading-relaxed">Uji pemahamanmu dengan kuis pilihan ganda buatan AI yang secara otomatis disesuaikan dengan materi spesifikmu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2FA084] font-medium text-sm tracking-wider uppercase mb-2 block">Pertanyaan Umum</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#171717] mb-4">Frequently Asked Questions</h2>
            <p className="text-[#666666]">Jawaban untuk pertanyaan yang paling sering ditanyakan oleh mahasiswa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "Apakah SnapCheat ini buat nyontek pas ujian?", a: "Tentu saja bukan! Kata 'Cheat' merujuk pada 'Cheat-Sheet' atau rangkuman singkat untuk mempercepat pemahaman materi, bukan untuk berbuat curang." },
              { q: "Apakah aplikasi ini 100% gratis?", a: "Ya! Misi kami adalah mendemokratisasi pendidikan agar mahasiswa bisa belajar lebih efisien tanpa beban biaya langganan bulanan." },
              { q: "Materi apa yang bisa diubah jadi kuis?", a: "Materi berbasis teks apa saja! Mulai dari teks PDF jurnal, slide presentasi dosen, hingga artikel dari internet." },
              { q: "Kenapa gak pakai AI chat biasa aja?", a: "Dengan AI biasa, kamu harus lelah mengetik instruksi (prompt). Di sini, teksmu otomatis disulap langsung menjadi UI kartu flashcard interaktif!" }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-[#eaeaea] p-8 rounded-2xl hover:border-[#2FA084]/30 transition-colors">
                <h4 className="text-lg font-bold font-heading text-[#171717] mb-3">{faq.q}</h4>
                <p className="text-[#666666] text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white border-t border-[#eaeaea]">
        <div className="max-w-5xl mx-auto relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#2FA084] to-[#1a7a63] border border-[#238069] shadow-2xl shadow-[#2FA084]/20">
          
          {/* Abstract Background Orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#114d3e]/40 blur-3xl rounded-full pointer-events-none"></div>
          
          {/* Decorative Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

          <div className="relative z-10 p-12 md:p-20 flex flex-col items-center text-center">
            {/* Tagline */}
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
              Mulai Petualangan Barumu
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 leading-tight max-w-3xl">
              Berhenti Menghafal, <br className="hidden md:block" />
              <span className="text-[#a8e6d5]">Mulai Memahami.</span>
            </h2>
            
            <p className="text-[#d8f2ec] mb-10 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              Bergabunglah dengan <strong>10.000+ mahasiswa</strong> yang telah menyelamatkan ratusan jam waktu belajar mereka dengan SnapCheat.
            </p>

            {/* Social Proof Avatars */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#1a7a63] bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=47" alt="User 1"/></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1a7a63] bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=32" alt="User 2"/></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1a7a63] bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=12" alt="User 3"/></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1a7a63] bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=5" alt="User 4"/></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1a7a63] bg-white text-[#1a7a63] flex items-center justify-center text-xs font-bold">+2k</div>
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <div className="flex justify-center sm:justify-start text-yellow-400 text-sm mb-1">
                  ★★★★★
                </div>
                <span className="text-white/90 text-xs font-medium">Rating 4.9/5 dari mahasiswa</span>
              </div>
            </div>

            <div className="flex flex-col w-full sm:w-auto">
              <button className="bg-white text-[#1a7a63] px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer">
                Mulai Sekarang Gratis
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#eaeaea] bg-[#fafafa]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-heading tracking-tight text-[#171717]">
              Snap<span className="text-[#2FA084]">Cheat</span>
            </span>
          </div>
          <div className="flex gap-6 text-sm text-[#666666]">
            <a href="#" className="hover:text-[#171717]">Persyaratan Layanan</a>
            <a href="#" className="hover:text-[#171717]">Kebijakan Privasi</a>
            <a href="#" className="hover:text-[#171717]">Kontak</a>
          </div>
          <p className="text-[#a3a3a3] text-sm">
            © 2026 SnapCheat. Hak cipta dilindungi.
          </p>
        </div>
      </footer>
      {/* Floating Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {/* Chat Window Popup */}
        {isChatOpen && (
          <div className="w-80 sm:w-96 bg-white border border-[#eaeaea] rounded-2xl shadow-2xl overflow-hidden flex flex-col origin-bottom-right transition-all duration-300">
            {/* Chat Header */}
            <div className="bg-[#2FA084] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 overflow-hidden"><img src="/Snapcheat-logo.svg" alt="AI" className="w-5 h-5 object-contain brightness-0 invert" /></div>
                <div>
                  <h4 className="font-bold text-sm font-heading">SnapCheat AI</h4>
                  <p className="text-xs text-[#d8f2ec]">Online - Siap membantu</p>
                </div>
              </div>
              <button 
                onClick={() => setChatMessages([{ role: "bot", content: "Halo! 👋 Ada yang bisa saya bantu terkait fitur SnapCheat?" }])} 
                title="Hapus obrolan"
                className="text-white/70 hover:text-white cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
            {/* Chat Messages */}
            <div className="p-4 h-64 overflow-y-auto bg-[#fafafa] flex flex-col gap-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-[#2FA084] flex items-center justify-center shrink-0 overflow-hidden"><img src="/Snapcheat-logo.svg" alt="AI" className="w-4 h-4 object-contain brightness-0 invert" /></div>
                  )}
                  <div className={`p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'bg-[#2FA084] text-white rounded-tr-none' : 'bg-white border border-[#eaeaea] text-[#666666] rounded-tl-none'}`}>
                    {msg.role === 'bot' ? formatMessage(msg.content) : msg.content}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#2FA084] flex items-center justify-center shrink-0 overflow-hidden"><img src="/Snapcheat-logo.svg" alt="AI" className="w-4 h-4 object-contain brightness-0 invert" /></div>
                  <div className="bg-white border border-[#eaeaea] p-3 rounded-2xl rounded-tl-none text-sm text-[#666666] shadow-sm flex gap-1">
                    <span className="animate-pulse">●</span><span className="animate-pulse delay-75">●</span><span className="animate-pulse delay-150">●</span>
                  </div>
                </div>
              )}
            </div>
            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-[#eaeaea] flex items-center gap-2">
              <button 
                onClick={handleToggleRecord} 
                disabled={isChatLoading}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-50 ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40' : 'bg-[#fafafa] border border-[#eaeaea] text-[#666666] hover:bg-gray-100'}`}
                title={isRecording ? "Hentikan Rekaman" : "Mulai Rekaman Suara"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              </button>
              <input 
                type="text" 
                placeholder={isRecording ? "Merekam suara..." : "Ketik pesan..."} 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isRecording && handleSendChat()}
                disabled={isRecording}
                className="flex-1 text-sm bg-[#fafafa] border border-[#eaeaea] rounded-full px-4 py-2.5 focus:outline-none focus:border-[#2FA084] focus:ring-1 focus:ring-[#2FA084] disabled:opacity-50" 
              />
              <button onClick={() => handleSendChat()} disabled={isChatLoading || isRecording} className="w-10 h-10 rounded-full bg-[#2FA084] text-white flex items-center justify-center shrink-0 hover:bg-[#238069] transition-colors cursor-pointer disabled:opacity-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              </button>
            </div>
          </div>
        )}

        {/* Floating Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 rounded-full bg-[#2FA084] text-white flex items-center justify-center shadow-lg shadow-[#2FA084]/30 hover:scale-110 hover:bg-[#238069] transition-all duration-300 cursor-pointer"
        >
          {isChatOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default App;
