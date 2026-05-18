import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Overview from '../../pages/Overview/Overview';
import Flashcards from '../../pages/Flashcards/Flashcards';
import Quiz from '../../pages/Quiz/Quiz';
import Notifications from '../../pages/Notifications/Notifications';
import Settings from '../../pages/Settings/Settings';
import HelpCenter from '../../pages/HelpCenter/HelpCenter';

const Dashboard = ({ user, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dapatkan activeTab dari URL. Jika path /dashboard maka activeTab = 'dashboard'
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts.length > 2 && pathParts[2] !== '' ? pathParts[2] : 'dashboard';

  // STATE BARU: Memantau apakah ada notifikasi yang belum dibaca
  const [hasUnread, setHasUnread] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('snapcheat_token');
    if (!token) return;

    const checkUnreadNotifications = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_URL}/api/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok && data.notifications) {
          const unread = data.notifications.some(n => !n.isRead);
          setHasUnread(unread);
        }
      } catch (error) {
        console.error("Gagal memeriksa notifikasi:", error);
      }
    };

    checkUnreadNotifications();
  }, [location.pathname]); // Perbarui status setiap kali rute/halaman berubah

  // Helper agar prop setActiveTab ke komponen turunan tidak error
  const setActiveTab = (tab) => {
    navigate(tab === 'dashboard' ? '/dashboard' : `/dashboard/${tab}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans text-[#171717]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#eaeaea] hidden md:flex flex-col z-20">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="h-16 flex items-center px-6 border-b border-[#eaeaea] cursor-pointer hover:opacity-85 transition-opacity"
          title="Ke Halaman Utama Dashboard"
        >
          <img src="/Snapcheat-logo.svg" alt="Logo" className="h-6 w-auto mr-1.5" />
          <span className="text-xl font-bold font-heading tracking-normal text-[#171717]">
            Snapcheat
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
            onClick={() => setActiveTab('notifikasi')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'notifikasi' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
          >
            <div className="relative flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              {hasUnread && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>
            Notifikasi
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
          <div className="border-t border-[#eaeaea] my-2 mx-3"></div>
          <button 
            onClick={() => setActiveTab('pengaturan')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'pengaturan' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Pengaturan Akun
          </button>
          <button 
            onClick={() => setActiveTab('bantuan')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'bantuan' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Pusat Bantuan
          </button>
        </nav>
        
        <div className="p-4 border-t border-[#eaeaea]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 font-medium rounded-xl transition-colors text-left cursor-pointer"
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
          <div className="md:hidden flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-[#171717] hover:text-[#2FA084] focus:outline-none cursor-pointer flex items-center justify-center p-1"
              title="Buka Menu Navigasi"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-85 transition-opacity"
              title="Ke Halaman Utama Dashboard"
            >
              <img src="/Snapcheat-logo.svg" alt="Logo" className="h-6 w-auto" />
              <span className="text-xl font-bold font-heading tracking-normal text-[#171717]">
                Snapcheat
              </span>
            </div>
          </div>
          <div className="hidden md:flex md:flex-col justify-center">
            <h1 className="text-xl font-bold font-heading text-[#171717] capitalize leading-tight">
              {activeTab === 'dashboard' ? 'Dashboard' : 
               activeTab === 'flashcards' ? 'Flashcard Saya' : 
               activeTab === 'kuis' ? 'Simulasi Kuis' : 
               activeTab === 'notifikasi' ? 'Notifikasi' : 
               activeTab === 'pengaturan' ? 'Pengaturan Akun' : 
               activeTab === 'bantuan' ? 'Pusat Bantuan' : 'Dashboard'}
            </h1>
            <p className="text-xs text-[#808080] font-medium mt-0.5">
              {activeTab === 'dashboard' ? 'Ringkasan aktivitas dan progres belajar Anda' : 
               activeTab === 'flashcards' ? 'Kelola deck materi dan kartu memori interaktif' : 
               activeTab === 'kuis' ? 'Uji pemahaman Anda dengan latihan soal cerdas AI' : 
               activeTab === 'notifikasi' ? 'Pembaruan terbaru dan aktivitas akun Anda' : 
               activeTab === 'pengaturan' ? 'Kelola data profil dan preferensi keamanan akun' : 
               activeTab === 'bantuan' ? 'Panduan penggunaan dan bantuan teknis aplikasi' : ''}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setActiveTab('pengaturan')}
              className="w-10 h-10 rounded-full bg-[#2FA084]/10 text-[#2FA084] font-bold flex items-center justify-center border-2 border-[#2FA084]/20 cursor-pointer hover:bg-[#2FA084]/20 transition-all hover:scale-105"
              title="Ke Pengaturan Akun"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth relative">
          
          {/* Background Gradient Ornaments */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2FA084]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
          
          {/* Dynamic Content Based on Active Tab */}
          <Routes>
            <Route index element={<Overview user={user} />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="kuis" element={<Quiz />} />
            <Route path="notifikasi" element={<Notifications />} />
            <Route path="pengaturan" element={<Settings user={user} />} />
            <Route path="bantuan" element={<HelpCenter />} />
          </Routes>
        </div>
      </main>

      {/* MOBILE DRAWER MENU - SLIDE-IN FROM LEFT */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Glassmorphic Backdrop Blur */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          ></div>
          
          {/* Drawer Panel */}
          <aside className="fixed top-0 left-0 bottom-0 w-72 bg-white border-r-2 border-[#171717] flex flex-col z-50 animate-[slideInLeft_0.25s_ease-out]">
            {/* Header Drawer */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#eaeaea]">
              <div className="flex items-center gap-1.5">
                <img src="/Snapcheat-logo.svg" alt="Logo" className="h-6 w-auto" />
                <span className="text-xl font-bold font-heading tracking-normal text-[#171717]">
                  Snapcheat
                </span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#666666] hover:text-[#171717] cursor-pointer p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            {/* Nav Links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <button 
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'dashboard' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                Dashboard
              </button>
              
              <button 
                onClick={() => { setActiveTab('notifikasi'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'notifikasi' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
              >
                <div className="relative flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                  {hasUnread && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </div>
                Notifikasi
              </button>
              
              <button 
                onClick={() => { setActiveTab('flashcards'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'flashcards' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Flashcard Saya
              </button>
              
              <button 
                onClick={() => { setActiveTab('kuis'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'kuis' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Kuis
              </button>
              
              <div className="border-t border-[#eaeaea] my-2 mx-3"></div>
              
              <button 
                onClick={() => { setActiveTab('pengaturan'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'pengaturan' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Pengaturan Akun
              </button>
              
              <button 
                onClick={() => { setActiveTab('bantuan'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${activeTab === 'bantuan' ? 'bg-[#2FA084]/10 text-[#2FA084]' : 'text-[#666666] hover:bg-gray-50 hover:text-[#171717]'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Pusat Bantuan
              </button>
            </nav>
            
            {/* Footer Drawer */}
            <div className="p-4 border-t border-[#eaeaea]">
              <button 
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 font-medium rounded-xl transition-colors text-left cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Keluar
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
