import React, { useState, useEffect, useMemo } from 'react';
import type { QuestionItem, CognitiveLevel } from '../types';
import {
  getQuestionBank,
  saveQuestionToBank,
  updateQuestionInBank,
  deleteQuestionFromBank,
  cloneQuestionInBank,
  type BankQuestionItem,
} from '../services/questionBankService';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion?: (q: QuestionItem) => void;
}

const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
  onSelectQuestion,
}) => {
  const [bankItems, setBankItems] = useState<BankQuestionItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [selectedSchoolLevelFilter, setSelectedSchoolLevelFilter] = useState<string>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // State cho form thêm/sửa câu hỏi
  const [editingItem, setEditingItem] = useState<Partial<BankQuestionItem> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setBankItems(getQuestionBank());
    }
  }, [isOpen]);

  const refreshList = () => {
    setBankItems(getQuestionBank());
  };

  const filteredItems = useMemo(() => {
    return bankItems.filter((q) => {
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchText =
          (q.question || '').toLowerCase().includes(kw) ||
          (q.topic || '').toLowerCase().includes(kw) ||
          (q.subject || '').toLowerCase().includes(kw);
        if (!matchText) return false;
      }
      if (selectedLevelFilter !== 'all' && q.level !== selectedLevelFilter) return false;
      if (selectedSchoolLevelFilter !== 'all' && q.schoolLevel !== selectedSchoolLevelFilter) return false;
      if (selectedSubjectFilter !== 'all' && q.subject !== selectedSubjectFilter) return false;
      if (selectedTypeFilter !== 'all') {
        if (selectedTypeFilter === 'mcq' && !q.questionType.startsWith('mcq')) return false;
        if (selectedTypeFilter === 'essay' && q.questionType.startsWith('mcq')) return false;
      }
      return true;
    });
  }, [
    bankItems,
    searchKeyword,
    selectedLevelFilter,
    selectedSchoolLevelFilter,
    selectedSubjectFilter,
    selectedTypeFilter,
  ]);

  // Danh sách các môn hiện có trong ngân hàng
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    bankItems.forEach((b) => {
      if (b.subject) set.add(b.subject);
    });
    return Array.from(set);
  }, [bankItems]);

  if (!isOpen) return null;

  const handleCopyQuestion = async (q: BankQuestionItem) => {
    let text = `${q.question}\n`;
    if (q.options && q.options.length > 0) {
      text += q.options.join('\n') + '\n';
    }
    text += `Đáp án: ${q.correctAnswer}\n`;
    if (q.explanation) text += `Lời giải: ${q.explanation}\n`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(q.bankId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const handleDelete = (bankId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng?')) {
      deleteQuestionFromBank(bankId);
      refreshList();
    }
  };

  const handleClone = (bankId: string) => {
    cloneQuestionInBank(bankId);
    refreshList();
  };

  const handleOpenAddForm = () => {
    setEditingItem({
      schoolLevel: 'THCS',
      grade: 'Lớp 8',
      subject: 'Toán',
      topic: 'Chủ đề mới',
      questionType: 'mcq_4',
      level: 'Nhận biết',
      question: '',
      options: ['A. ', 'B. ', 'C. ', 'D. '],
      correctAnswer: 'A',
      explanation: '',
      score: 0.25,
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.question?.trim()) return;

    if (editingItem.bankId) {
      updateQuestionInBank(editingItem as BankQuestionItem);
    } else {
      saveQuestionToBank(editingItem as QuestionItem, editingItem.schoolLevel || 'THCS');
    }
    setIsFormOpen(false);
    setEditingItem(null);
    refreshList();
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
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-xl shrink-0">
              🏦
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black truncate">
                Ngân Hàng Câu Hỏi - Quản Lý &amp; Tái Sử Dụng
              </h2>
              <p className="text-xs text-indigo-100 truncate">
                Lưu trữ {bankItems.length} câu hỏi • Dễ dàng trích xuất, chỉnh sửa và đưa vào đề thi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenAddForm}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>➕</span>
              <span className="hidden sm:inline">Thêm câu hỏi</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Thanh tìm kiếm & Bộ lọc */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 space-y-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm câu hỏi theo nội dung, chủ đề, môn học..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Lọc cấp học */}
            <select
              value={selectedSchoolLevelFilter}
              onChange={(e) => setSelectedSchoolLevelFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="all">Mọi cấp học</option>
              <option value="Tiểu học">Tiểu học</option>
              <option value="THCS">THCS</option>
              <option value="THPT">THPT</option>
            </select>

            {/* Lọc môn học */}
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="all">Mọi môn học</option>
              {availableSubjects.map((sbj) => (
                <option key={sbj} value={sbj}>
                  {sbj}
                </option>
              ))}
            </select>

            {/* Lọc mức độ nhận thức */}
            <select
              value={selectedLevelFilter}
              onChange={(e) => setSelectedLevelFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="all">Mọi mức độ</option>
              <option value="Nhận biết">Nhận biết</option>
              <option value="Thông hiểu">Thông hiểu</option>
              <option value="Vận dụng">Vận dụng</option>
              <option value="Vận dụng cao">Vận dụng cao</option>
            </select>

            {/* Lọc dạng bài */}
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="all">Mọi dạng bài</option>
              <option value="mcq">Trắc nghiệm</option>
              <option value="essay">Tự luận</option>
            </select>

            <span className="ml-auto text-slate-500 font-semibold text-[11px]">
              Hiển thị: <strong>{filteredItems.length}</strong> / {bankItems.length} câu
            </span>
          </div>
        </div>

        {/* Danh sách câu hỏi */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-3 flex-grow bg-slate-100/60 dark:bg-slate-950/40">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <span className="text-4xl block mb-2">📭</span>
              <p className="font-semibold text-sm">Không tìm thấy câu hỏi phù hợp với bộ lọc.</p>
              <p className="text-xs mt-1">Hãy thử tìm từ khóa khác hoặc nhấn "Thêm câu hỏi" để bổ sung.</p>
            </div>
          ) : (
            filteredItems.map((q) => {
              const isMcq = q.questionType.startsWith('mcq') || (q.options && q.options.length > 0);
              return (
                <div
                  key={q.bankId}
                  className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="font-black px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                        {q.subject} - {q.grade}
                      </span>
                      <span className="font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {q.level}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {q.topic}
                      </span>
                      <span className="text-slate-400">• {q.score}đ</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyQuestion(q)}
                        className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                        title="Sao chép nội dung câu hỏi"
                      >
                        {copiedId === q.bankId ? '✓ Đã chép' : '📋 Sao chép'}
                      </button>
                      <button
                        onClick={() => handleClone(q.bankId)}
                        className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                        title="Tạo bản sao câu hỏi"
                      >
                        📑 Nhân bản
                      </button>
                      <button
                        onClick={() => {
                          setEditingItem(q);
                          setIsFormOpen(true);
                        }}
                        className="px-2 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 transition cursor-pointer"
                        title="Chỉnh sửa câu hỏi"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(q.bankId)}
                        className="px-2 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 text-rose-700 dark:text-rose-300 transition cursor-pointer"
                        title="Xóa khỏi ngân hàng"
                      >
                        🗑️
                      </button>
                      {onSelectQuestion && (
                        <button
                          onClick={() => {
                            onSelectQuestion(q);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                        >
                          + Chọn vào đề
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Nội dung câu hỏi */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                    {q.question}
                  </p>

                  {/* Phương án lựa chọn */}
                  {isMcq && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const optLetter = opt.trim().charAt(0).toUpperCase();
                        const isCorrect = q.correctAnswer?.toUpperCase().includes(optLetter);
                        return (
                          <div
                            key={oIdx}
                            className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{isCorrect ? '✅' : '⚪'}</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Lời giải / Đáp án chi tiết */}
                  {q.explanation && (
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400">💡 Lời giải/Gợi ý chấm: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Thêm / Chỉnh Sửa Câu Hỏi */}
        {isFormOpen && editingItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-3 sm:p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-base mb-3 text-slate-900 dark:text-white">
                {editingItem.bankId ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới Vào Ngân Hàng'}
              </h3>
              <form onSubmit={handleSaveForm} className="space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Cấp học</label>
                    <select
                      value={editingItem.schoolLevel || 'THCS'}
                      onChange={(e) => setEditingItem({ ...editingItem, schoolLevel: e.target.value })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    >
                      <option value="Tiểu học">Tiểu học</option>
                      <option value="THCS">THCS</option>
                      <option value="THPT">THPT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Môn học</label>
                    <input
                      type="text"
                      value={editingItem.subject || 'Toán'}
                      onChange={(e) => setEditingItem({ ...editingItem, subject: e.target.value })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Lớp</label>
                    <input
                      type="text"
                      value={editingItem.grade || 'Lớp 8'}
                      onChange={(e) => setEditingItem({ ...editingItem, grade: e.target.value })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Mức độ</label>
                    <select
                      value={editingItem.level || 'Nhận biết'}
                      onChange={(e) => setEditingItem({ ...editingItem, level: e.target.value as CognitiveLevel })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    >
                      <option value="Nhận biết">Nhận biết</option>
                      <option value="Thông hiểu">Thông hiểu</option>
                      <option value="Vận dụng">Vận dụng</option>
                      <option value="Vận dụng cao">Vận dụng cao</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Chủ đề kiến thức</label>
                  <input
                    type="text"
                    value={editingItem.topic || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, topic: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    placeholder="VD: Số hữu tỉ, Quang hợp..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Nội dung câu hỏi</label>
                  <textarea
                    rows={3}
                    value={editingItem.question || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    placeholder="Nhập nội dung câu hỏi..."
                    required
                  />
                </div>

                {editingItem.options && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold">Các phương án lựa chọn (A, B, C, D)</label>
                    {editingItem.options.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...(editingItem.options || [])];
                          updated[idx] = e.target.value;
                          setEditingItem({ ...editingItem, options: updated });
                        }}
                        className="w-full p-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs"
                      />
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Đáp án đúng</label>
                    <input
                      type="text"
                      value={editingItem.correctAnswer || 'A'}
                      onChange={(e) => setEditingItem({ ...editingItem, correctAnswer: e.target.value })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Điểm số</label>
                    <input
                      type="number"
                      step={0.25}
                      value={editingItem.score || 0.25}
                      onChange={(e) => setEditingItem({ ...editingItem, score: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Lời giải / Gợi ý chấm</label>
                  <textarea
                    rows={2}
                    value={editingItem.explanation || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, explanation: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs"
                    placeholder="Giải thích các bước hoặc biểu điểm chi tiết..."
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-xs"
                  >
                    Lưu vào ngân hàng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            * Câu hỏi được lưu an toàn trong trình duyệt của bạn (Local Storage).
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-650 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionBankModal;
