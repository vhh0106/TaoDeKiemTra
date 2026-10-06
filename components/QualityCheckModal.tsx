import React from 'react';
import type { QualityCheckReport } from '../types';

interface QualityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: QualityCheckReport;
}

const QualityCheckModal: React.FC<QualityCheckModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  const passCount = report.issues.filter((i) => i.status === 'pass').length;
  const warningCount = report.issues.filter((i) => i.status === 'warning').length;
  const failCount = report.issues.filter((i) => i.status === 'fail').length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="font-black text-base sm:text-lg">
                Báo Cáo Kiểm Tra Đề Tự Động (12 Tiêu Chí)
              </h3>
              <p className="text-xs text-emerald-100">
                Thực hiện lúc {report.timestamp} • Chuẩn hóa theo quy chuẩn Bộ GD&ĐT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Thống kê nhanh */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-around gap-2 shrink-0">
          <div className="text-center">
            <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
              {passCount} / 12
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">Đạt chuẩn (Pass)</div>
          </div>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
          <div className="text-center">
            <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
              {warningCount}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">Lưu ý (Warning)</div>
          </div>
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
          <div className="text-center">
            <div className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">
              {failCount}
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">Cần chỉnh (Fail)</div>
          </div>
        </div>

        {/* Danh sách 12 tiêu chí */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-grow">
          <div className="mb-2 p-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
            <span className="text-base shrink-0">💡</span>
            <span>
              Hệ thống tự động quét 12 tiêu chí sư phạm trước khi bàn giao đề cho giáo viên: số câu, thang điểm, tỉ lệ nhận thức, trùng lặp, tính toàn vẹn đáp án, môn/lớp, bám sát tài liệu tham chiếu, dữ kiện, ngôn ngữ, khớp ma trận & bản đặc tả.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {report.issues.map((issue, idx) => {
              const isPass = issue.status === 'pass';
              const isWarning = issue.status === 'warning';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border transition-all ${
                    isPass
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50'
                      : isWarning
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/50'
                      : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                      {issue.rule}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                        isPass
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                      }`}
                    >
                      {isPass ? '✓ ĐẠT' : isWarning ? '⚠ LƯU Ý' : '✕ CHƯA ĐẠT'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {issue.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 italic">
            * Thầy/cô có thể chỉnh sửa trực tiếp nội dung ở chế độ "Soạn thảo (Rich Text)".
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            Đã hiểu &amp; Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualityCheckModal;
