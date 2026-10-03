import React, { useState, useEffect, useRef } from 'react';
import type {
  ExamFormData,
  ExamResult,
  SavedExamItem,
  LessonPlanFormData,
  SavedLessonPlanItem,
} from './types';
import ExamForm from './components/ExamForm';
import ResultsDisplay from './components/ResultsDisplay';
import ExamHistoryModal from './components/ExamHistoryModal';
import LessonPlanForm from './components/LessonPlanForm';
import LessonPlanDisplay from './components/LessonPlanDisplay';
import LessonPlanHistoryModal from './components/LessonPlanHistoryModal';

import { generateExam } from './services/geminiService';
import { generateLessonPlan } from './services/lessonPlanService';
import {
  getSavedExams,
  saveExamToHistory,
  deleteExamFromHistory,
  clearAllExamHistory,
} from './services/examHistoryService';
import {
  getSavedLessonPlans,
  saveLessonPlanToHistory,
  deleteLessonPlanFromHistory,
  clearAllLessonPlanHistory,
} from './services/lessonPlanHistoryService';
import { promptForNewApiKey } from './services/apiKeyHelper';
import { trackPageView, trackInteraction } from './services/analyticsService';

/* --------------------------- Header --------------------------- */
const Header: React.FC<{
  activeMenu: 'exam' | 'lessonPlan';
  setActiveMenu: (menu: 'exam' | 'lessonPlan') => void;
  onGuideClick: () => void;
  onHistoryClick: () => void;
  examHistoryCount: number;
  lessonPlanHistoryCount: number;
  globalVisits: number;
  globalInteractions: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}> = ({
  activeMenu,
  setActiveMenu,
  onGuideClick,
  onHistoryClick,
  examHistoryCount,
  lessonPlanHistoryCount,
  globalVisits,
  globalInteractions,
  isDarkMode,
  onToggleDarkMode,
}) => (
  <header
    className="
      bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-lg
      border border-slate-200/90 dark:border-slate-800 mb-4 sm:mb-6 lg:mb-8
      sticky top-0 lg:top-4 z-40
      px-safe transition-colors duration-200
    "
    role="banner"
  >
    <div className="p-3 sm:p-4">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-600 p-2.5 rounded-xl text-white shadow-md shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              <span>EduAI</span>
              <span className="text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 px-2 py-0.5 rounded-lg">
                Trợ Lý Giáo Dục AI
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Hỗ trợ giáo viên: Tạo đề kiểm tra (CV 7991 & TT 27) • Soạn kế hoạch bài dạy (CV 2345 & Khung NLS TT 02/2025)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Thống kê trực tuyến toàn quốc */}
          <div
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-slate-850 dark:via-slate-800 dark:to-slate-850 border border-emerald-200/80 dark:border-slate-700 rounded-full text-xs font-semibold text-emerald-950 dark:text-emerald-300 shadow-2xs"
            title="Số liệu đồng bộ thời gian thực từ tất cả người dùng GitHub Pages toàn quốc"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{globalVisits > 0 ? globalVisits.toLocaleString('vi-VN') : '---'} truy cập</span>
            <span className="text-emerald-300 dark:text-slate-600">·</span>
            <span className="text-indigo-700 dark:text-indigo-400 font-bold">{globalInteractions > 0 ? globalInteractions.toLocaleString('vi-VN') : '---'} tương tác</span>
          </div>

          {/* Nút Chế độ tối / sáng (Dark Mode) */}
          <button
            onClick={onToggleDarkMode}
            className={`
              inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold
              px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full transition shadow-xs border cursor-pointer
              ${isDarkMode
                ? 'bg-slate-800 hover:bg-slate-750 text-amber-300 border-slate-700 hover:border-slate-600 ring-1 ring-amber-400/20'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
              }
            `}
            title={isDarkMode ? 'Chuyển sang chế độ sáng (Light Mode)' : 'Chuyển sang chế độ tối (Dark Mode - Giảm mỏi mắt)'}
            aria-label={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            {isDarkMode ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="hidden sm:inline">Chế độ sáng</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="hidden sm:inline">Chế độ tối</span>
              </>
            )}
          </button>

          {/* Nút Lịch sử theo menu hiện tại */}
          <button
            onClick={onHistoryClick}
            className="
              inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold
              text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100
              bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-750 border border-indigo-200/80 dark:border-slate-700
              px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition shadow-xs
            "
            title="Xem lại lịch sử nội dung đã tạo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Lịch sử</span>
            <span className="bg-indigo-600 dark:bg-indigo-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-5 text-center leading-tight">
              {activeMenu === 'exam' ? examHistoryCount : lessonPlanHistoryCount}
            </span>
          </button>

          {/* Nút Hướng dẫn */}
          <button
            onClick={onGuideClick}
            className="
              inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold
              text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300
              bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-750 border border-transparent dark:border-slate-700
              px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition
            "
            aria-label="Xem hướng dẫn sử dụng"
            title="Hướng dẫn sử dụng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="hidden sm:inline">Hướng dẫn</span>
          </button>

          {/* Nút Đổi API Key */}
          <button
            onClick={() => {
              promptForNewApiKey('Cấu hình hoặc thay đổi Gemini API Key');
            }}
            className="
              inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold
              text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200
              bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-750 border border-emerald-200/80 dark:border-slate-700
              px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition shadow-xs
            "
            title="Đổi hoặc cấu hình Gemini API Key riêng (tùy chọn)"
          >
            <span className="shrink-0">🔑</span>
            <span className="hidden sm:inline">API Key</span>
          </button>

          {/* Avatar link */}
          <a
            href="https://www.facebook.com/vhh0106/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-offset-1 ring-indigo-300 dark:ring-offset-slate-900 shadow-sm transition-transform hover:scale-110 focus:outline-none shrink-0"
            title="Tác giả: Vũ Hoàng Hiệp (Facebook)"
            aria-label="Trang Facebook tác giả Vũ Hoàng Hiệp"
          >
            <span>VHH</span>
          </a>
        </div>
      </div>

      {/* Mobile Live Stats Row */}
      <div className="flex lg:hidden items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-850 rounded-lg px-2.5 py-1 mt-2.5 border border-slate-200/60 dark:border-slate-800">
        <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Toàn quốc:
        </span>
        <span className="flex items-center gap-2">
          <span>{globalVisits > 0 ? globalVisits.toLocaleString('vi-VN') : '---'} truy cập</span>
          <span>·</span>
          <span className="text-indigo-700 dark:text-indigo-400 font-bold">{globalInteractions > 0 ? globalInteractions.toLocaleString('vi-VN') : '---'} tạo thành công</span>
        </span>
      </div>

      {/* 2 Navigation Menus */}
      <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
        <button
          onClick={() => setActiveMenu('exam')}
          className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            activeMenu === 'exam'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none scale-[1.01]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="sm:hidden">1. Tạo Đề Thi</span>
          <span className="hidden sm:inline">1. Tạo Đề Kiểm Tra</span>
        </button>

        <button
          onClick={() => setActiveMenu('lessonPlan')}
          className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
            activeMenu === 'lessonPlan'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none scale-[1.01]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="sm:hidden">2. Soạn Giáo Án</span>
          <span className="hidden sm:inline">2. Soạn Kế Hoạch Bài Dạy</span>
          <span className="hidden md:inline bg-emerald-700 dark:bg-emerald-800 text-emerald-100 text-[10px] px-1.5 py-0.5 rounded-md uppercase font-semibold">
            TT 02 • QĐ 2422 • TT 08
          </span>
        </button>
      </div>
    </div>
  </header>
);

/* ------------------------ User Guide Modal ------------------------ */
const UserGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const examSteps = [
    { title: "1. Chọn Cấp học & Quy định", description: "Tiểu học áp dụng Thông tư 27/2020/TT-BGDĐT (3 mức độ nhận thức 1, 2, 3; điểm số không thập phân); THCS & THPT áp dụng Công văn 7991/BGDĐT-GDTrH (4 mức độ nhận thức)." },
    { title: "2. Cấu trúc Đề thi & Ma trận", description: "Thiết lập phân bổ câu hỏi: TNKQ, Đúng/Sai, Trả lời ngắn, Tự luận. Hệ thống tự động cân đối điểm số và %." },
    { title: "3. Xuất file & Lưu trữ", description: "Xuất file Word (.docx), file ZIP, sao chép hoặc xem lại bất cứ lúc nào trong 'Lịch sử đề'." }
  ];

  const lessonPlanSteps = [
    { title: "1. Quy chuẩn Kế hoạch bài dạy", description: "Tiểu học chuẩn hóa theo Công văn 2345/BGDĐT-GDTH (Phụ lục 3); THCS/THPT theo Công văn 5512/BGDĐT-GDTrH." },
    { title: "2. Tích hợp Năng Lực Số (TT 02/2025) & Giáo Dục AI (QĐ 2422)", description: "Tích hợp Thông tư 02/2025/TT-BGDĐT, Công văn 3456/BGDĐT-GDPT và Quyết định 2422/QĐ-BGDĐT ban hành Khung nội dung giáo dục Trí tuệ nhân tạo (AI) cho học sinh phổ thông với 4 mạch kiến thức (Tư duy lấy con người làm trung tâm, Đạo đức AI, Kỹ thuật & Ứng dụng, Thiết kế hệ thống AI) kèm mã định danh chuẩn hóa." },
    { title: "3. Lồng ghép Giáo dục Quốc phòng và An ninh (TT 08/2024/TT-BGDĐT)", description: "Quy định theo Điều 2, Điều 3, Điều 4 Thông tư số 08/2024/TT-BGDĐT ngày 15/05/2024 của Bộ GD&ĐT (có hiệu lực từ 01/07/2024): Lồng ghép tự nhiên, ngắn gọn vào Mục I.4 (Phẩm chất yêu nước & trách nhiệm), Mục II (Đồ dùng dạy học: tranh ảnh, bản đồ, video tư liệu) và Mục III (Bảng hoạt động dạy học của GV & HS) với chủ đề chuẩn theo từng khối lớp (tình yêu Tổ quốc, hình ảnh người lính, chủ quyền biển đảo Hoàng Sa - Trường Sa, an toàn số)." },
    { title: "4. 4 Hoạt động dạy học chuẩn", description: "Soạn thảo chi tiết 4 hoạt động: Mở đầu/Khởi động, Hình thành kiến thức mới, Luyện tập/Thực hành, Vận dụng/Trải nghiệm (rõ mục tiêu, nội dung, sản phẩm, tổ chức thực hiện GV & HS)." }
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/80 transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Hướng dẫn sử dụng"
    >
      <div
        className="
          relative bg-white dark:bg-slate-900 w-full max-w-4xl
          h-[92vh] sm:h-auto sm:max-h-[90vh]
          rounded-t-2xl sm:rounded-2xl shadow-2xl
          overflow-y-auto
          p-5 sm:p-8 m-0 sm:m-4
          border border-transparent dark:border-slate-800
          animate-scale-in text-slate-800 dark:text-slate-100
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full cursor-pointer"
          aria-label="Đóng hướng dẫn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-indigo-700 dark:text-indigo-400">Hướng dẫn sử dụng EduAI</h2>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">Trợ lý sư phạm toàn diện cho giáo viên Việt Nam</p>
        </div>

        <div className="space-y-6">
          {/* Menu 1 */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="p-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm">📝</span>
              <span>1. Tạo Đề Kiểm Tra (CV 7991 & TT 27)</span>
            </h3>
            <div className="space-y-2.5">
              {examSteps.map((step, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 text-xs sm:text-sm">
                  <p className="font-bold text-indigo-700 dark:text-indigo-400">{step.title}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Menu 2 */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm">📚</span>
              <span>2. Soạn Kế Hoạch Bài Dạy (CV 2345, CV 5512 & Khung NLS TT 02/2025)</span>
            </h3>
            <div className="space-y-2.5">
              {lessonPlanSteps.map((step, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-slate-850/70 text-xs sm:text-sm">
                  <p className="font-bold text-emerald-800 dark:text-emerald-400">{step.title}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Hệ thống hỗ trợ xuất file Word (.docx), sao chép và tự động lưu trữ lịch sử trên trình duyệt.
          </p>
        </div>
      </div>
    </div>
  );
};

/* --------------------------- Footer --------------------------- */
const Footer: React.FC<{ visits: number; clicks: number }> = ({ visits, clicks }) => (
  <footer className="text-center py-8 mt-10 sm:mt-12 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
    <p>
      Phát triển bởi:{' '}
      <a
        href="https://www.facebook.com/vhh0106/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
      >
        Vũ Hoàng Hiệp
      </a>{' '}
      | Zalo: 0348554851
    </p>
    <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm shadow-2xs">
      <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-semibold">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Trực tuyến toàn quốc (GitHub Pages)
      </span>
      <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
      <span>👁️ <strong>{visits > 0 ? visits.toLocaleString('vi-VN') : '---'}</strong> lượt truy cập</span>
      <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
      <span>⚡ <strong>{clicks > 0 ? clicks.toLocaleString('vi-VN') : '---'}</strong> lượt tạo thành công</span>
    </div>
  </footer>
);

/* ---------------------- Loading Indicator ---------------------- */
const LoadingIndicator: React.FC<{ onCancel: () => void; isLessonPlan?: boolean }> = ({ onCancel, isLessonPlan }) => {
  const steps = isLessonPlan
    ? [
        { text: 'Đang gửi thông tin bài dạy đến AI...', duration: 1500, progress: 10 },
        { text: 'AI đang phân tích mục tiêu & yêu cầu cần đạt...', duration: 6000, progress: 30 },
        { text: 'Đang tích hợp Năng lực số (TT 02/2025) & Giáo dục AI (QĐ 2422)...', duration: 7000, progress: 55 },
        { text: 'Đang lồng ghép GDQP&AN theo Thông tư số 08/2024/TT-BGDĐT...', duration: 6000, progress: 75 },
        { text: 'AI đang soạn tiến trình 4 hoạt động dạy học...', duration: 7000, progress: 92 },
        { text: 'Đang hoàn thiện kế hoạch bài dạy...', duration: 2500, progress: 100 },
      ]
    : [
        { text: 'Đang gửi yêu cầu đến AI...', duration: 1500, progress: 10 },
        { text: 'AI đang phân tích cấu trúc đề...', duration: 8000, progress: 35 },
        { text: 'AI đang tạo Ma trận & Bản đặc tả...', duration: 9000, progress: 70 },
        { text: 'AI đang soạn câu hỏi & đáp án...', duration: 7000, progress: 95 },
        { text: 'Sắp xong! Đang hoàn thiện kết quả...', duration: 2500, progress: 100 },
      ];

  const [i, setI] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(steps[i].progress);
    if (i < steps.length - 1) {
      const t = setTimeout(() => setI((p) => p + 1), steps[i].duration);
      return () => clearTimeout(t);
    }
  }, [i]);

  return (
    <div
      className="
        flex flex-col items-center justify-center
        p-5 sm:p-8 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-xl
        border border-slate-200/80 dark:border-slate-800 w-full transition-colors duration-200
      "
      role="status"
      aria-live="polite"
    >
      <svg className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 dark:text-indigo-400 mb-4 sm:mb-6" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>

      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 sm:mb-4 text-center">
        {steps[i].text}
      </h3>

      <div className="w-full max-w-md bg-slate-200 dark:bg-slate-800 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner my-2" aria-label="Tiến trình tạo">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-in-out ${
            isLessonPlan
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
          }`}
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>

      <p className={`mt-1 sm:mt-2 text-sm sm:text-base font-semibold ${isLessonPlan ? 'text-emerald-700 dark:text-emerald-400' : 'text-indigo-700 dark:text-indigo-400'}`}>
        {progress}%
      </p>
      <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center">
        Quá trình AI xử lý có thể mất khoảng một phút. Vui lòng không đóng tab.
      </p>

      <button
        onClick={onCancel}
        className="
          mt-6 sm:mt-8 px-5 py-2.5 text-sm sm:text-base font-semibold rounded-lg
          text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/60 hover:bg-red-200 dark:hover:bg-red-900/60
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:ring-offset-slate-900
          transition cursor-pointer
        "
      >
        Hủy bỏ
      </button>
    </div>
  );
};

/* ------------------------- Error Message ------------------------- */
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => {
  const isLeaked =
    message.toLowerCase().includes("leaked") ||
    message.toLowerCase().includes("use another api key") ||
    message.toLowerCase().includes("permission_denied");

  const displayMessage = isLeaked
    ? 'Khóa API này đã bị Google vô hiệu hóa vì lý do bảo mật (bị lộ lên GitHub công khai - Leaked API Key). Vui lòng tạo một khóa API mới hoàn toàn miễn phí tại Google AI Studio và bấm nút "🔑 Đổi API Key" bên cạnh để tiếp tục.'
    : message.startsWith("{") && message.includes("message")
    ? (() => {
        try {
          const parsed = JSON.parse(message);
          return parsed.error?.message || message;
        } catch {
          return message;
        }
      })()
    : message;

  const handleChangeKeyAndRetry = () => {
    const newKey = promptForNewApiKey("Khóa API hiện tại đã bị Google vô hiệu hóa vì bị lộ công khai.");
    if (newKey && onRetry) {
      onRetry();
    }
  };

  return (
    <div className="p-5 sm:p-6 bg-red-50/90 dark:bg-slate-900 border border-red-200 dark:border-red-900/60 border-l-4 border-l-red-500 text-red-900 dark:text-red-200 rounded-xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        <div className="shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-base sm:text-lg text-red-800 dark:text-red-300">
            {isLeaked ? "⚠️ Khóa API bị Google thu hồi (Leaked API Key)" : "Thông báo từ hệ thống AI"}
          </p>
          <p className="mt-1 text-sm sm:text-base break-words text-slate-700 dark:text-slate-300 leading-relaxed">
            {displayMessage}
          </p>
          {isLeaked && (
            <p className="mt-2 text-xs text-red-700 dark:text-red-400 font-semibold">
              👉 Thầy/cô chỉ cần bấm nút <strong>"🔑 Đổi API Key"</strong> để dán key mới và tiếp tục ngay lập tức!
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {isLeaked && (
          <button
            onClick={handleChangeKeyAndRetry}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-lg shadow-sm transition active:scale-95"
          >
            <span>🔑</span>
            <span>Đổi API Key</span>
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg shadow-sm transition active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Thử lại ngay
          </button>
        )}
      </div>
    </div>
  );
};

/* ------------------------------ App ------------------------------ */
const App: React.FC = () => {
  // Top-level active menu: 'exam' (Tạo đề kiểm tra) | 'lessonPlan' (Soạn kế hoạch bài dạy)
  const [activeMenu, setActiveMenu] = useState<'exam' | 'lessonPlan'>('exam');

  /* ---------- EXAM STATE ---------- */
  const [formData, setFormData] = useState<ExamFormData>({
    schoolLevel: 'Tiểu học',
    subject: 'Toán',
    grade: 'Lớp 4',
    textbook: 'Kết nối tri thức với cuộc sống',
    knowledgeContent: '',
    duration: 40,
    multipleChoice: { percentage: 40, score: 4.0, questionCount: 8 },
    trueFalse: { percentage: 20, score: 2.0, questionCount: 2 },
    shortAnswer: { percentage: 20, score: 2.0, questionCount: 2 },
    essay: { percentage: 20, score: 2.0, questionCount: 1 },
    additionalRequirements: '',
  });

  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedExams, setSavedExams] = useState<SavedExamItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  /* ---------- LESSON PLAN STATE ---------- */
  const [lessonPlanFormData, setLessonPlanFormData] = useState<LessonPlanFormData>({
    schoolLevel: 'Tiểu học',
    grade: 'Lớp 4',
    subject: 'Tin học',
    textbook: 'Kết nối tri thức với cuộc sống',
    lessonName: 'Bài 1: Phần cứng và phần mềm máy tính',
    durationInPeriods: 1,
    week: 'Tuần 1',
    schoolName: '',
    teacherName: '',
    knowledgeContent: 'Nhận biết chức năng của phần cứng và phần mềm máy tính; mối quan hệ giữa phần cứng và phần mềm.',
    integrateDigitalCompetence: true,
    digitalDomains: [
      'Miền 1: Khai thác dữ liệu và thông tin',
      'Miền 4: An toàn số',
      'Miền 6: Ứng dụng Trí tuệ nhân tạo (AI)'
    ],
    integrateAi2422: true,
    aiStrands: [
      'Mạch A: Tư duy lấy con người làm trung tâm (Human-centred mindset)',
      'Mạch C: Kỹ thuật và Ứng dụng AI (AI Techniques & Applications)'
    ],
    suggestedAiTools: ['AutoDraw / Quick, Draw!', 'Canva Magic Studio (Edu)'],
    integrateQpan08: true,
    qpanThemes: ['Bản đồ hành chính Việt Nam & Chủ quyền Hoàng Sa, Trường Sa'],
    qpanMethods: ['Quan sát tranh ảnh, bản đồ chủ quyền & Video tư liệu'],
    pedagogicalMethod: 'Dạy học khám phá và giải quyết vấn đề',
    additionalRequirements: 'Có trò chơi tương tác khởi động, tích hợp câu hỏi liên hệ thực tế.',
  });

  const [lessonPlanResult, setLessonPlanResult] = useState<string | null>(null);
  const [isLessonPlanLoading, setIsLessonPlanLoading] = useState<boolean>(false);
  const [lessonPlanError, setLessonPlanError] = useState<string | null>(null);
  const [savedLessonPlans, setSavedLessonPlans] = useState<SavedLessonPlanItem[]>([]);
  const [isLessonPlanHistoryOpen, setIsLessonPlanHistoryOpen] = useState(false);

  /* ---------- SHARED STATE ---------- */
  const [pageVisits, setPageVisits] = useState<number>(0);
  const [generationClicks, setGenerationClicks] = useState<number>(0);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Dark Mode Theme State (sử dụng class CSS của Tailwind)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('eduai_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('eduai_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('eduai_theme', 'light');
      }
    } catch (e) {}
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const isCancelledRef = useRef(false);

  useEffect(() => {
    // Đồng bộ thống kê lượt truy cập & lượt tạo toàn cầu cho GitHub Pages
    trackPageView().then(({ visits, interactions }) => {
      setPageVisits(visits);
      setGenerationClicks(interactions);
    });

    // Load histories
    setSavedExams(getSavedExams());
    setSavedLessonPlans(getSavedLessonPlans());
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  /* ---------- EXAM HANDLERS ---------- */
  const handleCancelLoading = () => {
    isCancelledRef.current = true;
    setIsLoading(false);
    setIsLessonPlanLoading(false);
  };

  const handleStartExamGeneration = async (data: ExamFormData) => {
    trackInteraction().then((count) => setGenerationClicks(count));

    setIsLoading(true);
    setError(null);
    setExamResult(null);
    isCancelledRef.current = false;

    try {
      const resultText = await generateExam(data);
      if (isCancelledRef.current) return;

      const cleanText = (text: string) =>
        text.replace(/\*\*/g, '').replace(/<br>/gi, '\n').replace(/^---+\s*$/gm, '').trim();

      const flexibleHeader = (text: string) =>
        `(?:\\*\\*\\s*)?${text.replace(/[-\\/\\^$*+?.()|[\\]{}]/g, '\\$&')}(?:\\s*\\*\\*)?`;

      let fullRegex: RegExp;

      if (data.subject === 'Ngoại ngữ 1 (Tiếng Anh)') {
        const p1 = 'PART 1: EXAM MATRIX';
        const p2 = 'PART 2: TEST SPECIFICATION GRID';
        const p3 = 'PART 3: EXAM PAPER';
        const p4 = 'PART 4: ANSWER KEY & GRADING GUIDE';
        fullRegex = new RegExp(
          `${flexibleHeader(p1)}([\\s\\S]*?)` +
            `${flexibleHeader(p2)}([\\s\\S]*?)` +
            `${flexibleHeader(p3)}([\\s\\S]*?)` +
            `${flexibleHeader(p4)}([\\s\\S]*)`,
          'i'
        );
      } else {
        const p1 = 'PHẦN 1: MA TRẬN ĐỀ KIỂM TRA';
        const p2 = 'PHẦN 2: BẢN ĐẶC TẢ CHI TIẾT';
        const p3 = 'PHẦN 3: NỘI DUNG ĐỀ KIỂM TRA';
        const p4 = 'PHẦN 4: HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN';
        fullRegex = new RegExp(
          `${flexibleHeader(p1)}([\\s\\S]*?)` +
            `${flexibleHeader(p2)}([\\s\\S]*?)` +
            `${flexibleHeader(p3)}([\\s\\S]*?)` +
            `${flexibleHeader(p4)}([\\s\\S]*)`,
          'i'
        );
      }

      const matches = resultText.match(fullRegex);
      if (isCancelledRef.current) return;

      let finalResult: ExamResult;

      if (!matches || matches.length < 5) {
        console.warn('Could not parse all sections, showing raw output.');
        finalResult = {
          matrix: 'Không thể phân tích Ma trận từ kết quả trả về.',
          specification: 'Không thể phân tích Bản đặc tả từ kết quả trả về.',
          exam: 'Không thể phân tích Đề kiểm tra từ kết quả trả về.',
          answerKey: `Vui lòng kiểm tra kết quả thô:\n\n${cleanText(resultText)}`,
        };
      } else {
        finalResult = {
          matrix: cleanText(matches[1]),
          specification: cleanText(matches[2]),
          exam: cleanText(matches[3]),
          answerKey: cleanText(matches[4]),
        };
      }

      setExamResult(finalResult);

      const savedItem = saveExamToHistory(data, finalResult);
      setSavedExams(getSavedExams());
      setToastMessage({
        text: `Đã tự động lưu "${savedItem.title}" vào lịch sử!`,
        type: 'success',
      });

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);

    } catch (err) {
      if (!isCancelledRef.current) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    } finally {
      if (!isCancelledRef.current) setIsLoading(false);
    }
  };

  const handleViewExamFromHistory = (item: SavedExamItem) => {
    setFormData(item.formData);
    setExamResult(item.result);
    setError(null);
    setIsHistoryOpen(false);
    setToastMessage({
      text: `Đang xem lại kết quả: ${item.title}`,
      type: 'info',
    });
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleApplyExamParameters = (item: SavedExamItem) => {
    setFormData(item.formData);
    setIsHistoryOpen(false);
    setToastMessage({
      text: `Đã nạp toàn bộ thông số của "${item.title}". Bạn có thể chỉnh sửa trước khi tạo đề!`,
      type: 'info',
    });
    setTimeout(() => {
      document.getElementById('exam-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  /* ---------- LESSON PLAN HANDLERS ---------- */
  const handleStartLessonPlanGeneration = async (data: LessonPlanFormData) => {
    trackInteraction().then((count) => setGenerationClicks(count));

    setIsLessonPlanLoading(true);
    setLessonPlanError(null);
    setLessonPlanResult(null);
    isCancelledRef.current = false;

    try {
      const resultText = await generateLessonPlan(data);
      if (isCancelledRef.current) return;

      setLessonPlanResult(resultText);

      const savedItem = saveLessonPlanToHistory(data, resultText);
      setSavedLessonPlans(getSavedLessonPlans());
      setToastMessage({
        text: `Đã tự động lưu kế hoạch bài dạy "${savedItem.title}" vào lịch sử!`,
        type: 'success',
      });

      setTimeout(() => {
        document.getElementById('lesson-plan-result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      if (!isCancelledRef.current) {
        setLessonPlanError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    } finally {
      if (!isCancelledRef.current) setIsLessonPlanLoading(false);
    }
  };

  const handleViewLessonPlanFromHistory = (item: SavedLessonPlanItem) => {
    setLessonPlanFormData(item.formData);
    setLessonPlanResult(item.content);
    setLessonPlanError(null);
    setIsLessonPlanHistoryOpen(false);
    setToastMessage({
      text: `Đang xem lại kế hoạch bài dạy: ${item.title}`,
      type: 'info',
    });
    setTimeout(() => {
      document.getElementById('lesson-plan-result-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleApplyLessonPlanParameters = (item: SavedLessonPlanItem) => {
    setLessonPlanFormData(item.formData);
    setIsLessonPlanHistoryOpen(false);
    setToastMessage({
      text: `Đã nạp thông số bài "${item.title}". Bạn có thể chỉnh sửa trước khi soạn lại!`,
      type: 'info',
    });
    setTimeout(() => {
      document.getElementById('lesson-plan-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 max-w-7xl flex-grow">
        <Header
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          onGuideClick={() => setIsGuideOpen(true)}
          onHistoryClick={() => {
            if (activeMenu === 'exam') setIsHistoryOpen(true);
            else setIsLessonPlanHistoryOpen(true);
          }}
          examHistoryCount={savedExams.length}
          lessonPlanHistoryCount={savedLessonPlans.length}
          globalVisits={pageVisits}
          globalInteractions={generationClicks}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        {/* ========================================================================= */}
        {/* MENU 1: TẠO ĐỀ KIỂM TRA (CV 7991 & TT 27) */}
        {/* ========================================================================= */}
        {activeMenu === 'exam' && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Quick Recent Exam Bar if history exists */}
            {savedExams.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-blue-50/80 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-indigo-100/90 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-indigo-900 dark:text-indigo-400 uppercase tracking-wider">Đề vừa tạo:</span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{savedExams[0].title}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {savedExams[0].formData.duration} phút • {savedExams[0].formData.knowledgeContent ? `Nội dung: ${savedExams[0].formData.knowledgeContent.slice(0, 60)}...` : 'Toàn bộ nội dung'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleViewExamFromHistory(savedExams[0])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-750 border border-indigo-200 dark:border-slate-700 rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    Xem lại đề này
                  </button>

                  <button
                    onClick={() => handleApplyExamParameters(savedExams[0])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-750 border border-amber-200 dark:border-slate-700 rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    Dùng lại thông số
                  </button>

                  <button
                    onClick={() => setIsHistoryOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <span>Tất cả ({savedExams.length})</span>
                  </button>
                </div>
              </div>
            )}

            <main className="space-y-6 sm:space-y-8">
              <div id="exam-form-section">
                <ExamForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleStartExamGeneration}
                  isLoading={isLoading}
                />
              </div>

              <div id="results-section" className="mt-6 sm:mt-10">
                {isLoading && <LoadingIndicator onCancel={handleCancelLoading} />}
                {error && !isLoading && (
                  <ErrorMessage
                    message={error}
                    onRetry={() => handleStartExamGeneration(formData)}
                  />
                )}
                {examResult && !isLoading && (
                  <ResultsDisplay
                    result={examResult}
                    onRegenerate={() => handleStartExamGeneration(formData)}
                  />
                )}
              </div>
            </main>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MENU 2: SOẠN KẾ HOẠCH BÀI DẠY (CV 2345 / CV 5512 & KHUNG NLS TT 02/2025) */}
        {/* ========================================================================= */}
        {activeMenu === 'lessonPlan' && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Quick Recent Lesson Plan Bar if history exists */}
            {savedLessonPlans.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-blue-50/80 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-emerald-200/90 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider">Giáo án vừa soạn:</span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{savedLessonPlans[0].title}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {savedLessonPlans[0].formData.schoolLevel} • {savedLessonPlans[0].formData.durationInPeriods} tiết • {savedLessonPlans[0].formData.integrateDigitalCompetence ? 'Tích hợp Khung NLS TT 02/2025' : 'Tiến trình chuẩn'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleViewLessonPlanFromHistory(savedLessonPlans[0])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-750 border border-emerald-200 dark:border-slate-700 rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    Xem lại giáo án này
                  </button>

                  <button
                    onClick={() => handleApplyLessonPlanParameters(savedLessonPlans[0])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-750 border border-amber-200 dark:border-slate-700 rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    Dùng lại thông số
                  </button>

                  <button
                    onClick={() => setIsLessonPlanHistoryOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <span>Tất cả ({savedLessonPlans.length})</span>
                  </button>
                </div>
              </div>
            )}

            <main className="space-y-6 sm:space-y-8">
              <div id="lesson-plan-form-section">
                <LessonPlanForm
                  formData={lessonPlanFormData}
                  setFormData={setLessonPlanFormData}
                  onSubmit={handleStartLessonPlanGeneration}
                  isLoading={isLessonPlanLoading}
                  onOpenHistory={() => setIsLessonPlanHistoryOpen(true)}
                  historyCount={savedLessonPlans.length}
                />
              </div>

              <div id="lesson-plan-result-section" className="mt-6 sm:mt-10">
                {isLessonPlanLoading && <LoadingIndicator onCancel={handleCancelLoading} isLessonPlan />}
                {lessonPlanError && !isLessonPlanLoading && (
                  <ErrorMessage
                    message={lessonPlanError}
                    onRetry={() => handleStartLessonPlanGeneration(lessonPlanFormData)}
                  />
                )}
                {lessonPlanResult && !isLessonPlanLoading && (
                  <LessonPlanDisplay
                    content={lessonPlanResult}
                    formData={lessonPlanFormData}
                    onRegenerate={() => handleStartLessonPlanGeneration(lessonPlanFormData)}
                    onEditParameters={() => {
                      document.getElementById('lesson-plan-form-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                )}
              </div>
            </main>
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 animate-scale-in border border-slate-700">
          <div className="flex items-center gap-2.5 min-w-0">
            {toastMessage.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="text-xs sm:text-sm font-medium break-words">{toastMessage.text}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded-md transition"
            aria-label="Đóng thông báo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Modals */}
      <ExamHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={savedExams}
        onViewExam={handleViewExamFromHistory}
        onApplyParameters={handleApplyExamParameters}
        onDeleteItem={(id) => {
          const updated = deleteExamFromHistory(id);
          setSavedExams(updated);
        }}
        onClearAll={() => {
          clearAllExamHistory();
          setSavedExams([]);
          setToastMessage({ text: 'Đã xóa toàn bộ lịch sử đề thi.', type: 'info' });
        }}
      />

      <LessonPlanHistoryModal
        isOpen={isLessonPlanHistoryOpen}
        onClose={() => setIsLessonPlanHistoryOpen(false)}
        historyList={savedLessonPlans}
        onViewPlan={handleViewLessonPlanFromHistory}
        onApplyParameters={handleApplyLessonPlanParameters}
        onDeleteItem={(id) => {
          const updated = deleteLessonPlanFromHistory(id);
          setSavedLessonPlans(updated);
        }}
        onClearAll={() => {
          clearAllLessonPlanHistory();
          setSavedLessonPlans([]);
          setToastMessage({ text: 'Đã xóa toàn bộ lịch sử kế hoạch bài dạy.', type: 'info' });
        }}
      />

      <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <Footer visits={pageVisits} clicks={generationClicks} />
    </div>
  );
};

export default App;
