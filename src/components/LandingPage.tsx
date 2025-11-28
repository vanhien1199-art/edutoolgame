import React from 'react';
import { 
  Rocket, BrainCircuit, BookOpen, CheckCircle, 
  ArrowRight, Users, Star, Zap 
} from 'lucide-react';
import Footer from './Footer';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      {/* --- HERO SECTION --- */}
      <header className="relative overflow-hidden bg-slate-900 pt-16 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           {/* Background Pattern giả lập */}
           <div className="absolute right-0 top-0 bg-blue-500 w-96 h-96 blur-3xl rounded-full mix-blend-multiply"></div>
           <div className="absolute left-0 bottom-0 bg-purple-500 w-96 h-96 blur-3xl rounded-full mix-blend-multiply"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 text-sm font-medium mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Hỗ trợ chương trình GDPT 2018
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Soạn Bài Giảng Tương Tác <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Chỉ Trong 30 Giây
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10">
            Công cụ AI hỗ trợ giáo viên biến nội dung sách giáo khoa thành các trò chơi giáo dục hấp dẫn: Trắc nghiệm, Ô chữ, Hộp bí mật và hơn thế nữa.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={onStart}
              className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-500 transition shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
            >
              <Rocket size={24} />
              Bắt Đầu Tạo Ngay
            </button>
            <button className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-slate-300 bg-slate-800 rounded-full hover:bg-slate-700 transition">
              <BookOpen size={24} />
              Xem Hướng Dẫn
            </button>
          </div>
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Tại sao chọn EduGame AI?</h2>
            <p className="text-slate-500">Giải pháp toàn diện cho lớp học hiện đại</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">AI Thông Minh</h3>
              <p className="text-slate-500 leading-relaxed">
                Tự động phân tích tên bài học và tạo ra nội dung chính xác, phù hợp với lứa tuổi học sinh mà không cần soạn thảo thủ công.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Tốc Độ Siêu Nhanh</h3>
              <p className="text-slate-500 leading-relaxed">
                Tiết kiệm hàng giờ soạn bài. Chỉ cần nhập tên bài, chọn loại game và nhận kết quả ngay lập tức để tải về máy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Tương Tác Cao</h3>
              <p className="text-slate-500 leading-relaxed">
                Hơn 10 loại trò chơi: Vòng quay may mắn, Lật mảnh ghép, Hộp bí mật... giúp khuấy động không khí lớp học.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">Quy Trình 3 Bước Đơn Giản</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
             {/* Đường nối (chỉ hiện trên desktop) */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2"></div>

             {[
                { step: "01", title: "Nhập Thông Tin", desc: "Chọn môn, lớp và tên bài học." },
                { step: "02", title: "AI Xử Lý", desc: "Hệ thống tự động tạo câu hỏi." },
                { step: "03", title: "Tải Về & Dạy", desc: "Nhận file HTML game chơi ngay." }
             ].map((item, idx) => (
               <div key={idx} className="bg-white p-6 text-center">
                  <div className="w-16 h-16 bg-slate-900 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- TRUST BADGE --- */}
      <section className="py-12 bg-slate-900 border-t border-slate-800 text-center">
         <p className="text-slate-400 text-sm mb-6 uppercase tracking-wider">Được tin dùng bởi giáo viên trên cả nước</p>
         <div className="flex justify-center gap-8 text-slate-500 opacity-50 grayscale">
            {/* Giả lập logo các trường/tổ chức */}
            <div className="flex items-center gap-2"><Star/> TRƯỜNG THPT A</div>
            <div className="flex items-center gap-2"><Star/> TRƯỜNG THCS B</div>
            <div className="flex items-center gap-2"><Star/> TRUNG TÂM C</div>
         </div>
      </section>

      {/* Reuse Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
