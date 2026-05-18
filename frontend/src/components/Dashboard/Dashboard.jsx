import React, { useState, useRef, useEffect } from 'react';

const Dashboard = ({ user, handleLogout, setCurrentView }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const profileRef = useRef(null);

  const faqs = [
    {
      question: "Bagaimana cara membuat Flashcard otomatis?",
      answer: "Masuk ke menu 'Flashcard Saya', klik tombol 'Buat Deck Baru', lalu salin-tempel teks materi atau catatan kuliah Anda ke dalam kolom yang tersedia. AI SnapCheat akan langsung merangkumnya menjadi kartu interaktif."
    },
    {
      question: "Apakah aplikasinya gratis selamanya?",
      answer: "Saat ini SnapCheat dalam fase beta dan dapat digunakan secara gratis. Ke depannya, kami akan menambahkan fitur premium untuk batas penggunaan AI yang lebih tinggi, namun fitur dasar akan selalu gratis!"
    },
    {
      question: "Bagaimana cara mengubah foto profil?",
      answer: "Anda dapat masuk ke menu 'Pengaturan Akun', lalu klik tombol 'Ganti Foto' di bawah nama Anda. Fitur unggah foto ini akan segera kami aktifkan di update selanjutnya."
    }
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans text-[#171717]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#eaeaea] hidden md:flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-[#eaeaea]">
          <img src="/Snapcheat-logo.svg" alt="Logo" className="w-6 h-6 mr-2" />
          <span className="text-xl font-bold font-heading tracking-tight text-[#171717]">
            Snap<span className="text-[#2FA084]">Cheat</span>
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'dashboard' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('flashcards')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'flashcards' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Flashcard Saya
          </button>
          <button 
            onClick={() => setActiveTab('kuis')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'kuis' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Kuis
          </button>
        </nav>
        
        <div className="p-4 border-t border-[#eaeaea]">
          <button 
            onClick={() => setCurrentView('landing')}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[#666666] hover:bg-gray-50 hover:text-[#171717] font-medium rounded-xl transition-colors text-left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Halaman Depan
          </button>
          <button 
            onClick={() => { handleLogout(); setCurrentView('landing'); }}
            className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 font-medium rounded-xl transition-colors text-left cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#eaeaea] flex items-center justify-between px-6 lg:px-10 shrink-0 z-10 sticky top-0">
          <div className="md:hidden flex items-center gap-2">
            <img src="/Snapcheat-logo.svg" alt="Logo" className="w-6 h-6" />
            <span className="text-xl font-bold font-heading tracking-tight text-[#171717]">
              Snap<span className="text-[#2FA084]">Cheat</span>
            </span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold font-heading text-[#171717] capitalize">
              {activeTab === 'dashboard' ? 'Dashboard' : 
               activeTab === 'flashcards' ? 'Flashcard Saya' : 
               activeTab === 'kuis' ? 'Simulasi Kuis' : 
               activeTab === 'pengaturan' ? 'Pengaturan Akun' : 
               activeTab === 'bantuan' ? 'Pusat Bantuan' : 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[#a3a3a3] hover:text-[#171717] transition-colors cursor-pointer rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="relative" ref={profileRef}>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 rounded-full bg-[#2FA084]/10 text-[#2FA084] font-bold flex items-center justify-center border border-[#2FA084]/20 cursor-pointer hover:bg-[#2FA084]/20 transition-colors"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              {/* Profile Dropdown Pop-up */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border-2 border-[#eaeaea] rounded-2xl p-2 z-50 animate-[fadeIn_0.2s_ease-out]">
                  <div className="p-3 border-b border-[#eaeaea] mb-2">
                    <p className="font-bold text-[#171717] truncate">{user?.name || 'User'}</p>
                    <p className="text-sm text-[#666666] truncate">{user?.email || 'email@example.com'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <button 
                      onClick={() => { setActiveTab('pengaturan'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#666666] hover:bg-gray-50 hover:text-[#171717] font-medium rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Pengaturan Akun
                    </button>
                    <button 
                      onClick={() => { setActiveTab('bantuan'); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#666666] hover:bg-gray-50 hover:text-[#171717] font-medium rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Pusat Bantuan
                    </button>
                    <div className="border-t border-[#eaeaea] my-1"></div>
                    <button 
                      onClick={() => { setIsProfileOpen(false); handleLogout(); setCurrentView('landing'); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 font-medium rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth relative">
          
          {/* Background Gradient Ornaments */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2FA084]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
          
          {/* Dynamic Content Based on Active Tab */}
          {activeTab === 'dashboard' && (
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
                  onClick={() => setActiveTab('flashcards')}
                  className="bg-[#171717] hover:bg-[#333333] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Buat Flashcard Baru
                </button>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border-2 border-[#eaeaea] p-6 rounded-3xl transition-all hover:-translate-y-1 hover:border-[#d4d4d4] relative overflow-hidden group">
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
                
                <div className="bg-white border-2 border-[#eaeaea] p-6 rounded-3xl transition-all hover:-translate-y-1 hover:border-[#d4d4d4] relative overflow-hidden group">
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
                
                <div className="bg-white border-2 border-[#eaeaea] p-6 rounded-3xl transition-all hover:-translate-y-1 hover:border-[#d4d4d4] relative overflow-hidden group">
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
                  <button onClick={() => setActiveTab('flashcards')} className="bg-[#2FA084] hover:bg-[#258069] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer">
                    Mulai Buat Materi Baru
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="max-w-4xl mx-auto animate-[fadeIn_0.3s_ease-out]">
              <div className="flex justify-end mb-6">
                <button className="bg-[#2FA084] hover:bg-[#258069] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Buat Deck Baru
                </button>
              </div>
              
              <div className="bg-white border-2 border-[#eaeaea] rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[#2FA084]/10 text-[#2FA084] rounded-full flex items-center justify-center mb-5">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-[#171717] mb-3">Ruang Belajarmu Masih Kosong</h3>
                <p className="text-[#666666] max-w-md mb-8">Fitur pembuatan Flashcard otomatis akan segera hadir. Anda bisa memasukkan ratusan halaman PDF dan AI kami akan merangkumnya dalam hitungan detik!</p>
                <button className="bg-white border border-[#eaeaea] text-[#171717] hover:bg-[#fafafa] px-6 py-3 rounded-xl font-medium transition-colors cursor-pointer">
                  Jelajahi Deck Publik (Segera)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'kuis' && (
            <div className="max-w-4xl mx-auto animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-gradient-to-br from-[#171717] to-[#333333] rounded-3xl p-12 flex flex-col items-center justify-center text-center relative overflow-hidden mt-4">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2FA084]/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="w-20 h-20 bg-white/10 text-white rounded-full flex items-center justify-center mb-5 backdrop-blur-md relative z-10 border border-white/20">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">Uji Coba Pintar AI</h3>
                <p className="text-[#d8f2ec] max-w-md mb-8 relative z-10">Fitur Kuis sedang diracik oleh tim SnapCheat. Nantinya, AI akan memberikan soal-soal jebakan layaknya ujian sungguhan!</p>
                <button onClick={() => setActiveTab('dashboard')} className="bg-[#2FA084] text-white hover:bg-[#258069] px-6 py-3 rounded-xl font-medium transition-colors cursor-pointer relative z-10">
                  Kembali ke Dashboard
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pengaturan' && (
            <div className="max-w-3xl mx-auto animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-white border-2 border-[#eaeaea] rounded-3xl p-8 md:p-10 mt-4">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#eaeaea]">
                  <div className="w-20 h-20 rounded-full bg-[#2FA084]/10 text-[#2FA084] text-2xl font-bold flex items-center justify-center border-2 border-[#2FA084]/20 shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#171717]">{user?.name || 'Sobat SnapCheat'}</h3>
                    <p className="text-[#666666] text-sm mb-3">{user?.email || 'email@example.com'}</p>
                    <button className="bg-white border-2 border-[#eaeaea] text-[#171717] hover:border-[#d4d4d4] hover:bg-[#fafafa] px-4 py-1.5 rounded-xl text-sm font-medium transition-all cursor-pointer">
                      Ganti Foto
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">Nama Lengkap</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name || ''}
                      className="w-full bg-[#fafafa] border-2 border-[#eaeaea] text-[#171717] px-4 py-3 rounded-xl focus:outline-none focus:border-[#2FA084] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">Email</label>
                    <input 
                      type="email" 
                      disabled
                      defaultValue={user?.email || ''}
                      className="w-full bg-[#f0f0f0] border-2 border-[#eaeaea] text-[#666666] px-4 py-3 rounded-xl cursor-not-allowed opacity-70"
                    />
                    <p className="text-xs text-[#a3a3a3] mt-1.5">Email tidak dapat diubah karena digunakan untuk login.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      placeholder="Masukkan kata sandi baru"
                      className="w-full bg-[#fafafa] border-2 border-[#eaeaea] text-[#171717] px-4 py-3 rounded-xl focus:outline-none focus:border-[#2FA084] transition-colors"
                    />
                  </div>
                  <div className="pt-4">
                    <button className="bg-[#171717] hover:bg-[#333333] text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer w-full md:w-auto">
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bantuan' && (
            <div className="max-w-3xl mx-auto animate-[fadeIn_0.3s_ease-out]">
              <div className="space-y-4 mt-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className={`bg-white border-2 ${openFaq === index ? 'border-[#2FA084]' : 'border-[#eaeaea] hover:border-[#d4d4d4]'} rounded-2xl p-6 transition-all cursor-pointer`}
                  >
                    <h3 className={`font-bold ${openFaq === index ? 'text-[#2FA084]' : 'text-[#171717]'} flex justify-between items-center`}>
                      {faq.question}
                      <svg className={`w-5 h-5 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-[#2FA084]' : 'text-[#a3a3a3]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </h3>
                    {openFaq === index && (
                      <p className="text-[#666666] text-sm leading-relaxed mt-4 animate-[fadeIn_0.2s_ease-out]">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-[#2FA084]/10 border-2 border-[#2FA084]/20 rounded-3xl p-8 text-center">
                <h3 className="font-bold text-[#171717] mb-2">Masih Butuh Bantuan Lain?</h3>
                <p className="text-[#666666] text-sm mb-5">Tim Support kami siap membalas pesan Anda 24/7 (kalau tidak sedang tidur).</p>
                <a 
                  href="mailto:snapcheatbussines@gmail.com?subject=Butuh Bantuan: Pengguna SnapCheat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#2FA084] hover:bg-[#258069] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  Hubungi Support via Email
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
