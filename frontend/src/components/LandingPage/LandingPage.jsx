import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // === STATES UNTUK MOCKUP FLASHCARD ===
  const [mockupInput, setMockupInput] = useState("Mitokondria adalah organel tempat berlangsungnya fungsi respirasi sel makhluk hidup. Fungsi utamanya adalah sebagai pabrik energi sel yang menghasilkan ATP. Organel ini banyak ditemukan pada sel yang butuh banyak energi seperti sel otot.");
  const [generatedFlashcards, setGeneratedFlashcards] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true, // animasi hanya diputar sekali saat di-scroll
      offset: 50, // trigger animasi lebih awal
    });
  }, []);

  const handleGenerateFlashcard = async () => {
    if (!mockupInput.trim()) return;
    setIsGenerating(true);
    setGeneratedFlashcards(null);

    try {
      const response = await fetch(`${API_URL}/api/flashcards`, {
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
    <>
      {/* Navbar */}
      <nav className="fixed w-full top-0 z-50 bg-[#fafafa]/80 backdrop-blur-xl border-b border-[#eaeaea]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src="/Snapcheat-logo.svg" 
              alt="SnapCheat Logo" 
              className="h-8 w-8 object-contain" 
              onError={(e) => { e.target.style.display = 'none' }} 
            />
            <span className="text-xl font-bold font-heading tracking-tight">
              Snap<span className="text-[#2FA084]">Cheat</span>
            </span>
          </a>
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
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2FA084]/5 blur-[100px] -z-10 rounded-[100%] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#eaeaea] text-xs font-medium text-[#666666] mb-8" data-aos="fade-up" data-aos-delay="100">
            <span className="flex h-2 w-2 rounded-full bg-[#2FA084]"></span>
            SnapCheat v1.0 telah rilis
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight mb-6 leading-[1.1] text-[#171717]" data-aos="fade-up" data-aos-delay="200">
            Berhenti Belajar Keras. <br className="hidden md:block" />
            <span className="text-[#2FA084]">Mulai Belajar Cerdas.</span>
          </h1>
          <p className="text-lg text-[#666666] mb-10 max-w-2xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="300">
            SnapCheat menyatukan PDF, slide dosen, dan catatanmu. Biarkan AI membuat flashcard dan kuis interaktif agar kamu bisa fokus menguasai materi tanpa lelah membaca.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16" data-aos="fade-up" data-aos-delay="400">
            <button className="w-full sm:w-auto bg-[#2FA084] hover:bg-[#258069] text-white px-8 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
              Coba SnapCheat Gratis
            </button>
            <button className="w-full sm:w-auto bg-white hover:bg-[#f5f5f5] text-[#171717] border border-[#eaeaea] px-8 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Lihat Demo
            </button>
          </div>
        </div>

        {/* Hero Mockup Interface */}
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-[#eaeaea] overflow-hidden" data-aos="zoom-in" data-aos-delay="600">
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
            <div className="order-2 lg:order-1" data-aos="fade-right">
              <div className="rounded-3xl overflow-hidden border border-[#eaeaea] bg-white p-2 shadow-sm">
                <div className="rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Students learning" className="w-full h-[350px] md:h-[450px] object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2" data-aos="fade-left">
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
            <div data-aos="fade-right">
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
            <div data-aos="fade-left">
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
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="text-[#2FA084] font-medium text-sm tracking-wider uppercase mb-2 block">Fitur Unggulan</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#171717] mb-4">Senjata Untuk Meningkatkan Nilaimu</h2>
            <p className="text-[#666666] max-w-2xl mx-auto">Semua yang kamu butuhkan untuk mencerna, menghafal, dan menguasai materi kuliah yang rumit tanpa stres berlebih.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-[#eaeaea] p-8 rounded-2xl flex flex-col items-start hover:border-[#2FA084]/50 transition-colors" data-aos="fade-up" data-aos-delay="100">
              <div className="w-10 h-10 rounded-lg bg-[#fafafa] border border-[#eaeaea] flex items-center justify-center text-[#2FA084] mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-lg font-bold font-heading text-[#171717] mb-2">Rangkuman Pintar</h3>
              <p className="text-[#666666] text-sm leading-relaxed">Ringkas jurnal 50 halaman menjadi poin-poin singkat yang mudah dibaca dan dipahami dalam sekejap.</p>
            </div>
            <div className="bg-white border border-[#eaeaea] p-8 rounded-2xl flex flex-col items-start hover:border-[#2FA084]/50 transition-colors" data-aos="fade-up" data-aos-delay="200">
              <div className="w-10 h-10 rounded-lg bg-[#fafafa] border border-[#eaeaea] flex items-center justify-center text-[#2FA084] mb-5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-lg font-bold font-heading text-[#171717] mb-2">Pembuatan Flashcard</h3>
              <p className="text-[#666666] text-sm leading-relaxed">Ubah catatan kaku jadi flashcard 3D interaktif. Sempurna untuk metode belajar active recall dan ingatan jangka panjang.</p>
            </div>
            <div className="bg-white border border-[#eaeaea] p-8 rounded-2xl flex flex-col items-start hover:border-[#2FA084]/50 transition-colors" data-aos="fade-up" data-aos-delay="300">
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
          <div className="text-center mb-16" data-aos="fade-up">
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
              <div key={i} className="bg-white border border-[#eaeaea] p-8 rounded-2xl hover:border-[#2FA084]/30 transition-colors" data-aos="fade-up" data-aos-delay={i * 100}>
                <h4 className="text-lg font-bold font-heading text-[#171717] mb-3">{faq.q}</h4>
                <p className="text-[#666666] text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white border-t border-[#eaeaea]">
        <div className="max-w-5xl mx-auto relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#2FA084] to-[#1a7a63] border border-[#238069] shadow-2xl shadow-[#2FA084]/20" data-aos="zoom-in">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#114d3e]/40 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10 p-12 md:p-20 flex flex-col items-center text-center">
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
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#1a7a63] bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=47" alt="User 1"/></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1a7a63] bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=32" alt="User 2"/></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1a7a63] bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=12" alt="User 3"/></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1a7a63] bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?img=5" alt="User 4"/></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#1a7a63] bg-white text-[#1a7a63] flex items-center justify-center text-xs font-bold">+2k</div>
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <div className="flex justify-center sm:justify-start text-yellow-400 text-sm mb-1">★★★★★</div>
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
    </>
  );
};

export default LandingPage;
