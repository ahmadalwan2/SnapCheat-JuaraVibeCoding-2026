import React from 'react';
import { useNavigate } from 'react-router-dom';

const Overview = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Greeting Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[#666666] font-medium text-sm mb-1">Selamat Belajar Kembali!</p>
          <h2 className="text-3xl font-bold font-heading text-[#171717]">
            Hai, {user?.name?.split(' ')[0] || 'Sobat SnapCheat'} 👋
          </h2>
        </div>
        <button 
          onClick={() => navigate('/dashboard/flashcards')}
          className="bg-[#171717] hover:bg-[#333333] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Buat Flashcard Baru
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border-2 border-[#eaeaea] p-6 rounded-3xl transition-all hover:-translate-y-1 hover:border-[#2FA084] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#2FA084]/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-[#2FA084]/10 text-[#2FA084] rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <p className="text-[#666666] font-medium text-sm">Total Deck Belajar</p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold font-heading text-[#171717]">0</h3>
            <span className="text-xs text-[#a3a3a3]">deck</span>
          </div>
        </div>
        
        <div className="bg-white border-2 border-[#eaeaea] p-6 rounded-3xl transition-all hover:-translate-y-1 hover:border-[#2FA084] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p className="text-[#666666] font-medium text-sm">Skor Rata-rata Kuis</p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold font-heading text-[#171717]">0%</h3>
            <span className="text-xs text-green-500 font-medium">✨ Semangat!</span>
          </div>
        </div>
        
        <div className="bg-white border-2 border-[#eaeaea] p-6 rounded-3xl transition-all hover:-translate-y-1 hover:border-[#2FA084] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p className="text-[#666666] font-medium text-sm">Waktu Belajar</p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold font-heading text-[#171717]">0</h3>
            <span className="text-xs text-[#a3a3a3]">mnt / minggu ini</span>
          </div>
        </div>
      </div>

      {/* Recent Materials */}
      <div className="mt-10">
        <h3 className="text-lg font-bold font-heading text-[#171717] mb-4">Materi Terakhir Dipelajari</h3>
        <div className="bg-white border-2 border-[#eaeaea] border-dashed rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#fafafa] rounded-2xl flex items-center justify-center mb-4 text-[#a3a3a3]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h4 className="text-base font-bold text-[#171717] mb-2">Belum ada flashcard</h4>
          <p className="text-sm text-[#666666] max-w-sm mb-6">Mulai tambahkan teks materi kuliah Anda dan biarkan AI menyulapnya menjadi flashcard interaktif.</p>
          <button onClick={() => navigate('/dashboard/flashcards')} className="bg-[#2FA084] hover:bg-[#258069] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer">
            Mulai Buat Materi Baru
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
