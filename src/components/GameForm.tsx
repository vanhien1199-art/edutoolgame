import React, { useEffect } from 'react';
import { GameConfig, GameType } from '../types';
import { BookOpen, Gamepad2, BrainCircuit, ListOrdered, MousePointerClick, Puzzle, Trophy } from 'lucide-react';

interface GameFormProps {
  config: GameConfig;
  onChange: (key: keyof GameConfig, value: string | number) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const GameForm: React.FC<GameFormProps> = ({ config, onChange, onSubmit, isLoading }) => {

  // Enforce game type logic based on activity
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

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {config.activityType === 'warmup' ? 'Loại Trò Chơi (Tự động chọn cho Khởi động)' : 'Chọn Loại Trò Chơi'}
          </label>
          
          {config.activityType === 'warmup' ? (
            <div className="border-2 border-blue-500 bg-blue-50 p-4 rounded-xl flex items-center gap-4 text-blue-700">
               <BrainCircuit size={32} />
               <div>
                 <h4 className="font-bold">Mô Phỏng Tương Tác (Simulation)</h4>
                 <p className="text-sm">Học sinh thao tác trực tiếp (kéo thả, phân loại) để khám phá bài học.</p>
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

        <button
          onClick={onSubmit}
          disabled={!config.lessonName || isLoading}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all ${
            !config.lessonName || isLoading
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI đang nghiên cứu bài học...
            </>
          ) : (
            <>
              <Gamepad2 className="w-6 h-6" />
              Tạo Trò Chơi
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GameForm;