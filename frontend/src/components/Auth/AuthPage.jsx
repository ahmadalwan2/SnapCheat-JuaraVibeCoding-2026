import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const AuthPageContent = ({ type, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = type === 'login' ? '/api/login' : '/api/register';

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (type === 'login') {
          localStorage.setItem('snapcheat_token', data.token);
          localStorage.setItem('snapcheat_user', JSON.stringify(data.user));
          onLoginSuccess(data.user);
        } else {
          setSuccessMsg('Akun berhasil dibuat! Silakan masuk.');
          navigate('/login');
        }
      } else {
        setError(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal menghubungi server. Pastikan backend menyala.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await res.json();
        
        if (res.ok) {
          localStorage.setItem('snapcheat_token', data.token);
          localStorage.setItem('snapcheat_user', JSON.stringify(data.user));
          onLoginSuccess(data.user);
        } else {
          setError(data.error || 'Gagal masuk dengan Google');
        }
      } catch (err) {
        setError('Gagal menghubungi server backend.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('Autentikasi Google dibatalkan atau gagal.')
  });

  return (
      <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-gradient-to-br from-[#2FA084]/20 via-[#fafafa] to-[#2FA084]/10 selection:bg-[#2FA084] selection:text-white font-sans text-[#171717]">
      
      {/* Background Ornaments (Glassmorphism blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2FA084]/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2FA084]/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-8 z-20">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#171717] hover:text-[#2FA084] transition-colors font-medium text-sm cursor-pointer w-fit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Beranda
        </button>
      </div>

      {/* Auth Card Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full mt-10 md:mt-0">
        
        {/* Logo Centered Above Card */}
        <div className="flex items-center justify-center gap-1.5 mb-10 w-full">
          <img src="/Snapcheat-logo.svg" alt="SnapCheat" className="h-8 w-auto object-contain" />
          <span className="text-2xl font-bold font-heading tracking-normal text-[#171717]">
            Snapcheat
          </span>
        </div>

        <div className="bg-white w-full max-w-[460px] rounded-[2rem] border border-[#eaeaea] p-10 md:p-12">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#171717] font-heading mb-2 tracking-normal">
              {type === 'login' ? 'Selamat Datang!' : 'Buat Akun Baru'}
            </h2>
            <p className="text-base text-[#666666]">
              {type === 'login' ? 'Kami merindukanmu! Silakan masukkan data dirimu.' : 'Mulai perjalanan belajar cerdasmu hari ini.'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center font-medium border border-red-100 animate-[fadeIn_0.3s_ease-out]">
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="bg-[#2FA084]/10 text-[#2FA084] p-3 rounded-xl text-sm text-center font-medium border border-[#2FA084]/20 animate-[fadeIn_0.3s_ease-out]">
                {successMsg}
              </div>
            )}

            {type === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1.5 ml-1">Nama Lengkap</label>
                <input 
                  name="name" type="text" required value={formData.name} onChange={handleChange} 
                  className="w-full px-5 py-3.5 bg-white border border-[#eaeaea] rounded-2xl text-sm text-[#171717] placeholder-[#a3a3a3] focus:outline-none focus:border-[#2FA084] focus:ring-1 focus:ring-[#2FA084] transition-all" 
                  placeholder="Masukkan nama" 
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5 ml-1">Email</label>
              <input 
                name="email" type="email" required value={formData.email} onChange={handleChange} 
                className="w-full px-5 py-3.5 bg-white border border-[#eaeaea] rounded-2xl text-sm text-[#171717] placeholder-[#a3a3a3] focus:outline-none focus:border-[#2FA084] focus:ring-1 focus:ring-[#2FA084] transition-all" 
                placeholder="Masukkan email" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1.5 ml-1">Password</label>
              <div className="relative">
                <input 
                  name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} 
                  className="w-full px-5 py-3.5 bg-white border border-[#eaeaea] rounded-2xl text-sm text-[#171717] placeholder-[#a3a3a3] focus:outline-none focus:border-[#2FA084] focus:ring-1 focus:ring-[#2FA084] transition-all" 
                  placeholder="Masukkan password" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a3a3a3] hover:text-[#666666] transition-colors cursor-pointer">
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </button>
              </div>
            </div>

            {type === 'login' && (
              <div className="flex items-center justify-between mt-2">
                <div className="relative flex items-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    className="peer appearance-none w-[18px] h-[18px] border border-[#d4d4d4] rounded-[5px] bg-white checked:bg-[#2FA084] checked:border-[#2FA084] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2FA084]/30 cursor-pointer transition-all duration-200" 
                  />
                  <svg 
                    className="absolute left-0 w-[18px] h-[18px] p-[3px] text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <label htmlFor="remember-me" className="ml-2.5 block text-xs font-medium text-[#666666] cursor-pointer hover:text-[#171717] transition-colors">Ingat saya</label>
                </div>
                <div className="text-xs">
                  <a href="#" className="font-semibold text-[#2FA084] hover:text-[#258069] transition-colors">Lupa password?</a>
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full py-3.5 px-4 mt-4 rounded-2xl shadow-sm text-sm font-semibold text-white bg-[#2FA084] hover:bg-[#258069] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2FA084] disabled:opacity-50 transition-colors cursor-pointer">
              {isLoading ? 'Memproses...' : type === 'login' ? 'Masuk' : 'Daftar Sekarang'}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#eaeaea]"></div></div>
              <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-[#a3a3a3]">atau lanjutkan dengan</span></div>
            </div>

            <button onClick={() => loginWithGoogle()} type="button" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-[#eaeaea] rounded-2xl bg-white text-sm font-medium text-[#171717] hover:bg-[#fafafa] transition-colors cursor-pointer disabled:opacity-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
              Masuk dengan Google
            </button>

          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#666666]">
              {type === 'login' ? "Belum punya akun? " : "Sudah punya akun? "}
              <Link 
                to={type === 'login' ? '/register' : '/login'}
                onClick={() => {
                  setError('');
                  setSuccessMsg('');
                }} 
                className="font-semibold text-[#2FA084] hover:text-[#258069] cursor-pointer"
              >
                {type === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthPage = (props) => {
  return (
    <GoogleOAuthProvider clientId="610668316856-dqa8k118pdncpapi866un6om1jkqh8ip.apps.googleusercontent.com">
      <AuthPageContent {...props} />
    </GoogleOAuthProvider>
  );
};

export default AuthPage;
