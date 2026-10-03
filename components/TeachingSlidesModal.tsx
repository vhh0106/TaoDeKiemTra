import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { LessonPlanFormData } from '../types';
import {
  generateStudentTeachingSlides,
  type SlidePresentationData,
  type SlideItem,
} from '../services/slideGeneratorService';
import {
  exportTeachingSlidesToPowerPoint,
  type PresentationTheme,
} from '../services/pptExportService';

interface TeachingSlidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: LessonPlanFormData;
  lessonPlanContent: string;
}

const THEMES: { id: PresentationTheme; label: string; bgClass: string; badgeClass: string; headerColor: string }[] = [
  { id: 'mint', label: '🌿 Xanh lá (Mint)', bgClass: 'from-emerald-50 via-teal-50/40 to-slate-50 dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900', badgeClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800', headerColor: 'bg-emerald-600' },
  { id: 'ocean', label: '🌊 Xanh dương (Ocean)', bgClass: 'from-blue-50 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900', badgeClass: 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800', headerColor: 'bg-blue-600' },
  { id: 'purple', label: '👑 Tím hoàng gia', bgClass: 'from-purple-50 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-purple-950/30 dark:to-slate-900', badgeClass: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800', headerColor: 'bg-purple-600' },
  { id: 'amber', label: '🌅 Cam năng động', bgClass: 'from-amber-50 via-orange-50/40 to-slate-50 dark:from-slate-900 dark:via-amber-950/30 dark:to-slate-900', badgeClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800', headerColor: 'bg-amber-600' },
];

const TeachingSlidesModal: React.FC<TeachingSlidesModalProps> = ({
  isOpen,
  onClose,
  formData,
  lessonPlanContent,
}) => {
  const [slideData, setSlideData] = useState<SlidePresentationData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentTheme, setCurrentTheme] = useState<PresentationTheme>('mint');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [revealedQuizAnswer, setRevealedQuizAnswer] = useState<boolean>(false);
  const [isExportingPpt, setIsExportingPpt] = useState<boolean>(false);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const fetchSlides = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setLoadingStep('AI Gemini đang phân tích Kế hoạch bài dạy...');

    const timer1 = setTimeout(() => {
      setLoadingStep('Thiết kế slide trực quan dành riêng cho học sinh trên lớp...');
    }, 2500);

    const timer2 = setTimeout(() => {
      setLoadingStep('Soạn thảo câu hỏi tương tác & trò chơi khởi động...');
    }, 5500);

    try {
      const data = await generateStudentTeachingSlides(formData, lessonPlanContent);
      setSlideData(data);
      setCurrentIndex(0);
      setRevealedQuizAnswer(false);
    } catch (err: any) {
      console.error('Failed to generate slides:', err);
      setError(err?.message || 'Không thể tạo slide từ kế hoạch bài dạy.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
      setLoadingStep('');
    }
  }, [formData, lessonPlanContent]);

  useEffect(() => {
    if (isOpen && !slideData && !isLoading) {
      fetchSlides();
    }
  }, [isOpen, slideData, isLoading, fetchSlides]);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isOpen || !slideData) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(prev + 1, slideData.slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, slideData, isFullscreen]);

  // Reset quiz answer reveal on slide switch
  useEffect(() => {
    setRevealedQuizAnswer(false);
  }, [currentIndex]);

  if (!isOpen) return null;

  const currentSlide: SlideItem | undefined = slideData?.slides[currentIndex];
  const totalSlides = slideData?.slides.length || 0;

  const handleDownloadPptx = async () => {
    if (!slideData) return;
    setIsExportingPpt(true);
    try {
      await exportTeachingSlidesToPowerPoint(slideData, formData.lessonName, currentTheme);
      setCopyNotice('Đã xuất file PowerPoint (.pptx) thành công!');
      setTimeout(() => setCopyNotice(null), 3000);
    } catch (err: any) {
      setCopyNotice('Lỗi: ' + (err?.message || 'Không thể đóng gói file PowerPoint.'));
      setTimeout(() => setCopyNotice(null), 3000);
    } finally {
      setIsExportingPpt(false);
    }
  };

  const handleCopyScript = async () => {
    if (!slideData) return;
    let scriptText = `BỘ SLIDE BÀI GIẢNG DẠY HỌC SINH: ${slideData.lessonTitle}\n`;
    scriptText += `Môn: ${slideData.subject} - Lớp: ${slideData.grade}\n\n`;

    slideData.slides.forEach((s, idx) => {
      scriptText += `========================================\n`;
      scriptText += `SLIDE ${idx + 1}: ${s.title}\n`;
      if (s.tag) scriptText += `Hoạt động: ${s.tag}\n`;
      if (s.bullets && s.bullets.length > 0) {
        scriptText += `Nội dung trên slide:\n` + s.bullets.map((b) => `• ${b}`).join('\n') + `\n`;
      }
      if (s.highlightBox) {
        scriptText += `Ghi chú trọng tâm: ${s.highlightBox}\n`;
      }
      if (s.question) {
        scriptText += `Câu hỏi trắc nghiệm: ${s.question}\n`;
        (s.options || []).forEach((opt) => (scriptText += `  ${opt}\n`));
        scriptText += `Đáp án đúng: ${s.correctAnswer} - ${s.explanation}\n`;
      }
      if (s.speakerNotes) {
        scriptText += `\n[LỜI THOẠI GIÁO VIÊN]:\n${s.speakerNotes}\n`;
      }
      scriptText += `\n`;
    });

    try {
      await navigator.clipboard.writeText(scriptText);
      setCopyNotice('Đã sao chép toàn bộ kịch bản slide!');
      setTimeout(() => setCopyNotice(null), 2500);
    } catch {}
  };

  const themeConfig = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 ${
        isFullscreen ? '!p-0' : ''
      }`}
      role="dialog"
      aria-modal="true"
      onClick={isFullscreen ? undefined : onClose}
    >
      <div
        className={`relative bg-white w-full rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'h-screen w-screen max-w-none rounded-none'
            : 'max-w-5xl max-h-[95vh] h-[92vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-md rounded-xl text-base sm:text-xl shrink-0">
              📊
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-lg font-black tracking-tight truncate">
                  Slide Giảng Dạy Trên Lớp Cho Học Sinh
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-amber-400 text-amber-950 font-bold text-[10px] sm:text-xs rounded-full uppercase tracking-wider shrink-0">
                  Gemini AI Thiết Kế
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-indigo-100 truncate mt-0.5">
                {formData.lessonName} • {formData.subject} {formData.grade} (Kết nối tri thức)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 transition flex items-center gap-1"
              title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Trình chiếu toàn màn hình'}
            >
              <span>{isFullscreen ? '🗗' : '🖥️'}</span>
              <span className="hidden md:inline">{isFullscreen ? 'Thu nhỏ' : 'Chiếu trên lớp'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Action Controls & Theme Selector */}
        {!isFullscreen && (
          <div className="px-3 sm:px-6 py-2 bg-slate-50/90 dark:bg-slate-850/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
            {/* Theme switcher */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline">Chủ đề:</span>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {THEMES.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setCurrentTheme(th.id)}
                    className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      currentTheme === th.id
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Top action buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
              {copyNotice && (
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 animate-fade-in">
                  ✓ {copyNotice}
                </span>
              )}

              <button
                onClick={handleCopyScript}
                disabled={!slideData || isLoading}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition shadow-2xs active:scale-95 disabled:opacity-50"
                title="Sao chép toàn bộ văn bản và lời thoại bài giảng"
              >
                📋 <span className="hidden sm:inline">Sao chép kịch bản</span>
              </button>

              <button
                onClick={fetchSlides}
                disabled={isLoading}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition shadow-2xs active:scale-95 disabled:opacity-50"
                title="Yêu cầu AI Gemini thiết kế lại toàn bộ Slide"
              >
                🔄 <span className="hidden sm:inline">Thiết kế lại</span>
              </button>

              <button
                onClick={handleDownloadPptx}
                disabled={!slideData || isLoading || isExportingPpt}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-sm transition active:scale-95 disabled:opacity-50"
              >
                {isExportingPpt ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang đóng gói...</span>
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    <span>Tải File (.pptx)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-5 flex flex-col justify-between bg-slate-100/70 dark:bg-slate-950/70">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  ✨
                </div>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Gemini AI Đang Chuyển Hóa Kế Hoạch Bài Dạy Thành Slide
              </h3>
              <p className="text-xs sm:text-sm text-indigo-700 dark:text-indigo-400 font-semibold animate-pulse max-w-md">
                {loadingStep || 'Đang chuẩn bị slide bài giảng tương tác...'}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-4 max-w-sm">
                Quá trình phân tích sư phạm và xuất kịch bản slide có thể mất khoảng 5 - 10 giây.
              </p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-base sm:text-lg font-bold text-red-700 dark:text-red-400 mb-1">
                Không thể tạo slide bài giảng
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mb-4">{error}</p>
              <button
                onClick={fetchSlides}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow transition"
              >
                Thử lại ngay
              </button>
            </div>
          ) : currentSlide ? (
            <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto w-full">
              {/* 16:9 Presentation Stage Card */}
              <div
                className={`relative w-full min-h-[360px] sm:min-h-0 sm:aspect-video rounded-2xl sm:rounded-3xl border border-slate-300 dark:border-slate-700 shadow-xl overflow-y-auto sm:overflow-hidden bg-gradient-to-br ${themeConfig.bgClass} flex flex-col justify-between p-3.5 sm:p-8 select-text`}
              >
                {/* Header Tag / Banner */}
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/80 pb-2.5 mb-2 sm:mb-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full border shadow-2xs ${themeConfig.badgeClass}`}
                    >
                      {currentSlide.tag || 'BÀI GIẢNG ĐIỆN TỬ'}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                      {formData.subject} {formData.grade}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                    Trang {currentIndex + 1} / {totalSlides}
                  </span>
                </div>

                {/* Main Slide Body based on Slide Type */}
                <div className="flex-1 flex flex-col justify-center min-h-0 py-1 sm:py-2">
                  {currentSlide.type === 'cover' ? (
                    <div className="space-y-2 sm:space-y-4 text-center my-auto">
                      <div className="inline-block px-3 py-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-400 shadow-2xs">
                        BÀI GIẢNG ĐIỆN TỬ TƯƠNG TÁC
                      </div>
                      <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                        {currentSlide.title || formData.lessonName}
                      </h1>
                      <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 font-medium">
                        {currentSlide.subtitle || `${formData.subject} - ${formData.grade}`}
                      </p>
                      <div className="pt-2 sm:pt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
                        {currentSlide.meta || `Giáo viên: ${formData.teacherName || 'Thầy/Cô'} • ${formData.schoolName || ''}`}
                      </div>
                    </div>
                  ) : currentSlide.type === 'quiz' ? (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="p-3 sm:p-4 bg-white/95 dark:bg-slate-800/95 rounded-xl sm:rounded-2xl border border-purple-200 dark:border-purple-800 shadow-xs">
                        <h3 className="text-sm sm:text-lg font-bold text-purple-950 dark:text-purple-200 flex items-start gap-2">
                          <span className="shrink-0 text-purple-600 dark:text-purple-400">❓</span>
                          <span>{currentSlide.question || currentSlide.title}</span>
                        </h3>
                      </div>

                      {/* 4 Choices */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {(currentSlide.options || []).map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-2.5 sm:p-3 rounded-xl border font-medium text-xs sm:text-sm transition-all ${
                              revealedQuizAnswer && opt.startsWith(currentSlide.correctAnswer || 'A')
                                ? 'bg-emerald-100/90 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-400 font-bold'
                                : 'bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-600'
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>

                      {/* Quiz Answer Reveal Toggle */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => setRevealedQuizAnswer(!revealedQuizAnswer)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-2xs"
                        >
                          <span>{revealedQuizAnswer ? '🙈 Ẩn đáp án' : '👁️ Xem đáp án & Giải thích'}</span>
                        </button>

                        {revealedQuizAnswer && currentSlide.explanation && (
                          <div className="text-xs sm:text-sm font-semibold text-purple-900 dark:text-purple-200 bg-purple-100/80 dark:bg-purple-950/80 px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-800 animate-scale-in">
                            🎉 Đáp án {currentSlide.correctAnswer}: {currentSlide.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 sm:space-y-3.5">
                      <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {currentSlide.title}
                      </h2>

                      {/* Bullets Card */}
                      {currentSlide.bullets && currentSlide.bullets.length > 0 && (
                        <div className="p-3 sm:p-5 bg-white/95 dark:bg-slate-800/95 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2 sm:space-y-2.5">
                          {currentSlide.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm md:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                              <span className="break-words">{b}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Highlight Box */}
                      {currentSlide.highlightBox && (
                        <div className="p-2.5 sm:p-3 bg-amber-100/80 dark:bg-amber-950/60 rounded-xl border border-amber-300 dark:border-amber-800 text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 flex items-start gap-2 shadow-2xs">
                          <span className="shrink-0 text-base">💡</span>
                          <span className="leading-snug">{currentSlide.highlightBox}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer on slide */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  <span>EduAI • Chuẩn Bộ GD&amp;ĐT</span>
                  <span>Nhấn phím mũi tên ⬅️ ➡️ để chuyển slide</span>
                </div>
              </div>

              {/* Teacher Speaker Notes Drawer */}
              {currentSlide.speakerNotes && (
                <div className="p-3 sm:p-4 bg-amber-50/90 dark:bg-slate-800/90 rounded-xl sm:rounded-2xl border border-amber-200/80 dark:border-amber-900/60 text-amber-950 dark:text-amber-200 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300 mb-1">
                    <span>🎤</span>
                    <span>Gợi ý lời thoại của giáo viên khi chiếu Slide này:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed italic">
                    &ldquo;{currentSlide.speakerNotes}&rdquo;
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Bottom Slide Strip & Navigation Bar */}
          {slideData && !isLoading && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              {/* Prev / Next controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentIndex === 0}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 transition shadow-2xs disabled:opacity-40"
                >
                  ⬅️ Trước
                </button>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2">
                  {currentIndex + 1} / {totalSlides}
                </span>
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1))}
                  disabled={currentIndex === totalSlides - 1}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 transition shadow-2xs disabled:opacity-40"
                >
                  Sau ➡️
                </button>
              </div>

              {/* Thumbnails strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full sm:max-w-md py-1">
                {slideData.slides.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-8 min-w-8 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center shrink-0 ${
                      currentIndex === idx
                        ? 'bg-indigo-600 text-white shadow-xs scale-105'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                    title={s.title}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeachingSlidesModal;
