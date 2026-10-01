import type { ExamFormData, LessonPlanFormData } from '../types';

/* ==========================================================================
   PROMPT DÀNH CHO TIỂU HỌC: THEO THÔNG TƯ 27/2020/TT-BGDĐT
   (Áp dụng 3 Mức độ nhận thức: Mức 1, Mức 2, Mức 3; thang điểm 10 không số thập phân)
   ========================================================================== */
export const createPrimarySchoolPrompt = (data: ExamFormData): string => {
  const schoolHeader = data.schoolName
    ? data.schoolName
    : 'TRƯỜNG TIỂU HỌC SƠN HẠ SỐ I';

  return `
Bạn là một chuyên gia giáo dục tiểu học tại Việt Nam, am hiểu sâu sắc về Chương trình GDPT 2018 và **THÔNG TƯ 27/2020/TT-BGDĐT** (Quy định đánh giá học sinh tiểu học) của Bộ Giáo dục và Đào tạo.
Nhiệm vụ của bạn là tạo ra một bộ đề kiểm tra định kỳ hoàn chỉnh cho học sinh tiểu học môn **${data.subject} lớp ${data.grade}** (${data.textbook}), tuân thủ nghiêm ngặt các quy định của Thông tư 27/2020/TT-BGDĐT.

**CĂN CỨ PHÁP LÝ & QUY ĐỊNH BẮT BUỘC THEO THÔNG TƯ 27/2020/TT-BGDĐT (TUÂN THỦ 100%):**

1. **3 MỨC ĐỘ NHẬN THỨC THEO ĐIỀU 7 KHOẢN 1 ĐIỂM C (TUYỆT ĐỐI KHÔNG DÙNG 4 MỨC CỦA THCS/THPT):**
   Đề kiểm tra định kỳ cấp tiểu học chỉ được thiết kế theo ĐÚNG 3 MỨC ĐỘ:
   - **Mức 1**: Nhận biết, nhắc lại hoặc mô tả được nội dung đã học và áp dụng trực tiếp để giải quyết một số tình huống, vấn đề quen thuộc trong học tập.
   - **Mức 2**: Kết nối, sắp xếp được một số nội dung đã học để giải quyết vấn đề có nội dung tương tự.
   - **Mức 3**: Vận dụng các nội dung đã học để giải quyết một số vấn đề mới hoặc đưa ra những phản hồi hợp lý trong học tập và cuộc sống.
   *QUY ĐỊNH CỘT "Mức độ nhận thức" TRONG MA TRẬN VÀ BẢN ĐẶC TẢ*: BẮT BUỘC PHẢI GHI RÕ LÀ: **Mức 1**, **Mức 2**, hoặc **Mức 3**. TUYỆT ĐỐI KHÔNG ghi Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao.

2. **THANG ĐIỂM VÀ ĐÁNH GIÁ THEO ĐIỀU 7 KHOẢN 1 ĐIỂM D:**
   - Cho điểm theo thang điểm 10, **KHÔNG CHO ĐIỂM THẬP PHÂN**.
   - Các câu hỏi được phân bổ điểm số nguyên hoặc nửa điểm chẵn (ví dụ: 1 điểm, 2 điểm; tổng điểm toàn bài đúng tròn 10 điểm, không cho điểm lẻ như 0.25, 0.75).
   - Giáo viên sửa lỗi, nhận xét về sự tiến bộ của học sinh, không so sánh học sinh này với học sinh khác.

3. **CẤU TRÚC 4 PHẦN CHUẨN (DÙNG ĐÚNG TIÊU ĐỀ THUẦN TÚY, CÁCH NHAU BẰNG '---'):**
   - PHẦN 1: MA TRẬN ĐỀ KIỂM TRA
   - ---
   - PHẦN 2: BẢN ĐẶC TẢ CHI TIẾT
   - ---
   - PHẦN 3: NỘI DUNG ĐỀ KIỂM TRA
   - ---
   - PHẦN 4: HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN

4. **YÊU CẦU ĐỊNH DẠNG TỪNG PHẦN:**
   - **PHẦN 1 (MA TRẬN):** Phải là MỘT bảng markdown sạch có 6 cột:
     - Cột 1: \`Nội dung/Chủ đề kiến thức\`
     - Cột 2: \`Mức độ nhận thức\` (Bắt buộc ghi rõ: Mức 1, Mức 2, Mức 3)
     - Cột 3: \`Hình thức câu hỏi\` (TNKQ, Đúng/Sai, Trả lời ngắn, Tự luận)
     - Cột 4: \`Số câu hỏi\`
     - Cột 5: \`Số điểm\`
     - Cột 6: \`Tỉ lệ % điểm\`
     - Dòng TỔNG CỘNG: Cột "Nội dung/Chủ đề kiến thức" phải có tóm tắt thống kê: "TỔNG CỘNG (Thống kê theo TT27: Mức 1 [X]đ/[A]%; Mức 2 [Y]đ/[B]%; Mức 3 [Z]đ/[C]%)". Các cột còn lại tính tổng tương ứng (Tổng 10 điểm, 100%).

   - **PHẦN 2 (BẢN ĐẶC TẢ):** Phải là MỘT bảng markdown sạch có 6 cột:
     - Cột 1: \`Câu số\`
     - Cột 2: \`Nội dung/Chủ đề kiến thức\`
     - Cột 3: \`Yêu cầu cần đạt\` (Theo chuẩn kiến thức kỹ năng CT GDPT 2018 cấp tiểu học)
     - Cột 4: \`Mức độ nhận thức\` (Bắt buộc ghi rõ: Mức 1, Mức 2, hoặc Mức 3)
     - Cột 5: \`Thời gian dự kiến (phút)\`
     - Cột 6: \`Điểm số\`

   - **PHẦN 3 (NỘI DUNG ĐỀ KIỂM TRA):** Tuyệt đối KHÔNG dùng bảng. Bắt đầu bằng khối tiêu đề chuẩn:
     \`\`\`text
     ${schoolHeader}
     ĐỀ KIỂM TRA ĐỊNH KỲ (THEO THÔNG TƯ 27/2020/TT-BGDĐT)
     NĂM HỌC 2025-2026
     MÔN: ${data.subject} - LỚP ${data.grade}
     Thời gian làm bài: ${data.duration} phút (không kể thời gian phát đề)
     Họ và tên học sinh: .................................................... Lớp: .............
     \`\`\`
     Sau đó là các câu hỏi rõ ràng, câu từ trong sáng, phù hợp tâm lý học sinh tiểu học. Tuyệt đối không để lộ đáp án ở phần này.

   - **PHẦN 4 (HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN):** Bảng markdown 3 cột:
     - Cột 1: \`Câu\`
     - Cột 2: \`Đáp án và Hướng dẫn chấm\` (Đáp án chi tiết, biểu điểm rõ ràng từng bước không chia điểm lẻ thập phân)
     - Cột 3: \`Điểm\` (Số nguyên, tổng bằng 10)
     Sau bảng đáp án, bổ sung hướng dẫn nhận xét theo Thông tư 27:
     \`\`\`text
     *Hướng dẫn nhận xét đánh giá theo Thông tư 27/2020/TT-BGDĐT:*
     - Lời nhận xét khích lệ sự tiến bộ, chỉ rõ ưu điểm và hướng dẫn học sinh khắc phục những điểm còn hạn chế; không so sánh học sinh với nhau.
     \`\`\`

**THÔNG SỐ ĐỀ KIỂM TRA CẦN TẠO:**
- **Cấp học:** Tiểu học (Áp dụng Thông tư 27/2020/TT-BGDĐT)
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
- **Tổng điểm:** 10 (Thang điểm 10 không số thập phân theo TT 27)

**YÊU CẦU BỔ SUNG:**
${data.additionalRequirements || 'Không có'}

---
Hãy tạo bộ đề kiểm tra tiểu học hoàn chỉnh, bám sát tuyệt đối Thông tư 27/2020/TT-BGDĐT.
`;
};

/* ==========================================================================
   PROMPT DÀNH CHO TIẾNG VIỆT TIỂU HỌC: THEO THÔNG TƯ 27/2020/TT-BGDĐT
   ========================================================================== */
export const createPrimaryVietnamesePrompt = (data: ExamFormData): string => {
  const schoolHeader = data.schoolName
    ? data.schoolName
    : 'TRƯỜNG TIỂU HỌC SƠN HẠ SỐ I';

  return `
Bạn là một chuyên gia giáo dục tiểu học tại Việt Nam, am hiểu sâu sắc về môn Tiếng Việt tiểu học Chương trình GDPT 2018 và **THÔNG TƯ 27/2020/TT-BGDĐT** (Quy định đánh giá học sinh tiểu học).
Nhiệm vụ của bạn là tạo ra một bộ đề kiểm tra định kỳ hoàn chỉnh môn **Tiếng Việt ${data.grade}** (${data.textbook}), tuân thủ nghiêm ngặt các quy định của Thông tư 27/2020/TT-BGDĐT.

**CĂN CỨ PHÁP LÝ & QUY CÁCH ĐỀ TIẾNG VIỆT TIỂU HỌC THEO TT 27/2020/TT-BGDĐT:**

1. **3 MỨC ĐỘ NHẬN THỨC THEO ĐIỀU 7 KHOẢN 1 ĐIỂM C (TUYỆT ĐỐI KHÔNG DÙNG 4 MỨC CỦA THCS/THPT):**
   - **Mức 1**: Nhận biết, nhắc lại hoặc mô tả được nội dung đã học (tìm chi tiết trong văn bản đọc; nhận diện từ loại, dấu câu quen thuộc).
   - **Mức 2**: Kết nối, sắp xếp được nội dung đã học để giải quyết vấn đề tương tự (hiểu ý nghĩa hình ảnh, rút ra ý chính bài đọc, đặt câu theo mẫu).
   - **Mức 3**: Vận dụng giải quyết vấn đề mới hoặc phản hồi hợp lý (bài học liên hệ bản thân, viết đoạn văn thể hiện tình cảm, suy nghĩ).
   *Trong Ma trận và Bản đặc tả, cột "Mức độ nhận thức" BẮT BUỘC ghi rõ là: **Mức 1**, **Mức 2**, hoặc **Mức 3**.*

2. **CẤU TRÚC ĐỀ ĐỊNH KỲ TIẾNG VIỆT TIỂU HỌC (THANG ĐIỂM 10, KHÔNG DÙNG ĐIỂM THẬP PHÂN):**
   - **A. BÀI KIỂM TRA ĐỌC (Tổng 10 điểm quy đổi hoặc phân 5 điểm Đọc hiểu)**:
     - I. Đọc thành tiếng: Một đoạn văn ngắn khoảng 50-80 từ phù hợp lứa tuổi ${data.grade} + 1 câu hỏi tìm hiểu nội dung.
     - II. Đọc hiểu văn bản và Kiến thức Tiếng Việt:
       + Cung cấp 1 bài đọc/đoạn trích hoàn chỉnh giàu ý nghĩa nhân văn, giáo dục lối sống đẹp.
       + Hệ thống câu hỏi đọc hiểu (trắc nghiệm và tự luận ngắn) được thiết kế theo 3 mức độ (Mức 1, Mức 2, Mức 3), bao gồm cả câu hỏi kiểm tra kiến thức về từ và câu theo chương trình ${data.grade}.
   - **B. BÀI KIỂM TRA VIẾT (Tổng 10 điểm quy đổi hoặc phân 5 điểm Viết)**:
     - I. Viết chính tả / bài tập chính tả (Nghe - viết một đoạn văn ngắn hoặc bài tập phân biệt âm/vần dễ lẫn).
     - II. Viết đoạn văn / Tập làm văn: Đề bài gắn liền với chủ điểm kiến thức ${data.grade} (ví dụ: tả người, tả cảnh, viết thư, kể lại câu chuyện đã học/chứng kiến, nêu cảm nghĩ về nhân vật hoặc sự việc).

3. **CẤU TRÚC 4 PHẦN CHUẨN:**
   - PHẦN 1: MA TRẬN ĐỀ KIỂM TRA (Bảng markdown 6 cột với 3 Mức: Mức 1, Mức 2, Mức 3)
   - ---
   - PHẦN 2: BẢN ĐẶC TẢ CHI TIẾT (Bảng markdown 6 cột với 3 Mức: Mức 1, Mức 2, Mức 3)
   - ---
   - PHẦN 3: NỘI DUNG ĐỀ KIỂM TRA (Đề thi hoàn chỉnh dành cho học sinh, mở đầu bằng khối tiêu đề chuẩn, không dùng bảng)
   - ---
   - PHẦN 4: HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN (Bảng đáp án, biểu điểm chi tiết không điểm lẻ thập phân + Hướng dẫn nhận xét khích lệ theo TT 27)

**THÔNG SỐ ĐỀ KIỂM TRA:**
- **Cấp học:** Tiểu học (Áp dụng Thông tư 27/2020/TT-BGDĐT)
- **Lớp:** ${data.grade}
- **Môn học:** Tiếng Việt
- **Bộ sách:** ${data.textbook}
- **Thời gian làm bài:** ${data.duration} phút
- **Nội dung kiến thức / Chủ điểm:**
${data.knowledgeContent}
- **Yêu cầu bổ sung:**
${data.additionalRequirements || 'Không có'}

---
Hãy tạo bộ đề kiểm tra Tiếng Việt tiểu học hoàn chỉnh, bám sát tuyệt đối Thông tư 27/2020/TT-BGDĐT.
`;
};

/* ==========================================================================
   PROMPT DÀNH CHO THCS & THPT: THEO CÔNG VĂN 7991/BGDĐT-GDTrH
   ========================================================================== */
export const createGeneralPrompt = (data: ExamFormData): string => {
  return `
Bạn là một trợ lý AI chuyên gia cho giáo viên THCS và THPT Việt Nam, có chuyên môn sâu về môn ${data.subject}. Nhiệm vụ của bạn là tạo ra một bộ đề kiểm tra hoàn chỉnh, chính xác và khoa học, tuân thủ nghiêm ngặt **CÔNG VĂN 7991/BGDĐT-GDTrH** và các thông số được cung cấp.

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
3.  **Định dạng Tiêu đề (QUAN TRỌNG):** Các tiêu đề của 4 phần trên BẮT BUỘC phải là văn bản thuần túy (plain text). TUYỆT ĐỐI KHÔNG sử dụng markdown. Viết chính xác các tiêu đề như đã chỉ định.
4.  **QUY TẮC PHÂN TÁCH NỘI DUNG:** Mỗi phần phải chứa đúng và đủ nội dung được yêu cầu, không được lẫn lộn nội dung giữa các phần.
    - **PHẦN 1 (MA TRẬN):** Chỉ chứa MỘT bảng markdown duy nhất theo CV 7991.
    - **PHẦN 2 (BẢN ĐẶC TẢ):** Chỉ chứa MỘT bảng markdown duy nhất theo CV 7991.
    - **PHẦN 3 (ĐỀ KIỂM TRA):** NỘI DUNG ĐỀ KIỂM TRA tuyệt đối KHÔNG được trình bày dưới dạng bảng, KHÔNG dùng bảng markdown, KHÔNG dùng các ký tự phân chia dòng, KHÔNG dùng block code, KHÔNG dùng bảng HTML. Chỉ trình bày đề kiểm tra dưới dạng các câu hỏi, đoạn văn hoặc danh sách rõ ràng, khoa học.
Mở đầu phần này BẮT BUỘC phải có khối tiêu đề chuẩn:
      \`\`\`text
      ${
        data.schoolName
          ? data.schoolName
          : data.schoolLevel === 'THCS'
          ? 'TRƯỜNG THCS SƠN HẠ SỐ I'
          : 'TRƯỜNG THPT SƠN HẠ SỐ I'
      }
      ĐỀ KIỂM TRA (THEO CV 7991/BGDĐT-GDTrH)
      NĂM HỌC 2025-2026
      MÔN: ${data.subject}
      LỚP: ${data.grade}
      Thời gian làm bài: ${data.duration} phút (không kể thời gian phát đề)
      \`\`\`
      Sau khối tiêu đề trên, chỉ chứa đề bài hoàn chỉnh cho học sinh. **TUYỆT ĐỐI KHÔNG** bao gồm bất kỳ đáp án, lời giải, hay hướng dẫn chấm nào trong phần này.
    - **PHẦN 4 (ĐÁP ÁN):** **CHỈ** chứa đáp án, lời giải và biểu điểm chấm chi tiết. **TUYỆT ĐỐI KHÔNG** lặp lại đề bài từ Phần 3.
5.  **Phân bổ câu hỏi (QUAN TRỌNG):** Bạn BẮT BUỘC phải tuân thủ CHÍNH XÁC SỐ LƯỢNG câu hỏi và ĐIỂM SỐ cho từng dạng bài đã được chỉ định. Toàn bộ 4 phần phải phản ánh đúng cấu trúc này.
6.  **Định dạng Toán học và Khoa học:**
    - Sử dụng ký tự Unicode (ví dụ: ², ³, ₁, ₂) cho các chỉ số trên và chỉ số dưới đơn giản.
    - Sử dụng cú pháp LaTeX cho các công thức phức tạp (phân số, căn, tích phân, phương trình hóa học).
7.  **Định dạng và Cấu trúc Bảng (BẮT BUỘC):**
    - **Bảng MA TRẬN (PHẦN 1 - CV 7991):** Phải có 6 cột với các tiêu đề sau:
        - Cột 1: \`Nội dung/Đơn vị kiến thức\`
        - Cột 2: \`Mức độ nhận thức\` (Ghi rõ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)
        - Cột 3: \`Hình thức câu hỏi\` (Ghi rõ: TNKQ, Đúng/Sai, Trả lời ngắn, Tự luận)
        - Cột 4: \`Số câu hỏi\`
        - Cột 5: \`Số điểm\`
        - Cột 6: \`Tỉ lệ % điểm\`
        - **Yêu cầu thêm:** Cuối bảng PHẢI có dòng TỔNG CỘNG. Trong dòng TỔNG CỘNG này, ở cột "Nội dung/Đơn vị kiến thức", hãy ghi tóm tắt thống kê tổng điểm VÀ TỔNG TỈ LỆ % theo từng mức độ nhận thức (NB, TH, VD, VDC). Các cột còn lại tính tổng cho toàn bảng.
    - **Bảng BẢN ĐẶC TẢ (PHẦN 2 - CV 7991):** Phải có 6 cột với các tiêu đề sau:
        - Cột 1: \`Câu số\`
        - Cột 2: \`Nội dung/Đơn vị kiến thức\`
        - Cột 3: \`Yêu cầu cần đạt\`
        - Cột 4: \`Mức độ nhận thức\` (Ghi rõ: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)
        - Cột 5: \`Thời gian dự kiến (phút)\`
        - Cột 6: \`Điểm số\`
    - **Bảng ĐÁP ÁN (PHẦN 4):** Phải là MỘT bảng markdown duy nhất có 3 cột:
        - Cột 1: \`Câu\`
        - Cột 2: \`Đáp án và Hướng dẫn chấm\` (Có đáp án mẫu và biểu điểm chi tiết)
        - Cột 3: \`Điểm\`

---

**THÔNG SỐ ĐỀ KIỂM TRA CẦN TẠO:**
- **Cấp học:** ${data.schoolLevel} (Áp dụng CV 7991/BGDĐT-GDTrH)
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
Bây giờ, hãy tạo ra bộ đề kiểm tra hoàn chỉnh, tuân thủ nghiêm ngặt mọi yêu cầu trên theo Công văn 7991/BGDĐT-GDTrH.
`;
};

/* ==========================================================================
   PROMPT DÀNH CHO TIẾNG ANH (CẢ TIỂU HỌC & TRUNG HỌC)
   ========================================================================== */
export const createEnglishPrompt = (data: ExamFormData): string => {
  const isPrimary = data.schoolLevel === 'Tiểu học';
  const schoolHeader = data.schoolName
    ? data.schoolName
    : isPrimary
    ? 'TRƯỜNG TIỂU HỌC SƠN HẠ SỐ I'
    : data.schoolLevel === 'THCS'
    ? 'TRƯỜNG THCS SƠN HẠ SỐ I'
    : 'TRƯỜNG THPT SƠN HẠ SỐ I';

  const regulatoryNote = isPrimary
    ? `IMPORTANT REGULATORY NOTE FOR PRIMARY SCHOOL (Circular 27/2020/TT-BGDĐT):
       - The cognitive levels in the Matrix and Test Specification Grid MUST be strictly divided into 3 levels:
         + Level 1 (Mức 1: Recall, recognition, familiar contexts)
         + Level 2 (Mức 2: Connection and application to similar contexts)
         + Level 3 (Mức 3: Application to new problems and personal responses)
       - Total points: 10 points. As per Circular 27, points MUST NOT contain decimal fractions (use integer or simple half-point units summing to 10).`
    : `IMPORTANT REGULATORY NOTE FOR SECONDARY/HIGH SCHOOL (Dispatch 7991/BGDĐT-GDTrH):
       - The cognitive levels in the Matrix and Test Specification Grid MUST be strictly 4 levels: Recognition, Comprehension, Application, High Application.`;

  return `
You are an expert, a teacher of English teaching for Vietnamese students. Your task is to create a complete, high-quality set of English test questions based on user requests.

${regulatoryNote}

**CRITICAL INSTRUCTIONS:**
1.  **Output Language:** The entire output, including all headers and content, MUST be 100% in English, **WITH ONE EXCEPTION:** The exam header in PART 3 must be in Vietnamese as specified below.
2.  **Strict 4-Part Structure:** The output MUST strictly follow this 4-part structure, using the exact headers provided. Use '---' as a separator between parts.
    - PART 1: EXAM MATRIX
    - ---
    - PART 2: TEST SPECIFICATION GRID
    - ---
    - PART 3: EXAM PAPER (IMPORTANT: The EXAM PAPER section MUST NOT be presented as a table, MUST NOT use markdown table, MUST NOT use any row/column separators, block code, or HTML table.)
    - ---
    - PART 4: ANSWER KEY & GRADING GUIDE
3.  **Header Formatting (IMPORTANT):** The 4 part headers above MUST be plain text. DO NOT use markdown. Write the headers exactly as specified.
4.  **Table Formatting (MANDATORY):** For Parts 1, 2, and 4, the output MUST be a single, clean, well-formed markdown table ONLY.
    - In Part 1 (EXAM MATRIX): The 'Cognitive Level' column must indicate ${isPrimary ? 'Level 1, Level 2, or Level 3 (as per Circular 27/2020/TT-BGDĐT)' : 'Recognition, Comprehension, Application, or High Application (as per Dispatch 7991)'}.
    - In Part 2 (TEST SPECIFICATION GRID): The 'Cognitive Level' column must match Part 1.
    - In Part 4 (ANSWER KEY & GRADING GUIDE): Table with 3 columns (\`Question\`, \`Answer & Grading Guide\`, \`Points\`).
5.  **Pedagogy & Question Quality:** All questions must be clear, appropriate for grade ${data.grade}, and align with the textbook ${data.textbook}.

**EXAM SPECIFICATIONS:**
- **Level:** ${data.schoolLevel} ${isPrimary ? '(Governed by Circular 27/2020/TT-BGDĐT)' : '(Governed by Dispatch 7991/BGDĐT-GDTrH)'}
- **Grade:** ${data.grade}
- **Textbook Series:** ${data.textbook}
- **Exam Duration:** ${data.duration} minutes
- **Knowledge Content / Topics:**
${data.knowledgeContent}
- **Additional Requirements:** ${data.additionalRequirements || 'None'}

**Part 3 (Exam Paper) must begin with this mandatory Vietnamese header block:**
\`\`\`text
${schoolHeader}
ĐỀ KIỂM TRA ĐỊNH KỲ ${isPrimary ? '(THEO THÔNG TƯ 27/2020/TT-BGDĐT)' : '(THEO CV 7991/BGDĐT-GDTrH)'}
NĂM HỌC 2025-2026
MÔN: ${data.subject}
LỚP: ${data.grade}
Thời gian làm bài: ${data.duration} phút (không kể thời gian phát đề)
Họ và tên học sinh: .................................................... Lớp: .............
\`\`\`

---
Please generate the complete exam package now, adhering to all instructions.
`;
};

/* ==========================================================================
   PROMPT DÀNH CHO NGỮ VĂN (THCS & THPT)
   ========================================================================== */
export const createLiteraturePrompt = (data: ExamFormData): string => {
  return `
Bạn là một chuyên gia giàu kinh nghiệm trong việc biên soạn đề thi môn Ngữ văn cho học sinh THCS và THPT tại Việt Nam theo **Công văn 7991/BGDĐT-GDTrH** và CT GDPT 2018. Nhiệm vụ của bạn là tạo ra một bộ đề kiểm tra hoàn chỉnh, khoa học, và bám sát chương trình giáo dục.

**HƯỚNG DẪN TỐI THƯỢNG (BẮT BUỘC TUÂN THỦ):**
1.  **Ngôn ngữ:** 100% nội dung và tiêu đề phải là tiếng Việt.
2.  **Cấu trúc 4 phần:** Phải tuân thủ nghiêm ngặt cấu trúc 4 phần với tiêu đề chính xác. Dùng '---' để ngăn cách các phần.
    - PHẦN 1: MA TRẬN ĐỀ KIỂM TRA
    - ---
    - PHẦN 2: BẢN ĐẶC TẢ CHI TIẾT
    - ---
    - PHẦN 3: NỘI DUNG ĐỀ KIỂM TRA
    - ---
    - PHẦN 4: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM
3.  **Tiêu đề phần:** Các tiêu đề phần phải là văn bản thuần túy, không dùng markdown.
4.  **Cấu trúc đề:** Đề thi gồm 2 phần Đọc hiểu (ngữ liệu ngoài sách giáo khoa) và Viết (nghị luận văn học hoặc nghị luận xã hội), phân bổ theo 4 mức độ nhận thức của CV 7991: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao.
5.  **Đáp án mẫu & Biểu điểm:** Biểu điểm rõ ràng từng ý, tiêu chí chấm lập luận, dẫn chứng, chính tả, ngữ pháp, sáng tạo.

**THÔNG SỐ ĐỀ KIỂM TRA:**
- **Cấp học:** ${data.schoolLevel}
- **Lớp:** ${data.grade}
- **Môn học:** Ngữ văn
- **Bộ sách:** ${data.textbook}
- **Thời gian làm bài:** ${data.duration} phút
- **Nội dung kiến thức:**
${data.knowledgeContent}
- **Yêu cầu bổ sung:**
${data.additionalRequirements || 'Không có'}

---
Hãy tạo bộ đề kiểm tra hoàn chỉnh, tuân thủ nghiêm ngặt mọi yêu cầu trên theo Công văn 7991/BGDĐT-GDTrH.
`;
};

/* ==========================================================================
   PROMPT DÀNH CHO: SOẠN KẾ HOẠCH BÀI DẠY (GIÁO ÁN)
   Format chuẩn xác 100% theo mẫu văn bản KHBD thực tế của giáo viên:
   - Áp dụng duy nhất Bộ sách Kết nối tri thức với cuộc sống
   - Tích hợp Khung năng lực số (Thông tư 02/2025/TT-BGDĐT, CV 3456/BGDĐT-GDPT)
   - TỰ ĐỘNG GEN KÈM BỘ MÃ CHUẨN XÁC: NLS (VD: NLS 1.1.CB1a) & AI (VD: 4.A1.3; 4.C2.3)
   - Trình bày hoạt động dạy học dạng BẢNG 2 CỘT: HOẠT ĐỘNG CỦA GV | HOẠT ĐỘNG CỦA HS
   ========================================================================== */
export const createLessonPlanPrompt = (data: LessonPlanFormData): string => {
  const schoolName = data.schoolName || 'Trường TH Sơn Hạ';
  const teacherName = data.teacherName || 'Vũ Hoàng Hiệp';
  const approverName = data.approverName || 'Nguyễn Thị Pô Ly';
  const weekText = data.week ? (data.week.toUpperCase().startsWith('TUẦN') ? data.week.toUpperCase() : `TUẦN ${data.week}`) : 'TUẦN 04';
  const prepDate = data.prepDate || '20/09/2026';
  const teachDate = data.teachDate || '28-29-30/09/2026';
  const classes = data.classesTaught || `${data.grade}A, ${data.grade}B, ${data.grade}C`;
  const periodText = data.periodNumber ? (data.periodNumber.startsWith('(') ? data.periodNumber : `(${data.periodNumber})`) : `(tiết 1)`;

  return `
Bạn là một chuyên gia sư phạm tiểu học và phổ thông tại Việt Nam, am hiểu sâu sắc về bộ sách **Kết nối tri thức với cuộc sống**, **Thông tư 02/2025/TT-BGDĐT** (Khung năng lực số) và **Công văn 3456/BGDĐT-GDPT** (Hướng dẫn triển khai NLS).
Nhiệm vụ của bạn là soạn một **KẾ HOẠCH BÀI DẠY (KHBD / GIÁO ÁN)** hoàn chỉnh, chi tiết, chuyên nghiệp theo **ĐÚNG FORMAT ĐỊNH DẠNG MẪU VĂN BẢN THỰC TẾ** sau đây:

**QUY TẮC BẮT BUỘC VỀ BỘ MÃ NĂNG LỰC SỐ & TÍCH HỢP AI:**
Bạn PHẢI TỰ ĐỘNG TẠO ra mục Năng lực số và Tích hợp AI KÈM THEO BỘ MÃ CHUẨN HÓA, ví dụ chuẩn:
\`Tích hợp Năng lực số (NLS 1.1.CB1a) & Tích hợp AI (4.A1.3; 4.C2.3) [nội dung hành vi nhiệm vụ cụ thể gắn với bài học, tra cứu, ứng dụng công cụ số/AI, bảo vệ môi trường, liên hệ thực tế]\`.
- Quy cách mã NLS (theo Thông tư 02/2025 và CV 3456):
  * Lớp 1, 2, 3 (Cơ bản 1): \`NLS 1.1.CB1a\`, \`NLS 1.2.CB1b\`, \`NLS 2.1.CB1a\`, \`NLS 4.1.CB1a\`, \`NLS 6.1.CB1a\`...
  * Lớp 4, 5 (Cơ bản 2): \`NLS 1.1.CB2a\`, \`NLS 2.1.CB2a\`, \`NLS 3.1.CB2a\`, \`NLS 4.1.CB2b\`, \`NLS 5.2.CB2a\`, \`NLS 6.2.CB2b\`...
  * THCS / THPT: \`NLS 1.1.TC1a\`, \`NLS 2.1.TC2a\`, \`NLS 6.1.NC1a\`...
- Quy cách mã AI: \`[Khối].A[x].[y]; [Khối].C[x].[y]\` (ví dụ đối với khối 4: \`4.A1.3; 4.C2.3\`; khối 3: \`3.A1.2; 3.B1.1\`; khối 5: \`5.A2.1; 5.C1.2\`).
- Mã NLS & AI này BẮT BUỘC xuất hiện ở:
  1. Mục \`I. YÊU CẦU CẦN ĐẠT\` -> \`3. Năng lực số & Tích hợp AI\`
  2. Trong bảng \`III. HOẠT ĐỘNG DẠY HỌC\` -> Lồng ghép cụ thể vào ít nhất 1 hoặc 2 hoạt động (Khám phá hoặc Vận dụng).

**BỘ SÁCH ÁP DỤNG:** DUY NHẤT bộ sách **Kết nối tri thức với cuộc sống**.

---
**CẤU TRÚC VÀ ĐỊNH DẠNG ĐẦU RA BẮT BUỘC (TUÂN THỦ 100% CẤU TRÚC SAU):**

\`\`\`text
${schoolName}                                  KHBD ${data.subject} ${weekText.toLowerCase()}
---------------------------------------------------------------------------------------------------
                                       ${weekText}
Môn: ${data.subject} ${data.grade}
Ngày soạn: ${prepDate}
Ngày dạy: ${teachDate}
Lớp: ${classes}

${data.themeName ? `${data.themeName.toUpperCase()}\n` : ''}BÀI: ${data.lessonName.toUpperCase()} ${periodText}
\`\`\`

## I. YÊU CẦU CẦN ĐẠT
### 1. Năng lực đặc thù
- (Liệt kê từ 2-4 gạch đầu dòng rõ ràng về kiến thức, kỹ năng đặc thù của môn học mà học sinh làm được).
### 2. Năng lực chung
- Năng lực tự chủ, tự học: (Mô tả hành vi cụ thể học tập độc lập, chủ động).
- Năng lực giải quyết vấn đề và sáng tạo: (Mô tả hành vi phát hiện và đề xuất giải pháp).
- Năng lực giao tiếp và hợp tác: (Mô tả hành vi làm việc nhóm, chia sẻ, lắng nghe bạn bè).
### 3. Năng lực số & Tích hợp AI
- Tích hợp Năng lực số (NLS 1.1.CB1a) & Tích hợp AI (4.A1.3; 4.C2.3) [Tự động tạo câu mô tả chuẩn chỉ rõ nội dung kiến thức bài học học sinh tra cứu, ứng dụng AI, thiết bị số và bảo vệ môi trường học đường/gia đình].
### 4. Phẩm chất
- Phẩm chất chăm chỉ: Tích cực tham gia vào các hoạt động học tập, hoàn thành nhiệm vụ được giao.
- Phẩm chất trách nhiệm: Có ý thức bảo quản thiết bị, đồ dùng học tập; tôn trọng tập thể lớp.

## II. ĐỒ DÙNG DẠY HỌC
- **Giáo viên chuẩn bị:** Giáo án điện tử PowerPoint, máy tính, máy chiếu, thiết bị dạy học, trò chơi học tập website (blooket.com, Quizizz.com...), phiếu học tập.
- **Học sinh chuẩn bị:** Sách giáo khoa Kết nối tri thức với cuộc sống, vở ghi bài, bút, nháp...

## III. HOẠT ĐỘNG DẠY HỌC
(BẮT BUỘC TRÌNH BÀY DƯỚI DẠNG BẢNG MARKDOWN 2 CỘT CHUẨN XÁC NHƯ SAU:)

| HOẠT ĐỘNG CỦA GIÁO VIÊN | HOẠT ĐỘNG CỦA HỌC SINH |
| :--- | :--- |
| **1. Khởi động, kết nối.**<br/>- Ổn định lớp.<br/>- Yêu cầu: Thực hiện trò chơi "Ai nhanh hơn" (hoặc Đố bạn / video tương tác / câu đố). Luật chơi: Trả lời nhanh và đúng các câu hỏi trắc nghiệm đã cho.<br/>- GV nhận xét, tuyên dương, dẫn dắt vào bài mới. | - HS báo cáo sĩ số lớp.<br/>- HS tham gia trò chơi, trả lời câu hỏi.<br/>- HS chú ý lắng nghe. |
| **2. Hình thành kiến thức mới / Khám phá**<br/>**2.1. [Tên hoạt động khám phá 1]**<br/>- GV giới thiệu nội dung bài tập / chia sẻ tranh ảnh, video / nêu câu hỏi cho học sinh thảo luận nhóm...<br/>*(Tích hợp Năng lực số (NLS 1.1.CB1a) & Tích hợp AI (4.A1.3): HS tìm kiếm, nhận biết...)*<br/>- GV nhận xét tuyên dương, chốt kiến thức: ... | - HS chú ý quan sát tranh/video.<br/>- HS thảo luận nhóm làm bài tập vào phiếu bài tập.<br/>- Đại diện các nhóm báo cáo kết quả thảo luận.<br/>- HS khác nhận xét, bổ sung.<br/>- Lắng nghe rút kinh nghiệm. |
| **2.2. [Tên hoạt động khám phá 2]**<br/>- GV nêu câu hỏi / nhiệm vụ tìm hiểu tiếp theo...<br/>- GV hướng dẫn học sinh đọc nội dung và phân tích...<br/>- GV nhận xét chung, tuyên dương và chốt kiến thức: ... | - HS đọc yêu cầu bài, quan sát và suy nghĩ.<br/>- HS thảo luận và trả lời câu hỏi.<br/>- Đại diện trình bày, nhóm khác nhận xét.<br/>- HS lắng nghe, chốt nội dung. |
| **3. Luyện tập**<br/>- GV hướng dẫn học sinh làm bài tập ... trong SGK Kết nối tri thức.<br/>- Yêu cầu học sinh làm việc cá nhân / nhóm đôi để hoàn thành.<br/>- GV quan sát, giúp đỡ học sinh gặp khó khăn.<br/>- GV nhận xét tuyên dương học sinh làm tốt. | - HS nghe hướng dẫn của giáo viên làm bài tập.<br/>- HS thực hành làm bài tập vào vở hoặc phiếu bài tập.<br/>- Một số HS trình bày trước lớp.<br/>- HS khác nhận xét bài làm của bạn. |
| **4. Vận dụng**<br/>- GV giao nhiệm vụ vận dụng thực tế đời sống...<br/>*(Tích hợp Năng lực số & Tích hợp AI (4.C2.3): Hướng dẫn HS tra cứu/chia sẻ kiến thức chăm sóc, bảo vệ môi trường, ứng dụng vào gia đình/trường học...)*<br/>- GV nhận xét tiết dạy, tuyên dương tinh thần học tập.<br/>- Dặn dò về nhà chuẩn bị cho bài học tiếp theo. | - HS lắng nghe nhiệm vụ vận dụng.<br/>- HS chia sẻ với bạn về hiểu biết và ý tưởng thực tế.<br/>- HS ghi nhớ nhiệm vụ về nhà và chuẩn bị bài mới.<br/>- Lắng nghe, rút kinh nghiệm. |

## IV. ĐIỀU CHỈNH SAU BÀI DẠY:
.....................................................................................................................................
.....................................................................................................................................

\`\`\`text
NGƯỜI KÝ DUYỆT                                      GIÁO VIÊN
  (Ký, ghi rõ họ tên)                               (Ký, ghi rõ họ tên)



${approverName}                                   ${teacherName}
\`\`\`

---
Hãy soạn thảo kế hoạch bài dạy chi tiết, sâu sắc, thực tế, đúng quy cách mẫu trên cho môn **${data.subject} - ${data.grade}** (${data.lessonName}).
`;
};

export const getExamPromptAndInstruction = (
  data: ExamFormData
): { prompt: string; systemInstruction: string } => {
  if (data.schoolLevel === 'Tiểu học') {
    if (data.subject === 'Tiếng Việt') {
      return {
        prompt: createPrimaryVietnamesePrompt(data),
        systemInstruction:
          "You are an expert Vietnamese primary education teacher's assistant AI specializing in creating high-quality Tiếng Việt exam papers strictly adhering to Circular 27/2020/TT-BGDĐT.",
      };
    } else if (data.subject === 'Ngoại ngữ 1 (Tiếng Anh)') {
      return {
        prompt: createEnglishPrompt(data),
        systemInstruction:
          'You are an expert English Language Teaching specialist AI creating primary school exams adhering to Circular 27/2020/TT-BGDĐT.',
      };
    } else {
      return {
        prompt: createPrimarySchoolPrompt(data),
        systemInstruction:
          "You are an expert Vietnamese primary education teacher's assistant AI specializing in creating primary school exams strictly adhering to Circular 27/2020/TT-BGDĐT.",
      };
    }
  } else {
    if (data.subject === 'Ngoại ngữ 1 (Tiếng Anh)') {
      return {
        prompt: createEnglishPrompt(data),
        systemInstruction:
          'You are an expert English Language Teaching (ELT) specialist AI, creating high-quality exams for Vietnamese students adhering to Dispatch 7991/BGDĐT-GDTrH.',
      };
    } else if (data.subject === 'Ngữ văn') {
      return {
        prompt: createLiteraturePrompt(data),
        systemInstruction:
          "You are an expert Vietnamese teacher's assistant AI specializing in creating high-quality Literature exam papers according to Dispatch 7991/BGDĐT-GDTrH.",
      };
    } else {
      return {
        prompt: createGeneralPrompt(data),
        systemInstruction:
          "You are an expert Vietnamese teacher's assistant AI specializing in creating high-quality educational materials and exam papers according to Dispatch 7991/BGDĐT-GDTrH.",
      };
    }
  }
};
