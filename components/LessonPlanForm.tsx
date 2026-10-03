import React, { useState, useEffect } from 'react';
import type { LessonPlanFormData } from '../types';
import {
  SCHOOL_LEVELS,
  GRADES_BY_LEVEL,
  SUBJECTS_BY_LEVEL,
  DIGITAL_COMPETENCE_DOMAINS,
  DIGITAL_LEVEL_BY_GRADE,
  PEDAGOGICAL_METHODS,
  AI_EDUCATION_STRANDS_QDD2422,
  AI_STAGES_BY_LEVEL,
  RECOMMENDED_AI_TOOLS,
  QPAN_FOCUS_SUBJECTS_BY_LEVEL,
  QPAN_THEMES_BY_GRADE,
  QPAN_METHODS_OPTIONS,
  isEnglishSubject,
} from '../constants';
import DocumentUploadModal from './DocumentUploadModal';

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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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

  // Khởi tạo mặc định cho AI Strands & GDQP-AN TT 08 nếu chưa có
  useEffect(() => {
    if (formData.integrateAi2422 === undefined) {
      handleChange('integrateAi2422', true);
    }
    if (!formData.aiStrands || formData.aiStrands.length === 0) {
      handleChange('aiStrands', [
        'Mạch A: Tư duy lấy con người làm trung tâm (Human-centred mindset)',
        'Mạch C: Kỹ thuật và Ứng dụng AI (AI Techniques & Applications)'
      ]);
    }
    if (formData.integrateQpan08 === undefined) {
      handleChange('integrateQpan08', true);
    }
    if (!formData.qpanThemes || formData.qpanThemes.length === 0) {
      const themesForGrade = QPAN_THEMES_BY_GRADE[formData.grade] || QPAN_THEMES_BY_GRADE['Lớp 4'] || [];
      if (themesForGrade.length > 0) {
        handleChange('qpanThemes', [themesForGrade[0].title]);
      }
    }
    if (!formData.qpanMethods || formData.qpanMethods.length === 0) {
      handleChange('qpanMethods', [
        'Quan sát tranh ảnh, bản đồ chủ quyền & Video tư liệu',
        'Kể chuyện lịch sử & Gương anh hùng liệt sĩ'
      ]);
    }
  }, []);

  // Khi grade thay đổi, nếu danh sách qpanThemes rỗng thì tự động gợi ý theme chuẩn cho khối lớp đó
  useEffect(() => {
    const themesForGrade = QPAN_THEMES_BY_GRADE[formData.grade] || [];
    if (themesForGrade.length > 0) {
      if (!formData.qpanThemes || formData.qpanThemes.length === 0) {
        handleChange('qpanThemes', [themesForGrade[0].title]);
      }
    }
  }, [formData.grade]);

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

  const handleToggleAiStrand = (strandName: string) => {
    setFormData((prev) => {
      const currentList = prev.aiStrands || [];
      const exists = currentList.includes(strandName);
      const updated = exists
        ? currentList.filter((s) => s !== strandName)
        : [...currentList, strandName];
      return { ...prev, aiStrands: updated };
    });
  };

  const handleToggleAiTool = (toolName: string) => {
    setFormData((prev) => {
      const currentTools = prev.suggestedAiTools || [];
      const exists = currentTools.includes(toolName);
      const updated = exists
        ? currentTools.filter((t) => t !== toolName)
        : [...currentTools, toolName];
      return { ...prev, suggestedAiTools: updated };
    });
  };

  const handleToggleQpanTheme = (themeTitle: string) => {
    setFormData((prev) => {
      const current = prev.qpanThemes || [];
      const exists = current.includes(themeTitle);
      const updated = exists
        ? current.filter((t) => t !== themeTitle)
        : [...current, themeTitle];
      return { ...prev, qpanThemes: updated };
    });
  };

  const handleToggleQpanMethod = (methodName: string) => {
    setFormData((prev) => {
      const current = prev.qpanMethods || [];
      const exists = current.includes(methodName);
      const updated = exists
        ? current.filter((m) => m !== methodName)
        : [...current, methodName];
      return { ...prev, qpanMethods: updated };
    });
  };

  const [formError, setFormError] = useState<string | null>(null);

  const loadLessonPlanSample = (type: 'tinhoc4' | 'toan4' | 'tv4' | 'tienganh5') => {
    setFormError(null);
    if (type === 'tienganh5') {
      setFormData((prev) => ({
        ...prev,
        schoolLevel: 'Tiểu học',
        grade: 'Lớp 5',
        subject: 'Ngoại ngữ 1 (Tiếng Anh)',
        textbook: 'Kết nối tri thức với cuộc sống',
        themeName: 'Unit 1: ALL ABOUT ME!',
        lessonName: 'Lesson 1 (1, 2, 3)',
        durationInPeriods: 1,
        periodNumber: 'Period 5',
        week: 'Week 2',
        classesTaught: '5A, 5B',
        schoolName: 'Truong Quang Trong Primary School',
        teacherName: 'Vo Thi Lac',
        approverName: 'BGH duyệt',
        prepDate: 'September 7th, 2026',
        teachDate: 'September 9th-13th, 2026',
        knowledgeContent: 'Vocabulary: city, class, countryside, province, address, hometown.\nStructures:\nA: Where do you live?\nB: I live in / at...\nCompetences: Pair work, asking and answering about address correctly and fluently.',
        integrateDigitalCompetence: true,
        digitalDomains: [
          'Miền 2: Giao tiếp và hợp tác trong môi trường số',
          'Miền 4: An toàn số',
          'Miền 6: Ứng dụng Trí tuệ nhân tạo (AI)'
        ],
        integrateAi2422: true,
        aiStrands: [
          'Mạch A: Tư duy lấy con người làm trung tâm (Human-centred mindset)',
          'Mạch C: Kỹ thuật và Ứng dụng AI (AI Techniques & Applications)'
        ],
        suggestedAiTools: ['Canva Magic Studio (Edu)', 'Interactive flashcards & audio'],
        integrateQpan08: true,
        qpanThemes: ['Tình yêu quê hương đất nước, tự hào về quê hương và ý thức chấp hành kỷ luật'],
        qpanMethods: [
          'Quan sát tranh ảnh, bản đồ chủ quyền & Video tư liệu',
          'Thảo luận nhóm & Liên hệ thực tế giữ gìn an ninh trật tự'
        ],
        pedagogicalMethod: 'Phương pháp giao tiếp (Communicative Language Teaching - CLT)',
        additionalRequirements: 'Warm-up with "Pass the teddy bears" game, 2-column table procedures (Teacher’s activities | Students’ activities), drill pictures, and Fun corner wrap-up.'
      }));
    } else if (type === 'tinhoc4') {
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
        integrateAi2422: true,
        aiStrands: [
          'Mạch A: Tư duy lấy con người làm trung tâm (Human-centred mindset)',
          'Mạch B: Đạo đức Trí tuệ nhân tạo (AI Ethics)',
          'Mạch C: Kỹ thuật và Ứng dụng AI (AI Techniques & Applications)'
        ],
        suggestedAiTools: ['AutoDraw / Quick, Draw!', 'Canva Magic Studio (Edu)'],
        integrateQpan08: true,
        qpanThemes: ['Ý thức chấp hành pháp luật về trật tự, an toàn giao thông'],
        qpanMethods: [
          'Quan sát tranh ảnh, bản đồ chủ quyền & Video tư liệu',
          'Thảo luận nhóm & Liên hệ thực tế giữ gìn an ninh trật tự'
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
        integrateAi2422: true,
        aiStrands: [
          'Mạch A: Tư duy lấy con người làm trung tâm (Human-centred mindset)',
          'Mạch C: Kỹ thuật và Ứng dụng AI (AI Techniques & Applications)'
        ],
        suggestedAiTools: ['Canva Magic Studio (Edu)'],
        integrateQpan08: true,
        qpanThemes: ['Bản đồ hành chính Việt Nam & Chủ quyền Hoàng Sa, Trường Sa'],
        qpanMethods: ['Quan sát tranh ảnh, bản đồ chủ quyền & Video tư liệu'],
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
          'Miền 2: Giao tiếp và hợp tác trong môi trường số',
          'Miền 3: Sáng tạo nội dung số'
        ],
        integrateAi2422: true,
        aiStrands: [
          'Mạch B: Đạo đức Trí tuệ nhân tạo (AI Ethics)',
          'Mạch C: Kỹ thuật và Ứng dụng AI (AI Techniques & Applications)'
        ],
        suggestedAiTools: ['Google Lens / Dịch hình ảnh'],
        integrateQpan08: true,
        qpanThemes: ['Bài hát, câu chuyện và hình ảnh về biển, đảo thiêng liêng của Tổ quốc'],
        qpanMethods: [
          'Kể chuyện lịch sử & Gương anh hùng liệt sĩ',
          'Hát bài hát truyền thống & Tác phẩm nghệ thuật'
        ],
        pedagogicalMethod: 'Dạy học hợp tác theo nhóm & Kỹ thuật mảnh ghép',
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

  const isEnglish = isEnglishSubject(formData.subject);
  const currentDigitalLevel = DIGITAL_LEVEL_BY_GRADE[formData.grade] || 'Cơ bản';
  const availableThemes = QPAN_THEMES_BY_GRADE[formData.grade] || QPAN_THEMES_BY_GRADE['Lớp 4'] || [];
  const focusSubjects = QPAN_FOCUS_SUBJECTS_BY_LEVEL[formData.schoolLevel] || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Banner Notice */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-colors shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isEnglish
          ? 'bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 dark:from-slate-850 dark:via-rose-950/30 dark:to-slate-850 border-rose-200 dark:border-rose-900/60'
          : formData.schoolLevel === 'Tiểu học'
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-slate-850 dark:via-slate-800 dark:to-slate-850 border-emerald-200 dark:border-slate-700'
          : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-850 dark:via-indigo-950/30 dark:to-slate-850 border-indigo-200 dark:border-slate-700'
      }`}>
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl text-white shrink-0 shadow-xs ${
            isEnglish ? 'bg-rose-600' : formData.schoolLevel === 'Tiểu học' ? 'bg-emerald-600' : 'bg-indigo-600'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                {isEnglish
                  ? 'Kế Hoạch Bài Dạy Môn Tiếng Anh (English Lesson Plan)'
                  : `Soạn Kế Hoạch Bài Dạy Chuẩn ${formData.schoolLevel === 'Tiểu học' ? 'CV 2345/BGDĐT-GDTH' : 'CV 5512/BGDĐT-GDTrH'}`}
              </h2>
              <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 text-[11px] font-bold px-2 py-0.5 rounded-md">
                Bộ sách: Kết nối tri thức với cuộc sống
              </span>
              {isEnglish && (
                <span className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 text-[11px] font-bold px-2 py-0.5 rounded-md">
                  Tiếng Anh Global Success
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {isEnglish
                ? 'Soạn 100% bằng tiếng Anh theo mẫu chuẩn văn bản quốc tế, bám sát CT GDPT 2018 và SGK Global Success (A. Objectives, B. Teaching Aids, C. Procedures bảng 2 cột, D. Adjustments).'
                : 'Tự động tích hợp Năng lực số (Thông tư 02/2025/TT-BGDĐT, CV 3456/BGDĐT-GDPT) & Giáo dục Trí tuệ nhân tạo AI (Quyết định 2422/QĐ-BGDĐT) kèm theo bộ mã chuẩn hóa.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenHistory}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-indigo-700 dark:text-indigo-300 font-semibold text-xs sm:text-sm rounded-xl border border-indigo-200 dark:border-slate-700 shadow-xs transition shrink-0 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Giáo án đã lưu ({historyCount})</span>
        </button>
      </div>

      {/* Card 1: Thông tin hành chính & Bài học (Theo định dạng mẫu văn bản PDF) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 space-y-5 text-slate-800 dark:text-slate-100 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
              <span>1. Thông tin bài dạy &amp; Hành chính</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {isEnglish
                ? 'Định dạng tiêu đề chuẩn: Lesson plan - English, School year, Week, Period, Preparing & Teaching date'
                : 'Định dạng tiêu đề, thời gian, lớp học theo chuẩn mẫu văn bản kế hoạch bài dạy'}
            </p>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-semibold text-xs rounded-full border border-indigo-100 dark:border-slate-700">
            {isEnglish ? 'Global Success (KNTT)' : 'Sách Kết nối tri thức'}
          </span>
        </div>

        {/* Thanh nạp bài mẫu nhanh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-slate-850 dark:via-slate-800 dark:to-slate-850 rounded-2xl border border-emerald-100 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-base">🪄</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-300">
              Giáo án mẫu nhanh:
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => loadLessonPlanSample('tienganh5')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-850 hover:bg-rose-50 dark:hover:bg-slate-800 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-slate-700 shadow-2xs transition active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>🇬🇧</span>
              <span>Tiếng Anh 5 (Global Success)</span>
            </button>
            <button
              type="button"
              onClick={() => loadLessonPlanSample('tinhoc4')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-850 hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-slate-700 shadow-2xs transition active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              💻 Tin học 4 (TT 02 &amp; AI)
            </button>
            <button
              type="button"
              onClick={() => loadLessonPlanSample('toan4')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-slate-800 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700 shadow-2xs transition active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              📐 Toán 4 (Tổng - Hiệu)
            </button>
            <button
              type="button"
              onClick={() => loadLessonPlanSample('tv4')}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-850 hover:bg-purple-50 dark:hover:bg-slate-800 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-slate-700 shadow-2xs transition active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              📖 Tiếng Việt 4 (Từ đơn &amp; Từ phức)
            </button>
          </div>
        </div>

        {/* Thông báo riêng môn Tiếng Anh */}
        {isEnglish && (
          <div className="p-3.5 bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 dark:from-slate-850 dark:via-rose-950/20 dark:to-slate-850 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5 text-rose-950 dark:text-rose-200">
            <span className="text-xl shrink-0 mt-0.5">🇬🇧</span>
            <div className="text-xs sm:text-sm space-y-1">
              <p className="font-bold text-rose-900 dark:text-rose-300">Quy chuẩn soạn thảo Kế hoạch bài dạy môn Tiếng Anh (English):</p>
              <p className="text-rose-800 dark:text-rose-300/90 leading-relaxed">
                Kế hoạch bài dạy sẽ được soạn <strong>100% bằng Tiếng Anh</strong> theo chuẩn quốc tế, bám sát bộ sách <strong>Tiếng Anh Global Success (Bộ sách Kết nối tri thức với cuộc sống của NXBGDVN)</strong> và <strong>CT GDPT 2018</strong>. Cấu trúc gồm: Header định dạng mẫu, <em>A. OBJECTIVES</em> (1. Knowledge, 2. Competences, 3. Attitudes/Qualities), <em>B. TEACHING AIDS</em> (hoclieu.vn, laptop, flashcards...), <em>C. PROCEDURES</em> (Bảng 2 cột: <strong>Teacher’s activities | Students’ activities</strong> với Warm-up song/game, Presentation với tranh mẫu thoại, Practice drill pictures, Production Let’s talk, Fun corner wrap-up), <em>D. ADJUSTMENTS</em> và khối ký duyệt.
              </p>
            </div>
          </div>
        )}

        {/* Hàng 1: Trường, Tuần, Môn, Cấp học */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Cơ sở giáo dục (Trường)
            </label>
            <input
              type="text"
              value={formData.schoolName || ''}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              placeholder={isEnglish ? "VD: Truong Quang Trong Primary School" : "VD: Trường TH Sơn Hạ"}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tuần thực hiện
            </label>
            <input
              type="text"
              value={formData.week || ''}
              onChange={(e) => handleChange('week', e.target.value)}
              placeholder={isEnglish ? "VD: Week 2" : "VD: TUẦN 04"}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Cấp học <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.schoolLevel}
              onChange={(e) => handleChange('schoolLevel', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
            >
              {SCHOOL_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Khối lớp <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.grade}
              onChange={(e) => handleChange('grade', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
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
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Môn học <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Bộ sách giáo khoa
            </label>
            <div className="px-3 py-2 border border-indigo-200 dark:border-slate-700 rounded-xl bg-indigo-50/70 dark:bg-slate-800 text-indigo-900 dark:text-indigo-300 font-bold text-sm flex items-center gap-1.5">
              <span>📘</span>
              <span className="truncate">{isEnglish ? 'Tiếng Anh Global Success (KNTT)' : 'Kết nối tri thức với cuộc sống'}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tiết số
            </label>
            <input
              type="text"
              value={formData.periodNumber || ''}
              onChange={(e) => handleChange('periodNumber', e.target.value)}
              placeholder={isEnglish ? "VD: Period 5 (hoặc 5)" : "VD: tiết 1 (hoặc tiết 2)"}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Lớp dạy
            </label>
            <input
              type="text"
              value={formData.classesTaught || ''}
              onChange={(e) => handleChange('classesTaught', e.target.value)}
              placeholder={isEnglish ? "VD: 5A, 5B" : "VD: 3A, 3B, 3C (hoặc 4A, 4B)"}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Hàng 3: Ngày soạn, Ngày dạy, Giáo viên, Người ký duyệt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Ngày soạn
            </label>
            <input
              type="text"
              value={formData.prepDate || ''}
              onChange={(e) => handleChange('prepDate', e.target.value)}
              placeholder={isEnglish ? "VD: September 7th, 2026" : "VD: 20/09/2026"}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Ngày dạy
            </label>
            <input
              type="text"
              value={formData.teachDate || ''}
              onChange={(e) => handleChange('teachDate', e.target.value)}
              placeholder={isEnglish ? "VD: September 9th-13th, 2026" : "VD: 28-29-30/09/2026"}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Giáo viên giảng dạy
            </label>
            <input
              type="text"
              value={formData.teacherName || ''}
              onChange={(e) => handleChange('teacherName', e.target.value)}
              placeholder={isEnglish ? "VD: Vo Thi Lac" : "VD: Vũ Hoàng Hiệp"}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Người ký duyệt (BGH/Tổ trưởng)
            </label>
            <input
              type="text"
              value={formData.approverName || ''}
              onChange={(e) => handleChange('approverName', e.target.value)}
              placeholder={isEnglish ? "VD: BGH duyệt" : "VD: Nguyễn Thị Pô Ly"}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Hàng 4: Chủ đề & Tên bài học */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Chủ đề (Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.themeName || ''}
              onChange={(e) => handleChange('themeName', e.target.value)}
              placeholder={isEnglish ? "VD: Unit 1: ALL ABOUT ME!" : "VD: CHỦ ĐỀ 1: CÔNG NGHỆ VÀ ĐỜI SỐNG"}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tên bài học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.lessonName}
              onChange={(e) => handleChange('lessonName', e.target.value)}
              placeholder={isEnglish ? "VD: Lesson 1 (1, 2, 3) hoặc Lesson 2 (1, 2, 3)" : "VD: Bài 2: MỘT SỐ LOẠI HOA, CÂY CẢNH PHỔ BIẾN (hoặc Bài 2: Xử lý thông tin...)"}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
            />
          </div>
        </div>
      </section>

      {/* Card 2: Tự động Tích hợp Năng lực số (TT 02/2025), Giáo dục AI (QĐ 2422) & GDQP-AN (TT 08/2024) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800 p-4 sm:p-7 space-y-6 text-slate-800 dark:text-slate-100 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs font-bold">
                CHUẨN BỘ GD&amp;ĐT
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                2. Tích hợp Năng lực số (TT 02), Giáo dục AI (QĐ 2422) &amp; GDQP-AN (TT 08)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hệ thống tự động phân bổ bộ mã chuẩn Năng lực số (Thông tư 02/2025/TT-BGDĐT), Khung giáo dục Trí tuệ nhân tạo (Quyết định số 2422/QĐ-BGDĐT) và lồng ghép Giáo dục Quốc phòng và An ninh (Thông tư số 08/2024/TT-BGDĐT).
            </p>
          </div>

          <label className="inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={formData.integrateDigitalCompetence}
              onChange={(e) => handleChange('integrateDigitalCompetence', e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            <span className="ms-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {formData.integrateDigitalCompetence ? 'Đang bật' : 'Tắt'}
            </span>
          </label>
        </div>

        {formData.integrateDigitalCompetence && (
          <div className="space-y-6 animate-scale-in">
            {/* Box Căn cứ pháp lý tổng hợp 3 trụ cột chuẩn Bộ GD&ĐT */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50 via-indigo-50/50 to-rose-50/60 dark:from-slate-850 dark:via-slate-800 dark:to-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>3 Căn cứ pháp lý &amp; Bộ mã chuẩn hóa của Bộ Giáo dục và Đào tạo:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-emerald-200 dark:border-slate-700 space-y-1 shadow-2xs">
                  <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <span>📘</span>
                    <span>1. TT 02/2025/TT-BGDĐT</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-snug">Khung năng lực số người học; 6 miền năng lực số và mức độ <strong>{currentDigitalLevel}</strong> cho {formData.grade}.</p>
                </div>

                <div className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-indigo-200 dark:border-slate-700 space-y-1 shadow-2xs">
                  <p className="font-bold text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                    <span>🤖</span>
                    <span>2. QĐ 2422/QĐ-BGDĐT</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-snug">Khung giáo dục Trí tuệ nhân tạo (AI) phổ thông với 4 mạch kiến thức (A, B, C, D) và nguyên tắc con người làm chủ.</p>
                </div>

                <div className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-rose-200 dark:border-slate-700 space-y-1 shadow-2xs">
                  <p className="font-bold text-rose-950 dark:text-rose-300 flex items-center gap-1.5">
                    <span>🇻🇳</span>
                    <span>3. TT 08/2024/TT-BGDĐT</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-snug">Hướng dẫn lồng ghép Giáo dục Quốc phòng và An ninh (tình yêu Tổ quốc, hình ảnh người lính, chủ quyền biển đảo, kỷ luật, an toàn số).</p>
                </div>
              </div>

              {/* Mẫu hiển thị trong giáo án */}
              <div className="font-mono bg-white dark:bg-slate-850 p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed text-xs space-y-1 shadow-2xs">
                <p className="font-sans font-bold text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Đoạn nội dung hệ thống tự động chuẩn hóa vào Yêu cầu cần đạt:
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  &ldquo;Tích hợp Năng lực số (theo TT 02/2025: <span className="font-bold text-emerald-700 dark:text-emerald-400">NLS 1.1.CB1a</span>) &amp; Giáo dục Trí tuệ nhân tạo (theo QĐ 2422/QĐ-BGDĐT: <span className="font-bold text-indigo-700 dark:text-indigo-400">Mã 4.A1.3; 4.C2.3</span>); Lồng ghép GDQP&amp;AN (theo Thông tư 08/2024/TT-BGDĐT: <span className="font-bold text-red-700 dark:text-red-400">Tình yêu quê hương đất nước, chủ quyền biển đảo Hoàng Sa - Trường Sa</span>).&rdquo;
                </p>
              </div>
            </div>

            {/* PHẦN A: KHUNG NĂNG LỰC SỐ (TT 02/2025/TT-BGDĐT) */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-850/60 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-750 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-emerald-600 text-white rounded-md text-xs font-bold">A</span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                    Khung Năng Lực Số (Thông tư số 02/2025/TT-BGDĐT)
                  </h4>
                </div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Mức {formData.grade}: {currentDigitalLevel.split('(')[0]}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chọn các miền năng lực số trọng tâm giáo viên muốn rèn luyện cho học sinh trong tiết học:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DIGITAL_COMPETENCE_DOMAINS.map((domain) => {
                  const isChecked = formData.digitalDomains.includes(domain.name);
                  return (
                    <div
                      key={domain.id}
                      onClick={() => handleToggleDomain(domain.name)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500 ring-1 ring-emerald-400 text-emerald-950 dark:text-emerald-200 shadow-xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs sm:text-sm">{domain.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-1">{domain.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PHẦN B: KHUNG GIÁO DỤC TRÍ TUỆ NHÂN TẠO (QUYẾT ĐỊNH 2422/QĐ-BGDĐT) */}
            <div className="p-4 sm:p-5 rounded-2xl border border-indigo-200 dark:border-slate-700 bg-indigo-50/40 dark:bg-slate-850/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-200/80 dark:border-slate-750 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-indigo-600 text-white rounded-md text-xs font-bold">B</span>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                      <span>Khung Giáo Dục Trí Tuệ Nhân Tạo (Quyết định 2422/QĐ-BGDĐT)</span>
                      <span className="px-2 py-0.5 bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 text-[10px] font-bold rounded-full">
                        MỚI BAN HÀNH
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Ban hành 4 mạch nội dung cốt lõi của giáo dục AI cho học sinh phổ thông
                    </p>
                  </div>
                </div>

                <label className="inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.integrateAi2422 ?? true}
                    onChange={(e) => handleChange('integrateAi2422', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-10 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ms-2.5 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                    {(formData.integrateAi2422 ?? true) ? 'Tích hợp AI: Bật' : 'Tắt'}
                  </span>
                </label>
              </div>

              {(formData.integrateAi2422 ?? true) && (
                <div className="space-y-4 animate-scale-in">
                  {/* Định hướng cấp học theo QĐ 2422 */}
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-indigo-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <p className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>{AI_STAGES_BY_LEVEL[formData.schoolLevel]?.stageName || 'Giai đoạn giáo dục'}:</span>
                    </p>
                    <p className="leading-relaxed">
                      {AI_STAGES_BY_LEVEL[formData.schoolLevel]?.description}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 italic pt-0.5">
                      • Đánh giá: {AI_STAGES_BY_LEVEL[formData.schoolLevel]?.evaluationNote}
                    </p>
                  </div>

                  {/* 4 Mạch nội dung chính của QĐ 2422 */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-indigo-950 dark:text-indigo-200 mb-2">
                      4 Mạch kiến thức giáo dục AI theo Quyết định 2422/QĐ-BGDĐT:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {AI_EDUCATION_STRANDS_QDD2422.map((strand) => {
                        const isSelected = (formData.aiStrands || []).includes(strand.name);
                        const codeSample = strand.sampleIndicators[formData.schoolLevel] || `${strand.codePrefix}1.1`;
                        return (
                          <div
                            key={strand.id}
                            onClick={() => handleToggleAiStrand(strand.name)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-white dark:bg-slate-800 border-indigo-500 dark:border-indigo-400 ring-1 ring-indigo-500 text-indigo-950 dark:text-indigo-200 shadow-xs'
                                : 'bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="h-4 w-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="font-bold text-xs sm:text-sm text-indigo-900 dark:text-indigo-300">
                                    {strand.title}
                                  </p>
                                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                    Mạch {strand.codePrefix}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                                  {strand.desc}
                                </p>
                                <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                                  <span>Mã mẫu {formData.schoolLevel}:</span>
                                  <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-slate-700">
                                    {codeSample}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Đề xuất công cụ AI sư phạm theo lứa tuổi */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Công cụ AI sư phạm đề xuất cho cấp {formData.schoolLevel} (Tùy chọn click chọn):
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(RECOMMENDED_AI_TOOLS[formData.schoolLevel] || []).map((tool) => {
                        const isToolSelected = (formData.suggestedAiTools || []).includes(tool.name);
                        return (
                          <button
                            key={tool.name}
                            type="button"
                            onClick={() => handleToggleAiTool(tool.name)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border cursor-pointer ${
                              isToolSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                : 'bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                            }`}
                            title={tool.desc}
                          >
                            <span>{isToolSelected ? '✓' : '+'}</span>
                            <span>{tool.name}</span>
                            <span className={`text-[10px] px-1 py-0.2 rounded font-normal ${
                              isToolSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}>
                              {tool.tag}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Đạo đức AI & Trách nhiệm xã hội */}
                  <div className="p-3 bg-amber-50 dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                    <span className="text-base shrink-0">⚖️</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-amber-900 dark:text-amber-300">
                        Nguyên tắc Đạo đức AI theo Quyết định 2422/QĐ-BGDĐT:
                      </p>
                      <p className="text-amber-800 dark:text-amber-200/90 leading-relaxed">
                        Học sinh được giáo dục kiểm chứng thông tin do AI cung cấp, tuyệt đối không sao chép mù quáng, tôn trọng bản quyền học thuật, bảo vệ dữ liệu cá nhân và giữ gìn môi trường học đường an toàn, nhân văn.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PHẦN C: LỒNG GHÉP GIÁO DỤC QUỐC PHÒNG VÀ AN NINH (THÔNG TƯ SỐ 08/2024/TT-BGDĐT) */}
            <div className="p-4 sm:p-5 rounded-2xl border border-rose-200 dark:border-slate-700 bg-gradient-to-br from-rose-50/40 via-amber-50/20 to-white dark:from-slate-850 dark:via-slate-800 dark:to-slate-850 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-200/80 dark:border-slate-750 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-1 px-1.5 bg-red-600 text-white rounded-md text-xs font-bold shrink-0">
                    C
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                        Lồng ghép Giáo dục Quốc phòng và An ninh (Thông tư số 08/2024/TT-BGDĐT)
                      </h4>
                      <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
                        Hiệu lực từ 01/07/2024
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Bộ GD&amp;ĐT ban hành ngày 15/05/2024; quy định lồng ghép nội dung GDQP&amp;AN vào các môn học và hoạt động giáo dục cấp Tiểu học, THCS và THPT.
                    </p>
                  </div>
                </div>

                <label className="inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={formData.integrateQpan08 !== false}
                    onChange={(e) => handleChange('integrateQpan08', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                  <span className="ms-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {formData.integrateQpan08 !== false ? 'Đang bật' : 'Tắt'}
                  </span>
                </label>
              </div>

              {formData.integrateQpan08 !== false && (
                <div className="space-y-4 pt-1 animate-scale-in">
                  {/* Danh sách môn học trọng tâm theo TT 08 */}
                  <div className="p-3 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-rose-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-semibold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                        <span>🎯</span>
                        <span>Môn học quy định lồng ghép cấp {formData.schoolLevel} (Điều 2 TT 08/2024):</span>
                      </span>
                      {focusSubjects.includes(formData.subject) && (
                        <span className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          ✓ Môn {formData.subject} là môn trọng tâm
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {focusSubjects.map((sub) => {
                        const isCurrentSubject = sub.toLowerCase().includes(formData.subject.toLowerCase()) || formData.subject.toLowerCase().includes(sub.toLowerCase());
                        return (
                          <span
                            key={sub}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                              isCurrentSubject
                                ? 'bg-red-600 text-white font-bold shadow-2xs'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {sub}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Danh sách chủ đề lồng ghép chuẩn theo lớp */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      Chủ đề lồng ghép GDQP&amp;AN chuẩn cho {formData.grade} (Căn cứ Phụ lục TT 08/2024 - Click chọn):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {availableThemes.map((th) => {
                        const isSelected = (formData.qpanThemes || []).includes(th.title);
                        return (
                          <div
                            key={th.id}
                            onClick={() => handleToggleQpanTheme(th.title)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                              isSelected
                                ? 'bg-rose-50/90 dark:bg-rose-950/40 border-red-500 dark:border-red-400 shadow-2xs ring-1 ring-red-400 text-slate-800 dark:text-slate-100'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}>
                                  {th.focusCode}
                                </span>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="h-3.5 w-3.5 text-red-600 rounded border-slate-300 dark:border-slate-600 focus:ring-red-500"
                                />
                              </div>
                              <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-snug">
                                {th.title}
                              </p>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                                {th.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hình thức / Phương pháp lồng ghép sư phạm */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      Hình thức &amp; Phương pháp lồng ghép sư phạm (Điều 4 TT 08/2024 - Tùy chọn click chọn):
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {QPAN_METHODS_OPTIONS.map((m) => {
                        const isSelected = (formData.qpanMethods || []).includes(m.name);
                        return (
                          <button
                            key={m.name}
                            type="button"
                            onClick={() => handleToggleQpanMethod(m.name)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border cursor-pointer ${
                              isSelected
                                ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                                : 'bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                            }`}
                            title={m.desc}
                          >
                            <span>{m.icon}</span>
                            <span>{m.name}</span>
                            <span className="text-[10px]">{isSelected ? '✓' : '+'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nguyên tắc sư phạm theo Điều 4 Thông tư 08 */}
                  <div className="p-3 bg-rose-50 dark:bg-slate-800 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs text-rose-950 dark:text-rose-200 flex items-start gap-2">
                    <span className="text-base shrink-0">🇻🇳</span>
                    <div className="space-y-0.5">
                      <p className="font-bold text-rose-900 dark:text-rose-300">
                        Nguyên tắc lồng ghép theo Điều 4 Thông tư số 08/2024/TT-BGDĐT:
                      </p>
                      <p className="text-rose-800 dark:text-rose-300/90 leading-relaxed">
                        Lồng ghép tự nhiên, ngắn gọn, phù hợp với tâm sinh lý lứa tuổi học sinh, không làm thay đổi thời lượng hay mục tiêu cốt lõi môn học. Hệ thống tự động phân bổ vào <strong>Mục I.4 (Phẩm chất yêu nước &amp; trách nhiệm)</strong>, <strong>Mục II (Đồ dùng dạy học: tranh ảnh, bản đồ, video tư liệu)</strong> và <strong>Mục III (Tiến trình hoạt động dạy học của GV &amp; HS)</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Card 3: Nội dung bài dạy & Tiến trình sư phạm */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 space-y-5 text-slate-800 dark:text-slate-100 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-lg sm:text-xl font-bold text-indigo-700 dark:text-indigo-400">
            3. Nội dung bài học & Phương pháp sư phạm
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cung cấp nội dung hoặc mục tiêu cốt lõi từ sách giáo khoa Kết nối tri thức
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nội dung bài học / Kiến thức trọng tâm / Yêu cầu cần đạt
            </label>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 rounded-lg border border-emerald-200 dark:border-slate-700 shadow-2xs transition active:scale-95 cursor-pointer"
              title="Trích xuất văn bản từ file Word .docx hoặc .txt"
            >
              <span>📎</span>
              <span>Tải file Word / Text</span>
            </button>
          </div>
          <textarea
            rows={4}
            value={formData.knowledgeContent}
            onChange={(e) => handleChange('knowledgeContent', e.target.value)}
            placeholder="Ví dụ: Nêu các nội dung kiến thức trong bài (VD: Nhận biết đặc điểm, lợi ích của hoa hồng, hoa đào; cách chăm sóc và sử dụng an toàn; tra cứu kĩ thuật chăm sóc cây cảnh trong nhà và bảo vệ môi trường học đường...)"
            className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Phương pháp & Kỹ thuật dạy học ưu tiên
            </label>
            <select
              value={formData.pedagogicalMethod || PEDAGOGICAL_METHODS[0]}
              onChange={(e) => handleChange('pedagogicalMethod', e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
            >
              {PEDAGOGICAL_METHODS.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Yêu cầu bổ sung của thầy/cô (Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.additionalRequirements || ''}
              onChange={(e) => handleChange('additionalRequirements', e.target.value)}
              placeholder="VD: Trò chơi 'Ai nhanh hơn', phiếu bài tập nhóm, video minh họa..."
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {formError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs sm:text-sm text-red-700 dark:text-red-300 font-semibold flex items-center gap-2 animate-shake">
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-wait cursor-pointer"
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

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onApplyText={(text) => handleChange('knowledgeContent', text)}
        targetFieldTitle="Nội dung bài học"
      />
    </form>
  );
};

export default LessonPlanForm;
