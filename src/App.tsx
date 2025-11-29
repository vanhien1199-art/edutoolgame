import React, { useState } from 'react'; // Bỏ useEffect vì không dùng nữa
import { GameConfig, GeneratedContent, QuestionItem } from './types';
import { generateGameContent } from './services/gemini';
import { generateStandaloneHTML } from './utils/exportUtils';
import GameForm from './components/GameForm';
import Footer from './components/Footer';
import { 
  Download, Edit3, ArrowLeft, BrainCircuit, 
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

  // --- ĐÃ XÓA: useEffect kiểm tra localStorage ---
  // (Giúp trang web luôn ở trạng thái "Chưa kích hoạt" khi tải lại)

  // --- XỬ LÝ VERIFY LICENSE (UI ONLY) ---
  const handleVerifyLicense = async (e: React.FormEvent) => {
    if(e) e.preventDefault();
    setVerifying(true);
    setLicenseError('');

    try {
        if (!licenseInput.trim()) {
            setLicenseError('Vui lòng nhập mã kích hoạt.');
            setVerifying(false);
            return;
        }

        // Chỉ kiểm tra giả lập để mở khóa giao diện
        // Server sẽ kiểm tra thật khi bấm "Tạo Game"
        setTimeout(() => {
            setIsVerified(true);
            // ĐÃ XÓA: localStorage.setItem(...) -> Không lưu mã nữa
            setVerifying(false);
        }, 300);

    } catch (err) {
      setLicenseError('Lỗi hệ thống.');
      setVerifying(false);
    }
  };

  // --- LOGIC TẠO GAME (SERVER SIDE) ---
  const handleGenerate = async () => {
    if (!config.lessonName) return;

    if (!licenseInput) {
        alert("Vui lòng nhập mã kích hoạt!");
        return;
    }

    setLoading(true);
    try {
      // Gọi Server để trừ tiền và tạo nội dung
      const data = await generateGameContent(config, licenseInput);
      
      setContent(data);
      setStep('review');
      
    } catch (error) {
      // Nếu mã sai hoặc hết tiền, Server báo lỗi -> Hiện alert và Reset lại trạng thái
      alert((error as Error).message);
      setIsVerified(false); // Khóa lại nút để bắt nhập lại
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

  const handleUpdateQuestion = (index: number, field: keyof QuestionItem, value: any) => {
    if (!content) return;
    const newQuestions = [...content.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setContent({ ...content, questions: newQuestions });
  };

  const goHome = () => {
    setStep('setup');
    setContent(null);
    // Khi về trang chủ, có thể giữ nguyên trạng thái verified hoặc reset tùy bạn.
    // Hiện tại giữ nguyên để tiện làm tiếp bài khác.
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
              <span className="text-xl font-extrabold text-slate-800 tracking-tight hidden md:block">GenEdu<span className="text-blue-600"></span></span>
           </div>

           <div className="flex items-center gap-4">
              {step === 'review' && (
                 <button onClick={goHome} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition font-medium text-sm">
                    <Home size={18} /> Trang chủ
                 </button>
              )}
              {isVerified && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                     <ShieldCheck size={14} /> ACTIVE SESSION
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
              
              <GameForm
                config={config}
                onChange={(key, val) => setConfig(prev => ({ ...prev, [key]: val }))}
                onSubmit={handleGenerate}
                isLoading={loading}
                // Props truyền xuống
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
                                            placeholder="Nội dung câu hỏi"
                                        />
                                        
                                        {(config.gameType === 'simulation' || config.gameType === 'comparison') && (
                                           <div className="bg-white p-4 rounded border border-blue-100">
                                              {q.simulationConfig && (
                                                <p className="mb-2 text-sm font-bold text-blue-600 flex items-center gap-1"><BrainCircuit size={16}/> Mô phỏng: {q.simulationConfig.backgroundTheme}</p>
                                              )}
                                              <div className="grid grid-cols-2 gap-4">
                                                 <div>
                                                    <p className="text-xs font-bold uppercase text-slate-400">Vật phẩm / Nội dung</p>
                                                    {(q.simulationConfig?.items || q.comparisonConfig?.items)?.map(i => (
                                                       <div key={i.id} className="text-sm p-1 border border-slate-200 mb-1 rounded flex justify-between">
                                                          <span>{i.content}</span>
                                                          <span className="text-xs text-slate-400">
                                                            &rarr; {q.simulationConfig 
                                                                ? q.simulationConfig.zones.find(z => z.id === i.zoneId)?.label 
                                                                : (i as any).belongsTo}
                                                          </span>
                                                       </div>
                                                    ))}
                                                 </div>
                                              </div>
                                           </div>
                                        )}

                                        {(config.gameType === 'quiz' || config.gameType === 'fast_quiz') && q.options && (
                                            <div className="grid grid-cols-2 gap-3">
                                                {q.options.map((opt, optIdx) => (
                                                    <div key={optIdx} className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded-full border ${opt === q.correctAnswer ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}></div>
                                                        <input
                                                            className="flex-1 p-2 text-sm border border-slate-200 rounded focus:border-blue-400 outline-none"
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const newOpts = [...q.options!];
                                                                newOpts[optIdx] = e.target.value;
                                                                handleUpdateQuestion(idx, 'options', newOpts);
                                                                if (opt === q.correctAnswer) handleUpdateQuestion(idx, 'correctAnswer', e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {/* Bạn có thể thêm các view khác (Keyword, Mystery...) tại đây tương tự file cũ */}
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
