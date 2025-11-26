import React, { useState } from 'react';
import { GameConfig, GeneratedContent, QuestionItem } from './types';
import { generateGameContent } from './services/gemini';
import { generateStandaloneHTML } from './utils/exportUtils';
import GameForm from './components/GameForm';
import { Download, Edit3, ArrowLeft, BrainCircuit, Target, Package, Grid3X3, Zap } from 'lucide-react';

const App: React.FC = () => {
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

  const handleGenerate = async () => {
    if (!config.lessonName) return;
    setLoading(true);
    try {
      const data = await generateGameContent(config);
      setContent(data);
      setStep('review');
    } catch (error) {
      alert((error as Error).message);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4 font-sans text-slate-900">
      <header className="max-w-5xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
          Game Creator AI
        </h1>
        <p className="text-slate-600 text-lg">Tạo trò chơi tương tác</p>
      </header>

      {step === 'setup' && (
        <GameForm
          config={config}
          onChange={(key, val) => setConfig(prev => ({ ...prev, [key]: val }))}
          onSubmit={handleGenerate}
          isLoading={loading}
        />
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
                         <button
                            onClick={() => setStep('setup')}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        >
                            <ArrowLeft size={18} /> Quay lại
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition"
                        >
                            <Download size={20} /> Tải Game
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-blue-600">
                        <Edit3 size={20} />
                        Xem trước & Chỉnh sửa
                    </h3>
                    
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
                                        placeholder="Nội dung câu hỏi / Tiêu đề"
                                    />
                                    
                                    {/* SIMULATION & COMPARISON VIEW */}
                                    {(config.gameType === 'simulation' || config.gameType === 'comparison') && (
                                       <div className="bg-white p-4 rounded border border-blue-100">
                                          {q.simulationConfig && (
                                            <p className="mb-2 text-sm font-bold text-blue-600 flex items-center gap-1"><BrainCircuit size={16}/> Mô phỏng: {q.simulationConfig.backgroundTheme}</p>
                                          )}
                                          {q.comparisonConfig && (
                                            <div className="mb-2 text-sm font-bold text-blue-600 flex items-center gap-1">
                                              <span>Nhóm A: {q.comparisonConfig.groupA}</span> | <span>Nhóm B: {q.comparisonConfig.groupB}</span>
                                            </div>
                                          )}
                                          <div className="grid grid-cols-2 gap-4">
                                             <div>
                                                <p className="text-xs font-bold uppercase text-slate-400">Vật phẩm / Nội dung</p>
                                                {(q.simulationConfig?.items || q.comparisonConfig?.items)?.map(i => (
                                                   <div key={i.id} className="text-sm p-1 border border-slate-200 mb-1 rounded flex justify-between">
                                                      <span>{i.content}</span>
                                                      <span className="text-xs text-slate-400">
                                                        &rarr {q.simulationConfig 
                                                            ? q.simulationConfig.zones.find(z => z.id === i.zoneId)?.label 
                                                            : (i as any).belongsTo}
                                                      </span>
                                                   </div>
                                                ))}
                                             </div>
                                          </div>
                                       </div>
                                    )}

                                    {/* NUMBER GRID VIEW */}
                                    {config.gameType === 'number_grid' && q.options && (
                                       <div className="bg-white p-3 rounded border border-blue-100">
                                          <p className="text-xs font-bold uppercase text-slate-400 mb-1 flex items-center gap-1"><Grid3X3 size={14}/> Ô số {idx+1}</p>
                                          <div className="grid grid-cols-2 gap-2">
                                             {q.options.map((opt, optIdx) => (
                                                <div key={optIdx} className={`text-sm p-1 border rounded ${opt === q.correctAnswer ? 'bg-green-50 border-green-200' : ''}`}>
                                                   {opt}
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    )}

                                    {/* KEYWORD GUESS VIEW */}
                                    {config.gameType === 'keyword_guess' && q.keywordConfig && (
                                        <div className="bg-white p-3 rounded border border-blue-100">
                                            <div className="flex items-center gap-2 mb-2 text-red-600 font-bold">
                                               <Target size={16} /> Đáp án cuối cùng: {q.keywordConfig.finalAnswer}
                                            </div>
                                            <div className="space-y-1">
                                                {q.keywordConfig.keywords.map((k, kIdx) => (
                                                    <div key={kIdx} className="p-2 bg-slate-100 rounded text-sm">Từ khóa {kIdx+1}: {k}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* MYSTERY BOX VIEW */}
                                    {config.gameType === 'mystery_box' && q.mysteryConfig && (
                                        <div className="bg-white p-3 rounded border border-blue-100">
                                             <div className="flex items-center gap-2 mb-2 text-purple-600 font-bold">
                                               <Package size={16} /> Trong hộp là: {q.mysteryConfig.itemContent}
                                            </div>
                                            <div className="space-y-1">
                                                {q.mysteryConfig.hints.map((h, hIdx) => (
                                                    <div key={hIdx} className="p-2 bg-slate-100 rounded text-sm text-slate-600">{h}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* SEQUENCING VIEW */}
                                    {config.gameType === 'sequencing' && (
                                       <div className="flex items-center gap-2">
                                          <span className="text-sm font-bold text-slate-500">Thứ tự: {q.sequenceOrder}</span>
                                          <input 
                                             className="flex-1 p-2 border border-slate-200 rounded text-sm"
                                             value={q.content || ''} 
                                             onChange={(e) => handleUpdateQuestion(idx, 'content', e.target.value)}
                                          />
                                       </div>
                                    )}

                                    {/* QUIZ / FAST QUIZ VIEW */}
                                    {(config.gameType === 'quiz' || config.gameType === 'fast_quiz') && q.options && (
                                        <div className="grid grid-cols-2 gap-3">
                                            {config.gameType === 'fast_quiz' && <div className="col-span-2 text-xs font-bold text-yellow-600 flex items-center gap-1"><Zap size={12}/> Câu hỏi nhanh</div>}
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

                                    {/* MATCHING VIEW */}
                                    {config.gameType === 'matching' && q.matchPair && (
                                        <div className="flex items-center gap-4 bg-white p-3 rounded border border-slate-200">
                                            <input
                                                className="flex-1 p-2 border-b border-dashed border-slate-300 focus:border-blue-500 outline-none text-center"
                                                value={q.matchPair.left}
                                                onChange={(e) => handleUpdateQuestion(idx, 'matchPair', { ...q.matchPair, left: e.target.value })}
                                            />
                                            <span className="text-slate-400">↔️</span>
                                            <input
                                                className="flex-1 p-2 border-b border-dashed border-slate-300 focus:border-blue-500 outline-none text-center"
                                                value={q.matchPair.right}
                                                onChange={(e) => handleUpdateQuestion(idx, 'matchPair', { ...q.matchPair, right: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {/* WHEEL VIEW */}
                                    {config.gameType === 'wheel' && (
                                        <div className="space-y-2">
                                            <div className="flex gap-2 items-center">
                                                <span className="text-sm text-slate-500 w-20">Nhãn ô:</span>
                                                <input
                                                    className="flex-1 p-2 border border-slate-200 rounded text-sm"
                                                    value={q.wheelLabel || ''}
                                                    onChange={(e) => handleUpdateQuestion(idx, 'wheelLabel', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-sm text-slate-500 w-20">Đáp án:</span>
                                                 <input
                                                    className="flex-1 p-2 border border-slate-200 rounded text-sm text-green-700 font-medium"
                                                    value={q.correctAnswer || ''}
                                                    onChange={(e) => handleUpdateQuestion(idx, 'correctAnswer', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="flex justify-center pb-12">
                 <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition text-lg"
                >
                    <Download size={24} /> Tải Trò Chơi Về Máy
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
