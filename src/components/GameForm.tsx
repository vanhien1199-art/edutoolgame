import React, { useEffect } from 'react';
import { GameConfig, GameType } from '../types';
import { BookOpen, Gamepad2, BrainCircuit, ListOrdered, KeyRound, ShieldCheck, Lock } from 'lucide-react';

interface GameFormProps {
  config: GameConfig;
  onChange: (key: keyof GameConfig, value: string | number) => void;
  onSubmit: () => void;
  isLoading: boolean;
  // Các props mới cho License
  isVerified: boolean;
  onVerify: (e: React.FormEvent) => void;
  licenseInput: string;
  setLicenseInput: (val: string) => void;
  licenseError: string;
  verifying: boolean;
}

const GameForm: React.FC<GameFormProps> = ({ 
  config, onChange, onSubmit, isLoading,
  isVerified, onVerify, licenseInput, setLicenseInput, licenseError, verifying
}) => {

  // Logic chọn loại game (giữ nguyên)
  useEffect(() => {
    if (config.activityType === 'warmup' && config.gameType !== 'simulation') {
      onChange('gameType', 'simulation');
    } else if (config.activityType === 'practice' && config.gameType === 'simulation') {
      onChange('gameType', 'quiz');
    }
  }, [config.activityType, onChange, config.gameType]);

  const practiceGames: {id: GameType, name: string, icon: React.ReactNode}[] = [
    { id: 'quiz', name: 'Trắc nghiệm', icon: <div className="text-2xl">❓</div> },
    { id: 'matching', name: 'Ghép đôi', icon: <div className="text-2xl">🧩</div> },
    { id: 'sequencing', name: 'Sắp xếp', icon: <ListOrdered size={24} /> },
    { id: 'wheel', name: 'Vòng quay', icon: <div className="text-2xl">🎡</div> },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Thiết Lập Bài Giảng AI</h2>
        <p className="text-slate-500">Tự động tìm kiếm nội dung SGK & tạo trò chơi</p>
      </div>

      <div className="space-y-6">
        {/* --- CÁC Ô NHẬP LIỆU (Giữ nguyên) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bộ Sách</label>
            <select
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={config.bookSeries}
              onChange={(e) => onChange('bookSeries', e.target.value)}
            >
              <option value="Kết nối tri thức với cuộc sống">Kết nối tri thức</option>
              <option value="Cánh Diều">Cánh Diều</option>
              <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Môn Học</label>
            <select
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={config.subject}
              onChange={(e) => onChange('subject', e.target.value)}
            >
               <option value="Toán học">Toán học</option>
               <option value="Tiếng Việt">Tiếng Việt</option>
               <option value="Tiếng Anh">Tiếng Anh</option>
               <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
               <option value="Lịch sử và Địa lí">Lịch sử và Địa lí</option>
               <option value="Tin học">Tin học</option>
               <option value="Công nghệ">Công nghệ</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Lớp</label>
            <select
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={config.grade}
              onChange={(e) => onChange('grade', e.target.value)}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={`${i + 1}`}>Lớp {i + 1}</option>
              ))}
            </select>
          </div>
           <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Hoạt Động</label>
            <select
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={config.activityType}
              onChange={(e) => onChange('activityType', e.target.value as any)}
            >
              <option value="warmup">Khởi động</option>
              <option value="practice">Luyện tập</option>
            </select>
          </div>
           <div className={`md:col-span-1 ${config.activityType === 'practice' ? '' : 'opacity-50 pointer-events-none'}`}>
                <label className="block text-sm font-medium text-slate-700 mb-2">Số câu hỏi</label>
                <select
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={config.questionCount}
                    onChange={(e) => onChange('questionCount', parseInt(e.target.value, 10))}
                    disabled={config.activityType !== 'practice'}
                >
                    <option value={4}>4 câu</option>
                    <option value={6}>6 câu</option>
                    <option value={8}>8 câu</option>
                    <option value={10}>10 câu</option>
                </select>
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tên Bài Học</label>
          <input
            type="text"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ví dụ: Phân số, ..."
            value={config.lessonName}
            onChange={(e) => onChange('lessonName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Loại Trò Chơi</label>
          {config.activityType === 'warmup' ? (
            <div className="border-2 border-blue-500 bg-blue-50 p-4 rounded-xl flex items-center gap-4 text-blue-700">
               <BrainCircuit size={32} />
               <div>
                 <h4 className="font-bold">Mô Phỏng Tương Tác</h4>
                 <p className="text-sm">Học sinh thao tác trực tiếp để khám phá bài học.</p>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {practiceGames.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    config.gameType === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                  onClick={() => onChange('gameType', type.id)}
                >
                  <span className="mb-2">{type.icon}</span>
                  <span className="font-semibold text-sm">{type.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <hr className="my-6 border-slate-200"/>

        {/* --- KHUNG KÍCH HOẠT LICENSE (NẰM TRÊN NÚT TẠO) --- */}
        {!isVerified && (
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl mb-4">
             <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
                <Lock size={20} className="text-orange-500"/>
                <h3>Yêu cầu kích hoạt</h3>
             </div>
             <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                    placeholder="Nhập mã kích hoạt (VD: DEMO-2025)"
                    value={licenseInput}
                    onChange={(e) => setLicenseInput(e.target.value)}
                  />
                </div>
                <button 
                  onClick={(e) => { e.preventDefault(); onVerify(e); }}
                  disabled={verifying || !licenseInput}
                  className="px-6 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition whitespace-nowrap disabled:opacity-50"
                >
                  {verifying ? 'Đang kiểm tra...' : 'Kích Hoạt'}
                </button>
             </div>
             {licenseError && <p className="text-red-500 text-sm mt-2 font-medium">⚠️ {licenseError}</p>}
             <p className="text-xs text-slate-400 mt-2">Bạn cần nhập mã kích hoạt để mở khóa nút tạo game.</p>
          </div>
        )}

        {/* --- NÚT TẠO GAME --- */}
        <button
          onClick={onSubmit}
          disabled={!isVerified || !config.lessonName || isLoading}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all ${
            !isVerified || !config.lessonName || isLoading
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              AI đang nghiên cứu...
            </>
          ) : (
            <>
              {isVerified ? <Gamepad2 className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              {isVerified ? 'Tạo Trò Chơi Ngay' : 'Vui Lòng Kích Hoạt Để Tạo Game'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GameForm;
