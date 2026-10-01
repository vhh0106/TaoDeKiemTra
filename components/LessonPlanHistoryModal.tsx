import React, { useState, useEffect, useMemo } from 'react';
import type { SavedLessonPlanItem } from '../types';

interface LessonPlanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyList: SavedLessonPlanItem[];
  onViewPlan: (item: SavedLessonPlanItem) => void;
  onApplyParameters: (item: SavedLessonPlanItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

const LessonPlanHistoryModal: React.FC<LessonPlanHistoryModalProps> = ({
  isOpen,
  onClose,
  historyList,
  onViewPlan,
  onApplyParameters,
  onDeleteItem,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmDeleteId || showClearConfirm) {
          setConfirmDeleteId(null);
          setShowClearConfirm(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, confirmDeleteId, showClearConfirm]);

  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return historyList;
    const term = searchTerm.toLowerCase();
    return historyList.filter(
      (item) =>
        item.formData.lessonName.toLowerCase().includes(term) ||
        item.formData.subject.toLowerCase().includes(term) ||
        item.formData.grade.toLowerCase().includes(term) ||
        item.formData.textbook.toLowerCase().includes(term) ||
        (item.formData.schoolName && item.formData.schoolName.toLowerCase().includes(term))
    );
  }, [historyList, searchTerm]);

  const formatDateTime = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      return d.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoDate;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-plan-history-modal-title"
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="lesson-plan-history-modal-title" className="text-xl sm:text-2xl font-bold text-slate-800">
                  Lịch sử Kế hoạch bài dạy
                </h2>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {historyList.length} giáo án
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Xem lại giáo án đã soạn hoặc nạp lại thông số để chỉnh sửa nhanh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            aria-label="Đóng cửa sổ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 sm:px-6 py-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên bài học, môn, lớp, bộ sách..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 hover:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[60vh]">
          {filteredList.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-700">
                {searchTerm ? 'Không tìm thấy giáo án phù hợp' : 'Chưa có kế hoạch bài dạy nào được lưu'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Khi bạn bấm "Soạn Kế Hoạch Bài Dạy Ngay", toàn bộ nội dung giáo án và thông số cấu hình sẽ tự động được lưu lại tại đây.
              </p>
            </div>
          ) : (
            filteredList.map((item) => {
              const isConfirming = confirmDeleteId === item.id;
              const { formData } = item;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-xs sm:text-sm border border-indigo-100">
                          {formData.subject}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded-md text-xs">
                          {formData.grade}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs">
                          {formData.textbook}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                          {formData.durationInPeriods} tiết
                        </span>
                        {formData.integrateDigitalCompetence && (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-semibold">
                            Tích hợp NLS
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{formatDateTime(item.createdAt)}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-800">
                      {formData.lessonName}
                    </h4>

                    {formData.schoolName && (
                      <p className="text-xs text-slate-500">
                        🏫 {formData.schoolName} {formData.teacherName ? `• GV: ${formData.teacherName}` : ''}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onViewPlan(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Xem lại giáo án</span>
                      </button>

                      <button
                        onClick={() => onApplyParameters(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-lg text-xs sm:text-sm font-semibold transition active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Dùng lại thông số</span>
                      </button>
                    </div>

                    {isConfirming ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-600 font-medium">Xác nhận xóa?</span>
                        <button
                          onClick={() => {
                            onDeleteItem(item.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold"
                        >
                          Xóa
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md text-xs"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa giáo án này khỏi lịch sử"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          {historyList.length > 0 && (
            showClearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium">Xác nhận xóa {historyList.length} giáo án?</span>
                <button
                  onClick={() => {
                    onClearAll();
                    setShowClearConfirm(false);
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Xác nhận
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs rounded-lg"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
              >
                Xóa toàn bộ lịch sử giáo án
              </button>
            )
          )}

          <div className="ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-sm font-semibold rounded-lg shadow-sm transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanHistoryModal;
