import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  // === STATES UNTUK AUTH ===
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('snapcheat_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('snapcheat_token');
    localStorage.removeItem('snapcheat_user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans selection:bg-[#2FA084] selection:text-white overflow-x-hidden">
      <Routes>
        <Route path="/" element={<LandingPage user={user} handleLogout={handleLogout} />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <AuthPage type="login" onLoginSuccess={handleLoginSuccess} />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" /> : <AuthPage type="register" onLoginSuccess={handleLoginSuccess} />} 
        />
        <Route 
          path="/dashboard/*" 
          element={user ? <Dashboard user={user} handleLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

export default App;
