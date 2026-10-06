import React, { useState, useEffect, useMemo } from "react";
import type { ExamFormData, QuestionTypeDistribution } from "../types";
import {
  SCHOOL_LEVELS,
  GRADES_BY_LEVEL,
  SUBJECTS_BY_LEVEL,
  OTHER_SUBJECT_KEY,
  GENERAL_TEXTBOOKS,
  TEXTBOOKS_BY_SUBJECT,
  isEnglishSubject,
  ENGLISH_EXAM_FORMATS,
  ENGLISH_SKILL_CATEGORIES,
  DEFAULT_ENGLISH_SKILLS_CONFIG,
  ENGLISH_SKILL_PRESETS,
} from "../constants";
import ConfigManagementModal from "./ConfigManagementModal";
import DocumentUploadModal from "./DocumentUploadModal";

interface ExamFormProps {
  formData: ExamFormData;
  setFormData: React.Dispatch<React.SetStateAction<ExamFormData>>;
  onSubmit: (data: ExamFormData) => void;
  isLoading: boolean;
}

const Section: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className="card bg-white/90 dark:bg-slate-900/90 flex flex-col h-full border border-slate-200/90 dark:border-slate-800 shadow-lg rounded-2xl p-5 sm:p-6 animate-scale-in text-slate-800 dark:text-slate-100 transition-colors duration-200">
    <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-2 tracking-tight">
      {title}
    </h2>
    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 sm:mb-6">{description}</p>
    <div className="space-y-4 flex-grow flex flex-col">{children}</div>
  </section>
);

const QuestionTypeInput: React.FC<{
  label: string;
  value: QuestionTypeDistribution;
  onChange: (field: keyof QuestionTypeDistribution, val: number) => void;
}> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-slate-850 dark:to-slate-850 rounded-2xl border border-indigo-100/60 dark:border-slate-700/80 shadow-xs transition-colors">
      <div className="flex items-center justify-between sm:w-1/4">
        <label className="font-bold text-xs sm:text-sm text-indigo-900 dark:text-indigo-300">
          {label}
        </label>
        <span className="sm:hidden text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-slate-700">
          {value.score} đ ({value.percentage}%)
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 flex-grow">
        {/* Số câu */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 sm:hidden">Số câu</label>
          <div className="flex items-center rounded-xl border border-indigo-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-500">
            <input
              type="number"
              inputMode="numeric"
              value={value.questionCount}
              onChange={(e) => onChange("questionCount", parseInt(e.target.value, 10) || 0)}
              className="w-full pl-2 pr-1 py-2 min-h-10 text-xs sm:text-sm bg-transparent font-semibold text-center focus:outline-none text-slate-800 dark:text-slate-100"
              min={0}
            />
            <span className="pr-2 text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs pointer-events-none shrink-0">câu</span>
          </div>
        </div>

        {/* Tỉ lệ % */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 sm:hidden">Tỉ lệ (%)</label>
          <div className="flex items-center rounded-xl border border-indigo-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-500">
            <input
              type="number"
              inputMode="numeric"
              value={value.percentage}
              onChange={(e) => onChange("percentage", parseInt(e.target.value, 10) || 0)}
              className="w-full pl-2 pr-1 py-2 min-h-10 text-xs sm:text-sm bg-transparent font-semibold text-center focus:outline-none text-slate-800 dark:text-slate-100"
              min={0}
              max={100}
              step={5}
            />
            <span className="pr-2 text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs pointer-events-none shrink-0">%</span>
          </div>
        </div>

        {/* Điểm số */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 sm:hidden">Điểm số</label>
          <div className="flex items-center rounded-xl border border-indigo-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-500">
            <input
              type="number"
              inputMode="decimal"
              value={value.score}
              onChange={(e) => onChange("score", parseFloat(e.target.value) || 0)}
              className="w-full pl-2 pr-1 py-2 min-h-10 text-xs sm:text-sm bg-transparent font-semibold text-center focus:outline-none text-slate-800 dark:text-slate-100"
              min={0}
              max={10}
              step={0.25}
            />
            <span className="pr-2 text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs pointer-events-none shrink-0">đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
  setStep: (step: number) => void;
}> = ({ currentStep, totalSteps, setStep }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const stepLabels =
    totalSteps === 2
      ? ["Thông tin & Thời lượng", "Nội dung chi tiết"]
      : ["Thông tin chung", "Cấu trúc đề", "Nội dung chi tiết"];

  return (
    <nav aria-label="Progress" className="w-full max-w-2xl mx-auto px-1">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, stepIdx) => (
          <React.Fragment key={step}>
            <button
              type="button"
              onClick={() => setStep(step)}
              className="group flex flex-col items-center focus:outline-none cursor-pointer"
            >
              <div
                className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all shadow-xs ${
                  currentStep > step
                    ? "bg-indigo-600 text-white"
                    : currentStep === step
                    ? "border-2 border-indigo-600 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 ring-2 ring-indigo-100 dark:ring-indigo-950"
                    : "border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {currentStep > step ? "✓" : step}
              </div>
              <span
                className={`mt-1.5 hidden sm:block text-xs font-semibold whitespace-nowrap transition-colors ${
                  currentStep === step ? "text-indigo-700 dark:text-indigo-400 font-bold" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {stepLabels[stepIdx]}
              </span>
            </button>

            {stepIdx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 sm:mx-4 rounded-full transition-colors ${
                  currentStep > step ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Mobile Current Step Subtitle */}
      <div className="mt-2 sm:hidden text-center">
        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
          Bước {currentStep}/{totalSteps}: {stepLabels[currentStep - 1]}
        </span>
      </div>
    </nav>
  );
};

const ExamForm: React.FC<ExamFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  isLoading,
}) => {
  // Fix: tính đúng và đủ deps + clear logic
  const isSpecialSubject = useMemo(() => {
    if (formData.subject === "Ngữ văn") return true;
    if (formData.schoolLevel === "Tiểu học" && formData.subject === "Tiếng Việt") return true;
    return false;
  }, [formData.subject, formData.schoolLevel]);

  const isEnglish = isEnglishSubject(formData.subject);

  const totalSteps = isSpecialSubject ? 2 : 3;
  const [step, setStep] = useState(1);

  const [grades, setGrades] = useState<string[]>(GRADES_BY_LEVEL[formData.schoolLevel]);
  const [subjects, setSubjects] = useState<string[]>(SUBJECTS_BY_LEVEL[formData.schoolLevel]);
  const [textbooks, setTextbooks] = useState<string[]>(GENERAL_TEXTBOOKS);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showLegalDetails, setShowLegalDetails] = useState(false);
  const [showEnglishFormatDetails, setShowEnglishFormatDetails] = useState(false);
  const [showEnglishSkillsDetail, setShowEnglishSkillsDetail] = useState(false);
  const [configurations, setConfigurations] = useState<Record<string, ExamFormData>>(() => {
    try {
      const saved = localStorage.getItem("examConfigurations");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    setGrades(GRADES_BY_LEVEL[formData.schoolLevel]);
    setSubjects(SUBJECTS_BY_LEVEL[formData.schoolLevel]);
    if (!GRADES_BY_LEVEL[formData.schoolLevel].includes(formData.grade)) {
      handleChange("grade", GRADES_BY_LEVEL[formData.schoolLevel][0]);
    }
    if (!SUBJECTS_BY_LEVEL[formData.schoolLevel].includes(formData.subject)) {
      handleChange("subject", SUBJECTS_BY_LEVEL[formData.schoolLevel][0]);
    }
  }, [formData.schoolLevel]);

  useEffect(() => {
    const specificTextbooks = TEXTBOOKS_BY_SUBJECT[formData.subject];
    const newTextbooks = specificTextbooks || GENERAL_TEXTBOOKS;
    setTextbooks(newTextbooks);
    if (!newTextbooks.includes(formData.textbook) && newTextbooks.length > 0) {
      handleChange("textbook", newTextbooks[0]);
    }
  }, [formData.subject]);

  // Khởi tạo dạng đề và cấu hình các kỹ năng mặc định cho Tiếng Anh nếu chưa có
  useEffect(() => {
    if (isEnglish) {
      if (!formData.examFormat) {
        handleChange("examFormat", "four_skills");
      }
      if (!formData.englishSkillsConfig) {
        handleChange("englishSkillsConfig", { ...DEFAULT_ENGLISH_SKILLS_CONFIG });
      }
    }
  }, [isEnglish]);

  // Reset step khi thay đổi số bước
  useEffect(() => setStep(1), [isSpecialSubject]);

  const handleChange = (field: keyof ExamFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectEnglishFormat = (formatId: string) => {
    const format = ENGLISH_EXAM_FORMATS.find((f) => f.id === formatId);
    if (!format) return;
    setFormData((prev) => ({
      ...prev,
      examFormat: format.id,
      duration: format.defaultDuration,
      multipleChoice: { ...format.distribution.multipleChoice },
      trueFalse: { ...format.distribution.trueFalse },
      shortAnswer: { ...format.distribution.shortAnswer },
      essay: { ...format.distribution.essay },
    }));
  };

  const handleToggleSkillType = (
    category: 'listeningTypes' | 'speakingTypes' | 'readingTypes' | 'writingTypes' | 'languageFocusTypes',
    typeId: string
  ) => {
    setFormData((prev) => {
      const curConfig = prev.englishSkillsConfig || { ...DEFAULT_ENGLISH_SKILLS_CONFIG };
      const curList = curConfig[category] || [];
      const exists = curList.includes(typeId);
      const updatedList = exists
        ? curList.filter((id) => id !== typeId)
        : [...curList, typeId];
      return {
        ...prev,
        englishSkillsConfig: {
          ...curConfig,
          [category]: updatedList,
        },
      };
    });
  };

  const handleApplySkillPreset = (presetId: string) => {
    const preset = ENGLISH_SKILL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setFormData((prev) => ({
      ...prev,
      englishSkillsConfig: {
        ...preset.config,
      },
    }));
  };

  const handleToggleSpeaking = () => {
    setFormData((prev) => {
      const curConfig = prev.englishSkillsConfig || { ...DEFAULT_ENGLISH_SKILLS_CONFIG };
      const nextSpeaking = !curConfig.includeSpeaking;
      return {
        ...prev,
        englishSkillsConfig: {
          ...curConfig,
          includeSpeaking: nextSpeaking,
          speakingTypes: nextSpeaking && (!curConfig.speakingTypes || curConfig.speakingTypes.length === 0)
            ? ['speak_qa', 'speak_topic_picture']
            : curConfig.speakingTypes,
        },
      };
    });
  };

  const handleQuestionTypeChange = (
    type: "multipleChoice" | "trueFalse" | "shortAnswer" | "essay",
    field: keyof QuestionTypeDistribution,
    value: number
  ) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[type] = { ...updated[type], [field]: value };

      if (field === "questionCount") {
        const types = ["multipleChoice", "trueFalse", "shortAnswer", "essay"] as const;
        const totalQuestions = types.reduce((sum, t) => sum + (updated[t].questionCount || 0), 0);

        if (totalQuestions > 0) {
          types.forEach((t) => {
            updated[t].percentage = Math.round((updated[t].questionCount / totalQuestions) * 100);
          });

          let sumPercent = types.reduce((s, t) => s + updated[t].percentage, 0);
          if (sumPercent !== 100) {
            const maxType = types.reduce((a, b) =>
              updated[a].questionCount >= updated[b].questionCount ? a : b
            );
            updated[maxType].percentage += 100 - sumPercent;
          }

          types.forEach((t) => {
            updated[t].score = parseFloat(((updated[t].percentage / 100) * 10).toFixed(2));
          });

          let sumScore = parseFloat(types.reduce((s, t) => s + updated[t].score, 0).toFixed(2));
          if (sumScore !== 10) {
            const maxType = types.reduce((a, b) =>
              updated[a].questionCount >= updated[b].questionCount ? a : b
            );
            updated[maxType].score = parseFloat((updated[maxType].score + (10 - sumScore)).toFixed(2));
          }
        }
      }
      return updated;
    });
  };

  const { totalPercentage, totalScore } = useMemo(() => {
    if (isSpecialSubject) return { totalPercentage: 100, totalScore: 10.0 };
    const q = [formData.multipleChoice, formData.trueFalse, formData.shortAnswer, formData.essay];
    const totalPercentage = q.reduce((sum, item) => sum + item.percentage, 0);
    const totalScore = parseFloat(q.reduce((sum, item) => sum + item.score, 0).toFixed(2));
    return { totalPercentage, totalScore };
  }, [formData, isSpecialSubject]);

  // Nạp bài mẫu nhanh để kiểm tra và dùng ngay
  const loadExamSample = (type: 'tieuhoc' | 'thcs' | 'thpt' | 'tienganh') => {
    if (type === 'tienganh') {
      const isPrimary = formData.schoolLevel === 'Tiểu học';
      setFormData((prev) => ({
        ...prev,
        subject: 'Ngoại ngữ 1 (Tiếng Anh)',
        grade: isPrimary ? 'Lớp 5' : 'Lớp 8',
        textbook: 'Kết nối tri thức với cuộc sống',
        examFormat: 'four_skills',
        duration: 45,
        multipleChoice: { questionCount: 12, percentage: 40, score: 4.0 },
        trueFalse: { questionCount: 4, percentage: 20, score: 2.0 },
        shortAnswer: { questionCount: 4, percentage: 20, score: 2.0 },
        essay: { questionCount: 2, percentage: 20, score: 2.0 },
        knowledgeContent: isPrimary
          ? 'Unit 1: All about me! & Unit 2: Our homes (Tiếng Anh 5 Global Success). Vocabulary, phonics, sentence structures, reading and writing.'
          : 'Unit 1: Leisure time & Unit 2: Life in the countryside (Tiếng Anh 8 Global Success). Pronunciation /s/ & /z/, verbs of liking/disliking + V-ing, comparative adverbs.',
        additionalRequirements: 'Đề kiểm tra 4 kỹ năng chuẩn ELT (Listening, Language Focus, Reading, Writing). Kèm audio script bài nghe và thang điểm/hướng dẫn chấm chi tiết.',
      }));
    } else if (type === 'tieuhoc') {
      setFormData((prev) => ({
        ...prev,
        schoolLevel: 'Tiểu học',
        grade: 'Lớp 4',
        subject: 'Toán',
        textbook: 'Kết nối tri thức với cuộc sống',
        duration: 40,
        multipleChoice: { questionCount: 6, percentage: 60, score: 6.0 },
        trueFalse: { questionCount: 0, percentage: 0, score: 0 },
        shortAnswer: { questionCount: 0, percentage: 0, score: 0 },
        essay: { questionCount: 2, percentage: 40, score: 4.0 },
        knowledgeContent: 'Chủ đề: Các phép tính với số tự nhiên (Cộng, trừ các số có nhiều chữ số; Nhân với số có một chữ số; Chia cho số có một chữ số; Tìm hai số khi biết tổng và hiệu của hai số đó).',
        additionalRequirements: 'Tuân thủ Thông tư 27/2020/TT-BGDĐT. Cấu trúc 3 mức độ nhận thức (Mức 1, 2, 3), thang điểm 10 số nguyên. Có 1 bài toán thực tế áp dụng tìm hai số khi biết tổng và hiệu.',
      }));
    } else if (type === 'thcs') {
      setFormData((prev) => ({
        ...prev,
        schoolLevel: 'THCS',
        grade: 'Lớp 8',
        subject: 'Khoa học tự nhiên',
        textbook: 'Kết nối tri thức với cuộc sống',
        duration: 45,
        multipleChoice: { questionCount: 8, percentage: 40, score: 4.0 },
        trueFalse: { questionCount: 2, percentage: 20, score: 2.0 },
        shortAnswer: { questionCount: 2, percentage: 20, score: 2.0 },
        essay: { questionCount: 1, percentage: 20, score: 2.0 },
        knowledgeContent: 'Chương 2: Một số hợp chất thông dụng (Oxide, Acid, Base, Thang pH, Muối, Phân bón hóa học).',
        additionalRequirements: 'Tuân thủ Công văn 7991/BGDĐT-GDTrH. Ma trận & bản đặc tả 4 mức độ (Nhận biết 40%, Thông hiểu 30%, Vận dụng 20%, Vận dụng cao 10%).',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        schoolLevel: 'THPT',
        grade: 'Lớp 11',
        subject: 'Lịch sử',
        textbook: 'Kết nối tri thức với cuộc sống',
        duration: 45,
        multipleChoice: { questionCount: 12, percentage: 30, score: 3.0 },
        trueFalse: { questionCount: 2, percentage: 40, score: 4.0 },
        shortAnswer: { questionCount: 2, percentage: 10, score: 1.0 },
        essay: { questionCount: 1, percentage: 20, score: 2.0 },
        knowledgeContent: 'Chủ đề 2: Chiến tranh bảo vệ Tổ quốc và chiến tranh giải phóng dân tộc trong lịch sử Việt Nam (trước Cách mạng tháng Tám năm 1945).',
        additionalRequirements: 'Cấu trúc đề kiểm tra đánh giá định kì theo định hướng phát triển phẩm chất và năng lực học sinh.',
      }));
    }
  };

  // Cấu hình mẫu phân bổ câu hỏi
  const applyPresetDistribution = (preset: '15p' | 'cv7991' | '50-50' | 'tt27') => {
    if (preset === '15p') {
      setFormData((prev) => ({
        ...prev,
        duration: 15,
        multipleChoice: { questionCount: 10, percentage: 100, score: 10.0 },
        trueFalse: { questionCount: 0, percentage: 0, score: 0 },
        shortAnswer: { questionCount: 0, percentage: 0, score: 0 },
        essay: { questionCount: 0, percentage: 0, score: 0 },
      }));
    } else if (preset === 'cv7991') {
      setFormData((prev) => ({
        ...prev,
        duration: 45,
        multipleChoice: { questionCount: 8, percentage: 40, score: 4.0 },
        trueFalse: { questionCount: 2, percentage: 20, score: 2.0 },
        shortAnswer: { questionCount: 2, percentage: 20, score: 2.0 },
        essay: { questionCount: 1, percentage: 20, score: 2.0 },
      }));
    } else if (preset === '50-50') {
      setFormData((prev) => ({
        ...prev,
        duration: 45,
        multipleChoice: { questionCount: 10, percentage: 50, score: 5.0 },
        trueFalse: { questionCount: 0, percentage: 0, score: 0 },
        shortAnswer: { questionCount: 0, percentage: 0, score: 0 },
        essay: { questionCount: 2, percentage: 50, score: 5.0 },
      }));
    } else if (preset === 'tt27') {
      setFormData((prev) => ({
        ...prev,
        duration: 40,
        multipleChoice: { questionCount: 6, percentage: 60, score: 6.0 },
        trueFalse: { questionCount: 0, percentage: 0, score: 0 },
        shortAnswer: { questionCount: 0, percentage: 0, score: 0 },
        essay: { questionCount: 2, percentage: 40, score: 4.0 },
      }));
    }
  };

  // Tự động cân bằng tỉ lệ 100% và 10.0 điểm
  const handleAutoBalance = () => {
    setFormData((prev) => {
      const updated = { ...prev };
      const types = ['multipleChoice', 'trueFalse', 'shortAnswer', 'essay'] as const;
      const totalQ = types.reduce((s, t) => s + (updated[t].questionCount || 0), 0);
      if (totalQ === 0) {
        return {
          ...updated,
          multipleChoice: { questionCount: 8, percentage: 40, score: 4.0 },
          trueFalse: { questionCount: 2, percentage: 20, score: 2.0 },
          shortAnswer: { questionCount: 2, percentage: 20, score: 2.0 },
          essay: { questionCount: 1, percentage: 20, score: 2.0 },
        };
      }
      types.forEach((t) => {
        updated[t].percentage = Math.round((updated[t].questionCount / totalQ) * 100);
      });
      let sumPct = types.reduce((s, t) => s + updated[t].percentage, 0);
      if (sumPct !== 100) {
        const maxT = types.reduce((a, b) => (updated[a].questionCount >= updated[b].questionCount ? a : b));
        updated[maxT].percentage += 100 - sumPct;
      }
      if (updated.schoolLevel === 'Tiểu học') {
        types.forEach((t) => {
          updated[t].score = Math.round((updated[t].percentage / 100) * 10);
        });
        let sumScore = types.reduce((s, t) => s + updated[t].score, 0);
        if (sumScore !== 10) {
          const maxT = types.reduce((a, b) => (updated[a].questionCount >= updated[b].questionCount ? a : b));
          updated[maxT].score += 10 - sumScore;
        }
      } else {
        types.forEach((t) => {
          updated[t].score = parseFloat(((updated[t].percentage / 100) * 10).toFixed(2));
        });
        let sumScore = parseFloat(types.reduce((s, t) => s + updated[t].score, 0).toFixed(2));
        if (sumScore !== 10) {
          const maxT = types.reduce((a, b) => (updated[a].questionCount >= updated[b].questionCount ? a : b));
          updated[maxT].score = parseFloat((updated[maxT].score + (10 - sumScore)).toFixed(2));
        }
      }
      return updated;
    });
  };

  const totalPercentageError = totalPercentage !== 100;
  const totalScoreError = totalScore !== 10.0;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  const jumpToStep = (targetStep: number) => {
    if (targetStep < step || !isStepInvalid(step)) setStep(targetStep);
  };

  const isStepInvalid = (checkStep: number) => {
    if (checkStep === 2 && !isSpecialSubject) return totalPercentageError || totalScoreError;
    return false;
  };

  useEffect(() => {
    localStorage.setItem("examConfigurations", JSON.stringify(configurations));
  }, [configurations]);

  const handleSaveConfig = (name: string) => {
    if (configurations[name]) {
      if (!window.confirm(`Cấu hình '${name}' đã tồn tại. Bạn có muốn ghi đè không?`)) return;
    }
    setConfigurations((prev) => ({ ...prev, [name]: formData }));
    setIsConfigModalOpen(false);
  };

  const handleLoadConfig = (name: string) => {
    setFormData(configurations[name]);
    setIsConfigModalOpen(false);
  };

  const handleDeleteConfig = (name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa cấu hình '${name}' không?`)) {
      setConfigurations((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
  };

  return (
    <form className="space-y-5 sm:space-y-8 card bg-white/95 dark:bg-slate-900/95 p-3.5 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 animate-scale-in text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mb-4 sm:mb-8 px-1 sm:px-4 pt-1 sm:pt-2">
        <StepIndicator currentStep={step} totalSteps={totalSteps} setStep={jumpToStep} />
      </div>

      <div className="min-h-[350px]">
        {step === 1 && (
          <Section
            title="1. Thông tin chung"
            description="Thiết lập các thông tin cơ bản cho đề kiểm tra."
          >
            {/* Thanh nạp bài mẫu nhanh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:p-3.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 rounded-2xl border border-indigo-100 dark:border-slate-800 shadow-2xs mb-2">
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-base">🪄</span>
                <span className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-300">
                  Dữ liệu mẫu nhanh:
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => loadExamSample('tieuhoc')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-750 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 shadow-2xs transition active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  🏫 Toán 4 (TT 27)
                </button>
                <button
                  type="button"
                  onClick={() => loadExamSample('thcs')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-750 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700 shadow-2xs transition active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  🔬 KHTN 8 (CV 7991)
                </button>
                <button
                  type="button"
                  onClick={() => loadExamSample('thpt')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-750 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-slate-700 shadow-2xs transition active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  📜 Lịch sử 11 (2025)
                </button>
                <button
                  type="button"
                  onClick={() => loadExamSample('tienganh')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-750 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-slate-700 shadow-2xs transition active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>🇬🇧</span>
                  <span>Tiếng Anh (4 kỹ năng)</span>
                </button>
              </div>
            </div>
            {/* Bước 1: 3 Thẻ lớn chọn cấp học theo yêu cầu */}
            <div className="mb-5">
              <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Bước 1 – Chọn cấp học
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'Tiểu học', title: 'TIỂU HỌC', subtitle: 'Lớp 1 → Lớp 5', icon: '🏫', desc: 'TT 27/2020/TT-BGDĐT • 3 Mức độ', color: 'emerald' },
                  { id: 'THCS', title: 'THCS', subtitle: 'Lớp 6 → Lớp 9', icon: '🎒', desc: 'CV 7991 • 4 Mức độ nhận thức', color: 'indigo' },
                  { id: 'THPT', title: 'THPT', subtitle: 'Lớp 10 → Lớp 12', icon: '🎓', desc: 'CV 7991 / GDPT 2018 • 4 Mức độ', color: 'purple' },
                ].map((lvl) => {
                  const isSelected = formData.schoolLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => handleChange('schoolLevel', lvl.id)}
                      className={`p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-900/60'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl">{lvl.icon}</span>
                        <div>
                          <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                            {lvl.title}
                          </div>
                          <div className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
                            {lvl.subtitle}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {lvl.desc}
                          </div>
                        </div>
                      </div>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tên trường (tùy chọn)
                </label>
                <input
                  id="schoolName"
                  name="schoolName"
                  type="text"
                  value={formData.schoolName || ""}
                  onChange={(e) => handleChange("schoolName", e.target.value)}
                  className="block w-full px-3 py-2 min-h-11 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  placeholder="VD: THCS Chu Văn An..."
                />
              </div>

              <div>
                <label htmlFor="teacherName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Giáo viên ra đề (tùy chọn)
                </label>
                <input
                  id="teacherName"
                  name="teacherName"
                  type="text"
                  value={formData.teacherName || ""}
                  onChange={(e) => handleChange("teacherName", e.target.value)}
                  className="block w-full px-3 py-2 min-h-11 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  placeholder="VD: Thầy Nguyễn Văn A..."
                />
              </div>

              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bước 2 – Chọn lớp
                </label>
                <select
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => handleChange("grade", e.target.value)}
                  className="block w-full px-3 py-2 min-h-11 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold"
                >
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bước 3 – Chọn môn học
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="block w-full px-3 py-2 min-h-11 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ô Nhập tên môn học khác khi chọn hoặc cần tùy chỉnh */}
            {(formData.subject === OTHER_SUBJECT_KEY || formData.customSubject) && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/50 mt-3 animate-scale-in">
                <label htmlFor="customSubject" className="block text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
                  ✍️ Nhập tên môn học khác:
                </label>
                <input
                  id="customSubject"
                  type="text"
                  value={formData.customSubject || ""}
                  onChange={(e) => handleChange("customSubject", e.target.value)}
                  placeholder="Nhập bất kỳ môn học nào (VD: Triết học, Mỹ thuật công nghiệp, Lập trình Python, v.v.)..."
                  className="w-full px-3 py-2 text-sm border border-amber-300 dark:border-amber-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-3">
              <div>
                <label htmlFor="examType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Loại đề kiểm tra
                </label>
                <select
                  id="examType"
                  value={formData.examType || "Kiểm tra giữa kỳ"}
                  onChange={(e) => handleChange("examType", e.target.value)}
                  className="block w-full px-3 py-2 min-h-11 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  <option value="Kiểm tra thường xuyên">Kiểm tra thường xuyên</option>
                  <option value="Kiểm tra 15 phút">Kiểm tra 15 phút</option>
                  <option value="Kiểm tra giữa kỳ">Kiểm tra giữa kỳ</option>
                  <option value="Kiểm tra cuối kỳ">Kiểm tra cuối kỳ</option>
                  <option value="Đề ôn tập">Đề ôn tập</option>
                  <option value="Đề luyện tập">Đề luyện tập</option>
                  <option value="Đề khảo sát">Đề khảo sát</option>
                  <option value="Đề tuyển chọn học sinh">Đề tuyển chọn học sinh</option>
                  <option value="Đề tự tạo">Đề tự tạo</option>
                </select>
              </div>

              <div>
                <label htmlFor="examTitle" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tên đề: (tùy chọn)
                </label>
                <input
                  id="examTitle"
                  type="text"
                  value={formData.examTitle || ""}
                  onChange={(e) => handleChange("examTitle", e.target.value)}
                  placeholder="VD: Đề kiểm tra giữa học kì 1..."
                  className="block w-full px-3 py-2 min-h-11 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Thời gian làm bài
                </label>
                <select
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", parseInt(e.target.value, 10))}
                  className="block w-full px-3 py-2 min-h-11 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  <option value={10}>10 phút</option>
                  <option value={15}>15 phút</option>
                  <option value={30}>30 phút</option>
                  <option value={45}>45 phút</option>
                  <option value={60}>60 phút</option>
                  <option value={90}>90 phút</option>
                  <option value={120}>120 phút</option>
                </select>
              </div>
            </div>

            {/* Menu Chọn Dạng Đề Môn Tiếng Anh - Tinh gọn */}
            {isEnglish && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-50/70 via-red-50/40 to-amber-50/40 dark:from-slate-850 dark:via-rose-950/20 dark:to-slate-850 border border-rose-200/80 dark:border-rose-900/60 shadow-xs mt-3 sm:mt-5 animate-scale-in">
                <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-rose-200/60 dark:border-rose-900/40">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇬🇧</span>
                    <h3 className="text-xs sm:text-sm font-bold text-rose-950 dark:text-rose-200">
                      Dạng đề Tiếng Anh (Exam Format)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                      {ENGLISH_EXAM_FORMATS.find(f => f.id === formData.examFormat)?.badge || "Chuẩn 4 kỹ năng"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowEnglishFormatDetails(!showEnglishFormatDetails)}
                    className="px-2 py-0.5 text-xs text-rose-800 dark:text-rose-300 font-semibold hover:bg-rose-100 dark:hover:bg-slate-750 rounded-lg transition cursor-pointer flex items-center gap-1"
                  >
                    <span>{showEnglishFormatDetails ? 'Thu gọn' : 'Chi tiết'}</span>
                    <span>{showEnglishFormatDetails ? '▴' : '▾'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {ENGLISH_EXAM_FORMATS.map((format) => {
                    const isSelected = (formData.examFormat || 'four_skills') === format.id;
                    return (
                      <button
                        key={format.id}
                        type="button"
                        onClick={() => handleSelectEnglishFormat(format.id)}
                        className={`p-2 sm:p-2.5 rounded-xl text-left border transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-white dark:bg-slate-800 border-rose-500 dark:border-rose-400 shadow-sm ring-2 ring-rose-200 dark:ring-rose-900/50'
                            : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border-rose-200/60 dark:border-slate-700'
                        }`}
                        title={format.description}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-base">{format.icon}</span>
                            <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300">
                              {format.defaultDuration}p
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">
                            {format.label}
                          </p>
                          {showEnglishFormatDetails && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                              {format.description}
                            </p>
                          )}
                        </div>
                        <div className="mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-700 text-[10px] flex items-center justify-between">
                          <span className={isSelected ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                            {isSelected ? '✓ Đã chọn' : 'Chọn'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </Section>
        )}

        {step === 2 && !isSpecialSubject && (
          <Section
            title={
              isEnglish
                ? "2. Cấu trúc đề & Phân bổ điểm (English Exam Structure)"
                : "2. Phân bổ câu hỏi và điểm"
            }
            description={
              isEnglish
                ? "Điều chỉnh số lượng câu hỏi, tỉ lệ % và điểm số cho từng phần theo dạng đề Tiếng Anh đã chọn. Tổng điểm toàn bài là 10.0."
                : formData.schoolLevel === 'Tiểu học'
                ? "Thiết lập cấu trúc câu hỏi theo Thông tư 27/2020/TT-BGDĐT. Tổng điểm toàn bài là 10 (không dùng điểm thập phân)."
                : "Điều chỉnh số lượng câu hỏi, tỉ lệ % và điểm số cho từng dạng theo CV 7991. Tổng điểm phải là 10."
            }
          >
            {/* Khi là môn Tiếng Anh: Hiển thị thanh chuyển đổi nhanh dạng đề */}
            {isEnglish ? (
              <div className="mb-3.5 p-3 sm:p-3.5 bg-rose-50/90 dark:bg-slate-850 border border-rose-200 dark:border-slate-700 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-950 dark:text-rose-200">
                  <span>🇬🇧</span>
                  <span>Đổi dạng đề Tiếng Anh nhanh:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {ENGLISH_EXAM_FORMATS.map((fmt) => {
                    const isCur = (formData.examFormat || 'four_skills') === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => handleSelectEnglishFormat(fmt.id)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition active:scale-95 flex items-center gap-1 ${
                          isCur
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-slate-700'
                        }`}
                        title={fmt.description}
                      >
                        <span>{fmt.icon}</span>
                        <span>{fmt.badge}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleAutoBalance}
                    className="px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xs transition active:scale-95 flex items-center gap-1"
                    title="Tự động tính lại tỉ lệ % và điểm để đạt chuẩn 100% và 10.0 điểm"
                  >
                    <span>🎯</span>
                    <span>Cân bằng tròn 10 điểm</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {formData.schoolLevel === 'Tiểu học' && (
                  <div className="mb-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                    <span className="font-bold shrink-0">📌 Lưu ý TT 27:</span>
                    <span>Ma trận và bản đặc tả tiểu học sẽ được hệ thống tự động phân bổ theo <strong>3 mức độ (Mức 1, Mức 2, Mức 3)</strong> và làm tròn điểm số nguyên.</span>
                  </div>
                )}

                {/* Khung cấu hình mẫu nhanh & nút cân bằng điểm */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50/90 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>⚡</span>
                    <span>Mẫu phân bổ câu hỏi:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPresetDistribution('15p')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition active:scale-95"
                      title="10 câu trắc nghiệm 100% (10 điểm)"
                    >
                      Đề 15p (10 TN)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetDistribution('cv7991')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 transition active:scale-95"
                      title="Chuẩn 70% TN (8 TN, 2 Đ/S, 2 TLN) - 30% TL (1 TL)"
                    >
                      45p Chuẩn 70-30 (CV 7991)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetDistribution('50-50')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition active:scale-95"
                      title="50% Trắc nghiệm - 50% Tự luận"
                    >
                      50% TN - 50% TL
                    </button>
                    {formData.schoolLevel === 'Tiểu học' && (
                      <button
                        type="button"
                        onClick={() => applyPresetDistribution('tt27')}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 transition active:scale-95"
                        title="Chuẩn TT 27 (6 TN 6đ + 2 TL 4đ)"
                      >
                        Tiểu học (TT 27)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAutoBalance}
                      className="px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xs transition active:scale-95 flex items-center gap-1"
                      title="Tự động tính lại tỉ lệ % và điểm để đạt chuẩn 100% và 10.0 điểm"
                    >
                      <span>🎯</span>
                      <span>Cân bằng tròn 10 điểm</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-3">
              <div className="hidden sm:grid grid-cols-4 gap-3 sm:gap-4 items-center text-xs sm:text-sm font-semibold text-slate-500 px-1 sm:px-3">
                <div className="col-span-1">{isEnglish ? "Dạng câu hỏi (Question Type)" : "Dạng câu hỏi"}</div>
                <div>{isEnglish ? "Số câu (Questions)" : "Số câu"}</div>
                <div>{isEnglish ? "Tỉ lệ % (Percentage)" : "Tỉ lệ (%)"}</div>
                <div className="col-span-1">{isEnglish ? "Điểm (Points)" : "Điểm"}</div>
              </div>

              <QuestionTypeInput
                label={isEnglish ? "Trắc nghiệm (Multiple Choice)" : "Trắc nghiệm"}
                value={formData.multipleChoice}
                onChange={(f, v) => handleQuestionTypeChange("multipleChoice", f, v)}
              />
              <QuestionTypeInput
                label={isEnglish ? "Đúng/Sai (True/False)" : "Đúng/Sai"}
                value={formData.trueFalse}
                onChange={(f, v) => handleQuestionTypeChange("trueFalse", f, v)}
              />
              <QuestionTypeInput
                label={isEnglish ? "Trả lời ngắn / Điền từ (Short Answer)" : "Trả lời ngắn"}
                value={formData.shortAnswer}
                onChange={(f, v) => handleQuestionTypeChange("shortAnswer", f, v)}
              />
              <QuestionTypeInput
                label={isEnglish ? "Tự luận / Viết (Writing / Essay)" : "Tự luận"}
                value={formData.essay}
                onChange={(f, v) => handleQuestionTypeChange("essay", f, v)}
              />
            </div>

            {/* Cấu hình chi tiết các dạng bài cho từng kỹ năng (Nghe, Nói, Đọc, Viết) - Thu gọn mặc định */}
            {isEnglish && (
              <div className="mt-4 p-3.5 sm:p-4 bg-gradient-to-br from-rose-50/70 via-white to-amber-50/60 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-xs animate-scale-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎧</span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-rose-950 dark:text-rose-200 flex items-center gap-2">
                        <span>Dạng bài kỹ năng (Listening, Speaking, Reading, Writing)</span>
                      </h3>
                      <p className="text-[11px] text-rose-700 dark:text-rose-300">
                        {(formData.englishSkillsConfig?.listeningTypes?.length || 0) +
                          (formData.englishSkillsConfig?.readingTypes?.length || 0) +
                          (formData.englishSkillsConfig?.writingTypes?.length || 0) +
                          (formData.englishSkillsConfig?.languageFocusTypes?.length || 0) +
                          (formData.englishSkillsConfig?.includeSpeaking
                            ? formData.englishSkillsConfig?.speakingTypes?.length || 0
                            : 0)}{" "}
                        dạng bài đã chọn
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEnglishSkillsDetail(!showEnglishSkillsDetail)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-slate-750 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>{showEnglishSkillsDetail ? 'Thu gọn' : 'Tùy chỉnh dạng bài'}</span>
                      <span>{showEnglishSkillsDetail ? '▴' : '▾'}</span>
                    </button>
                  </div>
                </div>

                {showEnglishSkillsDetail && (
                  <div className="mt-3 pt-3 border-t border-rose-200/80 dark:border-rose-900/40 space-y-3 animate-fadeIn">
                    {/* Thanh Mẫu cấu hình nhanh dạng bài theo cấp học */}
                    <div className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-rose-200/80 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span>⚡</span>
                        <span>Mẫu nhanh:</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {ENGLISH_SKILL_PRESETS.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleApplySkillPreset(p.id)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-slate-650 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-slate-600 transition active:scale-95 flex items-center gap-1"
                            title={p.label}
                          >
                            <span>{p.icon}</span>
                            <span>{p.badge}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Danh sách từng kỹ năng */}
                    <div className="space-y-3">
                  {ENGLISH_SKILL_CATEGORIES.map((category) => {
                    const configKey =
                      category.id === "listening"
                        ? "listeningTypes"
                        : category.id === "reading"
                        ? "readingTypes"
                        : category.id === "writing"
                        ? "writingTypes"
                        : category.id === "languageFocus"
                        ? "languageFocusTypes"
                        : "speakingTypes";

                    const selectedList = formData.englishSkillsConfig?.[configKey] || [];
                    const isSpeakingCategory = category.id === "speaking";
                    const isSpeakingActive = Boolean(formData.englishSkillsConfig?.includeSpeaking);

                    return (
                      <div
                        key={category.id}
                        className={`p-3.5 rounded-xl border transition-all duration-200 ${
                          isSpeakingCategory && !isSpeakingActive
                            ? "bg-slate-50/70 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 opacity-80"
                            : "bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 shadow-2xs"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-700/60">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{category.title}</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal hidden sm:inline">
                                  ({category.englishTitle})
                                </span>
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSpeakingCategory ? (
                              <button
                                type="button"
                                onClick={handleToggleSpeaking}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1.5 ${
                                  isSpeakingActive
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
                                }`}
                              >
                                <span>{isSpeakingActive ? "✓ Đang bật phần thi Nói" : "○ Chưa bật phần thi Nói"}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                                {selectedList.length} / {category.types.length} dạng bài
                              </span>
                            )}
                          </div>
                        </div>

                        {(!isSpeakingCategory || isSpeakingActive) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {category.types.map((type) => {
                              const isChecked = selectedList.includes(type.id);
                              return (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() => handleToggleSkillType(configKey, type.id)}
                                  className={`p-2.5 rounded-lg text-left border transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                                    isChecked
                                      ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-500 text-rose-950 dark:text-rose-200 shadow-2xs ring-1 ring-rose-200 dark:ring-rose-900/40"
                                      : "bg-slate-50/50 dark:bg-slate-750/50 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm">{type.icon}</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                          {type.label}
                                        </span>
                                      </div>
                                      <span
                                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                                          isChecked
                                            ? "bg-rose-600 text-white"
                                            : "border border-slate-300 dark:border-slate-600 text-transparent"
                                        }`}
                                      >
                                        ✓
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mb-1">
                                      {type.englishLabel}
                                    </p>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                      {type.desc}
                                    </p>
                                  </div>
                                  <div className="mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/60">
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 block truncate">
                                      {type.example}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-dashed flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 text-sm sm:text-base font-semibold">
              <div
                className={`flex items-center justify-between gap-2 p-2 rounded-md ${
                  totalPercentageError ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100"
                }`}
              >
                <span>Tổng tỉ lệ: {totalPercentage}%</span>
                {totalPercentageError && <span className="text-xs">(Phải là 100%)</span>}
              </div>

              <div
                className={`flex items-center justify-between gap-2 p-2 rounded-md ${
                  totalScoreError ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100"
                }`}
              >
                <span>Tổng điểm: {totalScore}</span>
                {totalScoreError && <span className="text-xs">(Phải là 10.0)</span>}
              </div>
            </div>
          </Section>
        )}

        {((step === 3 && !isSpecialSubject) || (step === 2 && isSpecialSubject)) && (
          <Section
            title="Bước 4 – Nhập nội dung kiến thức & Tài liệu tham chiếu"
            description="Cung cấp chi tiết bài học, yêu cầu cần đạt hoặc tải tài liệu tham chiếu (PDF, Word, TXT, Giáo án, Đề cũ...)."
          >
            {/* Mục 3: TÀI LIỆU THAM CHIẾU */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    TÀI LIỆU THAM CHIẾU
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                    Ưu tiên tuyệt đối
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-650 rounded-lg border border-indigo-200 dark:border-slate-600 shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <span>📎</span>
                  <span>Tải lên PDF / Word / TXT / SGK / Đề cũ</span>
                </button>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                Chế độ sử dụng tài liệu:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { mode: 'strict_doc_only', label: 'Chỉ sử dụng tài liệu đã cung cấp', desc: 'Không tự bổ sung kiến thức ngoài tài liệu' },
                  { mode: 'doc_and_curriculum', label: 'Tài liệu + Kiến thức phổ thông', desc: 'Ưu tiên tài liệu, bổ sung kiến thức chuẩn GDPT' },
                  { mode: 'manual_input', label: 'Giáo viên tự nhập nội dung', desc: 'Dựa trên các trường nhập liệu bên dưới' },
                ].map((item) => {
                  const currentMode = formData.referenceDoc?.mode || 'doc_and_curriculum';
                  const isChecked = currentMode === item.mode;
                  return (
                    <label
                      key={item.mode}
                      onClick={() => handleChange('referenceDoc', { ...(formData.referenceDoc || {}), mode: item.mode })}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        isChecked
                          ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-xs ring-1 ring-indigo-300 dark:ring-indigo-800'
                          : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-850/50 hover:bg-white dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <input
                          type="radio"
                          name="referenceDocMode"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 text-indigo-600"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Các trường nhập chi tiết Bước 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div>
                <label htmlFor="topicName" className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên bài / Chủ đề:
                </label>
                <input
                  id="topicName"
                  type="text"
                  value={formData.topicName || ""}
                  onChange={(e) => handleChange("topicName", e.target.value)}
                  placeholder="VD: Định luật Ôm, Trao đổi chất..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="chapterName" className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chương / Phân môn:
                </label>
                <input
                  id="chapterName"
                  type="text"
                  value={formData.chapterName || ""}
                  onChange={(e) => handleChange("chapterName", e.target.value)}
                  placeholder="VD: Chương 1: Điện học, Hình học..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="knowledgeScope" className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phạm vi kiến thức:
                </label>
                <input
                  id="knowledgeScope"
                  type="text"
                  value={formData.knowledgeScope || ""}
                  onChange={(e) => handleChange("knowledgeScope", e.target.value)}
                  placeholder="VD: Từ tuần 1 đến tuần 9..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="testFocus" className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nội dung cần kiểm tra:
                </label>
                <input
                  id="testFocus"
                  type="text"
                  value={formData.testFocus || ""}
                  onChange={(e) => handleChange("testFocus", e.target.value)}
                  placeholder="VD: Khái niệm, công thức, giải bài toán mạch nối tiếp..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="learningOutcomes" className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Yêu cầu cần đạt:
                </label>
                <input
                  id="learningOutcomes"
                  type="text"
                  value={formData.learningOutcomes || ""}
                  onChange={(e) => handleChange("learningOutcomes", e.target.value)}
                  placeholder="VD: Nêu được định luật, vận dụng tính điện trở tương đương..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="teacherNotes" className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ghi chú của giáo viên:
                </label>
                <input
                  id="teacherNotes"
                  type="text"
                  value={formData.teacherNotes || ""}
                  onChange={(e) => handleChange("teacherNotes", e.target.value)}
                  placeholder="VD: Tránh câu đánh đố, câu hỏi cần sát thực tế..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Vùng văn bản lớn để dán nội dung bài học */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 flex-grow">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="knowledgeContent" className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    📋 Vùng dán nội dung bài học / Văn bản đọc hiểu
                  </label>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    (Văn bản SGK, giáo án, kế hoạch bài dạy)
                  </span>
                </div>
                <textarea
                  id="knowledgeContent"
                  value={formData.knowledgeContent}
                  onChange={(e) => handleChange("knowledgeContent", e.target.value)}
                  placeholder={
                    isEnglish
                      ? "VD:\n- Unit 1: All about me! / Leisure time\n- Unit 2: Our homes / Life in the countryside\n- Target vocabulary, pronunciation (/s/, /z/), grammar (Present simple vs continuous, verbs of liking/disliking + V-ing)..."
                      : "Dán trực tiếp văn bản bài học, đoạn trích đọc hiểu, nội dung SGK hoặc tài liệu ôn tập vào đây..."
                  }
                  className="block w-full px-3 py-2.5 text-base border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl shadow-sm flex-grow min-h-[180px] sm:min-h-[220px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="additionalRequirements" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  ✨ Yêu cầu bổ sung đặc biệt (tùy chọn)
                </label>
                <textarea
                  id="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={(e) => handleChange("additionalRequirements", e.target.value)}
                  placeholder={
                    isEnglish
                      ? "VD:\n- Kèm audio script chi tiết cho bài nghe.\n- Phần viết (Writing) gồm 1 câu sắp xếp từ và 1 câu viết lại câu.\n- Có hướng dẫn chấm và đáp án chi tiết."
                      : "VD:\n- Cần 1 câu hỏi trắc nghiệm liên hệ thực tế địa phương.\n- Phần tự luận giải bài toán bằng hai bước.\n- Không ra câu hỏi ngoài phạm vi tài liệu."
                  }
                  className="block w-full px-3 py-2.5 text-base border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl shadow-sm flex-grow min-h-[180px] sm:min-h-[220px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>
          </Section>
        )}
      </div>

      {/* Thanh hành động sticky cho mobile */}
      <div className="sticky bottom-0 left-0 right-0 z-10 -mx-4 sm:mx-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-200 cursor-pointer"
              >
                Quay lại
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Cấu hình</span>
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isStepInvalid(step)}
                className="px-5 py-2.5 sm:px-8 sm:py-3 bg-indigo-600 text-white text-sm sm:text-base font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                Tiếp theo
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSubmit(formData)}
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-5 py-2.5 sm:px-8 sm:py-3.5 bg-indigo-600 text-white text-sm sm:text-lg font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform md:hover:scale-105 duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  "🚀 Tạo đề ngay!"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfigManagementModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        configurations={configurations}
        onSave={handleSaveConfig}
        onLoad={handleLoadConfig}
        onDelete={handleDeleteConfig}
      />

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onApplyText={(text) => handleChange("knowledgeContent", text)}
        targetFieldTitle="Nội dung kiến thức"
      />
    </form>
  );
};

export default ExamForm;
