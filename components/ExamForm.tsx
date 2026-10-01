import React, { useState, useEffect, useMemo } from "react";
import type { ExamFormData, QuestionTypeDistribution } from "../types";
import {
  SCHOOL_LEVELS,
  GRADES_BY_LEVEL,
  SUBJECTS_BY_LEVEL,
  GENERAL_TEXTBOOKS,
  TEXTBOOKS_BY_SUBJECT,
} from "../constants";
import ConfigManagementModal from "./ConfigManagementModal";

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
  <section className="card bg-white/90 flex flex-col h-full border-0 shadow-lg rounded-2xl p-5 sm:p-6 animate-scale-in">
    <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-2 tracking-tight">
      {title}
    </h2>
    <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">{description}</p>
    <div className="space-y-4 flex-grow flex flex-col">{children}</div>
  </section>
);

const QuestionTypeInput: React.FC<{
  label: string;
  value: QuestionTypeDistribution;
  onChange: (field: keyof QuestionTypeDistribution, val: number) => void;
}> = ({ label, value, onChange }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-center p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-0 shadow-sm">
      <label className="font-semibold text-indigo-700 col-span-2 sm:col-span-1">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={value.questionCount}
          onChange={(e) => onChange("questionCount", parseInt(e.target.value, 10) || 0)}
          className="w-full px-3 py-2 min-h-11 border border-indigo-200 rounded-lg shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm bg-white"
          min={0}
        />
        <span className="text-slate-600 text-sm">câu</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={value.percentage}
          onChange={(e) => onChange("percentage", parseInt(e.target.value, 10) || 0)}
          className="w-full px-3 py-2 min-h-11 border border-indigo-200 rounded-lg shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm bg-white"
          min={0}
          max={100}
          step={5}
        />
        <span className="text-slate-600 text-sm">%</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          value={value.score}
          onChange={(e) => onChange("score", parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 min-h-11 border border-indigo-200 rounded-lg shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm bg-white"
          min={0}
          max={10}
          step={0.25}
        />
        <span className="text-slate-600 text-sm">điểm</span>
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
    <nav aria-label="Progress" className=" -mx-2 px-2">
      <ol role="list" className="flex items-center min-w-max sm:gap-0">
        {steps.map((step, stepIdx) => (
          <li
            key={step}
            className={`relative ${stepIdx !== steps.length - 1 ? "pr-16 sm:pr-20 flex-1" : ""}`}
          >
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div
                className={`h-0.5 w-full ${
                  currentStep > step ? "bg-indigo-600" : "bg-slate-200"
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(step)}
              className="relative flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-current={currentStep === step ? "step" : undefined}
            >
              {currentStep > step ? (
                <div className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 md:hover:scale-105 transition">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : currentStep === step ? (
                <div className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                  <span className="text-indigo-600">{step}</span>
                </div>
              ) : (
                <div className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-slate-300 bg-white hover:border-slate-400">
                  <span className="text-slate-500">{step}</span>
                </div>
              )}
              {/* Nhãn ẩn trên mobile để tránh tràn */}
              <span className="absolute top-10 hidden sm:block text-center text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
                {stepLabels[stepIdx]}
              </span>
              {/* Nhãn rút gọn cho mobile (sr-only vì đã có số) */}
              <span className="sr-only">{stepLabels[stepIdx]}</span>
            </button>
          </li>
        ))}
      </ol>
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
    if (formData.subject === "Ngoại ngữ 1 (Tiếng Anh)" || formData.subject === "Ngữ văn") return true;
    if (formData.schoolLevel === "Tiểu học" && formData.subject === "Tiếng Việt") return true;
    return false;
  }, [formData.subject, formData.schoolLevel]);

  const totalSteps = isSpecialSubject ? 2 : 3;
  const [step, setStep] = useState(1);

  const [grades, setGrades] = useState<string[]>(GRADES_BY_LEVEL[formData.schoolLevel]);
  const [subjects, setSubjects] = useState<string[]>(SUBJECTS_BY_LEVEL[formData.schoolLevel]);
  const [textbooks, setTextbooks] = useState<string[]>(GENERAL_TEXTBOOKS);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
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

  // Reset step khi thay đổi số bước
  useEffect(() => setStep(1), [isSpecialSubject]);

  const handleChange = (field: keyof ExamFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
  const loadExamSample = (type: 'tieuhoc' | 'thcs' | 'thpt') => {
    if (type === 'tieuhoc') {
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
    <form className="space-y-6 sm:space-y-8 card bg-white/95 p-4 sm:p-8 rounded-3xl shadow-2xl border-0 animate-scale-in text-slate-900">
      <div className="sm:mb-12 px-10 pt-2 sm:pt-4 pb-2">
        <StepIndicator currentStep={step} totalSteps={totalSteps} setStep={jumpToStep} />
      </div>

      <div className="min-h-[350px]">
        {step === 1 && (
          <Section
            title="1. Thông tin chung"
            description="Thiết lập các thông tin cơ bản cho đề kiểm tra."
          >
            {/* Thanh nạp bài mẫu nhanh */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-2xl border border-indigo-100 shadow-2xs mb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🪄</span>
                <span className="text-xs sm:text-sm font-bold text-indigo-900">
                  Thử nghiệm nhanh với dữ liệu mẫu:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => loadExamSample('tieuhoc')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs transition active:scale-95"
                >
                  🏫 Toán 4 (TT 27)
                </button>
                <button
                  type="button"
                  onClick={() => loadExamSample('thcs')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs transition active:scale-95"
                >
                  🔬 KHTN 8 (CV 7991)
                </button>
                <button
                  type="button"
                  onClick={() => loadExamSample('thpt')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs transition active:scale-95"
                >
                  📜 Lịch sử 11 (2025)
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="transition-transform duration-300 md:hover:scale-105">
                <label
                  htmlFor="schoolLevel"
                  className="block font-medium mb-1 text-indigo-700 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
                  Cấp học
                </label>
                <select
                  id="schoolLevel"
                  value={formData.schoolLevel}
                  onChange={(e) => handleChange("schoolLevel", e.target.value)}
                  className="block w-full px-3 py-2 min-h-11 border border-indigo-300 rounded-lg shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-base bg-white transition-all duration-300"
                  required
                >
                  {SCHOOL_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" /></svg>
                  Chọn cấp học phù hợp với đề kiểm tra.
                </p>
              </div>

              <div className="transition-transform duration-300 md:hover:scale-105">
                <label
                  htmlFor="schoolName"
                  className="block font-medium mb-1 text-indigo-700 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 0h4" /></svg>
                  Tên trường
                </label>
                <input
                  id="schoolName"
                  name="schoolName"
                  type="text"
                  value={formData.schoolName || ""}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="block w-full px-3 py-2 min-h-11 border border-indigo-300 rounded-lg shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-base bg-white transition-all duration-300"
                  placeholder="Nhập tên trường"
                />
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" /></svg>
                  Nhập tên trường đầy đủ, ví dụ: Trường tiểu học số 1 Trương Quang Trọng.
                </p>
              </div>
            </div>

            {/* Khung căn cứ quy định áp dụng: Thông tư 27/2020/TT-BGDĐT cho Tiểu học hoặc CV 7991 cho THCS/THPT */}
            <div className={`p-4 rounded-xl border mb-6 flex items-start gap-3 transition-colors ${
              formData.schoolLevel === 'Tiểu học'
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : 'bg-indigo-50/90 border-indigo-200 text-indigo-950'
            }`}>
              <div className={`p-2 rounded-lg text-white shrink-0 mt-0.5 ${
                formData.schoolLevel === 'Tiểu học' ? 'bg-emerald-600' : 'bg-indigo-600'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xs sm:text-sm">
                {formData.schoolLevel === 'Tiểu học' ? (
                  <>
                    <p className="font-bold text-emerald-900 text-sm sm:text-base flex items-center gap-2">
                      <span>Căn cứ pháp lý: Thông tư 27/2020/TT-BGDĐT</span>
                      <span className="bg-emerald-200 text-emerald-800 text-[11px] px-2 py-0.5 rounded-full font-semibold">Cấp Tiểu học</span>
                    </p>
                    <ul className="mt-1 space-y-1 text-emerald-800 list-disc list-inside">
                      <li><strong>3 Mức độ nhận thức (Điều 7)</strong>: Mức 1 (Nhận biết/nhắc lại), Mức 2 (Kết nối/sắp xếp), Mức 3 (Vận dụng giải quyết vấn đề mới).</li>
                      <li><strong>Thang điểm 10 không số thập phân</strong> theo Điều 7 TT 27/2020/TT-BGDĐT.</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-indigo-900 text-sm sm:text-base flex items-center gap-2">
                      <span>Căn cứ pháp lý: Công văn 7991/BGDĐT-GDTrH</span>
                      <span className="bg-indigo-200 text-indigo-800 text-[11px] px-2 py-0.5 rounded-full font-semibold">Cấp {formData.schoolLevel}</span>
                    </p>
                    <p className="mt-1 text-indigo-800">
                      Đề kiểm tra biên soạn theo <strong>4 mức độ nhận thức</strong>: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-slate-700 mb-1">
                  Lớp
                </label>
                <select
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => handleChange("grade", e.target.value)}
                  className="block w-full px-3 py-2 min-h-11 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                  Môn học
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="block w-full px-3 py-2 min-h-11 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bộ sách áp dụng
                </label>
                <div className="flex items-center gap-2 px-3 py-2 min-h-11 border border-indigo-200 rounded-md bg-indigo-50/80 text-indigo-900 font-semibold text-sm">
                  <span>📘</span>
                  <span className="truncate">Kết nối tri thức với cuộc sống</span>
                </div>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">
                  Thời gian (phút)
                </label>
                <input
                  id="duration"
                  type="number"
                  inputMode="numeric"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", parseInt(e.target.value, 10))}
                  className="block w-full px-3 py-2 min-h-11 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </Section>
        )}

        {step === 2 && !isSpecialSubject && (
          <Section
            title="2. Phân bổ câu hỏi và điểm"
            description={
              formData.schoolLevel === 'Tiểu học'
                ? "Thiết lập cấu trúc câu hỏi theo Thông tư 27/2020/TT-BGDĐT. Tổng điểm toàn bài là 10 (không dùng điểm thập phân)."
                : "Điều chỉnh số lượng câu hỏi, tỉ lệ % và điểm số cho từng dạng theo CV 7991. Tổng điểm phải là 10."
            }
          >
            {formData.schoolLevel === 'Tiểu học' && (
              <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <span className="font-bold shrink-0">📌 Lưu ý TT 27:</span>
                <span>Ma trận và bản đặc tả tiểu học sẽ được hệ thống tự động phân bổ theo <strong>3 mức độ (Mức 1, Mức 2, Mức 3)</strong> và làm tròn điểm số nguyên.</span>
              </div>
            )}

            {/* Khung cấu hình mẫu nhanh & nút cân bằng điểm */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50/90 rounded-2xl border border-slate-200 shadow-2xs mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
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
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-center text-xs sm:text-sm font-medium text-slate-500 px-1 sm:px-3">
                <div className="col-span-2 sm:col-span-1">Dạng câu hỏi</div>
                <div>Số câu</div>
                <div>Tỉ lệ (%)</div>
                <div className="col-span-1">Điểm</div>
              </div>

              <QuestionTypeInput
                label="Trắc nghiệm"
                value={formData.multipleChoice}
                onChange={(f, v) => handleQuestionTypeChange("multipleChoice", f, v)}
              />
              <QuestionTypeInput
                label="Đúng/Sai"
                value={formData.trueFalse}
                onChange={(f, v) => handleQuestionTypeChange("trueFalse", f, v)}
              />
              <QuestionTypeInput
                label="Trả lời ngắn"
                value={formData.shortAnswer}
                onChange={(f, v) => handleQuestionTypeChange("shortAnswer", f, v)}
              />
              <QuestionTypeInput
                label="Tự luận"
                value={formData.essay}
                onChange={(f, v) => handleQuestionTypeChange("essay", f, v)}
              />
            </div>

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
            title={
              isSpecialSubject
                ? formData.schoolLevel === "Cấp 1" && formData.subject === "Tiếng Việt"
                  ? "2. Nội dung và Yêu cầu (Tiếng Việt cấp 1)"
                  : "2. Nội dung và Yêu cầu"
                : "3. Nội dung và Yêu cầu"
            }
            description="Cung cấp nội dung kiến thức và các yêu cầu đặc biệt để AI tùy chỉnh đề bài tốt hơn."
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 flex-grow">
              <div className="flex flex-col">
                <label htmlFor="knowledgeContent" className="block text-sm font-medium text-slate-700 mb-2">
                  Nội dung kiến thức
                </label>
                <textarea
                  id="knowledgeContent"
                  value={formData.knowledgeContent}
                  onChange={(e) => handleChange("knowledgeContent", e.target.value)}
                  placeholder={"VD:\n- Bài 1: Sự đa dạng của thế giới sống\n- Bài 2: Các giới sinh vật\n- Chủ đề: Quang hợp và hô hấp"}
                  className="block w-full px-3 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm flex-grow min-h-[160px] sm:min-h-[200px]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="additionalRequirements" className="block text-sm font-medium text-slate-700 mb-2">
                  Yêu cầu bổ sung (tùy chọn)
                </label>
                <textarea
                  id="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={(e) => handleChange("additionalRequirements", e.target.value)}
                  placeholder={"VD:\n- Cần có 1 câu hỏi trắc nghiệm liên hệ thực tế.\n- Phần tự luận cần có 1 câu hỏi vận dụng cao."}
                  className="block w-full px-3 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm flex-grow min-h-[160px] sm:min-h-[200px]"
                />
              </div>
            </div>
          </Section>
        )}
      </div>

      {/* Thanh hành động sticky cho mobile */}
      <div className="sticky bottom-0 left-0 right-0 z-10 -mx-4 sm:mx-0 bg-white/90 backdrop-blur border-t border-slate-200/80">
        <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-200"
              >
                Quay lại
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-sm font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
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
    </form>
  );
};

export default ExamForm;
