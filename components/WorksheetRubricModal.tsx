import React, { useState } from 'react';
import type { LessonPlanFormData } from '../types';
import { isEnglishSubject } from '../constants';

interface WorksheetRubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: LessonPlanFormData;
}

const WorksheetRubricModal: React.FC<WorksheetRubricModalProps> = ({
  isOpen,
  onClose,
  formData,
}) => {
  const [activeTab, setActiveTab] = useState<'worksheet' | 'rubric'>('worksheet');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isEnglish = isEnglishSubject(formData.subject);

  const handleDownloadWord = () => {
    const content = activeTab === 'worksheet' ? getWorksheetHtml() : getRubricHtml();
    const blob = new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const prefix = isEnglish
      ? (activeTab === 'worksheet' ? 'Student_Worksheet' : 'Evaluation_Rubric')
      : (activeTab === 'worksheet' ? 'Phieu_Hoc_Tap' : 'Bang_Rubric_Danh_Gia');
    a.download = `${prefix}_${formData.lessonName.slice(0, 30)}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const text = activeTab === 'worksheet' ? getWorksheetText() : getRubricText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getWorksheetText = () => {
    if (isEnglish) {
      return `
STUDENT WORKSHEET - ${formData.lessonName.toUpperCase()}
Subject: English - Grade: ${formData.classesTaught || formData.grade}
Student's Name / Group: ..........................................................................

TASK 1: VOCABULARY & LANGUAGE FOCUS
Content: ${formData.knowledgeContent || 'Complete vocabulary and sentence pattern exercises as instructed by teacher.'}
Answers:
............................................................................................................................................

TASK 2: PRACTICE & PAIR WORK
Look, point and say / Read and complete:
............................................................................................................................................

TASK 3: PRODUCTION & COMMUNICATION (Let's talk)
Ask and answer with your partner using real information:
............................................................................................................................................
TEACHER'S FEEDBACK: .................................................................................................
`;
    }
    return `
PHIẾU HỌC TẬP - ${formData.lessonName.toUpperCase()}
Môn: ${formData.subject} - Lớp: ${formData.classesTaught || formData.grade}
Họ và tên học sinh / Nhóm: ..........................................................................

NHIỆM VỤ 1: KHÁM PHÁ KIẾN THỨC
Nội dung: ${formData.knowledgeContent || 'Thực hiện nhiệm vụ theo hướng dẫn của giáo viên trong SGK.'}
Trả lời:
............................................................................................................................................

NHIỆM VỤ 2: THỰC HÀNH & BÀI TẬP
Thực hiện các bài tập và hoàn thành bảng dưới đây.
............................................................................................................................................

NHIỆM VỤ 3: VẬN DỤNG & SÁNG TẠO
Liên hệ thực tế đời sống hàng ngày:
............................................................................................................................................
ĐÁNH GIÁ CỦA GIÁO VIÊN: .................................................................................................
`;
  };

  const getRubricText = () => {
    if (isEnglish) {
      return `
STUDENT COMPETENCE ASSESSMENT RUBRIC
Lesson: ${formData.lessonName}
Subject: English - Grade: ${formData.grade}

Criterion 1: Language Knowledge (Vocabulary & Structures)
- Level 4 (Excellent): Master target vocabulary and sentence patterns with accurate pronunciation and natural intonation.
- Level 3 (Good): Correctly pronounce target words and use sentence patterns accurately.
- Level 2 (Satisfactory): Understand key words; occasional hesitation or pronunciation errors.
- Level 1 (Needs Improvement): Needs teacher and peer assistance to recall words and basic patterns.

Criterion 2: Communication & Collaboration
- Level 4: Actively participates in pair and group work; initiates conversations and supports peers.
- Level 3: Cooperates well in pair/group tasks; completes assigned speaking activities.
- Level 2: Participates passively; requires encouragement.
- Level 1: Hesitant to communicate in English.

Criterion 3: Digital & Learning Competence
- Level 4: Confidently uses digital learning aids (hoclieu.vn, interactive games) and demonstrates autonomous learning.
- Level 3: Effectively follows teacher's guidance with audio/visual digital materials.
- Level 2: Needs guidance when engaging with interactive media.
- Level 1: Rarely interacts with learning media.
`;
    }
    return `
BẢNG TIÊU CHÍ ĐÁNH GIÁ NĂNG LỰC HỌC SINH (RUBRIC)
Bài học: ${formData.lessonName}
Môn: ${formData.subject} - Lớp: ${formData.grade}

Tiêu chí 1: Nắm bắt kiến thức trọng tâm
- Mức 4 (Xuất sắc): Nắm vững toàn bộ kiến thức, giải thích rõ ràng và lấy được ví dụ thực tế.
- Mức 3 (Tốt): Nắm vững kiến thức bài học, làm đúng bài tập cơ bản.
- Mức 2 (Đạt): Hiểu nội dung chính, còn lúng túng khi làm bài tập nâng cao.
- Mức 1 (Cần cố gắng): Chưa nắm vững nội dung, cần sự hỗ trợ của giáo viên và bạn bè.

Tiêu chí 2: Kỹ năng hợp tác nhóm & giao tiếp
- Mức 4: Tích cực đóng góp ý kiến, lắng nghe và hỗ trợ các thành viên trong nhóm.
- Mức 3: Tham gia thảo luận nhóm, hoàn thành nhiệm vụ được phân công.
- Mức 2: Còn thụ động trong làm việc nhóm.
- Mức 1: Chưa tích cực tham gia thảo luận.

Tiêu chí 3: Ứng dụng công nghệ & Năng lực số (TT 02/2025)
- Mức 4: Sử dụng thành thạo thiết bị/phần mềm học tập, đảm bảo an toàn số.
- Mức 3: Sử dụng được công cụ công nghệ theo hướng dẫn của giáo viên.
- Mức 2: Cần giáo viên hướng dẫn thêm thao tác.
- Mức 1: Chưa thao tác được trên thiết bị.
`;
  };

  const getWorksheetHtml = () => {
    if (isEnglish) {
      return `
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{font-family:"Times New Roman",serif;font-size:13pt;line-height:1.5;padding:20px;}</style></head><body>
    <div style="text-align:center;font-weight:bold;font-size:15pt;margin-bottom:6px;">STUDENT WORKSHEET</div>
    <div style="text-align:center;font-weight:bold;font-size:13pt;margin-bottom:12px;">${formData.lessonName.toUpperCase()}</div>
    <div style="font-style:italic;margin-bottom:18px;">Subject: English - Grade: ${formData.classesTaught || formData.grade} | Week: ${formData.week || '...'}</div>
    <div style="margin-bottom:15px;border-bottom:1px dashed #000;padding-bottom:10px;">Student's Name / Group: ..........................................................................</div>
    <div style="font-weight:bold;margin-top:15px;">TASK 1: VOCABULARY &amp; TARGET STRUCTURES</div>
    <p>${formData.knowledgeContent || 'Complete vocabulary and sentence pattern exercises as instructed by teacher.'}</p>
    <div style="min-height:80px;border:1px solid #ccc;padding:10px;margin-bottom:15px;">Answers:...</div>
    <div style="font-weight:bold;margin-top:15px;">TASK 2: PRACTICE &amp; PAIR WORK (Look, point and say)</div>
    <div style="min-height:80px;border:1px solid #ccc;padding:10px;margin-bottom:15px;">Dialogue &amp; Notes:...</div>
    <div style="font-weight:bold;margin-top:15px;">TASK 3: PRODUCTION &amp; COMMUNICATION (Let's talk)</div>
    <div style="min-height:80px;border:1px solid #ccc;padding:10px;margin-bottom:15px;">Speaking responses:...</div>
    </body></html>
      `;
    }
    return `
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{font-family:"Times New Roman",serif;font-size:13pt;line-height:1.5;padding:20px;}</style></head><body>
    <div style="text-align:center;font-weight:bold;font-size:15pt;margin-bottom:10px;">PHIẾU HỌC TẬP</div>
    <div style="text-align:center;font-weight:bold;font-size:13pt;margin-bottom:15px;">${formData.lessonName.toUpperCase()}</div>
    <div style="font-style:italic;margin-bottom:20px;">Môn: ${formData.subject} - Lớp: ${formData.classesTaught || formData.grade} | Tuần: ${formData.week || '...'}</div>
    <div style="margin-bottom:15px;border-bottom:1px dashed #000;padding-bottom:10px;">Họ và tên học sinh / Nhóm: ..........................................................................</div>
    <div style="font-weight:bold;margin-top:15px;">NHIỆM VỤ 1: KHÁM PHÁ KIẾN THỨC</div>
    <p>${formData.knowledgeContent || 'Đọc thông tin SGK và hoàn thành yêu cầu.'}</p>
    <div style="min-height:80px;border:1px solid #ccc;padding:10px;margin-bottom:15px;">Trả lời:...</div>
    <div style="font-weight:bold;margin-top:15px;">NHIỆM VỤ 2: THỰC HÀNH & BÀI TẬP</div>
    <div style="min-height:80px;border:1px solid #ccc;padding:10px;margin-bottom:15px;">Lời giải:...</div>
    <div style="font-weight:bold;margin-top:15px;">NHIỆM VỤ 3: VẬN DỤNG & LIÊN HỆ THỰC TẾ</div>
    <div style="min-height:80px;border:1px solid #ccc;padding:10px;margin-bottom:15px;">Trả lời:...</div>
    </body></html>
    `;
  };

  const getRubricHtml = () => {
    if (isEnglish) {
      return `
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{font-family:"Times New Roman",serif;font-size:12pt;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #000;padding:8px;vertical-align:top;}</style></head><body>
    <div style="text-align:center;font-weight:bold;font-size:14pt;margin-bottom:5px;">COMPETENCE ASSESSMENT RUBRIC</div>
    <div style="text-align:center;font-style:italic;margin-bottom:15px;">Lesson: ${formData.lessonName} - English ${formData.grade}</div>
    <table>
      <thead><tr style="background:#eee;"><th>Assessment Criteria</th><th>Level 1 (Needs Improvement)</th><th>Level 2 (Satisfactory)</th><th>Level 3 (Good)</th><th>Level 4 (Excellent)</th></tr></thead>
      <tbody>
        <tr><td><strong>1. Language Knowledge</strong></td><td>Struggles with words/patterns</td><td>Understands key words; hesitant</td><td>Accurate vocabulary &amp; grammar</td><td>Fluent, accurate pronunciation &amp; intonation</td></tr>
        <tr><td><strong>2. Pair &amp; Group Work</strong></td><td>Hesitant to speak English</td><td>Participates when prompted</td><td>Cooperates well in pair tasks</td><td>Active leader, helps partners speak fluently</td></tr>
        <tr><td><strong>3. Digital &amp; Self-learning</strong></td><td>Needs frequent assistance</td><td>Follows basic digital instructions</td><td>Comfortable with audio/visual tools</td><td>Autonomous, explores learning aids creatively</td></tr>
      </tbody>
    </table></body></html>
      `;
    }
    return `
    <!DOCTYPE html><html><head><meta charset="utf-8">
    <style>body{font-family:"Times New Roman",serif;font-size:12pt;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #000;padding:8px;vertical-align:top;}</style></head><body>
    <div style="text-align:center;font-weight:bold;font-size:14pt;margin-bottom:5px;">BẢNG TIÊU CHÍ ĐÁNH GIÁ NĂNG LỰC (RUBRIC)</div>
    <div style="text-align:center;font-style:italic;margin-bottom:15px;">Bài học: ${formData.lessonName}</div>
    <table>
      <thead><tr style="background:#eee;"><th>Tiêu chí đánh giá</th><th>Mức 1 (Cần cố gắng)</th><th>Mức 2 (Đạt)</th><th>Mức 3 (Tốt)</th><th>Mức 4 (Xuất sắc)</th></tr></thead>
      <tbody>
        <tr><td><strong>1. Nắm bắt kiến thức</strong></td><td>Chưa nắm nội dung cơ bản</td><td>Hiểu nội dung chính</td><td>Nắm vững kiến thức bài học</td><td>Nắm chắc, giải thích sâu sắc</td></tr>
        <tr><td><strong>2. Hợp tác nhóm</strong></td><td>Chưa tích cực tham gia</td><td>Tham gia khi được yêu cầu</td><td>Tích cực chia sẻ ý kiến</td><td>Chủ động dẫn dắt, hỗ trợ bạn</td></tr>
        <tr><td><strong>3. Năng lực số (TT 02/2025)</strong></td><td>Cần hỗ trợ nhiều khi dùng thiết bị</td><td>Thực hiện được thao tác cơ bản</td><td>Sử dụng thành thạo công cụ số</td><td>Sáng tạo, đảm bảo an toàn số</td></tr>
      </tbody>
    </table></body></html>
    `;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3.5 sm:p-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-lg sm:text-xl shrink-0">
              📝
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-xl font-black truncate">
                Phiếu Học Tập & Bảng Tiêu Chí Đánh Giá (Rubric)
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-100 mt-0.5 truncate">
                Thiết kế đồng bộ theo tiến trình bài dạy và Khung năng lực số TT 02/2025
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-2.5 sm:p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
            <button
              onClick={() => setActiveTab('worksheet')}
              className={`px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'worksheet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              📄 Phiếu học tập
            </button>
            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl transition whitespace-nowrap shrink-0 ${
                activeTab === 'rubric'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              📊 Tiêu chí Rubric
            </button>
          </div>

          <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
            {copied && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                ✓ Đã sao chép!
              </span>
            )}
            <button
              onClick={handleCopy}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
            >
              📋 <span className="hidden sm:inline">Sao chép</span>
            </button>
            <button
              onClick={handleDownloadWord}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition active:scale-95 whitespace-nowrap"
            >
              <span>📥</span>
              <span className="hidden sm:inline">Tải file Word (.docx)</span>
              <span className="sm:hidden">Tải Word</span>
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-grow font-sans text-slate-800 dark:text-slate-200 text-sm">
          {activeTab === 'worksheet' ? (
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-850 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-750 shadow-sm space-y-4">
              <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-black text-base sm:text-lg text-emerald-900 dark:text-emerald-400">PHIẾU HỌC TẬP</h3>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-1">{formData.lessonName.toUpperCase()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                  Môn: {formData.subject} - Lớp: {formData.classesTaught || formData.grade}
                </p>
              </div>

              <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                Họ và tên học sinh / Nhóm: ................................................................................
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30">
                  <p className="font-bold text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm">
                    NHIỆM VỤ 1: Khám phá kiến thức
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {formData.knowledgeContent || 'Đọc kỹ nội dung bài học trong SGK và trả lời câu hỏi trọng tâm.'}
                  </p>
                  <div className="mt-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-emerald-100 dark:border-emerald-900/60 min-h-14 text-slate-400 dark:text-slate-500 text-xs italic">
                    Ghi câu trả lời của nhóm vào đây...
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30">
                  <p className="font-bold text-blue-900 dark:text-blue-300 text-xs sm:text-sm">
                    NHIỆM VỤ 2: Thực hành & Giải bài tập
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Hoàn thành các bài tập thực hành được giao.
                  </p>
                  <div className="mt-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-blue-100 dark:border-blue-900/60 min-h-14 text-slate-400 dark:text-slate-500 text-xs italic">
                    Ghi lời giải và các bước thực hiện...
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30">
                  <p className="font-bold text-purple-900 dark:text-purple-300 text-xs sm:text-sm">
                    NHIỆM VỤ 3: Vận dụng & Liên hệ thực tế
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Ứng dụng kiến thức vào thực tế đời sống hàng ngày hoặc sáng tạo sản phẩm.
                  </p>
                  <div className="mt-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-900/60 min-h-14 text-slate-400 dark:text-slate-500 text-xs italic">
                    Ý tưởng và câu trả lời liên hệ...
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="p-2.5 sm:p-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs sm:text-sm text-indigo-900 dark:text-indigo-300 font-semibold flex items-center justify-between">
                <span>📌 Khung tiêu chí đánh giá năng lực học sinh (4 mức độ)</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 -mx-1 sm:mx-0">
                <table className="min-w-[550px] w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <th className="p-3 font-bold w-1/4">Tiêu chí</th>
                      <th className="p-3 font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50">Mức 1 (Cần cố gắng)</th>
                      <th className="p-3 font-bold text-blue-900 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50">Mức 2 (Đạt)</th>
                      <th className="p-3 font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50">Mức 3 (Tốt)</th>
                      <th className="p-3 font-bold text-purple-900 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50">Mức 4 (Xuất sắc)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">1. Kiến thức bài học</td>
                      <td className="p-3 text-xs bg-amber-50/30 dark:bg-amber-950/20 text-slate-700 dark:text-slate-300">Chưa nắm chắc nội dung chính</td>
                      <td className="p-3 text-xs bg-blue-50/30 dark:bg-blue-950/20 text-slate-700 dark:text-slate-300">Hiểu nội dung cơ bản</td>
                      <td className="p-3 text-xs bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-700 dark:text-slate-300">Nắm vững và làm đúng bài tập</td>
                      <td className="p-3 text-xs bg-purple-50/30 dark:bg-purple-950/20 text-slate-700 dark:text-slate-300">Nắm chắc, liên hệ thực tế tốt</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">2. Hợp tác nhóm</td>
                      <td className="p-3 text-xs bg-amber-50/30 dark:bg-amber-950/20 text-slate-700 dark:text-slate-300">Chưa chủ động tham gia</td>
                      <td className="p-3 text-xs bg-blue-50/30 dark:bg-blue-950/20 text-slate-700 dark:text-slate-300">Làm việc khi được yêu cầu</td>
                      <td className="p-3 text-xs bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-700 dark:text-slate-300">Tích cực thảo luận, chia sẻ</td>
                      <td className="p-3 text-xs bg-purple-50/30 dark:bg-purple-950/20 text-slate-700 dark:text-slate-300">Dẫn dắt, hỗ trợ các bạn</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">3. Năng lực số (TT 02)</td>
                      <td className="p-3 text-xs bg-amber-50/30 dark:bg-amber-950/20 text-slate-700 dark:text-slate-300">Cần GV hướng dẫn từng bước</td>
                      <td className="p-3 text-xs bg-blue-50/30 dark:bg-blue-950/20 text-slate-700 dark:text-slate-300">Thao tác được phần mềm cơ bản</td>
                      <td className="p-3 text-xs bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-700 dark:text-slate-300">Sử dụng thành thạo công cụ số</td>
                      <td className="p-3 text-xs bg-purple-50/30 dark:bg-purple-950/20 text-slate-700 dark:text-slate-300">Sáng tạo nội dung số an toàn</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorksheetRubricModal;
