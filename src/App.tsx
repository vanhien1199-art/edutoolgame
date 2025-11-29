import React, { useState } from 'react'; // Bỏ useEffect vì không còn dùng để check key
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

  // --- ĐÃ XÓA: useEffect kiểm tra localStorage ---
  // (Giờ đây mỗi lần F5, isVerified sẽ mặc định là false -> Hiện khung nhập)

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

        // Chỉ mở khóa giao diện tạm thời
        setTimeout(() => {
            setIsVerified(true);
            // ĐÃ XÓA: dòng localStorage.setItem(...) -> Không lưu mã vào máy nữa
            setVerifying(false);
        }, 500);

    } catch (err) {
      setLicenseError('Lỗi hệ thống.');
      setVerifying(false);
    }
  };

  // --- LOGIC TẠO GAME (GỌI SERVER) ---
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
      
      if (licenseInput !== 'DEMO-2025') {
          console.log("Tạo thành công. Đã trừ 1 lượt.");
      }
    } catch (error) {
      // Nếu mã sai hoặc hết tiền, Server báo lỗi -> Khóa lại ngay
      alert((error as Error).message);
      setIsVerified(false); 
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
           <a 
             href="https://genedu.pages.dev/" 
             className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
           >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-
