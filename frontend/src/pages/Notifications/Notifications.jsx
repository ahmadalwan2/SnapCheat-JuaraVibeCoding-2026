import React, { useState, useEffect } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem('snapcheat_token');

  // Fetch all notifications from backend
  const fetchNotifications = async () => {
    if (!token) {
      setErrorMsg("Sesi Anda telah berakhir, silakan login kembali.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications || []);
      } else {
        setErrorMsg(data.error || "Gagal mengambil data notifikasi.");
      }
    } catch (error) {
      setErrorMsg("Gagal terhubung dengan server backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    if (!token || notifications.length === 0) return;

    try {
      const response = await fetch(`${API_URL}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Update local state immediately
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error("Gagal menandai semua dibaca:", error);
    }
  };

  // Membuka custom confirmation modal
  const handleClearAll = () => {
    if (!token || notifications.length === 0) return;
    setShowConfirmModal(true);
  };

  // Hapus semua notifikasi dari basis data (setelah dikonfirmasi lewat modal)
  const confirmClearAll = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notifications/delete-all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Hapus state secara instan di UI
        setNotifications([]);
      }
    } catch (error) {
      console.error("Gagal menghapus semua notifikasi:", error);
    } finally {
      setShowConfirmModal(false);
    }
  };

  // Mark a single notification as read
  const handleMarkOneRead = async (id, isRead) => {
    if (!token || isRead) return;

    try {
      const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Update local state immediately
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
      }
    } catch (error) {
      console.error("Gagal menandai notifikasi dibaca:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Helper to format dynamic relative time
  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins} menit lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      
      // Default standard date formatting
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch (e) {
      return "Baru saja";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <svg className="animate-spin h-8 w-8 text-[#2FA084]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-medium text-[#666666]">Memuat notifikasi Anda...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      {errorMsg ? (
        <div className="bg-red-50 text-red-500 border border-red-100 p-4 rounded-2xl text-center text-sm font-semibold">
          {errorMsg}
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-2">
            <p className="text-[#666666] font-medium text-sm">
              {unreadCount > 0 ? `${unreadCount} pesan belum dibaca` : "Semua pesan sudah dibaca"}
            </p>
            {notifications.length > 0 && (
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-xs sm:text-sm text-[#2FA084] hover:text-[#258069] font-semibold transition-colors cursor-pointer bg-[#2FA084]/10 hover:bg-[#2FA084]/20 px-4 py-2 rounded-xl"
                  >
                    Tandai semua dibaca
                  </button>
                )}
                <button 
                  onClick={handleClearAll}
                  className="text-xs sm:text-sm text-red-500 hover:text-red-600 font-semibold transition-colors cursor-pointer bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl"
                >
                  Hapus Semua
                </button>
              </div>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="bg-white border-2 border-[#eaeaea] p-12 rounded-[2rem] text-center space-y-3">
              <span className="text-4xl">🔔</span>
              <h3 className="font-bold text-[#171717]">Kotak Masuk Kosong</h3>
              <p className="text-sm text-[#666666] max-w-sm mx-auto leading-relaxed">
                Anda tidak memiliki notifikasi baru saat ini. Kami akan mengabari jika ada informasi terbaru!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleMarkOneRead(notif.id, notif.isRead)}
                  className={`flex gap-4 p-4 bg-white border-2 rounded-2xl transition-all cursor-pointer group ${
                    notif.isRead 
                      ? 'border-[#eaeaea] opacity-75 hover:opacity-100' 
                      : 'border-[#eaeaea] hover:border-[#2FA084]'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 pt-1 shrink-0">
                    {!notif.isRead ? (
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    ) : (
                      <div className="w-2.5 h-2.5 bg-transparent"></div>
                    )}
                  </div>
                  
                  {/* Custom icon based on type */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    notif.type === 'welcome' 
                      ? 'bg-[#2FA084]/10 text-[#2FA084]' 
                      : 'bg-blue-50 text-blue-500'
                  }`}>
                    {notif.type === 'welcome' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className={`font-bold text-[#171717] text-sm truncate ${!notif.isRead ? 'font-black' : ''}`}>
                        {notif.title}
                      </h4>
                      <span className={`text-xs shrink-0 ${!notif.isRead ? 'font-bold text-[#2FA084]' : 'text-[#a3a3a3]'}`}>
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-[#666666] leading-relaxed pr-4">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {/* CUSTOM PREMIUM CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white border-2 border-[#171717] rounded-[2rem] p-8 max-w-sm w-full space-y-6 text-center animate-[scaleUp_0.2s_ease-out]">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto border-2 border-red-100 mb-2">
              <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#171717] font-heading">Hapus Semua Pesan?</h3>
              <p className="text-xs text-[#666666] leading-relaxed px-2">
                Tindakan ini akan menghapus seluruh riwayat notifikasi secara permanen dari server. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-[#fafafa] hover:bg-gray-100 border border-[#eaeaea] text-[#171717] font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmClearAll}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
