
import { GoogleGenAI } from "@google/genai";
import type { ExamFormData } from '../types';

// The API key is expected to be set as a Vite environment variable.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey });

const createGeneralPrompt = (data: ExamFormData): string => {
    return `
Bạn là một trợ lý AI chuyên gia cho giáo viên Việt Nam, có chuyên môn sâu về môn ${data.subject}. Nhiệm vụ của bạn là tạo ra một bộ đề kiểm tra hoàn chỉnh, chính xác và khoa học, tuân thủ nghiêm ngặt các hướng dẫn và thông số được cung cấp.

**HƯỚNG DẪN TỐI QUAN TRỌNG (BẮT BUỘC TUÂN THỦ 100%):**

1.  **Ngôn ngữ đầu ra:** Toàn bộ đầu ra, bao gồm tất cả các tiêu đề và nội dung, BẮT BUỘC phải bằng tiếng Việt.
2.  **Cấu trúc 4 phần:** Đầu ra PHẢI tuân thủ nghiêm ngặt cấu trúc 4 phần này. TUYỆT ĐỐI không thay đổi tiêu đề và phải có dấu phân cách '---' giữa các phần.
    - \`PHẦN 1: MA TRẬN ĐỀ KIỂM TRA\`
    - ---
    - \`PHẦN 2: BẢN ĐẶC TẢ CHI TIẾT\`
    - ---
    - \`PHẦN 3: NỘI DUNG ĐỀ KIỂM TRA\`
    - ---
    - \`PHẦN 4: HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN\`
3.  **Định dạng Tiêu đề (QUAN TRỌNG):** Các tiêu đề của 4 phần trên BẮT BUỘC phải là văn bản thuần túy (plain text). TUYỆT ĐỐI KHÔNG sử dụng markdown (ví dụ: không dùng \`**in đậm**\`, \`# heading\`). Viết chính xác các tiêu đề như đã chỉ định.
4.  **QUY TẮC PHÂN TÁCH NỘI DUNG (CỰC KỲ QUAN TRỌNG):** Mỗi phần phải chứa đúng và đủ nội dung được yêu cầu, không được lẫn lộn nội dung giữa các phần.
    - **PHẦN 1 (MA TRẬN):** Chỉ chứa MỘT bảng markdown duy nhất.
    - **PHẦN 2 (BẢN ĐẶC TẢ):** Chỉ chứa MỘT bảng markdown duy nhất.
    - **PHẦN 3 (ĐỀ KIỂM TRA):** Mở đầu phần này BẮT BUỘC phải có khối tiêu đề chuẩn. Khối tiêu đề này phải bao gồm các dòng sau đây, sau đó mới đến nội dung các câu hỏi của đề thi:
      \`\`\`text
      ${data.schoolLevel === 'Cấp 1' ? 'TRƯỜNG TIỂU HỌC' : data.schoolLevel === 'Cấp 2' ? 'TRƯỜNG THCS' : 'TRƯỜNG THPT'} SƠN HẠ SỐ I
      ĐỀ KIỂM TRA
      NĂM HỌC 2025-2026
      MÔN: ${data.subject}
      Thời gian làm bài: ${data.duration} phút (không kể thời gian phát đề)
      \`\`\`
      Sau khối tiêu đề trên, chỉ chứa đề bài hoàn chỉnh cho học sinh. **TUYỆT ĐỐI KHÔNG** bao gồm bất kỳ đáp án, lời giải, hay hướng dẫn chấm nào trong phần này.
    - **PHẦN 4 (ĐÁP ÁN):** **CHỈ** chứa đáp án, lời giải và biểu điểm chấm chi tiết. **TUYỆT ĐỐI KHÔNG** lặp lại đề bài từ Phần 3.
5.  **Phân bổ câu hỏi (QUAN TRỌNG NHẤT):** Bạn BẮT BUỘC phải tuân thủ CHÍNH XÁC SỐ LƯỢNG câu hỏi và ĐIỂM SỐ cho từng dạng bài đã được chỉ định. Toàn bộ 4 phần phải phản ánh đúng cấu trúc này.
6.  **Định dạng Toán học và Khoa học (Ưu tiên Unicode cho ký tự đơn giản):**
    - Áp dụng cho môn Toán, Vật lí, Hóa học, Khoa học tự nhiên.
    - **QUY TẮC ƯU TIÊN:**
        - **Sử dụng ký tự Unicode (ví dụ: ², ³, ₁, ₂) cho các chỉ số trên và chỉ số dưới đơn giản.** Điều này giúp văn bản sạch sẽ và dễ đọc hơn.
        - **Chỉ sử dụng cú pháp LaTeX cho các công thức phức tạp** như phân số, căn bậc hai, tích phân, phương trình phản ứng hoàn chỉnh, và các ký hiệu hình học đặc biệt.
    - **Ví dụ minh họa (BẮT BUỘC TUÂN THỦ):**
        - **Dùng Unicode (Ưu tiên):**
            - Lũy thừa: Viết \`x²\`, \`10⁹\`. **KHÔNG** dùng \`$x^2$\`, \`$10^9$\`.
            - Công thức hóa học: Viết \`H₂O\`, \`C₆H₁₂O₆\`, \`SO₄²⁻\`. **KHÔNG** dùng \`$H_2O$\`, \`$C_6H_{12}O_6$\`, \`$SO_4^{2-}$\`.
        - **Dùng LaTeX (Bắt buộc cho trường hợp phức tạp):**
            - Phân số, tích phân, căn: \`$\\frac{a}{b}$\`, \`$\\int_{0}^{1} x^2 dx$\`, \`$\\sqrt{2}$\`.
            - Hình học: \`$\\Delta ABC$\`, \`$\\angle ABC = 90^\\circ$\`.
            - Phương trình phản ứng hóa học (để đảm bảo định dạng chuẩn): \`$2H_2 + O_2 \\rightarrow 2H_2O$\`.
            - Công thức vật lý phức tạp: \`$F = m \\cdot a$\`.
7.  **Định dạng và Cấu trúc Bảng (BẮT BUỘC):**
    - Tất cả các bảng PHẢI là bảng markdown sạch, nội dung trong ô không chứa ký tự thừa như \`**\` hay \`*\`.
    - **CẤU TRÚC CỘT CỐ ĐỊNH (TUÂN THỦ TUYỆT ĐỐI):** Bạn PHẢI sử dụng chính xác các tiêu đề cột và cấu trúc sau đây cho từng bảng để đảm bảo tính thống nhất.
        - **Bảng MA TRẬN (PHẦN 1):** Phải có 6 cột với các tiêu đề sau:
            - Cột 1: \`Nội dung/Đơn vị kiến thức\`
            - Cột 2: \`Mức độ nhận thức\` (Ghi rõ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)
            - Cột 3: \`Hình thức câu hỏi\` (Ghi rõ: TNKQ, Đúng/Sai, Trả lời ngắn, Tự luận)
            - Cột 4: \`Số câu hỏi\`
            - Cột 5: \`Số điểm\`
            - Cột 6: \`Tỉ lệ % điểm\`
            - **Yêu cầu thêm:** Cuối bảng PHẢI có dòng TỔNG CỘNG. Trong dòng TỔNG CỘNG này, ở cột "Nội dung/Đơn vị kiến thức", hãy ghi tóm tắt thống kê tổng điểm VÀ TỔNG TỈ LỆ % theo từng mức độ nhận thức. Ví dụ: "TỔNG CỘNG (Tổng điểm/Tỉ lệ: NB [X]đ/[A]%; TH [Y]đ/[B]%; VD [Z]đ/[C]%; VDC [W]đ/[D]%)". Các cột còn lại tính tổng cho toàn bảng.
        - **Bảng BẢN ĐẶC TẢ (PHẦN 2):** Phải có 6 cột với các tiêu đề sau:
            - Cột 1: \`Câu số\` (Số thứ tự của câu hỏi trong đề thi)
            - Cột 2: \`Nội dung/Đơn vị kiến thức\`
            - Cột 3: \`Yêu cầu cần đạt\`
            - Cột 4: \`Mức độ nhận thức\` (Ghi rõ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)
            - Cột 5: \`Thời gian dự kiến (phút)\`
            - Cột 6: \`Điểm số\`
        - **Bảng ĐÁP ÁN (PHẦN 4):** Phải là MỘT bảng markdown duy nhất. Bảng này phải có 3 cột với các tiêu đề chính xác sau:
            - Cột 1: \`Câu\`
            - Cột 2: \`Đáp án và Hướng dẫn chấm\`
            - Cột 3: \`Điểm\`
            - **QUY TẮC CHO CỘT "Đáp án và Hướng dẫn chấm" (CỰC KỲ QUAN TRỌNG):**
              - **Đối với câu hỏi trắc nghiệm (TNKQ, Đúng/Sai):** Chỉ cần ghi đáp án đúng (ví dụ: \`A. Paris\`, \`Đúng\`).
              - **Đối với câu hỏi Tự luận và Trả lời ngắn (QUY TẮC VÀNG):** Nội dung trong ô này BẮT BUỘC phải có 2 phần RÕ RỆT:
                1.  **ĐÁP ÁN MẪU:**
                    - Phải trình bày một bài giải/bài văn MẪU HOÀN CHỈNH, CHÍNH XÁC, và ĐẠT ĐIỂM TỐI ĐA. Đây là "đáp án vàng" để giáo viên tham khảo.
                    - **Tiêu chuẩn chất lượng:** Đáp án phải chính xác tuyệt đối về mặt học thuật, lập luận chặt chẽ, trình bày khoa học. Đối với các môn tự nhiên, phải có đủ các bước giải. Đối với các môn xã hội, phải là một đoạn/bài văn hoàn chỉnh, đủ ý, đủ luận cứ.
                    - **TUYỆT ĐỐI KHÔNG** viết các câu trả lời chung chung, vô trách nhiệm (ví dụ: "Học sinh trả lời theo ý hiểu...", "Miễn là hợp lý...").
                2.  **HƯỚNG DẪN CHẤM CHI TIẾT (BIỂU ĐIỂM):**
                    - Ngay sau đáp án mẫu, bạn BẮT BUỘC phải cung cấp một biểu điểm (rubric) để phân rã tổng số điểm của câu hỏi thành các ý/tiêu chí nhỏ hơn.
                    - Biểu điểm này phải rõ ràng, dễ áp dụng, giúp giáo viên chấm bài một cách nhất quán.
                    - **Ví dụ về cấu trúc biểu điểm:**
                      \`\`\`
                      *Hướng dẫn chấm:*
                      - Nêu đúng công thức / định luật: 0.25 điểm.
                      - Thay số và tính toán bước 1 chính xác: 0.25 điểm.
                      - Lập luận logic, dẫn đến kết quả cuối cùng: 0.25 điểm.
                      - Trình bày kết quả đúng, có kèm đơn vị: 0.25 điểm.
                      \`\`\`
                      (Tổng điểm trong biểu điểm phải khớp với tổng điểm của câu hỏi).
              - **Về cột "Điểm":** Ghi TỔNG ĐIỂM của câu hỏi đó. Việc chia nhỏ điểm đã được thực hiện trong biểu điểm ở cột 2.
---

**THÔNG SỐ ĐỀ KIỂM TRA CẦN TẠO:**
- **Cấp học:** ${data.schoolLevel}
- **Lớp:** ${data.grade}
- **Môn học:** ${data.subject}
- **Bộ sách:** ${data.textbook}
- **Thời gian làm bài:** ${data.duration} phút
- **Nội dung kiến thức:**
${data.knowledgeContent}

**CẤU TRÚC ĐỀ (BẮT BUỘC TUÂN THỦ):**
- **Trắc nghiệm khách quan:** ${data.multipleChoice.questionCount} câu, ${data.multipleChoice.score} điểm (${data.multipleChoice.percentage}%)
- **Trắc nghiệm Đúng/Sai:** ${data.trueFalse.questionCount} câu, ${data.trueFalse.score} điểm (${data.trueFalse.percentage}%)
- **Trả lời ngắn:** ${data.shortAnswer.questionCount} câu, ${data.shortAnswer.score} điểm (${data.shortAnswer.percentage}%)
- **Tự luận:** ${data.essay.questionCount} câu, ${data.essay.score} điểm (${data.essay.percentage}%)
- **Tổng điểm:** 10

**YÊU CẦU BỔ SUNG (nếu có):**
${data.additionalRequirements || 'Không có'}

---
Bây giờ, hãy tạo ra bộ đề kiểm tra hoàn chỉnh, tuân thủ nghiêm ngặt mọi yêu cầu trên.
`;
};


const createEnglishPrompt = (data: ExamFormData): string => {
    return `
You are an expert English Language Teaching (ELT) specialist AI. Your task is to create a complete, high-quality English exam package for Vietnamese students based on the user's specifications.

**CRITICAL INSTRUCTIONS:**
1.  **Output Language:** The entire output, including all headers and content, MUST be 100% in English, **WITH ONE EXCEPTION:** The exam header in PART 3 must be in Vietnamese as specified below.
2.  **Strict 4-Part Structure:** The output MUST strictly follow this 4-part structure, using the exact headers provided. Use '---' as a separator between parts.
    - \`PART 1: EXAM MATRIX\`
    - ---
    - \`PART 2: TEST SPECIFICATION GRID\`
    - ---
    - \`PART 3: EXAM PAPER\`
    - ---
    - \`PART 4: ANSWER KEY & GRADING GUIDE\`
3.  **Header Formatting (IMPORTANT):** The 4 part headers above MUST be plain text. DO NOT use markdown (e.g., no \`**bold**\`, no \`# heading\`). Write the headers exactly as specified.
4.  **IGNORE Question Distribution:** The user has NOT provided a specific question distribution for this subject. You MUST create a balanced and pedagogically sound exam structure YOURSELF based on the illustrative model below. Do NOT refer to any question distribution numbers.
5.  **Table Formatting:** For Parts 1, 2, and 4, the output MUST be a single, clean, well-formed markdown table ONLY. Do not add any text before or after the table in these sections.
6.  **Teacher's Priorities:** Pay close attention to and prioritize any specific instructions in the "Additional Requirements" section.

**EXAM SPECIFICATIONS:**
- **Level:** ${data.schoolLevel}
- **Grade:** ${data.grade}
- **Textbook Series:** ${data.textbook}
- **Exam Duration:** ${data.duration} minutes
- **Knowledge Content / Topics:**
${data.knowledgeContent}
- **Additional Requirements:** ${data.additionalRequirements || 'None'}

**ILLUSTRATIVE EXAM STRUCTURE (ADAPT AS NEEDED FOR THE GRADE LEVEL):**
- **Part 3 (Exam Paper) must begin with this mandatory Vietnamese header block:**
  \`\`\`text
  ${data.schoolLevel === 'Cấp 1' ? 'TRƯỜNG TIỂU HỌC' : data.schoolLevel === 'Cấp 2' ? 'TRƯỜNG THCS' : 'TRƯỜNG THPT'} SƠN HẠ SỐ I
  ĐỀ KIỂM TRA
  NĂM HỌC 2025-2026
  MÔN: ${data.subject}
  Thời gian làm bài: ${data.duration} phút (không kể thời gian phát đề)
  \`\`\`
- **After the header, continue with sections like:**
- **PART I. PHONETICS** (e.g., pronunciation, stress)
- **PART II. VOCABULARY AND GRAMMAR** (e.g., MCQs covering word choice, phrasal verbs, collocations, tenses, conditionals, etc.)
- **PART III. COMMUNICATION** (e.g., matching responses, choosing appropriate replies)
- **PART IV. READING** (e.g., Cloze test, Reading comprehension with questions)
- **PART V. WRITING** (e.g., Error identification, Sentence transformation/rewriting, Sentence building)

**DETAILED REQUIREMENTS FOR OUTPUT PARTS:**
- **PART 4: ANSWER KEY & GRADING GUIDE** (Must be a single markdown table)
    - The table must have 3 columns with these exact headers: \`Question\`, \`Answer & Grading Guide\`, \`Points\`.
    - For objective questions (MCQ, matching, filling gaps): The 'Answer & Grading Guide' column should contain only the correct answer (e.g., \`A. beautiful\`, \`was walking\`).
    - For writing tasks (sentence transformation, paragraph writing): The 'Answer & Grading Guide' column MUST contain two parts:
        1.  **Model Answer:** Provide a full, correct model answer.
        2.  **Grading Criteria:** Provide a simple rubric breaking down the points. Example for sentence rewriting:
            - Correct grammatical structure: [X] points.
            - Correct use of target vocabulary/phrase: [Y] points.
            - No spelling/punctuation errors: [Z] points.

---
Please generate the complete exam package now, adhering to all instructions.
`;
};

const createLiteraturePrompt = (data: ExamFormData): string => {
    return `
Bạn là một chuyên gia giàu kinh nghiệm trong việc biên soạn đề thi môn Ngữ văn cho học sinh THCS và THPT tại Việt Nam. Nhiệm vụ của bạn là tạo ra một bộ đề kiểm tra hoàn chỉnh, khoa học, và bám sát chương trình giáo dục.

**HƯỚNG DẪN TỐI THƯỢNG (BẮT BUỘC TUÂN THỦ):**
1.  **Ngôn ngữ:** 100% nội dung và tiêu đề phải là tiếng Việt.
2.  **Cấu trúc 4 phần:** Phải tuân thủ nghiêm ngặt cấu trúc 4 phần với tiêu đề chính xác. Dùng '---' để ngăn cách các phần.
    - \`PHẦN 1: MA TRẬN ĐỀ KIỂM TRA\`
    - ---
    - \`PHẦN 2: BẢN ĐẶC TẢ CHI TIẾT\`
    - ---
    - \`PHẦN 3: NỘI DUNG ĐỀ KIỂM TRA\`
    - ---
    - \`PHẦN 4: HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN\`
3.  **Định dạng Tiêu đề (QUAN TRỌNG):** Các tiêu đề của 4 phần trên BẮT BUỘC phải là văn bản thuần túy (plain text). TUYỆT ĐỐI KHÔNG sử dụng markdown (ví dụ: không dùng \`**in đậm**\`, \`# heading\`). Viết chính xác các tiêu đề như đã chỉ định.
4.  **Bỏ qua phân bổ chung:** Hoàn toàn KHÔNG sử dụng các thông số phân bổ câu hỏi chung. Chỉ tuân theo cấu trúc đặc thù của môn Ngữ văn được mô tả bên dưới.
5.  **Định dạng bảng:**
    - Kết quả của \`PHẦN 1\`, \`PHẦN 2\`, và \`PHẦN 4\` BẮT BUỘC CHỈ LÀ một bảng markdown duy nhất, sạch sẽ.
    - TUYỆT ĐỐI KHÔNG thêm bất kỳ văn bản nào khác ngoài bảng trong các phần này.

**THÔNG SỐ ĐỀ BÀI:**
- **Cấp học:** ${data.schoolLevel}
- **Lớp:** ${data.grade}
- **Bộ sách:** ${data.textbook} (Lưu ý: Ngữ liệu Đọc hiểu phải nằm ngoài bộ sách này)
- **Thời gian làm bài:** ${data.duration} phút
- **Nội dung kiến thức trọng tâm:**
${data.knowledgeContent}
- **Yêu cầu bổ sung từ giáo viên:** ${data.additionalRequirements || 'Không có'}

---

**YÊU CẦU CHI TIẾT VỀ NỘI DUNG CÁC PHẦN:**

**PHẦN 1: MA TRẬN ĐỀ KIỂM TRA** (Chỉ trả về bảng markdown)
- Bảng phải thể hiện rõ sự phân bổ câu hỏi và điểm số theo 2 phần chính (Đọc hiểu, Viết) và 4 mức độ nhận thức (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao).

**PHẦN 2: BẢN ĐẶC TẢ CHI TIẾT** (Chỉ trả về bảng markdown)
- Bảng mô tả chi tiết yêu cầu cần đạt cho từng câu hỏi, gắn với đơn vị kiến thức/kỹ năng cụ thể trong chương trình.

**PHẦN 3: NỘI DUNG ĐỀ KIỂM TRA**
- **Bắt buộc:** Mở đầu phần này phải là khối tiêu đề chuẩn sau, sau đó mới đến nội dung đề thi (I. ĐỌC HIỂU).
  \`\`\`text
  ${data.schoolLevel === 'Cấp 1' ? 'TRƯỜNG TIỂU HỌC' : data.schoolLevel === 'Cấp 2' ? 'TRƯỜNG THCS' : 'TRƯỜNG THPT'} SƠN HẠ SỐ I
  ĐỀ KIỂM TRA
  NĂM HỌC 2025-2026
  MÔN: Ngữ văn
  Thời gian làm bài: ${data.duration} phút (không kể thời gian phát đề)
  \`\`\`
- **I. ĐỌC HIỂU (4,0 điểm):**
  - **Ngữ liệu:** Chọn một đoạn văn bản (văn xuôi hoặc thơ) nằm **ngoài sách giáo khoa**, phù hợp với lứa tuổi, có giá trị nghệ thuật, nội dung trong sáng, và tránh các chủ đề nhạy cảm, gây tranh cãi. Trích dẫn nguồn đầy đủ và chính xác.
  - **Câu hỏi:** Xây dựng 4-5 câu hỏi đọc hiểu bám sát ngữ liệu, đánh giá các mức độ nhận thức.
- **II. VIẾT (6,0 điểm):**
  - **Câu 1 (2,0 điểm):** Viết một đoạn văn nghị luận (khoảng 200 chữ) về một vấn đề rút ra từ phần Đọc hiểu.
  - **Câu 2 (4,0 điểm):** Viết một bài văn nghị luận. Đề bài có thể cho học sinh lựa chọn giữa nghị luận xã hội và nghị luận văn học (dựa trên các tác phẩm trong chương trình).

**PHẦN 4: HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN** (Chỉ trả về MỘT bảng markdown duy nhất)
- Bảng phải có 3 cột với các tiêu đề chính xác sau:
    - Cột 1: \`Câu\`
    - Cột 2: \`Đáp án và Hướng dẫn chấm\`
    - Cột 3: \`Điểm\`
- **Đối với các câu hỏi Đọc hiểu (trắc nghiệm/trả lời ngắn):** Cung cấp đáp án chính xác. Với câu trả lời ngắn, diễn giải câu trả lời đầy đủ.
- **Đối với các câu hỏi phần Viết (cực kỳ quan trọng):** Nội dung trong cột "Đáp án và Hướng dẫn chấm" phải là một **biểu điểm chấm (rubric) cực kỳ chi tiết**.
- Biểu điểm phải phân rã tổng điểm thành các tiêu chí cụ thể và rõ ràng:
  - a. **Đảm bảo yêu cầu về hình thức:** (ví dụ: đúng cấu trúc đoạn văn/bài văn). Ghi rõ mức điểm.
  - b. **Xác định đúng vấn đề nghị luận:** Ghi rõ mức điểm.
  - c. **Triển khai vấn đề nghị luận:** Đây là phần quan trọng nhất.
    - **BẮT BUỘC** phải gợi ý chi tiết các **luận điểm, luận cứ, dẫn chứng cốt lõi** mà học sinh cần trình bày để đạt được các mức điểm khác nhau (ví dụ: đạt mức điểm cơ bản cần có ý A, B; đạt mức điểm tốt cần có thêm ý C, D và phân tích sâu sắc).
    - **KHÔNG** chỉ gạch đầu dòng, hãy diễn giải ngắn gọn nội dung của từng ý.
  - d. **Chính tả, ngữ pháp:** Ghi rõ mức điểm.
  - e. **Sáng tạo:** Ghi rõ mức điểm và gợi ý một số hướng sáng tạo (cách diễn đạt mới mẻ, liên hệ sâu sắc, góc nhìn độc đáo).

---
Bây giờ, hãy tạo ra bộ đề thi môn Ngữ văn hoàn chỉnh, tuân thủ nghiêm ngặt mọi yêu cầu trên.
`;
};


export const generateExam = async (data: ExamFormData): Promise<string> => {
    try {
        let prompt: string;
        let systemInstruction: string;

        if (data.subject === 'Ngoại ngữ 1 (Tiếng Anh)') {
            prompt = createEnglishPrompt(data);
            systemInstruction = "You are an expert English Language Teaching (ELT) specialist AI, creating high-quality exams for Vietnamese students.";
        } else if (data.subject === 'Ngữ văn') {
            prompt = createLiteraturePrompt(data);
            systemInstruction = "You are an expert Vietnamese teacher's assistant AI specializing in creating high-quality Literature exam papers according to the Vietnamese curriculum.";
        } else {
            prompt = createGeneralPrompt(data);
            systemInstruction = "You are an expert Vietnamese teacher's assistant AI specializing in creating high-quality educational materials and exam papers according to the Vietnamese curriculum.";
        }
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.5,
            },
        });
        
        const text = response.text;

        if (!text) {
            throw new Error('API returned an empty response.');
        }

        return text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        if (error instanceof Error) {
            if (error.message.includes('SAFETY')) {
                 throw new Error('Yêu cầu của bạn đã bị chặn vì lý do an toàn. Vui lòng điều chỉnh nội dung và thử lại.');
            }
            throw new Error(`Đã xảy ra lỗi khi tạo đề: ${error.message}`);
        }
        throw new Error('An unknown error occurred while generating the exam.');
    }
};
