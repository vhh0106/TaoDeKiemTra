/**
 * Dịch vụ Sinh Nhiều Mã Đề (Mục 17: Mã đề 101, 102, 103, 104)
 * Giữ nguyên kiến thức, độ khó, tổng điểm; đảo thứ tự câu hỏi và phương án A/B/C/D chính xác.
 */

import type { QuestionItem, TestCodeVariant, ExamFormData } from '../types';

export function generateExamVariants(
  questions: QuestionItem[],
  count: number,
  formData: ExamFormData
): TestCodeVariant[] {
  const codes = ['101', '102', '103', '104'].slice(0, Math.max(1, Math.min(count, 4)));

  return codes.map((code, codeIdx) => {
    // Mã đề 101 giữ nguyên thứ tự gốc, các mã sau đảo trật tự
    let variantQuestions: QuestionItem[] = questions.map((q) => ({ ...q }));

    if (codeIdx > 0) {
      variantQuestions = shuffleQuestions(variantQuestions, codeIdx * 7919);
    }

    // Đánh lại số thứ tự id: Câu 1, Câu 2...
    variantQuestions = variantQuestions.map((q, idx) => ({
      ...q,
      id: `Câu ${idx + 1}`,
    }));

    const examText = formatVariantExamText(variantQuestions, code, formData);
    const answerKeyText = formatVariantAnswerKeyText(variantQuestions, code);

    return {
      code,
      questions: variantQuestions,
      examText,
      answerKeyText,
    };
  });
}

/**
 * Xáo trộn câu hỏi và phương án A, B, C, D mà vẫn bảo toàn đáp án đúng 100%
 */
function shuffleQuestions(list: QuestionItem[], seed: number): QuestionItem[] {
  const pseudoRand = (s: number) => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };

  // Tách theo phần: Trắc nghiệm giữ theo cụm, Tự luận giữ sau
  const objectives = list.filter((q) => q.questionType.startsWith('mcq') || q.questionType === 'true_false' || q.questionType === 'short_answer');
  const essays = list.filter((q) => !q.questionType.startsWith('mcq') && q.questionType !== 'true_false' && q.questionType !== 'short_answer');

  // Xáo trộn mảng câu hỏi trắc nghiệm
  const shuffledObj = [...objectives];
  for (let i = shuffledObj.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRand(seed + i) * (i + 1));
    [shuffledObj[i], shuffledObj[j]] = [shuffledObj[j], shuffledObj[i]];
  }

  // Đảo phương án A, B, C, D cho các câu trắc nghiệm 4 lựa chọn
  const permutedObj = shuffledObj.map((q, qIndex) => {
    if (q.questionType === 'mcq_4' && q.options && q.options.length === 4 && !q.isLocked) {
      return shuffleMcqOptions(q, seed + qIndex * 17);
    }
    return q;
  });

  return [...permutedObj, ...essays];
}

function shuffleMcqOptions(q: QuestionItem, seed: number): QuestionItem {
  const pseudoRand = (s: number) => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];
  // Bóc tách nội dung thuần túy của từng phương án
  const rawContents = (q.options || []).map((opt) => opt.replace(/^[A-D]\.\s*/, '').trim());

  // Tìm index của đáp án đúng cũ
  const originalLetter = (q.correctAnswer || 'A').trim().toUpperCase().charAt(0);
  const correctIdx = Math.max(0, optionLetters.indexOf(originalLetter));
  const correctRawContent = rawContents[correctIdx];

  // Xáo trộn vị trí của 4 nội dung
  const shuffledRaw = [...rawContents];
  for (let i = shuffledRaw.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRand(seed + i) * (i + 1));
    [shuffledRaw[i], shuffledRaw[j]] = [shuffledRaw[j], shuffledRaw[i]];
  }

  // Gắn lại nhãn A, B, C, D
  const newOptions = shuffledRaw.map((content, idx) => `${optionLetters[idx]}. ${content}`);

  // Tìm lại chữ cái đáp án đúng mới
  const newCorrectIdx = shuffledRaw.indexOf(correctRawContent);
  const newCorrectLetter = optionLetters[newCorrectIdx] || 'A';

  return {
    ...q,
    options: newOptions,
    correctAnswer: newCorrectLetter,
  };
}

function formatVariantExamText(questions: QuestionItem[], code: string, formData: ExamFormData): string {
  const schoolName = formData.schoolName || 'TRƯỜNG TIỂU HỌC / THCS / THPT';
  const subjectName = (formData.customSubject || formData.subject).toUpperCase();
  const titleName = (formData.examTitle || 'ĐỀ KIỂM TRA ĐỊNH KỲ').toUpperCase();

  let text = `================================================================================
${schoolName.padEnd(45)} ${titleName}
MÔN: ${subjectName} - ${formData.grade.toUpperCase()}
MÃ ĐỀ: ${code}                                       Thời gian làm bài: ${formData.duration} phút
Họ và tên học sinh: .................................................... Lớp: ............. SBD: .......
================================================================================\n\n`;

  const objectives = questions.filter((q) => q.questionType.startsWith('mcq') || q.questionType === 'true_false' || q.questionType === 'short_answer');
  const essays = questions.filter((q) => !objectives.includes(q));

  if (objectives.length > 0) {
    text += `### PHẦN I. TRẮC NGHIỆM KHÁCH QUAN (${objectives.reduce((a, b) => a + (b.score || 0), 0)} điểm)\n\n`;
    objectives.forEach((q, idx) => {
      text += `**${q.id || `Câu ${idx + 1}`}** (${q.score}đ - ${q.level}): ${q.question}\n`;
      if (q.options && q.options.length > 0) {
        q.options.forEach((opt) => {
          text += `   ${opt}\n`;
        });
      }
      text += '\n';
    });
  }

  if (essays.length > 0) {
    text += `### PHẦN II. TỰ LUẬN (${essays.reduce((a, b) => a + (b.score || 0), 0)} điểm)\n\n`;
    essays.forEach((q, idx) => {
      text += `**${q.id || `Câu ${objectives.length + idx + 1}`}** (${q.score}đ - ${q.level}): ${q.question}\n\n`;
    });
  }

  text += `----------------------------------- HẾT -----------------------------------\n`;
  text += `*(Cán bộ coi thi không giải thích gì thêm)*\n`;

  return text;
}

function formatVariantAnswerKeyText(questions: QuestionItem[], code: string): string {
  let text = `### BẢNG ĐÁP ÁN VÀ THANG ĐIỂM - MÃ ĐỀ ${code}\n\n`;

  // Bảng tra cứu đáp án trắc nghiệm nhanh
  const objectives = questions.filter((q) => q.questionType.startsWith('mcq') || q.questionType === 'true_false' || q.questionType === 'short_answer');
  if (objectives.length > 0) {
    text += `#### 1. ĐÁP ÁN TRẮC NGHIỆM NHANH\n\n`;
    text += `| Câu | Đáp án đúng | Điểm số | Mức độ |\n`;
    text += `| :---: | :---: | :---: | :---: |\n`;
    objectives.forEach((q, idx) => {
      text += `| ${q.id || idx + 1} | **${q.correctAnswer}** | ${q.score}đ | ${q.level} |\n`;
    });
    text += `\n`;
  }

  // Hướng dẫn giải chi tiết
  text += `#### 2. LỜI GIẢI CHI TIẾT VÀ BIỂU ĐIỂM CHẤM\n\n`;
  questions.forEach((q, idx) => {
    text += `**${q.id || `Câu ${idx + 1}`}**: Đáp án: **${q.correctAnswer}** (${q.score}đ)\n`;
    if (q.explanation) {
      text += `*Hướng dẫn giải / Tiêu chí:* ${q.explanation}\n`;
    }
    text += `\n`;
  });

  return text;
}
