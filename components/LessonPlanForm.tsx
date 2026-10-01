import React, { useState, useEffect } from 'react';
import type { LessonPlanFormData } from '../types';
import {
  SCHOOL_LEVELS,
  GRADES_BY_LEVEL,
  SUBJECTS_BY_LEVEL,
  DIGITAL_COMPETENCE_DOMAINS,
  DIGITAL_LEVEL_BY_GRADE,
  PEDAGOGICAL_METHODS,
} from '../constants';

interface LessonPlanFormProps {
  formData: LessonPlanFormData;
  setFormData: React.Dispatch<React.SetStateAction<LessonPlanFormData>>;
  onSubmit: (data: LessonPlanFormData) => void;
  isLoading: boolean;
  onOpenHistory: () => void;
  historyCount: number;
}

const LessonPlanForm: React.FC<LessonPlanFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isLoading,
  onOpenHistory,
  historyCount,
}) => {
  const [grades, setGrades] = useState<string[]>(GRADES_BY_LEVEL[formData.schoolLevel]);
  const [subjects, setSubjects] = useState<string[]>(SUBJECTS_BY_LEVEL[formData.schoolLevel]);

  useEffect(() => {
    const newGrades = GRADES_BY_LEVEL[formData.schoolLevel] || [];
    const newSubjects = SUBJECTS_BY_LEVEL[formData.schoolLevel] || [];
    setGrades(newGrades);
    setSubjects(newSubjects);

    if (!newGrades.includes(formData.grade)) {
      handleChange('grade', newGrades[0] || 'Lớp 1');
    }
    if (!newSubjects.includes(formData.subject)) {
      handleChange('subject', newSubjects[0] || 'Toán');
    }
  }, [formData.schoolLevel]);

  // Luôn cố định bộ sách Kết nối tri thức với cuộc sống
  useEffect(() => {
    if (formData.textbook !== 'Kết nối tri thức với cuộc sống') {
      handleChange('textbook', 'Kết nối tri thức với cuộc sống');
    }
  }, []);

  const handleChange = (field: keyof LessonPlanFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleDomain = (domainName: string) => {
    setFormData((prev) => {
      const exists = prev.digitalDomains.includes(domainName);
      const updated = exists
        ? prev.digitalDomains.filter((d) => d !== domainName)
        : [...prev.digitalDomains, domainName];
      return { ...prev, digitalDomains: updated };
    });
  };

  const [formError, setFormError] = useState<string | null>(null);

  const loadLessonPlanSample = (type: 'tinhoc4' | 'toan4' | 'tv4') => {
    setFormError(null);
    if (type === 'tinhoc4') {
      setFormData((prev) => ({
        ...prev,
        schoolLevel: 'Tiểu học',
        grade: 'Lớp 4',
        subject: 'Tin học',
        textbook: 'Kết nối tri thức với cuộc sống',
        lessonName: 'Bài 1: Phần cứng và phần mềm máy tính',
        durationInPeriods: 1,
        periodNumber: '1',
        week: 'Tuần 1',
        classesTaught: '4A, 4B',
        schoolName: 'Trường Tiểu học',
        teacherName: 'Giáo viên',
        knowledgeContent: 'Nhận biết và phân biệt được phần cứng và phần mềm máy tính; nêu được mối quan hệ gắn bó giữa phần cứng và phần mềm qua ví dụ thực tế.',
        integrateDigitalCompetence: true,
        digitalDomains: [
          'Miền 1: Khai thác dữ liệu và thông tin',
          'Miền 4: An toàn số',
          'Miền 6: Ứng dụng Trí tuệ nhân tạo (AI)'
        ],
        pedagogicalMethod: 'Dạy học khám phá và giải quyết vấn đề',
        additionalRequirements: 'Có trò chơi tương tác khởi động, tích hợp câu hỏi liên hệ thực tế và hướng dẫn an toàn khi sử dụng thiết bị.'
      }));
    } else if (type === 'toan4') {
      setFormData((prev) => ({
        ...prev,
        schoolLevel: 'Tiểu học',
        grade: 'Lớp 4',
        subject: 'Toán',
        textbook: 'Kết nối tri thức với cuộc sống',
        lessonName: 'Bài 25: Tìm hai số khi biết tổng và hiệu của hai số đó (Tiết 1)',
        durationInPeriods: 1,
        periodNumber: '1',
        week: 'Tuần 12',
        classesTaught: '4A',
        schoolName: 'Trường Tiểu học',
        teacherName: 'Giáo viên',
        knowledgeContent: 'Biết cách vẽ sơ đồ đoạn thẳng để biểu diễn bài toán; tìm được hai số khi biết tổng và hiệu của chúng bằng hai cách giải cơ bản.',
        integrateDigitalCompetence: true,
        digitalDomains: [
          'Miền 1: Khai thác dữ liệu và thông tin',
          'Miền 5: Giải quyết vấn đề'
        ],
        pedagogicalMethod: 'Dạy học phát hiện và giải quyết vấn đề',
        additionalRequirements: 'Thiết kế hoạt động trải nghiệm thực tế với đồ dùng học tập trực quan.'
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        schoolLevel: 'Tiểu học',
        grade: 'Lớp 4',
        subject: 'Tiếng Việt',
        textbook: 'Kết nối tri thức với cuộc sống',
        lessonName: 'Luyện từ và câu: Luyện tập về từ đơn và từ phức',
        durationInPeriods: 1,
        periodNumber: '1',
        week: 'Tuần 3',
        classesTaught: '4A',
        schoolName: 'Trường Tiểu học',
        teacherName: 'Giáo viên',
        knowledgeContent: 'Phân biệt được từ đơn và từ phức; nhận biết từ ghép và từ láy trong văn bản; vận dụng đặt câu với các từ ngữ đã học.',
        integrateDigitalCompetence: true,
        digitalDomains: [
          'Miền 2: Giao tiếp và hợp tác số',
          'Miền 3: Sáng tạo nội dung số'
        ],
        pedagogicalMethod: 'Dạy học hợp tác nhóm',
        additionalRequirements: 'Tổ chức trò chơi ghép từ nhanh trên bảng nhóm tương tác.'
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lessonName.trim()) {
      setFormError('Vui lòng nhập Tên bài học trước khi tạo!');
      return;
    }
    setFormError(null);
    onSubmit(formData);
  };

  const currentDigitalLevel = DIGITAL_LEVEL_BY_GRADE[formData.grade] || 'Cơ bản';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Banner Notice */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-colors shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        formData.schoolLevel === 'Tiểu học'
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-emerald-200'
          : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-indigo-200'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl text-white shrink-0 shadow-xs ${
            formData.schoolLevel === 'Tiểu học' ? 'bg-emerald-600' : 'bg-indigo-600'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Soạn Kế Hoạch Bài Dạy Chuẩn {formData.schoolLevel === 'Tiểu học' ? 'CV 2345/BGDĐT-GDTH' : 'CV 5512/BGDĐT-GDTrH'}
              </h2>
              <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                Bộ sách: Kết nối tri thức với cuộc sống
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Tự động tích hợp <strong>Năng lực số (Thông tư 02/2025/TT-BGDĐT, CV 3456/BGDĐT-GDPT)</strong> & <strong>Tích hợp AI</strong> kèm theo bộ mã chuẩn hóa.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenHistory}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-indigo-700 font-semibold text-xs sm:text-sm rounded-xl border border-indigo-200 shadow-xs transition shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Giáo án đã lưu ({historyCount})</span>
        </button>
      </div>

      {/* Card 1: Thông tin hành chính & Bài học (Theo định dạng mẫu văn bản PDF) */}
      <section className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-5 sm:p-7 space-y-5">
        <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-indigo-700 flex items-center gap-2">
              <span>1. Thông tin bài dạy & Hành chính</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Định dạng tiêu đề, thời gian, lớp học theo chuẩn mẫu văn bản kế hoạch bài dạy
            </p>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-full border border-indigo-100">
            Sách Kết nối tri thức
          </span>
        </div>

        {/* Thanh nạp bài mẫu nhanh */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-2xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🪄</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-950">
              Thử nghiệm nhanh với giáo án mẫu chuẩn:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => loadLessonPlanSample('tinhoc4')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs transition active:scale-95"
            >
              💻 Tin học 4 (TT 02 & AI)
            </button>
            <button
              type="button"
              onClick={() => loadLessonPlanSample('toan4')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs transition active:scale-95"
            >
              📐 Toán 4 (Tổng - Hiệu)
            </button>
            <button
              type="button"
              onClick={() => loadLessonPlanSample('tv4')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs transition active:scale-95"
            >
              📖 Tiếng Việt 4 (Từ đơn & Từ phức)
            </button>
          </div>
        </div>

        {/* Hàng 1: Trường, Tuần, Môn, Cấp học */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Cơ sở giáo dục (Trường)
            </label>
            <input
              type="text"
              value={formData.schoolName || ''}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              placeholder="VD: Trường TH Sơn Hạ"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Tuần thực hiện
            </label>
            <input
              type="text"
              value={formData.week || ''}
              onChange={(e) => handleChange('week', e.target.value)}
              placeholder="VD: TUẦN 04"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Cấp học <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.schoolLevel}
              onChange={(e) => handleChange('schoolLevel', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              {SCHOOL_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Khối lớp <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.grade}
              onChange={(e) => handleChange('grade', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              {grades.map((gr) => (
                <option key={gr} value={gr}>{gr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Hàng 2: Môn học, Bộ sách áp dụng, Tiết số, Lớp dạy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Môn học <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Bộ sách giáo khoa
            </label>
            <div className="px-3 py-2 border border-indigo-200 rounded-xl bg-indigo-50/70 text-indigo-900 font-bold text-sm flex items-center gap-1.5">
              <span>📘</span>
              <span className="truncate">Kết nối tri thức với cuộc sống</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Tiết số
            </label>
            <input
              type="text"
              value={formData.periodNumber || ''}
              onChange={(e) => handleChange('periodNumber', e.target.value)}
              placeholder="VD: tiết 1 (hoặc tiết 2)"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Lớp dạy
            </label>
            <input
              type="text"
              value={formData.classesTaught || ''}
              onChange={(e) => handleChange('classesTaught', e.target.value)}
              placeholder="VD: 3A, 3B, 3C (hoặc 4A, 4B)"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>
        </div>

        {/* Hàng 3: Ngày soạn, Ngày dạy, Giáo viên, Người ký duyệt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Ngày soạn
            </label>
            <input
              type="text"
              value={formData.prepDate || ''}
              onChange={(e) => handleChange('prepDate', e.target.value)}
              placeholder="VD: 20/09/2026"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Ngày dạy
            </label>
            <input
              type="text"
              value={formData.teachDate || ''}
              onChange={(e) => handleChange('teachDate', e.target.value)}
              placeholder="VD: 28-29-30/09/2026"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Giáo viên giảng dạy
            </label>
            <input
              type="text"
              value={formData.teacherName || ''}
              onChange={(e) => handleChange('teacherName', e.target.value)}
              placeholder="VD: Vũ Hoàng Hiệp"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Người ký duyệt (BGH/Tổ trưởng)
            </label>
            <input
              type="text"
              value={formData.approverName || ''}
              onChange={(e) => handleChange('approverName', e.target.value)}
              placeholder="VD: Nguyễn Thị Pô Ly"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>
        </div>

        {/* Hàng 4: Chủ đề & Tên bài học */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Chủ đề (Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.themeName || ''}
              onChange={(e) => handleChange('themeName', e.target.value)}
              placeholder="VD: CHỦ ĐỀ 1: CÔNG NGHỆ VÀ ĐỜI SỐNG"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Tên bài học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.lessonName}
              onChange={(e) => handleChange('lessonName', e.target.value)}
              placeholder="VD: Bài 2: MỘT SỐ LOẠI HOA, CÂY CẢNH PHỔ BIẾN (hoặc Bài 2: Xử lý thông tin...)"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white font-medium"
            />
          </div>
        </div>
      </section>

      {/* Card 2: Tự động Tích hợp Năng lực số & Tích hợp AI (Kèm bộ mã chuẩn) */}
      <section className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-5 sm:p-7 space-y-5">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                TỰ ĐỘNG GEN KÈM MÃ
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-emerald-800">
                2. Tích hợp Năng lực số & Tích hợp AI (Kèm bộ mã chuẩn)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hệ thống tự động phân bổ và gắn mã chuẩn hóa NLS (VD: <code>NLS 1.1.CB1a</code>) và mã AI (VD: <code>4.A1.3; 4.C2.3</code>) vào yêu cầu cần đạt và tiến trình bài dạy.
            </p>
          </div>

          <label className="inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={formData.integrateDigitalCompetence}
              onChange={(e) => handleChange('integrateDigitalCompetence', e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ms-3 text-sm font-semibold text-slate-700">
              {formData.integrateDigitalCompetence ? 'Đang bật' : 'Tắt'}
            </span>
          </label>
        </div>

        {formData.integrateDigitalCompetence && (
          <div className="space-y-4 animate-scale-in">
            {/* Box ví dụ mẫu đúng theo yêu cầu của thầy cô */}
            <div className="p-4 bg-emerald-50/90 rounded-xl border border-emerald-300 text-xs sm:text-sm text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Ví dụ mẫu bộ mã sẽ được AI tự động tạo ra:</span>
              </div>
              <p className="font-mono bg-white p-2.5 rounded-lg border border-emerald-200 text-emerald-800 leading-relaxed text-xs">
                &ldquo;Tích hợp Năng lực số (NLS 1.1.CB1a) &amp; Tích hợp AI (4.A1.3; 4.C2.3) tra cứu kĩ thuật chăm sóc cây cảnh trong nhà (lưỡi hổ, kim phát tài, trầu bà, xương rồng) và bảo vệ môi trường học đường.&rdquo;
              </p>
              <p className="mt-2 text-xs text-emerald-800">
                • <strong>Mức độ NLS quy định cho {formData.grade}:</strong> {currentDigitalLevel}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Miền năng lực số ưu tiên tích hợp (từ Thông tư 02/2025/TT-BGDĐT):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DIGITAL_COMPETENCE_DOMAINS.map((domain) => {
                  const isChecked = formData.digitalDomains.includes(domain.name);
                  return (
                    <div
                      key={domain.id}
                      onClick={() => handleToggleDomain(domain.name)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-400 text-emerald-950 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-xs sm:text-sm">{domain.name}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">{domain.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Card 3: Nội dung bài dạy & Tiến trình sư phạm */}
      <section className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-5 sm:p-7 space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-lg sm:text-xl font-bold text-indigo-700">
            3. Nội dung bài học & Phương pháp sư phạm
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cung cấp nội dung hoặc mục tiêu cốt lõi từ sách giáo khoa Kết nối tri thức
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Nội dung bài học / Kiến thức trọng tâm / Yêu cầu cần đạt
          </label>
          <textarea
            rows={4}
            value={formData.knowledgeContent}
            onChange={(e) => handleChange('knowledgeContent', e.target.value)}
            placeholder="Ví dụ: Nêu các nội dung kiến thức trong bài (VD: Nhận biết đặc điểm, lợi ích của hoa hồng, hoa đào; cách chăm sóc và sử dụng an toàn; tra cứu kĩ thuật chăm sóc cây cảnh trong nhà và bảo vệ môi trường học đường...)"
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white shadow-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Phương pháp & Kỹ thuật dạy học ưu tiên
            </label>
            <select
              value={formData.pedagogicalMethod || PEDAGOGICAL_METHODS[0]}
              onChange={(e) => handleChange('pedagogicalMethod', e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              {PEDAGOGICAL_METHODS.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Yêu cầu bổ sung của thầy/cô (Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.additionalRequirements || ''}
              onChange={(e) => handleChange('additionalRequirements', e.target.value)}
              placeholder="VD: Trò chơi 'Ai nhanh hơn', phiếu bài tập nhóm, video minh họa..."
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>
        </div>

        {formError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 font-semibold flex items-center gap-2 animate-shake">
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>AI Đang Soạn Giáo Án Chuẩn Mẫu...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span>🚀 Soạn Kế Hoạch Bài Dạy Chuẩn Mẫu Ngay!</span>
              </>
            )}
          </button>
        </div>
      </section>
    </form>
  );
};

export default LessonPlanForm;
