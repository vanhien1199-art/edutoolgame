import React, { useState, useEffect } from 'react';
import { GameConfig, GeneratedContent, QuestionItem } from './types';
import { generateGameContent } from './services/gemini';
import { generateStandaloneHTML } from './utils/exportUtils';
import GameForm from './components/GameForm';
import Footer from './components/Footer';
import { 
  Download, Edit3, ArrowLeft, BrainCircuit, Target, Package, Grid3X3, Zap, 
  Home, ShieldCheck 
} from 'lucide-react';

const App: React.FC = () => {
  // --- STATE QUẢN LÝ LICENSE ---
  const [isVerified, setIsVerified] = useState(false);
  const [licenseInput, setLicenseInput] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const [verifying, setVerifying] = useState(false);

  // --- STATE QUẢN LÝ APP ---
  const [step, setStep] = useState<'setup' | 'review'>('setup');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<GameConfig>({
    bookSeries: 'Kết nối tri thức với cuộc sống',
    subject: 'Toán học',
    grade: '5',
    lessonName: '',
    activityType: 'practice',
    gameType: 'quiz',
    questionCount: 6,
  });

  const [content, setContent] = useState<GeneratedContent | null>(null);

  // --- CHECK LICENSE TỪ LOCALSTORAGE ---
  useEffect(() => {
    const savedKey = localStorage.getItem('app_license_key');
    if (savedKey) setIsVerified(true);
  }, []);

  // --- XỬ LÝ VERIFY LICENSE ---
  const handleVerifyLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setLicenseError('');

    // Logic kiểm tra mã (Demo code)
    // Trong thực tế bạn sẽ gọi API ở đây
    try {
      if (licenseInput.trim().toUpperCase() === 'DEMO-2025') {
         // Giả lập delay mạng
         setTimeout(() => {
             setIsVerified(true);
             localStorage.setItem('app_license_key', licenseInput);
         }, 1000);
      } else {
         // Nếu có backend thật thì uncomment đoạn dưới:
         /*
         const response = await fetch('/verify-license', {
            method: 'POST',
            body: JSON.stringify({ licenseKey: licenseInput })
         });
         const data = await response.json();
         if(data.valid) ...
         */
         setLicenseError('Mã kích hoạt không đúng. Vui lòng thử lại.');
         setVerifying(false);
      }
    } catch (err) {
      setLicenseError('Lỗi kết nối.');
      setVerifying(false);
    }
  };

  const handleGenerate = async () => {
    if (!config.lessonName) return;
    setLoading(true);
    try {
      const data = await generateGameContent(config);
      setContent(data);
      setStep('review');
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!content) return;
    const html = generateStandaloneHTML(content, config.gameType);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Game_${config.subject}_Bai${config.lessonName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpdateQuestion = (index: number, field: keyof QuestionItem, value: any) => {
    if (!content) return;
    const newQuestions = [...content.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setContent({ ...content, questions: newQuestions });
  };

  const goHome = () => {
    setStep('setup');
    setContent(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
                <BrainCircuit size={24} />
              </div>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight hidden md:block">EduGame<span className="text-blue-600">AI</span></span>
           </div>

           <div className="flex items-center gap-4">
              {step === 'review' && (
                 <button onClick={goHome} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition font-medium text-sm">
                    <Home size={18} /> Trang chủ
                 </button>
              )}
              {isVerified && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                     <ShieldCheck size={14} /> PRO LICENSE
                  </div>
              )}
           </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow py-8 px-4 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="max-w-5xl mx-auto">
          {step === 'setup' && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                  Game Creator AI
                </h1>
                <p className="text-slate-600 text-lg">Tạo trò chơi tương tác thông minh</p>
              </div>
              
              {/* === PHẦN QUAN TRỌNG NHẤT: TRUYỀN PROPS LICENSE XUỐNG === */}
              <GameForm
                config={config}
                onChange={(key, val) => setConfig(prev => ({ ...prev, [key]: val }))}
                onSubmit={handleGenerate}
                isLoading={loading}
                // Các dòng này sẽ kích hoạt hiển thị khung nhập trong GameForm
                isVerified={isVerified}
                onVerify={handleVerifyLicense}
                licenseInput={licenseInput}
                setLicenseInput={setLicenseInput}
                licenseError={licenseError}
                verifying={verifying}
              />
            </div>
          )}

          {step === 'review' && content && (
             <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-100">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{content.title}</h2>
                            <p className="text-slate-500">{content.description}</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setStep('setup')} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                                <ArrowLeft size={18} /> Quay lại
                            </button>
                            <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition">
                                <Download size={20} /> Tải Game
                            </button>
                        </div>
                    </div>
                    
                    {/* Phần Review nội dung giữ nguyên */}
                    <div className="space-y-6">
                        {content.questions.map((q, idx) => (
                            <div key={q.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition">
                                <div className="flex items-start gap-4">
                                    <span className="bg-blue-100 text-blue-700 font-bold w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0">
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1 space-y-3">
                                        <input
                                            className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 outline-none font-medium"
                                            value={q.question}
                                            onChange={(e) => handleUpdateQuestion(idx, 'question', e.target.value)}
                                        />
                                        
                                        {(config.gameType === 'quiz' || config.gameType === 'fast_quiz') && q.options && (
                                           <div className="grid grid-cols-2 gap-3">
                                              {q.options.map((opt, oi) => (
                                                <div key={oi} className="p-2 border rounded text-sm bg-white border-slate-200">{opt}</div>
                                              ))}
                                           </div>
                                        )}
                                        {/* Bạn có thể bổ sung phần hiển thị chi tiết các game khác tại đây nếu cần */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
