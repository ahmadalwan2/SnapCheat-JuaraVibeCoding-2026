import React, { useState } from 'react';

const HelpCenter = () => {
  const [openFaq, setOpenFaq] = useState(0);

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

  return (
    <div className="max-w-3xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      {/* Header Section for Pusat Bantuan */}
      <div className="text-center mt-6 mb-10 px-4">
        <div className="w-16 h-16 bg-[#2FA084]/10 text-[#2FA084] rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-heading text-[#171717] mb-3">Ada yang bisa kami bantu?</h2>
        <p className="text-[#666666] text-sm max-w-lg mx-auto leading-relaxed">
          Temukan jawaban dari pertanyaan umum seputar fitur dan penggunaan SnapCheat di bawah ini.
        </p>
      </div>

      <div className="space-y-4">
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
  );
};

export default HelpCenter;
