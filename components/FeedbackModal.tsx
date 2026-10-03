import React, { useState, useEffect } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorEmail?: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  authorEmail = 'vhh0106@gmail.com',
}) => {
  const [feedbackType, setFeedbackType] = useState<string>('feature');
  const [teacherName, setTeacherName] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(authorEmail);
      setCopiedStatus('Đã chép email!');
      setTimeout(() => setCopiedStatus(null), 2500);
    } catch {
      // Fallback
    }
  };

  const getFeedbackSubject = () => {
    const types: Record<string, string> = {
      feature: '[Góp ý EduAI] Đề xuất tính năng mới',
      bug: '[Báo lỗi EduAI] Phản hồi lỗi hệ thống',
      content: '[Góp ý EduAI] Góp ý nội dung đề thi & giáo án',
      other: '[Phản hồi EduAI] Ý kiến đóng góp từ giáo viên',
    };
    return types[feedbackType] || '[Góp ý EduAI] Phản hồi từ Thầy/Cô';
  };

  const getFeedbackBody = () => {
    return `Kính gửi tác giả Vũ Hoàng Hiệp,

Tôi là: ${teacherName || 'Giáo viên'}
Trường: ${schoolName || 'Chưa cung cấp'}
Loại góp ý: ${
      feedbackType === 'feature'
        ? 'Đề xuất tính năng mới'
        : feedbackType === 'bug'
        ? 'Báo lỗi hệ thống'
        : feedbackType === 'content'
        ? 'Góp ý nội dung'
        : 'Khác'
    }

Nội dung góp ý / phản hồi:
${content || '(Chưa nhập nội dung chi tiết)'}

Trân trọng!`;
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(getFeedbackSubject());
    const body = encodeURIComponent(getFeedbackBody());
    const mailtoUrl = `mailto:${authorEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const handleOpenGmail = () => {
    const subject = encodeURIComponent(getFeedbackSubject());
    const body = encodeURIComponent(getFeedbackBody());
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${authorEmail}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyFeedbackText = async () => {
    try {
      await navigator.clipboard.writeText(getFeedbackBody());
      setCopiedStatus('Đã sao chép nội dung góp ý!');
      setTimeout(() => setCopiedStatus(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-scale-in text-slate-900 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0 shadow-xs">
              💬
            </div>
            <div className="min-w-0">
              <h2 id="feedback-modal-title" className="text-base sm:text-lg font-black truncate">
                Góp ý &amp; Phản hồi cho Tác giả
              </h2>
              <p className="text-xs text-indigo-100 truncate mt-0.5">
                Ý kiến của thầy/cô giúp ứng dụng EduAI ngày một hoàn thiện hơn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition shrink-0"
            aria-label="Đóng cửa sổ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Author Email Info Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/80 dark:bg-slate-850 border border-indigo-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-400">
                Email nhận phản hồi trực tiếp:
              </p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                  {authorEmail}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tác giả: Vũ Hoàng Hiệp • SĐT/Zalo: 0348554851
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-750 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition active:scale-95 cursor-pointer"
                title="Sao chép địa chỉ email"
              >
                <span>📋</span>
                <span>{copiedStatus === 'Đã chép email!' ? 'Đã chép!' : 'Chép Email'}</span>
              </button>

              <a
                href="https://www.facebook.com/vhh0106/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition active:scale-95"
                title="Nhắn tin qua Facebook tác giả"
              >
                <span>Facebook</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Feedback Form Fields */}
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Họ và tên của thầy/cô:
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="VD: Cô Mai Lan"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Trường / Đơn vị công tác:
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="VD: Trường Tiểu học Dịch Vọng A"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phân loại góp ý:
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="feature">💡 Đề xuất tính năng mới / Định dạng mới</option>
                <option value="bug">🐛 Báo lỗi / Câu hỏi hiển thị chưa đúng</option>
                <option value="content">📖 Góp ý nội dung đề thi hoặc giáo án</option>
                <option value="other">💬 Ý kiến đóng góp khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Chi tiết nội dung góp ý:
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Thầy/cô vui lòng mô tả chi tiết mong muốn cải tiến, cấu trúc bài tập cần bổ sung hoặc lỗi gặp phải khi sử dụng..."
                className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3.5 sm:p-5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5">
            {copiedStatus && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                ✓ {copiedStatus}
              </span>
            )}
            <button
              type="button"
              onClick={handleCopyFeedbackText}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xs transition active:scale-95 cursor-pointer"
              title="Sao chép nội dung đã viết để dán vào Zalo hoặc email"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Sao chép nội dung</span>
              <span className="sm:hidden">Sao chép</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenGmail}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 rounded-xl shadow-2xs transition active:scale-95 cursor-pointer"
              title="Mở giao diện soạn thư mới trên Gmail"
            >
              <span>✉️</span>
              <span>Gửi qua Gmail</span>
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              title="Gửi phản hồi trực tiếp qua ứng dụng Email của thiết bị"
            >
              <span>🚀</span>
              <span>Gửi Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
