import React from 'react';

const Settings = ({ user }) => {
  return (
    <div className="max-w-3xl mx-auto animate-[fadeIn_0.3s_ease-out] mt-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8 px-2">
        <div className="w-24 h-24 rounded-full bg-[#2FA084]/10 text-[#2FA084] text-3xl font-bold flex items-center justify-center border-4 border-white shadow-sm shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3 className="text-2xl font-bold font-heading text-[#171717]">{user?.name || 'Sobat SnapCheat'}</h3>
          <p className="text-[#666666] text-sm mb-4 mt-1">{user?.email || 'email@example.com'}</p>
          <button className="bg-white border-2 border-[#eaeaea] text-[#171717] hover:border-[#d4d4d4] px-5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer">
            Ganti Foto Profil
          </button>
        </div>
      </div>

      <div className="border-t border-[#eaeaea] mb-8"></div>

      {/* Form Section */}
      <div className="space-y-6 max-w-2xl px-2">
        <div>
          <label className="block text-sm font-bold text-[#171717] mb-2">Nama Lengkap</label>
          <input 
            type="text" 
            defaultValue={user?.name || ''}
            className="w-full bg-white border-2 border-[#eaeaea] text-[#171717] px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#2FA084] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#171717] mb-2">Email</label>
          <input 
            type="email" 
            disabled
            defaultValue={user?.email || ''}
            className="w-full bg-[#f5f5f5] border-2 border-[#eaeaea] text-[#a3a3a3] px-4 py-3.5 rounded-xl cursor-not-allowed"
          />
          <p className="text-xs text-[#a3a3a3] mt-2">Email Anda sudah diverifikasi dan digunakan sebagai identitas utama login.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-[#171717] mb-2">Kata Sandi Baru</label>
          <input 
            type="password" 
            placeholder="Masukkan kata sandi baru (minimal 8 karakter)"
            className="w-full bg-white border-2 border-[#eaeaea] text-[#171717] px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#2FA084] transition-colors"
          />
        </div>
        
        <div className="pt-6">
          <button className="bg-[#171717] hover:bg-[#333333] text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-colors cursor-pointer w-full md:w-auto">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
