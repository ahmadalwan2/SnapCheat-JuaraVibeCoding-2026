import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // === STATES UNTUK AUTH ===
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'login' | 'register'
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('snapcheat_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('snapcheat_token');
    localStorage.removeItem('snapcheat_user');
    setUser(null);
    setCurrentView('landing');
  };

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
      const response = await fetch(`${API_URL}/api/chat`, {
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

  if (currentView === 'login' || currentView === 'register') {
    return (
      <AuthPage 
        type={currentView} 
        setType={setCurrentView} 
        onBack={() => setCurrentView('landing')} 
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentView === 'dashboard' && user) {
    return <Dashboard user={user} handleLogout={handleLogout} setCurrentView={setCurrentView} />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans selection:bg-[#2FA084] selection:text-white overflow-x-hidden">
      <LandingPage setCurrentView={setCurrentView} user={user} handleLogout={handleLogout} />
      {/* Floating Chatbot Widget */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-4">
        {/* Chat Window Popup */}
        {isChatOpen && (
          <div className="w-[calc(100vw-2rem)] sm:w-96 bg-white border border-[#eaeaea] rounded-2xl shadow-2xl overflow-hidden flex flex-col origin-bottom-right transition-all duration-300">
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
