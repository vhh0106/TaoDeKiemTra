/**
 * Dịch vụ Trộn đề trắc nghiệm & Tạo nhiều mã đề (Mã đề 101, 102, 103, 104)
 * Kèm Bảng ma trận đối chiếu đáp án chuẩn theo quy chế thi của Bộ GD&ĐT.
 */

export interface MultipleChoiceQuestion {
  originalNumber: number;
  questionText: string;
  options: { label: string; text: string; isCorrect: boolean }[];
}

export interface ShuffledExamCode {
  code: string;
  questions: {
    number: number;
    questionText: string;
    options: { label: string; text: string }[];
    correctLabel: string;
    originalQuestionNumber: number;
  }[];
}

export interface ExamShuffleResult {
  codes: ShuffledExamCode[];
  answerMatrix: {
    questionNumber: number;
    answersByCode: Record<string, string>;
  }[];
  essayContent?: string;
}

// Hàm xáo trộn mảng Fisher-Yates
function shuffleArray<T>(array: T[], seedOffset: number = 0): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    // Sử dụng thuật toán giả ngẫu nhiên có thể dự đoán dựa theo seedOffset
    const j = Math.floor(Math.abs(Math.sin(i + seedOffset * 100)) * (i + 1)) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Trích xuất danh sách câu hỏi trắc nghiệm từ văn bản đề thi và đáp án
 */
export function parseExamQuestions(rawExamText: string, rawAnswerKeyText: string): {
  mcQuestions: MultipleChoiceQuestion[];
  essayPart: string;
} {
  // Chuyển HTML sang văn bản thuần nếu đã qua RichTextEditor
  const stripHtml = (str: string): string => {
    if (!str) return '';
    if (!/<[a-z][\s\S]*>/i.test(str)) return str;
    return str
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/tr>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, '');
  };

  const examText = stripHtml(rawExamText);
  const answerKeyText = stripHtml(rawAnswerKeyText);

  const mcQuestions: MultipleChoiceQuestion[] = [];
  let essayPart = '';

  // Tách phần tự luận nếu có
  const essayMatch = examText.match(/(phần\s*(?:ii|2|b)?[\s\S]*?(?:tự luận|câu hỏi tự luận)[\s\S]*)/i);
  if (essayMatch) {
    essayPart = essayMatch[1].trim();
  }

  // Tìm đáp án từ bảng hoặc danh sách đáp án
  const correctMap = new Map<number, string>();
  const answerLines = answerKeyText.split('\n');
  for (const line of answerLines) {
    // Khớp mẫu "1. A" hoặc "Câu 1: A" hoặc "| 1 | A |"
    const match = line.match(/(?:câu\s*)?(\d+)[:.\s|]+([A-D])/i);
    if (match) {
      const qNum = parseInt(match[1], 10);
      const ans = match[2].toUpperCase();
      if (!correctMap.has(qNum)) {
        correctMap.set(qNum, ans);
      }
    }
  }

  // Tách từng câu hỏi trong đề thi
  const rawQuestions = examText.split(/(?=(?:câu\s*\d+[:.]))/gi);

  let qIndex = 1;
  for (const raw of rawQuestions) {
    const headerMatch = raw.match(/câu\s*(\d+)[:.]\s*([\s\S]*)/i);
    if (!headerMatch) continue;

    const currentNum = parseInt(headerMatch[1], 10);
    const body = headerMatch[2];

    // Kiểm tra xem có chứa các phương án A, B, C, D không
    const optAMatch = body.match(/A[\.\)]\s*([\s\S]*?)(?=B[\.\)]|$)/i);
    const optBMatch = body.match(/B[\.\)]\s*([\s\S]*?)(?=C[\.\)]|$)/i);
    const optCMatch = body.match(/C[\.\)]\s*([\s\S]*?)(?=D[\.\)]|$)/i);
    const optDMatch = body.match(/D[\.\)]\s*([\s\S]*?)(?=(?:câu\s*\d+|$))/i);

    if (optAMatch && optBMatch) {
      // Đây là câu trắc nghiệm
      const statement = body.split(/[A-D][\.\)]/)[0].trim();
      const correctAns = correctMap.get(currentNum) || 'A';

      const options = [
        { label: 'A', text: optAMatch[1].trim(), isCorrect: correctAns === 'A' },
        { label: 'B', text: optBMatch[1].trim(), isCorrect: correctAns === 'B' },
        { label: 'C', text: optCMatch ? optCMatch[1].trim() : '', isCorrect: correctAns === 'C' },
        { label: 'D', text: optDMatch ? optDMatch[1].trim() : '', isCorrect: correctAns === 'D' },
      ].filter((opt) => opt.text.length > 0);

      mcQuestions.push({
        originalNumber: currentNum || qIndex,
        questionText: statement,
        options,
      });
      qIndex++;
    }
  }

  return { mcQuestions, essayPart };
}

/**
 * Trộn đề ra 4 mã đề: 101, 102, 103, 104
 */
export function shuffleExam(examText: string, answerKeyText: string): ExamShuffleResult {
  const { mcQuestions, essayPart } = parseExamQuestions(examText, answerKeyText);
  const codeLabels = ['101', '102', '103', '104'];
  const codes: ShuffledExamCode[] = [];

  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  codeLabels.forEach((codeStr, seedIndex) => {
    // Mã 101 giữ nguyên thứ tự câu hỏi để làm đề gốc, chỉ xáo trộn nhẹ các mã sau
    const questionList = seedIndex === 0 ? [...mcQuestions] : shuffleArray(mcQuestions, seedIndex + 1);

    const shuffledQuestions = questionList.map((q, idx) => {
      // Xáo trộn phương án lựa chọn A, B, C, D (Mã 101 giữ nguyên)
      const shuffledOptions = seedIndex === 0 ? [...q.options] : shuffleArray(q.options, seedIndex * 10 + idx);

      let correctLabel = 'A';
      const formattedOptions = shuffledOptions.map((opt, optIdx) => {
        const newLetter = OPTION_LETTERS[optIdx];
        if (opt.isCorrect) {
          correctLabel = newLetter;
        }
        return {
          label: newLetter,
          text: opt.text,
        };
      });

      return {
        number: idx + 1,
        questionText: q.questionText,
        options: formattedOptions,
        correctLabel,
        originalQuestionNumber: q.originalNumber,
      };
    });

    codes.push({
      code: codeStr,
      questions: shuffledQuestions,
    });
  });

  // Xây dựng Bảng ma trận đối chiếu đáp án 4 mã đề
  const maxQ = codes[0]?.questions.length || 0;
  const answerMatrix = [];

  for (let i = 0; i < maxQ; i++) {
    const answersByCode: Record<string, string> = {};
    codes.forEach((c) => {
      const q = c.questions[i];
      answersByCode[c.code] = q ? q.correctLabel : '-';
    });

    answerMatrix.push({
      questionNumber: i + 1,
      answersByCode,
    });
  }

  return {
    codes,
    answerMatrix,
    essayContent: essayPart,
  };
}

/**
 * Xuất dữ liệu trộn đề ra tài liệu HTML chuẩn để tải về file Word .docx
 */
export function generateShuffledWordDoc(
  shuffleResult: ExamShuffleResult,
  schoolName: string = 'TRƯỜNG THPT NGUYỄN DU',
  subject: string = 'Môn học'
): string {
  let html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <title>Bộ 4 Mã Đề Kiểm Tra & Ma Trận Đáp Án</title>
      <style>
        body { font-family: "Times New Roman", Times, serif; font-size: 13pt; line-height: 1.4; color: #000; padding: 20px; }
        .page-break { page-break-after: always; }
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .header-table td { vertical-align: top; font-size: 12pt; border: none; }
        .exam-title { text-align: center; font-size: 14pt; font-weight: bold; margin: 15px 0 5px 0; }
        .exam-meta { text-align: center; font-size: 11pt; font-style: italic; margin-bottom: 20px; }
        .question { margin-bottom: 12px; }
        .question-title { font-weight: bold; }
        .options { margin-left: 20px; margin-top: 4px; display: grid; grid-template-columns: 1fr 1fr; }
        .matrix-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11pt; }
        .matrix-table th, .matrix-table td { border: 1px solid #000; padding: 6px 8px; text-align: center; }
        .matrix-table th { background-color: #f2f2f2; font-weight: bold; }
      </style>
    </head>
    <body>
  `;

  // 1. In từng mã đề
  shuffleResult.codes.forEach((c, idx) => {
    html += `
      <div class="exam-page ${idx < shuffleResult.codes.length ? 'page-break' : ''}">
        <table class="header-table">
          <tr>
            <td style="width: 50%; text-align: center;">
              <strong>SỞ GD&ĐT ...</strong><br>
              <strong>${schoolName.toUpperCase()}</strong><br>
              <span style="font-size: 11pt;">(Đề thi gồm có 02 trang)</span>
            </td>
            <td style="width: 50%; text-align: center;">
              <strong>ĐỀ KIỂM TRA ĐỊNH KÌ</strong><br>
              <strong>MÔN: ${subject.toUpperCase()}</strong><br>
              <div style="border: 2px solid #000; display: inline-block; padding: 2px 10px; font-weight: bold; margin-top: 4px;">
                MÃ ĐỀ: ${c.code}
              </div>
            </td>
          </tr>
        </table>

        <div style="margin-bottom: 15px; font-size: 11pt; border-bottom: 1px dashed #999; padding-bottom: 8px;">
          Họ và tên thí sinh: .......................................................................... Lớp: ............. SBD: ............
        </div>

        <div style="font-weight: bold; text-decoration: underline; margin-bottom: 10px;">
          I. PHẦN TRẮC NGHIỆM (${c.questions.length} câu)
        </div>
    `;

    c.questions.forEach((q) => {
      html += `
        <div class="question">
          <span class="question-title">Câu ${q.number}:</span> ${q.questionText}
          <div class="options">
            ${q.options.map((opt) => `<div><strong>${opt.label}.</strong> ${opt.text}</div>`).join('')}
          </div>
        </div>
      `;
    });

    if (shuffleResult.essayContent) {
      html += `
        <div style="font-weight: bold; text-decoration: underline; margin-top: 20px; margin-bottom: 10px;">
          II. PHẦN TỰ LUẬN
        </div>
        <div>${shuffleResult.essayContent.replace(/\n/g, '<br>')}</div>
      `;
    }

    html += `
        <div style="text-align: center; margin-top: 30px; font-style: italic; font-weight: bold;">
          ---------- HẾT ----------
        </div>
      </div>
    `;
  });

  // 2. In Bảng Ma Trận Đáp Án Đối Chiếu
  html += `
    <div class="matrix-page">
      <div class="exam-title" style="margin-top: 0;">BẢNG ĐỐI CHIẾU ĐÁP ÁN CÁC MÃ ĐỀ THI</div>
      <div class="exam-meta">Môn: ${subject} - Căn cứ đáp án chuẩn từ ma trận gốc</div>

      <table class="matrix-table">
        <thead>
          <tr>
            <th>Câu hỏi</th>
            ${shuffleResult.codes.map((c) => `<th>Mã đề ${c.code}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${shuffleResult.answerMatrix
            .map(
              (row) => `
            <tr>
              <td><strong>Câu ${row.questionNumber}</strong></td>
              ${shuffleResult.codes.map((c) => `<td style="font-weight: bold; color: #1a56db;">${row.answersByCode[c.code]}</td>`).join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  html += `</body></html>`;
  return html;
}
