import type { ExamFormData, LessonPlanFormData } from '../types';
import { isEnglishSubject, ENGLISH_EXAM_FORMATS, ENGLISH_SKILL_CATEGORIES } from '../constants';

/* ==========================================================================
   PROMPT DÀNH CHO: SOẠN KẾ HOẠCH BÀI DẠY (GIÁO ÁN) MÔN TIẾNG ANH (ENGLISH)
   Format chuẩn xác 100% theo mẫu văn bản trong file người dùng cung cấp:
   - Sách Tiếng Anh Global Success (Bộ sách Kết nối tri thức với cuộc sống của NXBGDVN)
   - Bám sát Chương trình Giáo dục phổ thông 2018 (GDPT 2018)
   - Toàn bộ bằng Tiếng Anh (English):
     Header (School, Lesson plan - English [Grade], Teacher, School year, Week, Period, Preparing date, Teaching date)
     A. OBJECTIVES: (1. Knowledge: communicative contexts, Vocabulary, Structures; 2. Competences; 3. Attitudes/ Qualities)
     B. TEACHING AIDS: (website hoclieu.vn, laptop, textbook, lesson plan, TV, students' book, notebooks...)
     C. PROCEDURES: Bảng 2 cột chuẩn Markdown: Teacher’s activities | Students’ activities
        1. Warm-up (and review) (Song/Game, *Aims, *Procedure)
        2. Presentation (Activity 1 Vocabulary, Activity 2 Look, listen and repeat, Activity 3 Listen, point and say / Structures)
        3. Practice (Drill pictures, pair work, choral/individual practice)
        4. Production (Activity 4 Let's talk / Survey / Role-play)
        5. Fun corner and wrap-up (Games: Pass the teddy bears / Spin the wheel / Lucky windows / Roll the dice / Whisper, homework)
     D. ADJUSTMENTS (if necessary)
     Ký duyệt cuối trang: BGH duyệt & Người soạn bài
   ========================================================================== */
export const createEnglishLessonPlanPrompt = (data: LessonPlanFormData): string => {
  const schoolName = data.schoolName || 'Truong Quang Trong Primary School';
  const teacherName = data.teacherName || 'Vo Thi Lac';
  
  // Extract grade number: "Lớp 5" -> "5", "Lớp 3" -> "3", "Grade 5" -> "5"
  const gradeMatch = (data.grade || '').match(/\d+/);
  const gradeNumber = gradeMatch ? gradeMatch[0] : '5';
  
  // Week text: "Tuần 2" -> "Week 2", "Week 2" -> "Week 2"
  const weekNumMatch = (data.week || '').match(/\d+/);
  const weekText = weekNumMatch ? `Week ${weekNumMatch[0]}` : (data.week || 'Week 2');

  // Period text: "tiết 5" or "5" -> "Period 5"
  const periodNumMatch = (data.periodNumber || '').match(/\d+/);
  const periodText = periodNumMatch ? `Period ${periodNumMatch[0]}` : (data.periodNumber || 'Period 5');

  const prepDate = data.prepDate || 'September 7th, 2026';
  const teachDate = data.teachDate || 'September 14th-15th, 2026';

  const unitTitle = data.themeName ? data.themeName : (data.lessonName.toLowerCase().includes('unit') ? '' : `Unit 1: All about me!`);
  const lessonTitle = data.lessonName || 'Lesson 1 (1, 2, 3)';

  const aiStrandsText = data.aiStrands && data.aiStrands.length > 0
    ? data.aiStrands.join('; ')
    : 'Human-centred mindset & AI techniques in education';

  const suggestedToolsText = data.suggestedAiTools && data.suggestedAiTools.length > 0
    ? data.suggestedAiTools.join(', ')
    : 'Canva Magic Studio Edu, interactive flashcard tools, digital audio/visual aids';

  const qpanThemesText = data.qpanThemes && data.qpanThemes.length > 0
    ? data.qpanThemes.join('; ')
    : 'Love for hometown, pride in sea and islands, friendly school environment and public discipline';

  const isDigitalGeneralEnabled = data.integrateDigitalCompetence !== false;
  const isQpanEnabled = Boolean(
    isDigitalGeneralEnabled &&
    data.integrateQpan08 !== false &&
    data.qpanThemes &&
    data.qpanThemes.length > 0
  );
  const isAiEnabled = Boolean(
    isDigitalGeneralEnabled &&
    (data.integrateAi2422 ?? true)
  );
  const isNlsEnabled = Boolean(
    isDigitalGeneralEnabled &&
    data.digitalDomains &&
    data.digitalDomains.length > 0
  );

  return `
You are an expert English Language Teaching (ELT) educational specialist in Vietnam, with profound expertise in:
1. The national English textbook **"Tiếng Anh - Global Success" (Bộ sách Kết nối tri thức với cuộc sống của Nhà xuất bản Giáo dục Việt Nam)**.
2. Vietnam's **General Education Program 2018 (Chương trình GDPT 2018)** for English.
3. Decision No. 2422/QĐ-BGDĐT on AI education framework and Circular No. 02/2025/TT-BGDĐT on digital competence.${isQpanEnabled ? `
4. Circular No. 08/2024/TT-BGDĐT on integrating National Defense and Security Education into school subjects.` : ''}

${!isQpanEnabled ? `**CRITICAL INSTRUCTION - NO NATIONAL DEFENSE INTEGRATION:**
The teacher has explicitly TURNED OFF National Defense & Security Education (Circular 08/2024/TT-BGDĐT).
YOU MUST NOT include any national defense, military, border/island sovereignty, or security integration tasks, aims, or notes in any section of this lesson plan. The lesson plan must focus purely on standard English language communicative learning.` : ''}

TASK: Prepare a complete, highly detailed, pedagogical **LESSON PLAN - ENGLISH (KẾ HOẠCH BÀI DẠY MÔN TIẾNG ANH)** written entirely in English, following the EXACT format, sections, procedures, and styling of the provided authentic lesson plan from the user's document.

CRITICAL FORMATTING & CONTENT RULES:
1. LANGUAGE: The entire lesson plan MUST BE IN ENGLISH (except Vietnamese word translations in the vocabulary presentation list, e.g. "+ city : thành phố (picture)", to ensure pupils understand the meaning).
2. TEXTBOOK & CURRICULUM: Strictly follow the **Tiếng Anh (Global Success - Kết nối tri thức)** curriculum for Grade ${gradeNumber}. Retrieve accurate target vocabulary, sentence structures, communicative dialogues, phonics/songs, and textbook activities (Look, listen and repeat; Listen, point and say; Listen and tick/match/number; Read and complete; Let's talk; Let's sing/play; Project...).
3. STRUCTURE & HEADINGS (DO NOT DEVIATE):
   - Header with school name, Lesson plan - English ${gradeNumber}, asterisks line, Teacher, School year (2026-2027), Week, Period, Preparing date, Teaching date.
   - Centered Unit title & Lesson title.
   - Section **## A. OBJECTIVES:**
     * **### 1. Knowledge:**
       - Bullet points on understanding and repeating sentences in communicative contexts.
       - Saying words and using structures to ask and answer in guided and freer contexts.
       - **Vocabulary:** list target words (e.g. city, class, countryside...).
       - **Structures:**
         A: [Target question]
         B: [Target answer]
     * **### 2. Competences:**
       - Communication and collaboration: work in pairs and groups to complete the learning tasks.
       - Self-control and independent learning: perform pronunciation and speaking tasks.
       - Critical thinking and creativity: learn how to ask and answer questions about personal information correctly and fluently.
       ${(isNlsEnabled || isAiEnabled) ? `- Digital competence & AI literacy (Decision 2422/QĐ-BGDĐT & Circular 02/2025): identify and use educational tools (${suggestedToolsText}, hoclieu.vn) safely, verify information, and respect ethical digital practices.` : ''}
     * **### 3. Attitudes/ Qualities:**
       - Show pride in their personal information, hobbies, hometown, family, and country.
       ${isQpanEnabled ? `- Integration of National Defense & Security Education (under Circular 08/2024/TT-BGDĐT): Foster love for peaceful Vietnam, pride in national sovereignty (sea and islands), solidarity, and traffic/cyber discipline.` : ''}
   - Section **## B. TEACHING AIDS:**
     * Teacher: website hoclieu.vn, laptop, textbook (Tiếng Anh ${gradeNumber} - Global Success - Kết nối tri thức), lesson plan, TV/projector, audio files, flashcards${isAiEnabled && suggestedToolsText ? `, AI teaching tools (${suggestedToolsText})` : ''}.
     * Students: Students’ book Page [X], notebooks, school things.
   - Section **## C. PROCEDURES:**
     MUST BE IN A 2-COLUMN MARKDOWN TABLE:
     \`| Teacher’s activities | Students’ activities |\`
     \`| :--- | :--- |\`
     With 5 detailed stages:
     * **1. Warm-up (and review): (3-5’)**
       - Song or interactive game (e.g. Hello, nice to meet you / All about me / Spin the wheel / Pass the ball / Whisper...).
       - \`*Aims:\` create active atmosphere or review previous structures.
       - \`*Procedure:\` steps of teacher, YouTube song link or game rules, book opening instruction.
       - Students' activities: singing, dancing or playing game, opening books.
     * **2. Presentation. (12-16’)** (or Practice depending on lesson part)
       - **Activity 1. Vocabulary:** *Aims, *Procedure (T elicits new words with pictures/realia/mime, models 3 times, writes on board, checking technique: Rub out and remember / Slap the board). Ss listen, repeat in chorus/individual, take notes, remember and write.
       - **Activity 2. Look, listen and repeat:** (or Listen and tick/match) *Aims, *Procedure (Ss look at pictures a, b, answer guiding questions; T plays audio twice; Ss repeat in chorus and pairs; T checks pronunciation). Full character dialogue included!
       - **Activity 3. Listen, point and say:** (or Read and complete) *Aims, *Procedure, *Structures (model question and answer highlighted).
     * **3. Practice: (6-8’)**
       - \`*Drill pictures\` with pictures a, b, c, d descriptions.
       - Elicit and check comprehension, run through model sentences.
       - Practise: Teacher - Ss, Group A - Group B, pair work.
       - A few pairs perform in front of class.
     * **4. Production: (5-7’)**
       - **Activity 4. Let’s talk.** (or Role-play / Survey / Find someone who...).
       - Free communicative speaking practice using real student information.
     * **5. Fun corner and wrap-up: (4-5’)**
       - Engaging educational game (Pass the teddy bears / Lucky windows / Roll the dice / Guessing game).
       - Clear rules, examples of student exchanges during game.
       - Teacher gives feedback, praises winner.
       - Homework instructions.
   - Section **## D. ADJUSTMENTS (if necessary):**
     \`………………………………………………………………………………………….…..……\`
     (Include project preparation note if at end of unit).
   - Bottom signature block:
     Date line, \`BGH duyệt\` (School Board Approver) and \`Người soạn bài\` (Teacher).

TARGET LESSON INPUT INFORMATION:
- School: ${schoolName}
- Teacher: ${teacherName}
- Grade: English ${gradeNumber} (Cấp: ${data.schoolLevel})
- Textbook: Tiếng Anh Global Success (Bộ sách Kết nối tri thức với cuộc sống - GDPT 2018)
- Unit / Theme: ${unitTitle}
- Lesson Name / Focus: ${lessonTitle}
- Week: ${weekText} | Period: ${periodText}
- Prep Date: ${prepDate} | Teach Date: ${teachDate}
- Content / Teacher's notes: ${data.knowledgeContent || 'Follow the standard curriculum of the unit and lesson in Tiếng Anh Global Success.'}
- Additional requirements: ${data.additionalRequirements || 'Include engaging games and communicative practice.'}

OUTPUT FORMAT (GENERATE EXACTLY THIS COMPLETE STRUCTURE WITHOUT ANY EXTRA CONVERSATIONAL TEXT):
\`\`\`text
${schoolName}                                         Lesson plan - English ${gradeNumber}
***************************************************************************************************
Teacher: ${teacherName}                                School year: 2026-2027
${weekText}                                           Preparing date: ${prepDate}
${periodText}                                         Teaching date: ${teachDate}

                              ${unitTitle}
                              ${lessonTitle}
\`\`\`

## A. OBJECTIVES:
By the end of the lesson, Ss will be able to:
### 1. Knowledge:
- ...
- Vocabulary: ...
- Structures:
  A: ...
  B: ...
### 2. Competences:
- Communication and collaboration: ...
- Self-control and independent learning: ...
- Critical thinking and creativity: ...
${(isNlsEnabled || isAiEnabled) ? `- Digital competence & AI literacy (Decision 2422/QĐ-BGDĐT & Circular 02/2025): ...` : ''}
### 3. Attitudes/ Qualities:
- ...
${isQpanEnabled ? `- Integration of National Defense & Security Education (under Circular 08/2024/TT-BGDĐT): ...` : ''}

## B. TEACHING AIDS:
- Teacher: website hoclieu.vn, laptop, textbook (Tiếng Anh ${gradeNumber} - Global Success), lesson plan, TV...
- Students: Students’ book Page ..., notebooks, school things.

## C. PROCEDURES:
| Teacher’s activities | Students’ activities |
| :--- | :--- |
| **1. Warm-up (and review): (4’)**<br/>...<br/>***Aims:** ...<br/>***Procedure:**<br/>- ... | - ... |
| **2. Presentation. (15’)**<br/>**Activity 1. Vocabulary.**<br/>***Aims:** ...<br/>***Procedure:**<br/>- T elicits the new words:<br/>+ ... : ... (picture)<br/>- T models (3 times).<br/>- T writes the words on the board.<br/>- Checking: Rub out and remember | - Ss listen and answer.<br/>- Ss listen and repeat:<br/>+ Choral repetition (3 times).<br/>+ Individual repetition (3 ss).<br/>- Ss take note.<br/>- Ss look, remember and write. |
| **Activity 2. Look, listen and repeat:**<br/>***Aims:** ...<br/>***Procedure:**<br/>- Have Ss look at Pictures a and b...<br/>- Play audio twice...<br/>- Have Ss practice... | **1. Look, listen and repeat.**<br/>- Look at the pictures and get to know the characters...<br/>+ In picture a:<br/>...<br/>+ In picture b:<br/>...<br/>- Ss listen and repeat in chorus.<br/>- Ss work in pairs to practice. |
| **Activity 3. Listen, point and say.**<br/>***Aims:** ...<br/>***Procedure:**<br/>***Structures:**<br/>- T introduces new structures:<br/>**A: ...**<br/>**B: ...** | **2. Listen, point and say.**<br/>- Ss look at the picture and answer.<br/>- Ss repeat to the structures. |
| **3. Practice: (7’)**<br/>***Drill pictures**<br/>- Elicit and check comprehension...<br/>- Practise: Teacher - Ss, Group A - Group B, Pair work. | - Ss look, listen and repeat:<br/>+ Picture a: ...<br/>+ Picture b: ...<br/>- Pairs of Ss point at pictures and say. |
| **4. Production: (6’)**<br/>**Activity 4. Let’s talk.**<br/>***Aims:** ...<br/>***Procedure:**<br/>- ... | **3. Let’s talk.**<br/>- Ss work in pairs to ask and answer with real facts... |
| **5. Fun corner and wrap-up: (4’)**<br/>**Game: [Game name]**<br/>- ... | - Ss listen and play the game.<br/>Ex:<br/>A: ...<br/>B: ... |

## D. ADJUSTMENTS (if necessary):
………………………………………………………………………………………….…..……
* Preparation for the project: ...

\`\`\`text
                                                   Ngày 10 tháng 9 năm 2026
      BGH duyệt                                       Người soạn bài
\`\`\`
`;
};

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
   Hỗ trợ cấu hình cấu trúc đề, menu chọn dạng đề & đa dạng các dạng bài
   cho từng kỹ năng (Nghe điền từ, nghe chọn ABC, đọc cloze test, viết lại câu...)
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

  const formatOption = ENGLISH_EXAM_FORMATS.find((f) => f.id === data.examFormat);

  // Parse skill configuration
  const cfg = data.englishSkillsConfig;
  const lTypes = cfg?.listeningTypes && cfg.listeningTypes.length > 0
    ? cfg.listeningTypes
    : ['listen_gap_fill', 'listen_mcq'];
  const rTypes = cfg?.readingTypes && cfg.readingTypes.length > 0
    ? cfg.readingTypes
    : ['read_mcq', 'read_cloze', 'read_true_false'];
  const wTypes = cfg?.writingTypes && cfg.writingTypes.length > 0
    ? cfg.writingTypes
    : ['write_rewrite', 'write_reorder', 'write_paragraph'];
  const lfTypes = cfg?.languageFocusTypes && cfg.languageFocusTypes.length > 0
    ? cfg.languageFocusTypes
    : ['lang_phonetics', 'lang_vocab_grammar'];
  const includeSpeaking = Boolean(cfg?.includeSpeaking);
  const sTypes = includeSpeaking && cfg?.speakingTypes && cfg.speakingTypes.length > 0
    ? cfg.speakingTypes
    : [];

  const allSkillTypesMap = new Map<string, { label: string; englishLabel: string; desc: string }>();
  ENGLISH_SKILL_CATEGORIES.forEach((cat) => {
    cat.types.forEach((t) => {
      allSkillTypesMap.set(t.id, { label: t.label, englishLabel: t.englishLabel, desc: t.desc });
    });
  });

  const formatSkillTypeList = (typeIds: string[]) => {
    return typeIds
      .map((id) => {
        const item = allSkillTypesMap.get(id);
        return item ? `    * ${item.englishLabel} (${item.label})` : `    * ${id}`;
      })
      .join('\n');
  };

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
6.  **Question Distribution Compliance (MANDATORY):**
    You MUST strictly build the exam according to the question distribution below configured by the teacher. The matrix, specification, exam questions, and answer key must accurately correspond to these question types and point values.

**EXAM SPECIFICATIONS & FORMAT:**
- **Level:** ${data.schoolLevel} ${isPrimary ? '(Governed by Circular 27/2020/TT-BGDĐT)' : '(Governed by Dispatch 7991/BGDĐT-GDTrH)'}
- **Grade:** ${data.grade}
- **Textbook Series:** ${data.textbook}
- **Exam Duration:** ${data.duration} minutes
- **Exam Format Type:** ${formatOption ? formatOption.label : 'Standard Formatted Test'}
${formatOption ? `\n**Format Structure Guidelines:**\n${formatOption.promptGuideline}\n` : ''}

**QUESTION DISTRIBUTION (MANDATORY):**
- **Multiple Choice:** ${data.multipleChoice.questionCount} questions, ${data.multipleChoice.score} points (${data.multipleChoice.percentage}%)
- **True / False:** ${data.trueFalse.questionCount} questions, ${data.trueFalse.score} points (${data.trueFalse.percentage}%)
- **Short Answer / Gap-Fill:** ${data.shortAnswer.questionCount} questions, ${data.shortAnswer.score} points (${data.shortAnswer.percentage}%)
- **Essay / Writing:** ${data.essay.questionCount} questions, ${data.essay.score} points (${data.essay.percentage}%)
- **Total Score:** 10.0 points (100%)

**MANDATORY VARIETY OF QUESTION TYPES FOR EACH SKILL (USER EXPLICIT REQUIREMENT):**
The exam MUST NOT consist of only a single question type per skill. You MUST implement multiple diverse question formats for each section as specified below:

1. **LISTENING SECTION:**
   - MUST include a complete, realistic **Audio Script / Listening Transcript** printed in the teacher's instructions or answer key, featuring natural dialogs/announcements matching grade ${data.grade}.
   - The Listening section MUST include the following specific question formats:
${formatSkillTypeList(lTypes)}
     *(Example: incorporate both gap-filling with missing words/numbers AND multiple-choice A/B/C/D or True/False).*

2. **LANGUAGE FOCUS (PHONETICS, VOCABULARY & GRAMMAR):**
   - The Language Focus section MUST include the following specific question formats:
${formatSkillTypeList(lfTypes)}
     *(Example: include pronunciation/stress odd-one-out, vocabulary in context, and everyday communicative exchanges).*

3. **READING COMPREHENSION SECTION:**
   - MUST include high-quality, engaging reading passage(s) closely linked to ${data.textbook} themes for grade ${data.grade}.
   - The Reading section MUST include the following specific question formats:
${formatSkillTypeList(rTypes)}
     *(Example: include both a Cloze test / gap-fill passage with word box AND reading comprehension multiple-choice questions A/B/C/D or True/False).*

4. **WRITING SECTION:**
   - The Writing section MUST include the following specific question formats:
${formatSkillTypeList(wTypes)}
     *(Example: include sentence reordering to make complete sentences, sentence rewriting with given cues keeping the same meaning, and short paragraph/email writing).*

${includeSpeaking ? `5. **SPEAKING SECTION (OPTIONAL COMPONENT):**
   - Provide clear teacher prompt cards and student task descriptions covering:
${formatSkillTypeList(sTypes)}
     *(Include interactive questions, topic presentation prompts, and concise grading criteria).*
` : ''}

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
Please generate the complete exam package now, adhering strictly to the above specifications, question distribution, and diverse skill-specific question formats.
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
   - Tích hợp Khung nội dung giáo dục Trí tuệ nhân tạo cho học sinh phổ thông (Quyết định số 2422/QĐ-BGDĐT của Bộ GD&ĐT)
   - Tích hợp Lồng ghép Giáo dục Quốc phòng và An ninh (Thông tư số 08/2024/TT-BGDĐT ngày 15/05/2024 của Bộ GD&ĐT)
   - TỰ ĐỘNG GEN KÈM BỘ MÃ CHUẨN XÁC: NLS (VD: NLS 1.1.CB1a) & AI (VD: 4.A1.3; 4.C2.3)
   - Trình bày hoạt động dạy học dạng BẢNG 2 CỘT: HOẠT ĐỘNG CỦA GV | HOẠT ĐỘNG CỦA HS
   ========================================================================== */
export const createLessonPlanPrompt = (data: LessonPlanFormData): string => {
  if (isEnglishSubject(data.subject)) {
    return createEnglishLessonPlanPrompt(data);
  }

  const schoolName = data.schoolName || 'Trường TH Sơn Hạ';
  const teacherName = data.teacherName || 'Vũ Hoàng Hiệp';
  const approverName = data.approverName || 'Nguyễn Thị Pô Ly';
  const weekText = data.week ? (data.week.toUpperCase().startsWith('TUẦN') ? data.week.toUpperCase() : `TUẦN ${data.week}`) : 'TUẦN 04';
  const prepDate = data.prepDate || '20/09/2026';
  const teachDate = data.teachDate || '28-29-30/09/2026';
  const classes = data.classesTaught || `${data.grade}A, ${data.grade}B, ${data.grade}C`;
  const periodText = data.periodNumber ? (data.periodNumber.startsWith('(') ? data.periodNumber : `(${data.periodNumber})`) : `(tiết 1)`;

  const isDigitalGeneralEnabled = data.integrateDigitalCompetence !== false;
  const isQpanEnabled = Boolean(
    isDigitalGeneralEnabled &&
    data.integrateQpan08 !== false &&
    data.qpanThemes &&
    data.qpanThemes.length > 0
  );
  const isAiEnabled = Boolean(
    isDigitalGeneralEnabled &&
    (data.integrateAi2422 ?? true)
  );
  const isNlsEnabled = Boolean(
    isDigitalGeneralEnabled &&
    data.digitalDomains &&
    data.digitalDomains.length > 0
  );

  const aiStrandsText = data.aiStrands && data.aiStrands.length > 0
    ? data.aiStrands.join('; ')
    : 'Mạch A: Tư duy lấy con người làm trung tâm & Mạch C: Kỹ thuật và Ứng dụng AI vào học tập';

  const suggestedToolsText = data.suggestedAiTools && data.suggestedAiTools.length > 0
    ? data.suggestedAiTools.join(', ')
    : 'Ứng dụng AI nhận diện thực tế, Canva Magic Edu, trợ lý AI tra cứu an toàn';

  const qpanThemesText = data.qpanThemes && data.qpanThemes.length > 0
    ? data.qpanThemes.join('; ')
    : 'Tình yêu quê hương, đất nước, niềm tự hào dân tộc, chủ quyền biển đảo và ý thức chấp hành pháp luật';

  const qpanMethodsText = data.qpanMethods && data.qpanMethods.length > 0
    ? data.qpanMethods.join(', ')
    : 'Quan sát tranh ảnh/video tư liệu, kể chuyện lịch sử, liên hệ thực tế';

  return `
Bạn là một chuyên gia sư phạm tiểu học và phổ thông tại Việt Nam, am hiểu sâu sắc về:
1. Bộ sách giáo khoa **Kết nối tri thức với cuộc sống**.
2. **Thông tư số 02/2025/TT-BGDĐT** (Khung năng lực số) & **Công văn số 3456/BGDĐT-GDPT** (Hướng dẫn triển khai giáo dục năng lực số).
3. **Quyết định số 2422/QĐ-BGDĐT của Bộ GD&ĐT** (Khung nội dung giáo dục Trí tuệ nhân tạo AI cho học sinh phổ thông).${isQpanEnabled ? `
4. **Thông tư số 08/2024/TT-BGDĐT ngày 15/05/2024 của Bộ GD&ĐT** (Hướng dẫn lồng ghép nội dung giáo dục quốc phòng và an ninh trong trường tiểu học, trường trung học cơ sở và trường phổ thông có nhiều cấp học).` : ''}

Nhiệm vụ của bạn là soạn một **KẾ HOẠCH BÀI DẠY (KHBD / GIÁO ÁN)** hoàn chỉnh, chi tiết, chuyên nghiệp theo **ĐÚNG FORMAT ĐỊNH DẠNG MẪU VĂN BẢN THỰC TẾ** sau đây:

${isNlsEnabled && isAiEnabled ? `**QUY TẮC BẮT BUỘC VỀ BỘ MÃ NĂNG LỰC SỐ (TT 02/2025) & GIÁO DỤC TRÍ TUỆ NHÂN TẠO (QĐ 2422/QĐ-BGDĐT):**
Bạn PHẢI TỰ ĐỘNG TẠO ra mục Năng lực số và Giáo dục Trí tuệ nhân tạo KÈM THEO BỘ MÃ CHUẨN HÓA CỦA BỘ GD&ĐT:
- Ví dụ mẫu chuẩn:
\`Tích hợp Năng lực số (theo TT 02/2025: NLS 1.1.CB1a) & Giáo dục Trí tuệ nhân tạo (theo QĐ 2422/QĐ-BGDĐT: Mã 4.A1.3; 4.C2.3) [nội dung hành vi nhiệm vụ cụ thể gắn với bài học, tra cứu, ứng dụng công cụ số/AI, bảo vệ môi trường, liên hệ thực tế, con người kiểm soát và làm chủ công nghệ]\`.
- Quy cách mã NLS (theo Thông tư 02/2025/TT-BGDĐT và CV 3456/BGDĐT-GDPT):
  * Lớp 1, 2, 3 (Cơ bản 1): \`NLS 1.1.CB1a\`, \`NLS 1.2.CB1b\`, \`NLS 2.1.CB1a\`, \`NLS 4.1.CB1a\`, \`NLS 6.1.CB1a\`...
  * Lớp 4, 5 (Cơ bản 2): \`NLS 1.1.CB2a\`, \`NLS 2.1.CB2a\`, \`NLS 3.1.CB2a\`, \`NLS 4.1.CB2b\`, \`NLS 5.2.CB2a\`, \`NLS 6.2.CB2b\`...
  * THCS / THPT: \`NLS 1.1.TC1a\`, \`NLS 2.1.TC2a\`, \`NLS 6.1.NC1a\`...
- Quy cách mã AI (theo Khung nội dung giáo dục Trí tuệ nhân tạo Quyết định số 2422/QĐ-BGDĐT):
  * Cấu trúc mã: \`[Khối].A[x].[y]; [Khối].B[x].[y]; [Khối].C[x].[y]; [Khối].D[x].[y]\`
  * Mạch kiến thức đã chọn: ${aiStrandsText}
  * Khối 3: \`3.A1.2; 3.B1.1; 3.C1.1\`
  * Khối 4: \`4.A1.3; 4.B1.2; 4.C2.3\`
  * Khối 5: \`5.A2.1; 5.C1.2; 5.D1.2\`
  * Khối THCS (6-9): \`7.A1.2; 8.B2.1; 9.C1.3; 9.D1.1\`
  * Khối THPT (10-12): \`11.A2.2; 11.B2.1; 12.C1.4; 12.D1.1\`` : isNlsEnabled ? `**QUY TẮC BẮT BUỘC VỀ BỘ MÃ NĂNG LỰC SỐ (TT 02/2025/TT-BGDĐT):**
Bạn PHẢI TỰ ĐỘNG TẠO ra mục Năng lực số KÈM THEO BỘ MÃ NLS CHUẨN HÓA (theo TT 02/2025 và CV 3456/BGDĐT-GDPT).
(LƯU Ý: Người dùng đã tắt tính năng Giáo dục AI QĐ 2422. TUYỆT ĐỐI KHÔNG sinh mã AI như 4.A1.3 hay đề cập đến QĐ 2422).` : isAiEnabled ? `**QUY TẮC BẮT BUỘC VỀ GIÁO DỤC TRÍ TUỆ NHÂN TẠO (QĐ 2422/QĐ-BGDĐT):**
Bạn PHẢI TỰ ĐỘNG TẠO ra mục Giáo dục AI KÈM THEO BỘ MÃ AI CHUẨN HÓA (theo QĐ 2422/QĐ-BGDĐT).
(LƯU Ý: Người dùng đã tắt tính năng Năng lực số TT 02/2025. TUYỆT ĐỐI KHÔNG sinh mã NLS).` : `**LƯU Ý QUAN TRỌNG VỀ NĂNG LỰC SỐ & TRÍ TUỆ NHÂN TẠO (AI):**
Người dùng ĐÃ TẮT tính năng tích hợp Năng lực số (TT 02/2025) và Giáo dục AI (QĐ 2422).
TUYỆT ĐỐI KHÔNG tạo mục riêng cho Năng lực số / AI, không sinh các bộ mã NLS hay mã AI trong giáo án này.`}

${isQpanEnabled ? `**QUY TẮC BẮT BUỘC VỀ LỒNG GHÉP GIÁO DỤC QUỐC PHÒNG VÀ AN NINH (THÔNG TƯ 08/2024/TT-BGDĐT):**
Bạn PHẢI LỒNG GHÉP NỘI DUNG GIÁO DỤC QUỐC PHÒNG VÀ AN NINH theo đúng Điều 2, Điều 3, Điều 4 Thông tư số 08/2024/TT-BGDĐT:
- Chủ đề lồng ghép cho ${data.grade}: ${qpanThemesText}
- Phương pháp & hình thức lồng ghép: ${qpanMethodsText}
- Yêu cầu thực hiện theo Điều 4 TT 08: Lồng ghép tự nhiên, ngắn gọn, dễ nhớ, dễ hiểu; phát huy tính sáng tạo và cảm xúc tích cực của học sinh; không làm thay đổi thời lượng hay làm nặng nề bài học; kết hợp hình ảnh minh họa, liên hệ thực tế đời sống.
- Lồng ghép GDQP&AN BẮT BUỘC xuất hiện ở:
  1. Mục \`I. YÊU CẦU CẦN ĐẠT\` -> \`4. Phẩm chất\` (Phẩm chất Yêu nước & Trách nhiệm): Ghi rõ \`Lồng ghép GDQP&AN (theo Thông tư 08/2024/TT-BGDĐT): [nêu hành vi/tình cảm cụ thể phù hợp với bài học và khối lớp]\`.
  2. Mục \`II. ĐỒ DÙNG DẠY HỌC\`: Nêu rõ hình ảnh, bản đồ, video tư liệu hoặc bài hát hỗ trợ lồng ghép QP-AN.
  3. Trong bảng \`III. HOẠT ĐỘNG DẠY HỌC\`: Lồng ghép rõ ràng vào ít nhất 1 hoạt động (Khám phá hoặc Vận dụng) với chú thích: \`*(Lồng ghép GDQP&AN theo TT 08/2024: [nội dung GV hướng dẫn và HS thực hiện/cảm nhận/liên hệ])*\`.` : `**QUY TẮC BẮT BUỘC: ĐÃ TẮT LỒNG GHÉP GIÁO DỤC QUỐC PHÒNG VÀ AN NINH (GDQP-AN):**
NGƯỜI DÙNG ĐÃ TẮT TÍNH NĂNG TÍCH HỢP GIÁO DỤC QUỐC PHÒNG VÀ AN NINH (THÔNG TƯ 08/2024/TT-BGDĐT).
YÊU CẦU BẮT BUỘC TUÂN THỦ 100%:
1. TUYỆT ĐỐI KHÔNG đề cập đến "Thông tư 08/2024/TT-BGDĐT" hay "GDQP&AN", "GDQP-AN", "quốc phòng", "an ninh", "chủ quyền biển đảo" trong bất kỳ phần nào của giáo án này.
2. Mục I. YÊU CẦU CẦN ĐẠT -> Phẩm chất yêu nước: Chỉ nêu tình cảm yêu quý quê hương, đất nước, yêu gia đình, thầy cô, bạn bè một cách tự nhiên theo đặc thù môn học; TUYỆT ĐỐI KHÔNG ghi chú thích hoặc lồng ghép GDQP&AN.
3. Mục II. ĐỒ DÙNG DẠY HỌC: Chỉ chuẩn bị đồ dùng phục vụ bài học bình thường; TUYỆT ĐỐI KHÔNG ghi tranh ảnh, video lồng ghép GDQP&AN.
4. Mục III. HOẠT ĐỘNG DẠY HỌC: TUYỆT ĐỐI KHÔNG chèn bất kỳ dòng chú thích nào dạng \`*(Lồng ghép GDQP&AN theo TT 08/2024...)*\`. Kế hoạch bài dạy phải hoàn toàn thuần túy chuyên môn nội dung bài học.`}

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
${isNlsEnabled || isAiEnabled ? `### 3. Năng lực số & Giáo dục Trí tuệ nhân tạo (AI)
- ${
  isNlsEnabled && isAiEnabled
    ? 'Tích hợp Năng lực số (theo TT 02/2025/TT-BGDĐT: NLS 1.1.CB1a) & Giáo dục Trí tuệ nhân tạo (theo QĐ 2422/QĐ-BGDĐT: Mã 4.A1.3; 4.C2.3) [Tự động tạo câu mô tả chuẩn chỉ rõ nội dung kiến thức bài học học sinh tra cứu, ứng dụng AI/thiết bị số an toàn, có trách nhiệm, hiểu AI là công cụ hỗ trợ và bảo vệ môi trường học đường/gia đình].'
    : isNlsEnabled
    ? 'Tích hợp Năng lực số (theo TT 02/2025/TT-BGDĐT: NLS 1.1.CB1a) [Tự động tạo câu mô tả chuẩn chỉ rõ nội dung học sinh tra cứu, khai thác dữ liệu, an toàn số phù hợp bài học].'
    : 'Giáo dục Trí tuệ nhân tạo (theo QĐ 2422/QĐ-BGDĐT: Mã 4.A1.3) [Tự động tạo câu mô tả học sinh nhận biết ứng dụng AI, sử dụng AI có đạo đức, con người làm chủ].'
}
### 4. Phẩm chất` : `### 3. Phẩm chất`}
- Phẩm chất yêu nước: Tự hào về truyền thống tốt đẹp của quê hương, đất nước${isQpanEnabled ? `; **Lồng ghép GDQP&AN (theo Thông tư 08/2024/TT-BGDĐT)**: (Ghi rõ nội dung học sinh nhận thức về tình yêu quê hương, đất nước, lòng biết ơn người có công, tự hào về Quân đội nhân dân, Công an nhân dân, hoặc ý thức về chủ quyền biển đảo/an ninh trật tự theo bài học)` : '; có ý thức giữ gìn, bảo vệ các giá trị văn hóa và môi trường xung quanh'}.
- Phẩm chất chăm chỉ: Tích cực tham gia vào các hoạt động học tập, hoàn thành nhiệm vụ được giao.
- Phẩm chất trách nhiệm: Có ý thức bảo quản thiết bị, đồ dùng học tập; sử dụng công nghệ an toàn; có ý thức chấp hành kỷ luật, nội quy trường lớp và quy định của pháp luật.

## II. ĐỒ DÙNG DẠY HỌC
- **Giáo viên chuẩn bị:** Giáo án điện tử PowerPoint, máy tính, máy chiếu, thiết bị dạy học, trò chơi học tập (Quizizz/blooket...)${isAiEnabled ? `, công cụ AI minh họa (theo QĐ 2422/QĐ-BGDĐT: ${suggestedToolsText})` : ''}${isQpanEnabled ? `, tư liệu/hình ảnh/video lồng ghép GDQP&AN (theo TT 08/2024/TT-BGDĐT: ${qpanMethodsText})` : ''}, phiếu học tập.
- **Học sinh chuẩn bị:** Sách giáo khoa Kết nối tri thức với cuộc sống, vở ghi bài, bút, nháp...

## III. HOẠT ĐỘNG DẠY HỌC
(BẮT BUỘC TRÌNH BÀY DƯỚI DẠNG BẢNG MARKDOWN 2 CỘT CHUẨN XÁC NHƯ SAU:)

| HOẠT ĐỘNG CỦA GIÁO VIÊN | HOẠT ĐỘNG CỦA HỌC SINH |
| :--- | :--- |
| **1. Khởi động, kết nối.**<br/>- Ổn định lớp.<br/>- Yêu cầu: Thực hiện trò chơi "Ai nhanh hơn" (hoặc Đố bạn / video tương tác / câu đố). Luật chơi: Trả lời nhanh và đúng các câu hỏi trắc nghiệm đã cho.<br/>- GV nhận xét, tuyên dương, dẫn dắt vào bài mới. | - HS báo cáo sĩ số lớp.<br/>- HS tham gia trò chơi, trả lời câu hỏi.<br/>- HS chú ý lắng nghe. |
| **2. Hình thành kiến thức mới / Khám phá**<br/>**2.1. [Tên hoạt động khám phá 1]**<br/>- GV giới thiệu nội dung bài tập / chia sẻ tranh ảnh, video / nêu câu hỏi cho học sinh thảo luận nhóm...<br/>${isNlsEnabled || isAiEnabled ? `*(Tích hợp ${isNlsEnabled ? 'NLS TT 02/2025: NLS 1.1.CB1a' : ''}${isNlsEnabled && isAiEnabled ? ' & ' : ''}${isAiEnabled ? 'Giáo dục AI QĐ 2422/QĐ-BGDĐT: 4.A1.3' : ''}: HS tìm kiếm, nhận biết ứng dụng công nghệ/AI...)*<br/>` : ''}- GV nhận xét tuyên dương, chốt kiến thức: ... | - HS chú ý quan sát tranh/video.<br/>- HS thảo luận nhóm làm bài tập vào phiếu bài tập.<br/>- Đại diện các nhóm báo cáo kết quả thảo luận.<br/>- HS khác nhận xét, bổ sung.<br/>- Lắng nghe rút kinh nghiệm. |
| **2.2. [Tên hoạt động khám phá 2]**<br/>- GV nêu câu hỏi / nhiệm vụ tìm hiểu tiếp theo mở rộng kiến thức...<br/>${isQpanEnabled ? `*(Lồng ghép GDQP&AN theo Thông tư 08/2024/TT-BGDĐT: GV khéo léo liên hệ nội dung bài học với truyền thống yêu nước, hình ảnh bộ đội, công an, bảo vệ an ninh trật tự, chủ quyền biển đảo hoặc ý thức giữ gìn kỷ luật học đường...)*<br/>` : ''}- GV nhận xét chung, tuyên dương và chốt kiến thức: ... | - HS đọc yêu cầu bài, quan sát và suy nghĩ.<br/>- HS thảo luận và trả lời câu hỏi.<br/>- Đại diện trình bày, nhóm khác nhận xét.<br/>- HS lắng nghe, tự hào và chốt nội dung. |
| **3. Luyện tập**<br/>- GV hướng dẫn học sinh làm bài tập ... trong SGK Kết nối tri thức.<br/>- Yêu cầu học sinh làm việc cá nhân / nhóm đôi để hoàn thành.<br/>- GV quan sát, giúp đỡ học sinh gặp khó khăn.<br/>- GV nhận xét tuyên dương học sinh làm tốt. | - HS nghe hướng dẫn của giáo viên làm bài tập.<br/>- HS thực hành làm bài tập vào vở hoặc phiếu bài tập.<br/>- Một số HS trình bày trước lớp.<br/>- HS khác nhận xét bài làm của bạn. |
| **4. Vận dụng**<br/>- GV giao nhiệm vụ vận dụng thực tế đời sống...<br/>${isNlsEnabled || isAiEnabled ? `*(Tích hợp ${isNlsEnabled ? 'NLS TT 02/2025' : ''}${isNlsEnabled && isAiEnabled ? ' & ' : ''}${isAiEnabled ? 'Giáo dục AI QĐ 2422/QĐ-BGDĐT: 4.C2.3' : ''}: Hướng dẫn HS tra cứu/chia sẻ kiến thức, áp dụng AI an toàn, đạo đức và trách nhiệm, kiểm chứng thông tin, bảo vệ môi trường, ứng dụng vào gia đình/trường học...)*<br/>` : ''}${isQpanEnabled ? `*(Lồng ghép GDQP&AN theo TT 08/2024: Dặn dò học sinh phát huy tinh thần đoàn kết, tương trợ bạn bè, chấp hành tốt an toàn giao thông, yêu quý quê hương đất nước...)*<br/>` : ''}- GV nhận xét tiết dạy, tuyên dương tinh thần học tập.<br/>- Dặn dò về nhà chuẩn bị cho bài học tiếp theo. | - HS lắng nghe nhiệm vụ vận dụng.<br/>- HS chia sẻ với bạn về hiểu biết và ý tưởng thực tế.<br/>- HS ghi nhớ nhiệm vụ về nhà và chuẩn bị bài mới.<br/>- Lắng nghe, rút kinh nghiệm. |

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

/* ==========================================================================
   PROMPT TẠO SLIDE BÀI GIẢNG ĐIỆN TỬ DÀNH CHO HỌC SINH TỪ KẾ HOẠCH BÀI DẠY
   ========================================================================== */
export const createSlidePresentationPrompt = (
  formData: LessonPlanFormData,
  lessonPlanContent: string
): { prompt: string; systemInstruction: string } => {
  const systemInstruction = `Bạn là chuyên gia sư phạm hàng đầu và chuyên gia thiết kế bài giảng điện tử tương tác (Interactive Presentation Designer) cho giáo viên Việt Nam.
Nhiệm vụ của bạn là đọc bản Kế hoạch bài dạy (Giáo án) được cung cấp, sau đó chuyển hóa toàn bộ nội dung thành BỘ SLIDE BÀI GIẢNG ĐIỆN TỬ THỰC THỤ DÙNG ĐỂ CHIẾU CHO HỌC SINH HỌC TRÊN LỚP.

QUY TẮC CỐT LÕI (BẮT BUỘC):
1. ĐỐI TƯỢNG XEM SLIDE LÀ HỌC SINH (Học sinh nhìn lên máy chiếu/tivi tương tác):
   - TUYỆT ĐỐI KHÔNG sao chép nguyên văn ngôn từ hành chính giáo án (như "Giáo viên chuyển giao nhiệm vụ", "Học sinh báo cáo sản phẩm", "Tiêu chí cần đạt phẩm chất...").
   - Mọi câu chữ phải hướng đến học sinh: Ngắn gọn, súc tích, sinh động, dễ hiểu, font chữ to rõ.
2. CẤU TRÚC BÀI GIẢNG PHẢI ĐẦY ĐỦ 4 HOẠT ĐỘNG SƯ PHẠM VÀ TÍNH TƯƠNG TÁC CAO:
   - Slide Khởi động: Phải là một trò chơi hoặc câu đố, hình ảnh tình huống kích thích tò mò của học sinh.
   - Slide Khám phá: Tóm lược kiến thức trọng tâm thành các từ khóa nổi bật, gạch đầu dòng ngắn gọn (15-20 từ/bullet), có hộp "Ghi nhớ" cốt lõi.
   - Slide Luyện tập: Bài tập thảo luận nhóm, câu hỏi tình huống có hướng dẫn rõ ràng.
   - Slide Trò chơi trắc nghiệm (Củng cố): Có câu hỏi trắc nghiệm tương tác với 4 phương án A, B, C, D để giáo viên tổ chức cho cả lớp tham gia chọn đáp án.
   - Slide Vận dụng & Dặn dò: Thử thách sáng tạo và lời dặn dò thân thiện.
3. SPEAKER NOTES (LỜI THOẠI CỦA GIÁO VIÊN):
   - Mỗi slide phải có trường "speakerNotes": Gợi ý chi tiết lời dẫn dắt, câu hỏi gợi mở của giáo viên khi đang chiếu slide này trên lớp.
${isEnglishSubject(formData.subject) ? `4. QUY ĐỊNH CHO MÔN TIẾNG ANH (ENGLISH):
   - TOÀN BỘ nội dung hiển thị trên slide (title, tag, subtitle, bullets, highlightBox, quizQuestion, quizOptions, meta) BẮT BUỘC PHẢI VIẾT HOÀN TOÀN BẰNG TIẾNG ANH (English).
   - speakerNotes có thể viết bằng tiếng Anh hoặc song ngữ gợi ý cho giáo viên.` : ''}
5. ĐỊNH DẠNG ĐẦU RA:
   - BẮT BUỘC trả về DUY NHẤT một khối JSON hợp lệ nằm trong \`\`\`json ... \`\`\`.
   - TUYỆT ĐỐI không có bất kỳ văn bản nào ngoài khối JSON.`;

  const prompt = `Dưới đây là thông tin và bản Kế hoạch bài dạy đã soạn:

- MÔN HỌC: ${formData.subject}
- KHỐI LỚP: ${formData.grade} (Cấp: ${formData.schoolLevel})
- TÊN BÀI HỌC: ${formData.lessonName}
- GIÁO VIÊN: ${formData.teacherName || 'Thầy/Cô giáo'}
- TRƯỜNG: ${formData.schoolName || 'Trường học'}
- BỘ SÁCH: Kết nối tri thức với cuộc sống
- THỜI LƯỢNG: ${formData.durationInPeriods || 1} tiết
- NĂNG LỰC SỐ & GIÁO DỤC AI: Thông tư 02/2025/TT-BGDĐT & Quyết định 2422/QĐ-BGDĐT (${(formData.digitalDomains || []).join(', ') || 'Khai thác dữ liệu, an toàn số, ứng dụng AI có đạo đức'})

NỘI DUNG KẾ HOẠCH BÀI DẠY (GIÁO ÁN GỐC):
"""
${lessonPlanContent}
"""

HÃY THIẾT KẾ BỘ SLIDE BÀI GIẢNG TRÊN LỚP DÀNH CHO HỌC SINH VÀ TRẢ VỀ THEO CẤU TRÚC JSON SAU:
\`\`\`json
{
  "lessonTitle": "${formData.lessonName}",
  "subject": "${formData.subject}",
  "grade": "${formData.grade}",
  "slides": [
    {
      "type": "cover",
      "tag": "BÀI GIẢNG ĐIỆN TỬ",
      "title": "${formData.lessonName}",
      "subtitle": "${formData.subject} - ${formData.grade}",
      "meta": "Giáo viên: ${formData.teacherName || 'Thầy/Cô giáo'} | ${formData.schoolName || ''}",
      "speakerNotes": "Chào mừng các em học sinh đến với tiết học hôm nay!"
    },
    {
      "type": "goals",
      "tag": "MỤC TIÊU BÀI HỌC",
      "title": "Sau bài học này, chúng mình sẽ:",
      "bullets": [
        "Mục tiêu cụ thể 1 học sinh sẽ làm được (dễ hiểu, không dùng từ ngữ hành chính)",
        "Mục tiêu cụ thể 2",
        "Mục tiêu cụ thể 3 (Kỹ năng số hoặc ứng dụng thực tế)"
      ],
      "highlightBox": "🌟 Cùng nhau tích cực thảo luận để nhận được nhiều sao học tập nhé!",
      "speakerNotes": "Giáo viên giới thiệu ngắn gọn các điều thú vị các em sẽ khám phá trong bài học."
    },
    {
      "type": "warmup",
      "tag": "HOẠT ĐỘNG 1: KHỞI ĐỘNG",
      "title": "🎮 [Tên trò chơi khởi động hấp dẫn]",
      "bullets": [
        "Câu hỏi hoặc tình huống khơi gợi sự tò mò của học sinh",
        "Gợi ý trả lời hoặc quy luật trò chơi"
      ],
      "highlightBox": "❓ Thử thách: [Câu hỏi mở màn để dẫn vào bài mới]",
      "speakerNotes": "Tổ chức cho học sinh chơi trò chơi hoặc quan sát hình ảnh để dẫn vào bài mới."
    },
    {
      "type": "knowledge",
      "tag": "HOẠT ĐỘNG 2: KHÁM PHÁ KIẾN THỨC",
      "title": "🔍 [Tên nội dung kiến thức trọng tâm 1]",
      "bullets": [
        "Kiến thức cốt lõi 1 (viết ngắn gọn, có từ khóa nổi bật)",
        "Kiến thức cốt lõi 2",
        "Ví dụ minh họa cụ thể, gần gũi với học sinh"
      ],
      "highlightBox": "💡 Ghi nhớ: [Quy tắc, công thức hoặc định nghĩa quan trọng nhất cần ghi vở]",
      "speakerNotes": "Giáo viên phân tích ví dụ, hướng dẫn học sinh rút ra ghi nhớ."
    },
    {
      "type": "knowledge",
      "tag": "HOẠT ĐỘNG 2: KHÁM PHÁ KIẾN THỨC (TIẾP THEO)",
      "title": "🔍 [Tên nội dung kiến thức trọng tâm 2 hoặc Ứng dụng số]",
      "bullets": [
        "Nội dung kiến thức tiếp theo hoặc thao tác thực hành",
        "Điểm cần lưu ý để tránh sai sót",
        "Liên hệ thực tế"
      ],
      "highlightBox": "🌐 Kỹ năng số: [Hướng dẫn an toàn số hoặc sử dụng công cụ]",
      "speakerNotes": "Hướng dẫn học sinh thảo luận nhóm để làm rõ kiến thức."
    },
    {
      "type": "practice",
      "tag": "HOẠT ĐỘNG 3: LUYỆN TẬP & THỰC HÀNH",
      "title": "⚡ [Thực hành: Tên thử thách luyện tập]",
      "bullets": [
        "Nhiệm vụ 1: Bài tập cụ thể trong SGK hoặc phiếu bài tập",
        "Nhiệm vụ 2: Thảo luận nhóm đôi hoặc nhóm 4",
        "Thời gian thực hiện: 5 - 7 phút"
      ],
      "highlightBox": "👥 Hoạt động nhóm: Cùng bạn bàn thảo luận và ghi kết quả vào bảng nhóm!",
      "speakerNotes": "Giáo viên phát lệnh thảo luận nhóm, đi quanh lớp quan sát và hỗ trợ."
    },
    {
      "type": "quiz",
      "tag": "CỦNG CỐ KIẾN THỨC",
      "title": "🏆 Thử Tài Nhanh Mắt Nhanh Trí",
      "question": "[Nội dung một câu hỏi trắc nghiệm tương tác hay về bài học]?",
      "options": [
        "A. [Phương án A]",
        "B. [Phương án B]",
        "C. [Phương án C]",
        "D. [Phương án D]"
      ],
      "correctAnswer": "A",
      "explanation": "[Lời giải thích súc tích khen ngợi học sinh khi trả lời đúng]",
      "speakerNotes": "Mời học sinh giơ tay chọn đáp án hoặc dùng thẻ A, B, C, D để biểu quyết."
    },
    {
      "type": "application",
      "tag": "HOẠT ĐỘNG 4: VẬN DỤNG & SÁNG TẠO",
      "title": "🌟 Em Là Nhà Sáng Tạo Nhí",
      "bullets": [
        "Nhiệm vụ vận dụng kiến thức vào thực tế đời sống gia đình hoặc trường học",
        "Cách thực hiện sản phẩm hoặc hành động cụ thể"
      ],
      "highlightBox": "🎯 Thử thách tuần này: [Hành động thực tế học sinh cần làm sau bài học]",
      "speakerNotes": "Khuyến khích học sinh vận dụng kiến thức để giải quyết vấn đề thực tế."
    },
    {
      "type": "homework",
      "tag": "DẶN DÒ VỀ NHÀ",
      "title": "🏡 Dặn Dò & Chuẩn Bị Cho Tiết Tới",
      "bullets": [
        "1. Ôn lại nội dung bài học trong SGK",
        "2. Hoàn thành phiếu học tập / Vở bài tập",
        "3. Chuẩn bị trước bài học cho tiết sau"
      ],
      "highlightBox": "🎉 Khen ngợi cả lớp đã có một tiết học rất sôi nổi và hiệu quả!",
      "speakerNotes": "Nhận xét tinh thần học tập của cả lớp và chào tạm biệt học sinh."
    }
  ]
}
\`\`\``;

  return { prompt, systemInstruction };
};
