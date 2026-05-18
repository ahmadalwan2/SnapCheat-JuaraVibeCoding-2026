import React, { useState } from 'react';

const Flashcards = () => {
  const [materialText, setMaterialText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleGenerate = async () => {
    if (!materialText.trim()) {
      setErrorMsg('Silakan masukkan materi kuliah Anda terlebih dahulu.');
      return;
    }
    
    setIsGenerating(true);
    setErrorMsg('');
    setFlashcards(null);
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
      } else {
        setErrorMsg(data.error || "Gagal membuat flashcard. Silakan coba lagi.");
      }
    } catch (error) {
      setErrorMsg("Gagal menghubungi server AI. Pastikan backend menyala.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
      }, 150);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out] px-4 md:px-0">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold font-heading text-[#171717]">Pembuat Flashcard AI</h2>
        <p className="text-sm text-[#666666] mt-1">
          Tempelkan catatan atau materi kuliah Anda, dan AI kami akan otomatis menyulapnya menjadi kartu hafalan interaktif.
        </p>
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
              setMaterialText(e.target.value);
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
            className="w-full py-3.5 bg-[#171717] hover:bg-[#333333] disabled:opacity-50 text-white font-semibold rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm text-sm"
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
                  className={`w-full h-full relative rounded-[2rem] shadow-md border border-[#eaeaea] transition-all duration-500 ease-out`}
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
    </div>
  );
};

export default Flashcards;
