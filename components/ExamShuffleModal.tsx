import React, { useState, useMemo } from 'react';
import { shuffleExam, generateShuffledWordDoc, type ExamShuffleResult } from '../services/examShufflerService';

interface ExamShuffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  examContent: string;
  answerKeyContent: string;
  schoolName?: string;
  subject?: string;
}

const ExamShuffleModal: React.FC<ExamShuffleModalProps> = ({
  isOpen,
  onClose,
  examContent,
  answerKeyContent,
  schoolName = 'Trường học',
  subject = 'Đề kiểm tra',
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | '101' | '102' | '103' | '104'>('matrix');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const shuffleResult: ExamShuffleResult = useMemo(() => {
    if (!isOpen) return { codes: [], answerMatrix: [] };
    return shuffleExam(examContent, answerKeyContent);
  }, [isOpen, examContent, answerKeyContent]);

  if (!isOpen) return null;

  const currentCodeData = shuffleResult.codes.find((c) => c.code === activeTab);

  // Xuất file Word (.docx) chứa 4 mã đề và ma trận đáp án
  const handleDownloadWord = () => {
    const html = generateShuffledWordDoc(shuffleResult, schoolName, subject);
    const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bo_4_Ma_De_${subject.replace(/\s+/g, '_')}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Sao chép nội dung mã đề hiện tại
  const handleCopyCurrentCode = async () => {
    if (!currentCodeData) return;
    let text = `MÃ ĐỀ ${currentCodeData.code}\nMÔN: ${subject}\n\n`;
    currentCodeData.questions.forEach((q) => {
      text += `Câu ${q.number}: ${q.questionText}\n`;
      q.options.forEach((opt) => {
        text += `  ${opt.label}. ${opt.text}\n`;
      });
      text += '\n';
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Đã sao chép mã đề!');
      setTimeout(() => setCopyStatus(null), 2500);
    } catch {}
  };

  // Sao chép dạng bảng ma trận đáp án
  const handleCopyMatrix = async () => {
    let text = `BẢNG ĐỐI CHIẾU ĐÁP ÁN 4 MÃ ĐỀ\nCâu\tMã 101\tMã 102\tMã 103\tMã 104\n`;
    shuffleResult.answerMatrix.forEach((r) => {
      text += `${r.questionNumber}\t${r.answersByCode['101'] || ''}\t${r.answersByCode['102'] || ''}\t${r.answersByCode['103'] || ''}\t${r.answersByCode['104'] || ''}\n`;
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Đã sao chép bảng đáp án Excel!');
      setTimeout(() => setCopyStatus(null), 2500);
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-3.5 sm:p-6 bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-lg sm:text-xl shrink-0">
              🔀
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-black truncate">
                Trộn Đề Thi - 4 Mã Đề (101, 102, 103, 104)
              </h2>
              <p className="text-[11px] sm:text-xs text-indigo-100 mt-0.5 truncate">
                Hoán vị câu hỏi & phương án lựa chọn kèm ma trận đối chiếu đáp án
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector & Action Buttons */}
        <div className="p-2.5 sm:p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'matrix'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              📊 Ma trận đáp án
            </button>
            {(['101', '102', '103', '104'] as const).map((code) => (
              <button
                key={code}
                onClick={() => setActiveTab(code)}
                className={`px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap shrink-0 ${
                  activeTab === code
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Mã {code}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
            {copyStatus && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                ✓ {copyStatus}
              </span>
            )}
            {activeTab === 'matrix' ? (
              <button
                onClick={handleCopyMatrix}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
              >
                📋 <span className="hidden sm:inline">Sao chép</span>
              </button>
            ) : (
              <button
                onClick={handleCopyCurrentCode}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
              >
                📋 <span className="hidden sm:inline">Sao chép mã</span>
              </button>
            )}
            <button
              onClick={handleDownloadWord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition active:scale-95 whitespace-nowrap"
            >
              <span>📥</span>
              <span className="hidden sm:inline">Tải Word (.docx)</span>
              <span className="sm:hidden">Word</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-grow font-sans text-slate-800 dark:text-slate-200">
          {activeTab === 'matrix' ? (
            <div className="space-y-4">
              <div className="p-2.5 sm:p-3 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/80 rounded-xl text-xs sm:text-sm text-purple-900 dark:text-purple-300 font-semibold flex items-center justify-between">
                <span>📌 Bảng đối chiếu đáp án phục vụ chấm bài kiểm tra</span>
                <div className="flex items-center gap-1.5">
                  <span className="sm:hidden text-[10px] text-purple-700 dark:text-purple-300 font-bold">👉 Vuốt xem đủ cột</span>
                  <span className="text-[11px] sm:text-xs bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-md font-bold">
                    {shuffleResult.answerMatrix.length} câu
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 -mx-1 sm:mx-0">
                <table className="min-w-[480px] w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <th className="p-3 font-bold text-center w-24">Câu hỏi</th>
                      <th className="p-3 font-bold text-center bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300">Mã đề 101</th>
                      <th className="p-3 font-bold text-center bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300">Mã đề 102</th>
                      <th className="p-3 font-bold text-center bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-300">Mã đề 103</th>
                      <th className="p-3 font-bold text-center bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300">Mã đề 104</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shuffleResult.answerMatrix.map((row) => (
                      <tr key={row.questionNumber} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-center text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-850/50">
                          Câu {row.questionNumber}
                        </td>
                        <td className="p-3 text-center font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50/30 dark:bg-indigo-950/20">
                          {row.answersByCode['101']}
                        </td>
                        <td className="p-3 text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/20">
                          {row.answersByCode['102']}
                        </td>
                        <td className="p-3 text-center font-bold text-teal-700 dark:text-teal-300 bg-teal-50/30 dark:bg-teal-950/20">
                          {row.answersByCode['103']}
                        </td>
                        <td className="p-3 text-center font-bold text-purple-700 dark:text-purple-300 bg-purple-50/30 dark:bg-purple-950/20">
                          {row.answersByCode['104']}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : currentCodeData ? (
            <div className="space-y-4 max-w-3xl mx-auto bg-slate-50/50 dark:bg-slate-850/50 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-750">
              <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">{schoolName}</p>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  ĐỀ KIỂM TRA ĐỊNH KÌ - MÔN: {subject.toUpperCase()}
                </h3>
                <span className="inline-block mt-1 px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-2xs">
                  MÃ ĐỀ: {currentCodeData.code}
                </span>
              </div>

              <div className="space-y-4">
                {currentCodeData.questions.map((q) => (
                  <div key={q.number} className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">Câu {q.number}:</span> {q.questionText}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 text-xs sm:text-sm">
                      {q.options.map((opt) => (
                        <div
                          key={opt.label}
                          className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          <strong className="text-indigo-700 dark:text-indigo-400">{opt.label}.</strong> {opt.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">Không tìm thấy dữ liệu mã đề.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamShuffleModal;
