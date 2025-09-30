import React, { useState, useEffect, useRef } from 'react';
import { ExamFormData, ExamResult } from './types';
import ExamForm from './components/ExamForm';
import ResultsDisplay from './components/ResultsDisplay';
import { generateExam } from './services/geminiService';

/* --------------------------- Header --------------------------- */
const Header: React.FC<{ onGuideClick: () => void }> = ({ onGuideClick }) => (
  <header
    className="
      bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-lg
      border border-slate-200/80 mb-4 sm:mb-6 lg:mb-8
      sticky top-0 lg:top-4 z-40
      px-safe
    "
    role="banner"
  >
    <div className="flex items-center justify-between p-3 sm:p-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-2 rounded-lg lg:rounded-xl text-white shadow-md shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
            <path fill="currentColor" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18A2.25 2.25 0 0 0 20.25 16.5V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6.108V18A2.25 2.25 0 0 0 7.5 20.25h.375m1.5-15.118a.75.75 0 0 0-.75.75v3.75a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75v-3.75a.75.75 0 0 0-.75-.75h-4.5Z"/>
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight truncate">
          Tạo Đề Kiểm Tra Theo CV7991
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          onClick={onGuideClick}
          className="
            inline-flex items-center gap-2 text-xs sm:text-sm font-semibold
            text-slate-700 hover:text-indigo-700
            bg-slate-100 hover:bg-indigo-100
            px-3 py-2 sm:px-4 rounded-full
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            transition
          "
          aria-label="Xem hướng dẫn sử dụng"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span className="hidden sm:inline">Hướng dẫn</span>
        </button>

        {/* Avatar nhỏ, bo tròn, có ring để dễ thấy trên mobile */}
        <a
          href="https://www.facebook.com/vhh0106/"
          target="_blank"
          rel="noopener noreferrer"
          className="ring-1 sm:ring-2 ring-offset-1 ring-offset-white ring-indigo-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Trang Facebook của Vũ Hoàng Hiệp (mở tab mới)"
        >
          <img
            src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/543117120_4112665879051174_5463830652082981920_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=UVFebXqE6DoQ7kNvwFowOHQ&_nc_oc=AdmhktLbevr1HwLq1ht2moviLk2zVcWIB2m7KnbFDyjM7V8tdclS40bSW9EwXfKC700&_nc_zt=23&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=KDlMF5jWrA3zBsxQviGygQ&oh=00_AfYEa6uqpXpHC-CoX3Ucp23saX44j7BpCJPnMQ5VltNtJQ&oe=68E00E10"
            alt="Vũ Hoàng Hiệp"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover transition-transform hover:scale-110"
            loading="lazy"
            decoding="async"
          />
        </a>
      </div>
    </div>
  </header>
);

/* ------------------------ User Guide Modal ------------------------ */
const UserGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const guideSteps = [
    { title: "Bước 1: Thiết lập Thông số Chung", description: "Xác định các tham số: Cấp học, Lớp, Môn học, Bộ sách, Thời gian." },
    { title: "Bước 2: Phạm vi Kiến thức", description: "Liệt kê chương, bài, chủ đề cụ thể. Càng chi tiết càng bám sát mục tiêu." },
    { title: "Bước 3: Cấu trúc Đề", description: "Phân bổ số câu, %, điểm cho từng dạng. Tổng điểm 10, tổng % 100." },
    { title: "Bước 4: Tinh chỉnh", description: "Điền 'Yêu cầu bổ sung' như liên hệ thực tế, mức độ vận dụng, v.v." },
    { title: "Bước 5: Khởi tạo", description: "Nhấn '🚀 Tạo đề ngay!'. Không đóng trình duyệt trong lúc xử lý." },
    { title: "Bước 6: Khai thác", description: "Xem Ma trận/Đặc tả/Đề/Đáp án. Sao chép, xuất .docx, hoặc tạo lại." }
  ];

  // ESC để đóng trên desktop & mobile keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Hướng dẫn sử dụng"
    >
      <div
        className="
          relative bg-white w-full max-w-4xl
          h-[92vh] sm:h-auto sm:max-h-[90vh]
          rounded-t-2xl sm:rounded-2xl shadow-2xl
          overflow-y-auto
          p-5 sm:p-8 m-0 sm:m-4
          animate-scale-in
        "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
          aria-label="Đóng hướng dẫn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="text-center mb-4 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">Hướng dẫn sử dụng</h2>
          <p className="mt-2 text-sm sm:text-lg text-slate-600">Quy trình tạo bộ đề kiểm tra hoàn chỉnh</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {guideSteps.map((step, i) => (
            <div
              key={i}
              className="
                flex items-start gap-3 sm:gap-5
                p-4 sm:p-5 rounded-xl border border-slate-200
                bg-slate-50/70 hover:shadow-md hover:border-indigo-200 transition
              "
            >
              <div className="flex-shrink-0 flex items-center justify-center bg-indigo-100 rounded-full h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 font-bold text-lg sm:text-xl">
                {i + 1}
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-base sm:text-xl font-semibold text-slate-800">{step.title}</h3>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-dashed">
          <p className="text-center font-semibold text-red-700 bg-red-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
            <span className="font-bold">Lưu ý:</span> Hãy thẩm định kỹ nội dung AI tạo trước khi dùng chính thức.
          </p>
        </div>
      </div>
    </div>
  );
};

/* --------------------------- Footer --------------------------- */
const Footer: React.FC<{ visits: number; clicks: number }> = ({ visits, clicks }) => (
  <footer className="text-center py-8 mt-10 sm:mt-12 border-t border-slate-200 text-slate-500 text-xs sm:text-sm">
    <p>
      Phát triển bởi:{' '}
      <a
        href="https://www.facebook.com/vhh0106/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 hover:underline font-semibold"
      >
        Vũ Hoàng Hiệp
      </a>{' '}
      | Zalo: 0348554851
    </p>
    {(visits > 0 || clicks > 0) && (
      <p className="mt-2 text-slate-600 font-medium">
        <span className="mx-1">📊</span>
        {visits.toLocaleString('vi-VN')} lượt truy cập &{' '}
        {clicks.toLocaleString('vi-VN')} lượt tạo đề
      </p>
    )}
  </footer>
);

/* ---------------------- Loading Indicator ---------------------- */
const LoadingIndicator: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const steps = [
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
        p-5 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-xl
        border border-slate-200/80 w-full
      "
      role="status"
      aria-live="polite"
    >
      <svg className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-indigo-600 mb-4 sm:mb-6" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>

      <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-4 text-center">
        {steps[i].text}
      </h3>

      <div className="w-full max-w-md bg-slate-200 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner my-2" aria-label="Tiến trình tạo đề">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-in-out"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>

      <p className="mt-1 sm:mt-2 text-sm sm:text-base font-semibold text-indigo-700">{progress}%</p>
      <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-slate-500 text-center">
        Quá trình có thể mất khoảng một phút. Vui lòng không đóng tab.
      </p>

      <button
        onClick={onCancel}
        className="
          mt-6 sm:mt-8 px-5 py-2.5 text-sm sm:text-base font-semibold rounded-lg
          text-red-700 bg-red-100 hover:bg-red-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
          transition
        "
      >
        Hủy bỏ
      </button>
    </div>
  );
};

/* ------------------------- Error Message ------------------------- */
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-5 sm:p-6 bg-red-50/80 border-l-4 border-red-500 text-red-800 rounded-xl shadow-lg flex items-start gap-3 sm:gap-4">
    <div className="shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>
    <div className="min-w-0">
      <p className="font-bold text-base sm:text-lg">Đã xảy ra lỗi</p>
      <p className="mt-1 text-sm sm:text-base break-words">{message}</p>
    </div>
  </div>
);

/* ------------------------------ App ------------------------------ */
const App: React.FC = () => {
  const [formData, setFormData] = useState<ExamFormData>({
    schoolLevel: 'Tiểu học',
    subject: 'Tin học',
    grade: 'Lớp 5',
    textbook: 'Kết nối tri thức',
    knowledgeContent: '',
    duration: 45,
    multipleChoice: { percentage: 30, score: 3.0, questionCount: 6 },
    trueFalse: { percentage: 20, score: 2.0, questionCount: 4 },
    shortAnswer: { percentage: 20, score: 2.0, questionCount: 2 },
    essay: { percentage: 30, score: 3.0, questionCount: 1 },
    additionalRequirements: '',
  });
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageVisits, setPageVisits] = useState<number>(0);
  const [generationClicks, setGenerationClicks] = useState<number>(0);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const isCancelledRef = useRef(false);

  const getStat = (key: string): number => {
    try {
      return parseInt(localStorage.getItem(key) || '0', 10);
    } catch { return 0; }
  };

  const incrementStat = (key: string): number => {
    const currentVal = getStat(key);
    const newVal = currentVal + 1;
    try {
      localStorage.setItem(key, newVal.toString());
    } catch (error) {
      console.error(`Failed to update stat '${key}' in localStorage:`, error);
    }
    return newVal;
  };

  useEffect(() => {
    const newVisits = incrementStat('pageVisits');
    setPageVisits(newVisits);
    const currentClicks = getStat('generationClicks');
    setGenerationClicks(currentClicks);
  }, []);

  const handleCancelLoading = () => {
    isCancelledRef.current = true;
    setIsLoading(false);
  };

  const handleStartGeneration = async (data: ExamFormData) => {
    const newClicks = incrementStat('generationClicks');
    setGenerationClicks(newClicks);

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

      if (!matches || matches.length < 5) {
        console.warn('Could not parse all sections, showing raw output.');
        setExamResult({
          matrix: 'Không thể phân tích Ma trận từ kết quả trả về.',
          specification: 'Không thể phân tích Bản đặc tả từ kết quả trả về.',
          exam: 'Không thể phân tích Đề kiểm tra từ kết quả trả về.',
          answerKey: `Vui lòng kiểm tra kết quả thô:\n\n${cleanText(resultText)}`,
        });
      } else {
        setExamResult({
          matrix: cleanText(matches[1]),
          specification: cleanText(matches[2]),
          exam: cleanText(matches[3]),
          answerKey: cleanText(matches[4]),
        });
      }
    } catch (err) {
      if (!isCancelledRef.current) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    } finally {
      if (!isCancelledRef.current) setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 max-w-7xl flex-grow">
        <Header onGuideClick={() => setIsGuideOpen(true)} />

        <main className="space-y-6 sm:space-y-8">
          {/* ExamForm đã được tối ưu responsive ở file trước */}
          <ExamForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleStartGeneration}
            isLoading={isLoading}
          />

          <div className="mt-6 sm:mt-10">
            {isLoading && <LoadingIndicator onCancel={handleCancelLoading} />}
            {error && !isLoading && <ErrorMessage message={error} />}
            {examResult && !isLoading && (
              <ResultsDisplay
                result={examResult}
                onRegenerate={() => handleStartGeneration(formData)}
              />
            )}
          </div>
        </main>
      </div>

      <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <Footer visits={pageVisits} clicks={generationClicks} />
    </div>
  );
};

export default App;
