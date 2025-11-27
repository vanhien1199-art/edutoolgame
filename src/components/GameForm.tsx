import React, { useEffect } from 'react';
import { GameConfig, GameType } from '../types';
import { 
  BookOpen, Gamepad2, BrainCircuit, ListOrdered, Zap, 
  Grid3X3, Package, Target, KeyRound, Lock, ShieldCheck 
} from 'lucide-react';

interface GameFormProps {
  config: GameConfig;
  onChange: (key: keyof GameConfig, value: string | number) => void;
  onSubmit: () => void;
  isLoading: boolean;
  // --- Props mới để xử lý License ---
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

  // Tự động chuyển loại game hợp lệ khi đổi chế độ (Warmup <-> Practice)
  useEffect(() => {
    if (config.activityType === 'warmup') {
      const validWarmups = ['simulation', 'fast_quiz', 'comparison', 'number_grid', 'keyword_guess', 'mystery_box'];
      if (!validWarmups.includes(config.gameType)) {
        onChange('gameType', 'fast_quiz');
      }
    } else if (config.activityType === 'practice') {
      const validPractice = ['quiz', 'matching', 'sequencing', 'wheel'];
      if (!validPractice.includes(config.gameType)) {
        onChange('gameType', 'quiz');
      }
    }
  }, [config.activityType, onChange, config.gameType]);

  // Danh sách game Luyện tập
  const practiceGames: {id: GameType, name: string, icon: React.ReactNode}[] = [
    { id: 'quiz', name: 'Trắc nghiệm', icon: <div className="text-2xl">❓</div> },
    { id: 'matching', name: 'Ghép đôi', icon: <div className="text-2xl">🧩</div> },
    { id: 'sequencing', name: 'Sắp xếp', icon: <ListOrdered size={24} /> },
    { id: 'wheel', name: 'Vòng quay', icon: <div className="text-2xl">🎡</div> },
  ];

  // Danh sách game Khởi động
  const warmupGames: {id: GameType, name: string, desc: string, icon: React.ReactNode}[] = [
    { id: 'fast_quiz', name: 'Kahoot / Quizizz', desc: 'Trắc nghiệm nhanh tranh điểm', icon: <Zap size={24} className="text-yellow-500"/> },
    { id: 'comparison', name: 'Điểm chung - Khác', desc: 'So sánh 2 khái niệm/hình ảnh', icon: <div className="text-2xl">⚖️</div> },
    { id: 'number_grid', name: 'Chọn ô số', desc: '9 ô số bí mật gợi mở bài học', icon: <Grid3X3 size={24} className="text-blue-500"/> },
    { id: 'keyword_guess', name: 'Bắn tên (3 từ khóa)', desc: 'Đoán nội dung từ các từ khóa', icon: <Target size={24} className="text-red-500"/> },
    { id: 'mystery_box', name: 'Hộp bí mật', desc: 'Đoán vật trong hộp qua dữ kiện', icon: <Package size={24} className="text-purple-500"/> },
    { id: 'simulation', name: 'Mô phỏng tương tác', desc: 'Kéo thả, thao tác vật thể', icon: <BrainCircuit size={24} className="text-green-500"/> },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl animate-fade-in-up">
      {/* HEADER FORM */}
      <div className="text-center mb-8">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Thiết Lập Bài Giảng AI</h2>
        <p className="text-slate-500">Tự động tìm kiếm nội dung SGK & tạo trò chơi</p>
      </div>

      <div className="space-y-6">
        {/* HÀNG 1: BỘ SÁCH & MÔN HỌC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bộ Sách</label>
            <select
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={config.bookSeries}
              onChange={(e) => onChange('bookSeries', e.target.value)}
            >
              <option value="Kết nối tri thức với cuộc sống">Kết nối tri thức</option>
              <option value="Cánh Diều">Cánh Diều</option>
              <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
              <option value="Cùng học để phát triển năng lực">Cùng học phát triển năng lực</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Môn Học</label>
            <select
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={config.subject}
              onChange={(e) => onChange('subject', e.target.value)}
            >
              <optgroup label="Môn Chính">
                <option value="Toán học">Toán học</option>
                <option value="Tiếng Việt">Tiếng Việt (Tiểu học)</option>
                <option value="Ngữ văn">Ngữ văn (THCS/THPT)</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
              </optgroup>
              <optgroup label="Khoa học & Xã hội">
                <option value="Tự nhiên và Xã hội">Tự nhiên và Xã hội (Lớp 1-3)</option>
                <option value="Khoa học">Khoa học (Lớp 4-5)</option>
                <option value="Khoa học tự nhiên">Khoa học tự nhiên (Lý-Hóa-Sinh)</option>
                <option value="Vật lí">Vật lí</option>
                <option value="Hóa học">Hóa học</option>
                <option value="Sinh học">Sinh học</option>
                <option value="Lịch sử và Địa lí">Lịch sử và Địa lí</option>
                <option value="Lịch sử">Lịch sử</option>
                <option value="Địa lí">Địa lí</option>
              </optgroup>
              <optgroup label="Giáo dục công dân & Kỹ năng">
                <option value="Đạo đức">Đạo đức (Tiểu học)</option>
                <option value="Giáo dục công dân">Giáo dục công dân (THCS)</option>
                <option value="Giáo dục Kinh tế và Pháp luật">GD Kinh tế & Pháp luật (THPT)</option>
                <option value="Hoạt động trải nghiệm">Hoạt động trải nghiệm</option>
              </optgroup>
              <optgroup label="Công nghệ & Nghệ thuật">
                <option value="Tin học">Tin học</option>
                <option value="Công nghệ">Công nghệ</option>
                <option value="Âm nhạc">Âm nhạc</option>
                <option value="Mĩ thuật">Mĩ thuật</option>
                <option value="Giáo dục thể chất">Giáo dục thể chất</option>
                <option value="Giáo dục Quốc phòng và An ninh">GD Quốc phòng & An ninh</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* HÀNG 2: LỚP, HOẠT ĐỘNG, SỐ CÂU */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Lớp</label>
            <select
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={config.activityType}
              onChange={(e) => onChange('activityType', e.target.value as any)}
            >
              <option value="warmup">Khởi động (Warm-up)</option>
              <option value="practice">Luyện tập (Practice)</option>
            </select>
          </div>
           <div className={`md:col-span-1 transition-opacity duration-300 ${config.activityType === 'practice' ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                <label className="block text-sm font-medium text-slate-700 mb-2">Số câu hỏi</label>
                <select
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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

        {/* HÀNG 3: TÊN BÀI HỌC */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tên Bài Học</label>
          <input
            type="text"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Ví dụ: Phân số, Lực đẩy Archimedes, ..."
            value={config.lessonName}
            onChange={(e) => onChange('lessonName', e.target.value)}
          />
        </div>

        {/* HÀNG 4: CHỌN GAME */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {config.activityType === 'warmup' ? 'Chọn Game Khởi Động' : 'Chọn Game Luyện Tập'}
          </label>
          
          {config.activityType === 'warmup' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {warmupGames.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      config.gameType === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                    onClick={() => onChange('gameType', type.id)}
                  >
                    <div className="mt-1 flex-shrink-0">{type.icon}</div>
                    <div>
                      <div className="font-bold">{type.name}</div>
                      <div className="text-xs opacity-75">{type.desc}</div>
                    </div>
                  </button>
               ))}
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

        {/* --- KHUNG KÍCH HOẠT LICENSE (HIỂN THỊ NẾU CHƯA VERIFIED) --- */}
        {!isVerified && (
          <div className="bg-slate-50 border-2 border-orange-100 p-6 rounded-xl mb-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Lock size={100} />
             </div>
             <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold relative z-10">
                <div className="bg-orange-100 p-2 rounded-full">
                   <Lock size={20} className="text-orange-500"/>
                </div>
                <h3>Yêu cầu kích hoạt bản quyền</h3>
             </div>
             <div className="flex flex-col md:flex-row gap-3 relative z-10">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono shadow-sm"
                    placeholder="Nhập mã kích hoạt (VD: DEMO-2025)"
                    value={licenseInput}
                    onChange={(e) => setLicenseInput(e.target.value)}
                  />
                </div>
                <button 
                  onClick={(e) => { e.preventDefault(); onVerify(e); }}
                  disabled={verifying || !licenseInput}
                  className="px-6 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition whitespace-nowrap disabled:opacity-50 shadow-md flex items-center gap-2"
                >
                  {verifying ? 'Đang kiểm tra...' : 'Kích Hoạt'} <ShieldCheck size={18}/>
                </button>
             </div>
             {licenseError && <p className="text-red-500 text-sm mt-2 font-medium flex items-center gap-1">⚠️ {licenseError}</p>}
             <p className="text-xs text-slate-500 mt-3 italic">
               * Bạn cần nhập mã kích hoạt để mở khóa nút tạo trò chơi bên dưới.
             </p>
          </div>
        )}

        {/* --- NÚT TẠO GAME --- */}
        <button
          onClick={onSubmit}
          disabled={!isVerified || !config.lessonName || isLoading}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
            !isVerified || !config.lessonName || isLoading
              ? 'bg-slate-300 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transform hover:-translate-y-0.5'
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
