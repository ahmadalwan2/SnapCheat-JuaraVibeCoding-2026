import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const navigate = useNavigate();
  const [materialText, setMaterialText] = useState(() => {
    return localStorage.getItem('snapcheat_quiz_cached_material') || '';
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState(() => {
    const cached = localStorage.getItem('snapcheat_quiz_cached_questions');
    return cached ? JSON.parse(cached) : null;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleStartQuiz = async () => {
    if (!materialText.trim()) {
      setErrorMsg('Silakan masukkan materi pelajaran Anda untuk membuat kuis.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');
    setQuestions(null);
    localStorage.removeItem('snapcheat_quiz_cached_questions');
    setCurrentIndex(0);
    setUserAnswer('');
    setIsChecked(false);
    setScore(0);
    setQuizFinished(false);

    try {
      const response = await fetch(`${API_URL}/api/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text_content: materialText })
      });

      const data = await response.json();

      if (response.ok && data.flashcards) {
        setQuestions(data.flashcards);
        localStorage.setItem('snapcheat_quiz_cached_questions', JSON.stringify(data.flashcards));
      } else {
        setErrorMsg(data.error || "Gagal membuat kuis. Silakan coba lagi.");
      }
    } catch (error) {
      setErrorMsg("Gagal terhubung dengan server AI. Pastikan backend aktif.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckAnswer = () => {
    if (!userAnswer.trim()) return;
    setIsChecked(true);
  };

  const handleSelfGrade = (isCorrect) => {
    const nextScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setIsChecked(false);
    } else {
      setQuizFinished(true);
      const percentage = Math.round((nextScore / questions.length) * 100);
      localStorage.setItem('snapcheat_last_quiz_score', `${percentage}%`);
    }
  };

  const handleResetQuiz = () => {
    setQuestions(null);
    setMaterialText('');
    setQuizFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out] px-4 md:px-0">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold font-heading text-[#171717]">Uji Pemahaman AI (Kuis)</h2>
        <p className="text-sm text-[#666666] mt-1">
          Latih kemampuan ingatan aktif (*Active Recall*) Anda. Jawab pertanyaan, lalu bandingkan jawaban Anda dengan penjelasan AI.
        </p>
      </div>

      {!questions ? (
        /* INPUT STATE */
        <div className="bg-white border-2 border-[#eaeaea] p-8 rounded-[2rem] space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#2FA084]/10 text-[#2FA084] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-[#171717] font-heading">Buat Simulasi Ujian Mandiri</h3>
            <p className="text-sm text-[#666666] max-w-md mx-auto">
              AI kami akan mengekstrak poin penting materi Anda menjadi pertanyaan esai untuk menguji kedalaman ingatan Anda.
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              value={materialText}
              onChange={(e) => {
                const val = e.target.value;
                setMaterialText(val);
                localStorage.setItem('snapcheat_quiz_cached_material', val);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Tempel catatan kuliah atau materi pelajaran di sini..."
              className="w-full h-44 p-4 bg-[#fafafa] border border-[#eaeaea] rounded-2xl text-sm text-[#171717] placeholder-[#a3a3a3] focus:outline-none focus:border-[#2FA084] focus:ring-1 focus:ring-[#2FA084] transition-colors resize-none leading-relaxed"
            ></textarea>

            {errorMsg && (
              <div className="bg-red-50 text-red-500 border border-red-100 p-3.5 rounded-xl text-xs font-semibold text-center">
                {errorMsg}
              </div>
            )}

            <button
              onClick={handleStartQuiz}
              disabled={isGenerating}
              className="w-full py-4 bg-[#2FA084] hover:bg-[#258069] disabled:opacity-50 text-white font-semibold rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyusun Soal Ujian...
                </>
              ) : (
                "Mulai Kuis Sekarang"
              )}
            </button>
          </div>
        </div>
      ) : quizFinished ? (
        /* SCORE/RESULT STATE */
        <div className="bg-gradient-to-br from-[#171717] to-[#333333] text-white p-12 rounded-[2rem] text-center max-w-xl mx-auto space-y-6 relative overflow-hidden border-2 border-[#eaeaea]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2FA084]/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20 backdrop-blur-sm">
            <span className="text-3xl">🎓</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-heading text-white">Kuis Selesai!</h3>
            <p className="text-[#a8e6d5] text-sm font-medium">Hasil performa belajar Anda telah dihitung</p>
          </div>

          <div className="py-6 bg-white/5 border border-white/10 rounded-2xl max-w-xs mx-auto">
            <span className="text-xs text-white/50 uppercase tracking-widest block font-bold mb-1">Skor Pemahaman</span>
            <span className="text-5xl font-black text-[#a8e6d5] font-heading">
              {Math.round((score / questions.length) * 100)}%
            </span>
            <span className="block text-xs text-white/60 mt-2 font-medium">
              Menjawab benar {score} dari {questions.length} soal
            </span>
          </div>

          <p className="text-white/70 text-sm max-w-sm mx-auto leading-relaxed">
            {score === questions.length 
              ? "Luar biasa! Pemahaman Anda terhadap materi ini sangat sempurna! ✨ Keep it up!" 
              : "Kerja bagus! Lakukan kuis secara berkala untuk memperkuat memori jangka panjang."}
          </p>

          <div className="flex gap-4 max-w-md mx-auto pt-4">
            <button
              onClick={handleResetQuiz}
              className="flex-1 py-3 bg-[#2FA084] hover:bg-[#258069] text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Ulangi Kuis
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/10 transition-colors cursor-pointer"
            >
              Ke Beranda
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE QUIZ STATE */
        <div className="bg-white border-2 border-[#eaeaea] p-8 rounded-[2rem] max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#eaeaea]">
            <span className="text-xs font-bold tracking-widest text-[#2FA084] uppercase bg-[#2FA084]/10 px-3 py-1 rounded-full">
              Pertanyaan {currentIndex + 1} dari {questions.length}
            </span>
            <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#2FA084] h-1.5 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#171717] font-heading leading-relaxed">
              {questions[currentIndex].question}
            </h3>

            {!isChecked ? (
              <div className="space-y-4">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Ketik jawaban Anda secara detail di sini..."
                  className="w-full h-32 p-4 bg-[#fafafa] border border-[#eaeaea] rounded-2xl text-sm text-[#171717] placeholder-[#a3a3a3] focus:outline-none focus:border-[#2FA084] transition-colors resize-none leading-relaxed"
                ></textarea>
                <button
                  onClick={handleCheckAnswer}
                  disabled={!userAnswer.trim()}
                  className="w-full py-3.5 bg-[#171717] hover:bg-[#333333] disabled:opacity-50 text-white font-semibold rounded-2xl text-sm transition-colors cursor-pointer"
                >
                  Periksa Jawaban
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#fafafa] border border-[#eaeaea] p-5 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">Jawaban Anda:</span>
                    <p className="text-sm text-[#171717] leading-relaxed italic">"{userAnswer}"</p>
                  </div>
                  <div className="bg-[#2FA084]/5 border border-[#2FA084]/20 p-5 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold text-[#2FA084] uppercase tracking-wider block">Jawaban Benar (AI):</span>
                    <p className="text-sm text-[#171717] leading-relaxed font-medium">{questions[currentIndex].answer}</p>
                  </div>
                </div>

                {/* Self Evaluation Banner */}
                <div className="bg-[#fafafa] border border-[#eaeaea] p-6 rounded-2xl text-center space-y-4">
                  <h4 className="text-sm font-bold text-[#171717] font-heading">Apakah jawaban Anda mendekati kebenaran?</h4>
                  <div className="flex gap-4 max-w-xs mx-auto">
                    <button
                      onClick={() => handleSelfGrade(true)}
                      className="flex-1 py-2.5 bg-[#2FA084] hover:bg-[#258069] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      👍 Ya, Benar
                    </button>
                    <button
                      onClick={() => handleSelfGrade(false)}
                      className="flex-1 py-2.5 bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      👎 Kurang Tepat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
