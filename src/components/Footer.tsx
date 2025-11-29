// src/components/Footer.tsx
import React from 'react';
import { Facebook, MessageCircle, Mail, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-12 border-t border-slate-700">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Cột 1: Thông tin bản quyền */}
        <div>
          <h3 className="text-white font-bold text-lg mb-2">GenEdu</h3>
          <p className="text-sm text-slate-400">
            Công cụ hỗ trợ giáo viên soạn bài giảng tương tác thông minh, tiết kiệm thời gian và nâng cao hiệu quả lớp học.
          </p>
          <p className="text-xs text-slate-500 mt-4">
            © {new Date().getFullYear()} Bản quyền thuộc về Genedu.
          </p>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-white font-bold text-lg mb-2">Hỗ Trợ</h3>
          <a href="#" className="hover:text-blue-400 transition mb-1">Hướng dẫn sử dụng</a>
          <a href="#" className="hover:text-blue-400 transition mb-1">Điều khoản dịch vụ</a>
          <a href="#" className="hover:text-blue-400 transition">Chính sách bảo mật</a>
        </div>

        {/* Cột 3: Liên hệ */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Hỗ Trợ Trực Tuyến</h3>
          <div className="flex flex-col gap-4">
            
            {/* Nút Chat Facebook */}
            <a 
              href="https://facebook.com/nung.hien" // <-- Thay link Fanpage của bạn vào đây
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white px-4 py-2 rounded-lg transition w-fit"
            >
              <Facebook size={20} />
              <span className="font-medium text-sm">Chat Facebook</span>
            </a>

            {/* Khu vực Zalo QR */}
            <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wide">Quét mã Zalo</span>
                <div className="bg-white p-2 rounded-lg w-fit shadow-lg shadow-blue-900/20">
                    {/* Mã QR được tạo tự động. Thay 'https://zalo.me/' vào param data */}
                    <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://zalo.me/84914329178" 
                        alt="Zalo QR Code" 
                        className="w-24 h-24"
                    />
                </div>
                <a 
                  href="https://zalo.me/84914329178" // <-- Thay link Zalo cá nhân/OA của bạn vào đây
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                >
                   <MessageCircle size={16}/> Kết nối Zalo
                </a>
            </div>

          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} GenEdu AI. All rights reserved. Developed by Vanhien1199-Art.</p>
      </div>
    </footer>
  );
};


export default Footer;

