import React, { useState, useEffect } from 'react';

const Flashcards = () => {
  const [materialText, setMaterialText] = useState(() => {
    return localStorage.getItem('snapcheat_cached_material') || '';
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState(() => {
    const cached = localStorage.getItem('snapcheat_cached_flashcards');
    return cached ? JSON.parse(cached) : null;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // STATE BARU: Menyimpan daftar riwayat deck belajar
  const [history, setHistory] = useState(() => {
    const cached = localStorage.getItem('snapcheat_decks_history');
    return cached ? JSON.parse(cached) : [];
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Sinkronisasi riwayat ke LocalStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('snapcheat_decks_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!materialText.trim()) {
      setErrorMsg('Silakan masukkan materi kuliah Anda terlebih dahulu.');
      return;
    }
    
    setIsGenerating(true);
    setErrorMsg('');
    setFlashcards(null);
    localStorage.removeItem('snapcheat_cached_flashcards');
    setIsFlipped(false);
    setCurrentIndex(0);

    try {
      const response = await fetch(`${API_URL}/api/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text_content: materialText })
      });
      
      const data = await response.json();
      
      if (response.ok && data.flashcards) {
        setFlashcards(data.flashcards);
        localStorage.setItem('snapcheat_cached_flashcards', JSON.stringify(data.flashcards));

        // Buat judul deck dinamis dari kalimat pertama materi
        const firstLine = materialText.split('\n')[0].trim();
        const cleanTitle = firstLine.length > 40 ? firstLine.substring(0, 40) + '...' : firstLine;
        
        // Simpan deck baru ke dalam riwayat
        const newDeck = {
          id: 'deck-' + Date.now(),
          title: cleanTitle || 'Materi Belajar Baru',
          materialText: materialText,
          flashcards: data.flashcards,
          createdAt: new Date().toISOString()
        };

        setHistory(prev => [newDeck, ...prev]);
      } else {
        setErrorMsg(data.error || "Gagal membuat flashcard. Silakan coba lagi.");
      }
    } catch (error) {
      setErrorMsg("Gagal menghubungi server AI. Pastikan backend menyala.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Menghapus deck dari riwayat
  const handleDeleteDeck = (deckId, e) => {
    e.stopPropagation(); // Mencegah deck termuat saat diklik tombol hapus
    setHistory(prev => prev.filter(item => item.id !== deckId));
  };

  // Memuat kembali deck dari riwayat ke area belajar aktif
  const handleLoadDeck = (deck) => {
    setMaterialText(deck.materialText);
    localStorage.setItem('snapcheat_cached_material', deck.materialText);
    setFlashcards(deck.flashcards);
    localStorage.setItem('snapcheat_cached_flashcards', JSON.stringify(deck.flashcards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setErrorMsg('');

    // Scroll halus ke atas pada container dashboard agar kartu hafalan langsung terlihat
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Memulai pembuatan deck baru (membersihkan area aktif)
  const handleCreateNew = () => {
    setMaterialText('');
    localStorage.removeItem('snapcheat_cached_material');
    setFlashcards(null);
    localStorage.removeItem('snapcheat_cached_flashcards');
    setCurrentIndex(0);
    setIsFlipped(false);
    setErrorMsg('');
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setIsFlipped(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : prev));
    setIsFlipped(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out] px-4 md:px-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-heading text-[#171717]">Pembuat Flashcard AI</h2>
          <p className="text-sm text-[#666666] mt-1">
            Tempelkan catatan materi kuliah Anda, dan AI kami akan menyulapnya menjadi kartu hafalan interaktif.
          </p>
        </div>
        {flashcards && (
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 bg-[#2FA084] hover:bg-[#258069] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer w-full md:w-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            Buat Deck Baru
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Material Input */}
        <div className="lg:col-span-5 bg-white border-2 border-[#eaeaea] p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#171717]">Materi Pelajaran</span>
            <span className="text-xs text-[#a3a3a3]">{materialText.length} karakter</span>
          </div>

          <textarea
            value={materialText}
            onChange={(e) => {
              const val = e.target.value;
              setMaterialText(val);
              localStorage.setItem('snapcheat_cached_material', val);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Tempel catatan kuliah, artikel, atau ringkasan bab buku pelajaran di sini (Minimal 10 kata)..."
            className="w-full h-72 p-4 bg-[#fafafa] border border-[#eaeaea] rounded-2xl text-sm text-[#171717] placeholder-[#a3a3a3] focus:outline-none focus:border-[#2FA084] focus:ring-1 focus:ring-[#2FA084] transition-colors resize-none leading-relaxed"
          ></textarea>

          {errorMsg && (
            <div className="bg-red-50 text-red-500 border border-red-100 p-3.5 rounded-xl text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 bg-[#171717] hover:bg-[#333333] disabled:opacity-50 text-white font-semibold rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menganalisis Materi...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Buat Flashcard Instan
              </>
            )}
          </button>
        </div>

        {/* Right Column: Interactive Card Flipper */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center w-full min-h-[400px]">
          {flashcards && flashcards.length > 0 ? (
            <div className="w-full flex flex-col items-center gap-6">
              {/* Card Container with 3D perspective */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-[460px] h-[280px] cursor-pointer"
                style={{ perspective: '1000px' }}
              >
                {/* Flipping Inner Wrapper */}
                <div 
                  className={`w-full h-full relative rounded-[2rem] border-2 border-[#eaeaea] transition-all duration-500 ease-out`}
                  style={{ 
                    transformStyle: 'preserve-3d', 
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
                  }}
                >
                  {/* FRONT SIDE (Question) */}
                  <div 
                    className="absolute w-full h-full bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-4"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <span className="text-[10px] font-bold tracking-widest text-[#2FA084] uppercase bg-[#2FA084]/10 px-3 py-1 rounded-full">
                      Pertanyaan ({currentIndex + 1} / {flashcards.length})
                    </span>
                    <p className="text-lg font-bold text-[#171717] px-4 leading-relaxed font-heading">
                      {flashcards[currentIndex].question}
                    </p>
                    <span className="text-xs text-[#a3a3a3] font-medium animate-pulse pt-2">
                      💡 Klik kartu untuk balikkan
                    </span>
                  </div>

                  {/* BACK SIDE (Answer) */}
                  <div 
                    className="absolute w-full h-full bg-[#171717] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-4"
                    style={{ 
                      backfaceVisibility: 'hidden', 
                      transform: 'rotateY(180deg)' 
                    }}
                  >
                    <span className="text-[10px] font-bold tracking-widest text-[#a8e6d5] uppercase bg-white/10 px-3 py-1 rounded-full">
                      Jawaban
                    </span>
                    <p className="text-base text-[#d8f2ec] px-4 leading-relaxed font-medium">
                      {flashcards[currentIndex].answer}
                    </p>
                    <span className="text-xs text-white/40 font-medium pt-2">
                      ✨ Klik kartu untuk kembali
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-6 mt-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="w-12 h-12 rounded-full border border-[#eaeaea] bg-white text-[#171717] hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Kembali"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>

                <div className="text-sm font-bold text-[#171717]">
                  {currentIndex + 1} / {flashcards.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === flashcards.length - 1}
                  className="w-12 h-12 rounded-full border border-[#eaeaea] bg-white text-[#171717] hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Selanjutnya"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-[#eaeaea] border-dashed rounded-[2rem] p-12 text-center max-w-[460px] w-full flex flex-col items-center">
              <div className="w-16 h-16 bg-[#2FA084]/10 text-[#2FA084] rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-[#171717] mb-2 font-heading">Siap Membuat Flashcard?</h3>
              <p className="text-sm text-[#666666] leading-relaxed mb-6">
                Masukkan ringkasan materi kuliah Anda di kolom sebelah kiri untuk membuat kartu hafalan interaktif menggunakan Gemini AI.
              </p>
              <div className="w-full bg-[#fafafa] border border-[#eaeaea] rounded-xl p-3 text-xs text-[#a3a3a3] font-medium flex items-center justify-center gap-2">
                ⚡ Didukung oleh Gemini 1.5 Flash
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION BARU: Daftar Riwayat Deck Belajar */}
      {history.length > 0 && (
        <div className="pt-6 border-t border-[#eaeaea]">
          <h3 className="text-xl font-bold font-heading text-[#171717] mb-4">Riwayat Deck Belajar Anda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {history.map((deck) => (
              <div
                key={deck.id}
                onClick={() => handleLoadDeck(deck)}
                className="bg-white border-2 border-[#eaeaea] hover:border-[#2FA084] p-5 rounded-3xl cursor-pointer transition-all flex flex-col justify-between group h-40"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xl shrink-0">📚</span>
                    <button
                      onClick={(e) => handleDeleteDeck(deck.id, e)}
                      className="text-[#a3a3a3] hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                      title="Hapus dari Riwayat"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-[#171717] leading-snug line-clamp-2 group-hover:text-[#2FA084] transition-colors">
                    {deck.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#a3a3a3] font-medium pt-2 border-t border-[#fafafa]">
                  <span>{deck.flashcards.length} kartu hafalan</span>
                  <span>{new Date(deck.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
