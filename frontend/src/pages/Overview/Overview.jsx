import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Overview = ({ user }) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [quizScore, setQuizScore] = useState('0%');

  useEffect(() => {
    // Ambil data riwayat deck secara dinamis
    const cachedHistory = localStorage.getItem('snapcheat_decks_history');
    if (cachedHistory) {
      setHistory(JSON.parse(cachedHistory));
    }

    // Ambil skor kuis terakhir
    const cachedQuizScore = localStorage.getItem('snapcheat_last_quiz_score');
    if (cachedQuizScore) {
      setQuizScore(cachedQuizScore);
    }
  }, []);

  const hasDeck = history.length > 0;
  const deckCount = history.length;
  const studyTime = deckCount * 15; // Estimasi 15 menit per deck belajar aktif

  // Mengarahkan ke flashcard dengan memuat deck terakhir dari riwayat
  const handleContinueLearning = () => {
    if (hasDeck) {
      const lastDeck = history[0];
      localStorage.setItem('snapcheat_cached_material', lastDeck.materialText);
      localStorage.setItem('snapcheat_cached_flashcards', JSON.stringify(lastDeck.flashcards));
    }
    navigate('/dashboard/flashcards');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out] px-4 md:px-0">
      {/* Greeting Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[#8a8a8a] text-[10px] uppercase tracking-widest font-semibold mb-1.5">Overview Progres</p>
          <h2 className="text-3xl font-semibold text-[#171717] tracking-tight">
            Hai, {user?.name?.split(' ')[0] || 'Sobat SnapCheat'} 👋
          </h2>
        </div>
        <button 
          onClick={handleContinueLearning}
          className="bg-[#171717] hover:bg-[#333333] text-white px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
          {hasDeck ? "Buka Ruang Belajar" : "Buat Deck Baru"}
        </button>
      </div>

      {/* REDESAIN: Quick Stats Grid - ULTRA PREMIUM NEO-MINIMALIST (SEMI-BOLD EDITION) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Deck Belajar */}
        <div className="bg-white border-2 border-[#eaeaea] p-6 rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#171717] flex flex-col justify-between h-48 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8a8a8a] block">Koleksi Deck</span>
              <div className="flex items-baseline gap-1">
                <h3 className="text-4xl font-semibold text-[#171717] tracking-tight">{deckCount}</h3>
                <span className="text-xs font-medium text-[#8a8a8a]">deck</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-[#2FA084]/5 text-[#2FA084] border-2 border-[#2FA084]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#2FA084] group-hover:text-white group-hover:border-[#2FA084] transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#fafafa]">
            <span className="text-xs font-semibold text-[#171717]">Total Deck Belajar</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold bg-[#2FA084]/10 text-[#2FA084]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2FA084] animate-pulse"></span>
              {deckCount > 0 ? "Aktif" : "Kosong"}
            </span>
          </div>
        </div>
        
        {/* Skor Rata-rata Kuis */}
        <div className="bg-white border-2 border-[#eaeaea] p-6 rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#171717] flex flex-col justify-between h-48 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8a8a8a] block">Evaluasi AI</span>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-4xl font-semibold text-[#171717] tracking-tight">{quizScore}</h3>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-500 border-2 border-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#fafafa]">
            <span className="text-xs font-semibold text-[#171717]">Skor Terakhir Kuis</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold ${quizScore !== '0%' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${quizScore !== '0%' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></span>
              {quizScore !== '0%' ? "Selesai" : "Semangat"}
            </span>
          </div>
        </div>
        
        {/* Waktu Belajar */}
        <div className="bg-white border-2 border-[#eaeaea] p-6 rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#171717] flex flex-col justify-between h-48 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#8a8a8a] block">Fokus Belajar</span>
              <div className="flex items-baseline gap-1">
                <h3 className="text-4xl font-semibold text-[#171717] tracking-tight">{studyTime}</h3>
                <span className="text-xs font-medium text-[#8a8a8a]">menit</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-50 text-orange-500 border-2 border-orange-100 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#fafafa]">
            <span className="text-xs font-semibold text-[#171717]">Durasi Belajar</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold bg-orange-50 text-orange-600">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              {studyTime > 0 ? "Fokus" : "Idle"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Materials */}
      <div className="mt-10">
        <h3 className="text-sm uppercase tracking-widest font-bold text-[#8a8a8a] mb-4">Materi Terakhir Dipelajari</h3>
        
        {hasDeck ? (
          /* ACTIVE MATERIAL STATE */
          <div className="bg-white border-2 border-[#eaeaea] rounded-[2rem] p-6 hover:border-[#2FA084] transition-all flex flex-col md:flex-row justify-between items-center gap-6 group">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-14 h-14 bg-[#2FA084]/10 text-[#2FA084] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <div className="min-w-0 flex-1">
                {/* Dynamically renders the exact title of the most recent deck! */}
                <h4 className="font-bold text-[#171717] text-base leading-snug truncate pr-4">
                  {history[0].title}
                </h4>
                <p className="text-xs text-[#666666] mt-1">Mengandung {history[0].flashcards.length} buah kartu belajar aktif.</p>
              </div>
            </div>
            
            <button 
              onClick={handleContinueLearning}
              className="bg-[#2FA084] hover:bg-[#258069] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer w-full md:w-auto text-center shrink-0"
            >
              Lanjutkan Belajar ➔
            </button>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white border-2 border-[#eaeaea] border-dashed rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#fafafa] rounded-2xl flex items-center justify-center mb-4 text-[#a3a3a3]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h4 className="text-base font-bold text-[#171717] mb-2">Belum ada flashcard</h4>
            <p className="text-sm text-[#666666] max-w-sm mb-6">Mulai tambahkan teks materi kuliah Anda dan biarkan AI menyulapnya menjadi flashcard interaktif.</p>
            <button onClick={() => navigate('/dashboard/flashcards')} className="bg-[#2FA084] hover:bg-[#258069] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer">
              Mulai Buat Materi Baru
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
