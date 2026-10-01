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
        className="relative bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-xl">
              🔀
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                Trộn Đề Trắc Nghiệm - 4 Mã Đề (101, 102, 103, 104)
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">
                Tự động hoán vị câu hỏi & phương án lựa chọn kèm Bảng ma trận đối chiếu đáp án
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector & Action Buttons */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                activeTab === 'matrix'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              📊 Ma trận đáp án đối chiếu
            </button>
            {(['101', '102', '103', '104'] as const).map((code) => (
              <button
                key={code}
                onClick={() => setActiveTab(code)}
                className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                  activeTab === code
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Mã đề {code}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {copyStatus && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                ✓ {copyStatus}
              </span>
            )}
            {activeTab === 'matrix' ? (
              <button
                onClick={handleCopyMatrix}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
              >
                📋 Sao chép Excel
              </button>
            ) : (
              <button
                onClick={handleCopyCurrentCode}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
              >
                📋 Sao chép mã này
              </button>
            )}
            <button
              onClick={handleDownloadWord}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition active:scale-95"
            >
              <span>📥</span>
              <span>Tải Word (.docx) 4 Mã đề</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow font-sans text-slate-800">
          {activeTab === 'matrix' ? (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs sm:text-sm text-purple-900 font-semibold flex items-center justify-between">
                <span>📌 Bảng đối chiếu đáp án phục vụ chấm bài kiểm tra cho giáo viên</span>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-md">
                  Tổng số: {shuffleResult.answerMatrix.length} câu trắc nghiệm
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                      <th className="p-3 font-bold text-center w-24">Câu hỏi</th>
                      <th className="p-3 font-bold text-center bg-indigo-50 text-indigo-900">Mã đề 101</th>
                      <th className="p-3 font-bold text-center bg-blue-50 text-blue-900">Mã đề 102</th>
                      <th className="p-3 font-bold text-center bg-teal-50 text-teal-900">Mã đề 103</th>
                      <th className="p-3 font-bold text-center bg-purple-50 text-purple-900">Mã đề 104</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shuffleResult.answerMatrix.map((row) => (
                      <tr key={row.questionNumber} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-bold text-center text-slate-600 bg-slate-50/50">
                          Câu {row.questionNumber}
                        </td>
                        <td className="p-3 text-center font-bold text-indigo-700 bg-indigo-50/30">
                          {row.answersByCode['101']}
                        </td>
                        <td className="p-3 text-center font-bold text-blue-700 bg-blue-50/30">
                          {row.answersByCode['102']}
                        </td>
                        <td className="p-3 text-center font-bold text-teal-700 bg-teal-50/30">
                          {row.answersByCode['103']}
                        </td>
                        <td className="p-3 text-center font-bold text-purple-700 bg-purple-50/30">
                          {row.answersByCode['104']}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : currentCodeData ? (
            <div className="space-y-4 max-w-3xl mx-auto bg-slate-50/50 p-4 sm:p-6 rounded-2xl border border-slate-200">
              <div className="text-center pb-4 border-b border-slate-200">
                <p className="text-xs uppercase font-bold text-slate-500">{schoolName}</p>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  ĐỀ KIỂM TRA ĐỊNH KÌ - MÔN: {subject.toUpperCase()}
                </h3>
                <span className="inline-block mt-1 px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-2xs">
                  MÃ ĐỀ: {currentCodeData.code}
                </span>
              </div>

              <div className="space-y-4">
                {currentCodeData.questions.map((q) => (
                  <div key={q.number} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                    <p className="font-semibold text-slate-800 text-sm">
                      <span className="text-indigo-600 font-bold">Câu {q.number}:</span> {q.questionText}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 text-xs sm:text-sm">
                      {q.options.map((opt) => (
                        <div
                          key={opt.label}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-700"
                        >
                          <strong className="text-indigo-700">{opt.label}.</strong> {opt.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">Không tìm thấy dữ liệu mã đề.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamShuffleModal;
