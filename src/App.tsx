<header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
           {/* LOGO: Đã thay div thành thẻ a để gắn link */}
           <a 
             href="https://genedu.pages.dev/" 
             className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
           >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
                <BrainCircuit size={24} />
              </div>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight hidden md:block">GenEdu<span className="text-blue-600"></span></span>
           </a>

           <div className="flex items-center gap-4">
              {step === 'review' && (
                 {/* NÚT TRANG CHỦ: Đã thay button thành thẻ a */}
                 <a 
                   href="https://genedu.pages.dev/" 
                   className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition font-medium text-sm"
                 >
                    <Home size={18} /> Trang chủ
                 </a>
              )}
              {isVerified && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                     <ShieldCheck size={14} /> ACTIVE SESSION
                  </div>
              )}
           </div>
        </div>
      </header>
