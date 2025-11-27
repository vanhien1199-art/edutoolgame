// src/components/Footer.tsx
import React from 'react';
import { Facebook, MessageCircle, Mail, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-12 border-t border-slate-700">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Cột 1: Thông tin bản quyền */}
        <div>
          <h3 className="text-white font-bold text-lg mb-2">EduGame AI Creator</h3>
          <p className="text-sm text-slate-400">
            Công cụ hỗ trợ giáo viên soạn bài giảng tương tác thông minh, tiết kiệm thời gian và nâng cao hiệu quả lớp học.
          </p>
          <p className="text-xs text-slate-500 mt-4">
            © {new Date().getFullYear()} Bản quyền thuộc về Vanhien1199-Art.
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
        <div className="flex flex-col items-center md:items-end">
          <h3 className="text-white font-bold text-lg mb-2">Liên Hệ</h3>
          <div className="flex gap-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition text-white" title="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://zalo.me" target="_blank" rel="noreferrer" className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition text-white" title="Zalo">
              <MessageCircle size={20} />
            </a>
            <a href="mailto:contact@example.com" className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition text-white" title="Email">
              <Mail size={20} />
            </a>
             <a href="https://yourwebsite.com" className="bg-emerald-500 p-2 rounded-full hover:bg-emerald-600 transition text-white" title="Website">
              <Globe size={20} />
            </a>
          </div>
          <p className="text-sm mt-3">Hotline: 09xx.xxx.xxx</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;