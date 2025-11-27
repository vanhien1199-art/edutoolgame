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
    if (savedKey) {
        setLicenseInput(savedKey);
        setIsVerified(true);
    }
  }, []);

  // --- XỬ LÝ KÍCH HOẠT (CHỈ ĐỂ MỞ KHÓA UI) ---
  const handleVerifyLicense = async (e: React.FormEvent) => {
    if(e) e.preventDefault();
    setVerifying(true);
    setLicenseError('');

    // Ở phương án 2, việc kiểm tra kỹ và trừ tiền sẽ nằm ở bước Tạo Game.
    // Bước này chỉ để kiểm tra format sơ bộ hoặc cho phép nhập mã.
    try {
        if (!licenseInput.trim()) {
            setLicenseError('Vui lòng nhập mã.');
            setVerifying(false);
            return;
        }

        // Tạm thời cho phép qua bước này để mở khóa nút bấm.
        // Server sẽ từ chối sau nếu mã sai/hết tiền.
        setTimeout(() => {
            setIsVerified(true);
            localStorage.setItem('app_license_key', licenseInput);
            setVerifying(false);
        }, 500);

    } catch (err) {
      setLicenseError('Lỗi hệ thống.');
      setVerifying(false);
    }
  };

  // --- LOGIC TẠO GAME (GỌI SERVER ĐỂ TRỪ TIỀN & TẠO) ---
  const handleGenerate = async () => {
    if (!config.lessonName) return;

    // Bắt buộc phải có mã mới cho tạo
    if (!licenseInput) {
        alert("Vui lòng nhập mã kích hoạt!");
        return;
    }

    setLoading(true);
    try {
      // GỌI SERVER: Truyền config + licenseKey để server xử lý
      const data = await generateGameContent(config, licenseInput);
      
      setContent(data);
      setStep('review');
      
      // Thông báo nhỏ (Tùy chọn)
      if (licenseInput !== 'DEMO-2025') {
          console.log("Đã trừ 1 lượt sử dụng.");
      }
    } catch (error) {
      // Hiển thị lỗi từ Server trả về (VD: Hết tiền, Mã sai)
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC TẢI GAME ---
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

  // --- LOGIC SỬA CÂU HỎI ---
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
              
              {/* TRUYỀN PROPS LICENSE XUỐNG GAMEFORM */}
              <GameForm
                config={config}
                onChange={(key, val) => setConfig(prev => ({ ...prev, [key]: val }))}
                onSubmit={handleGenerate}
                isLoading={loading}
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
