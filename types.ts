export interface QuestionTypeDistribution {
    percentage: number;
    score: number;
    questionCount: number;
}

export interface EnglishSkillsConfig {
    listeningTypes?: string[];
    speakingTypes?: string[];
    readingTypes?: string[];
    writingTypes?: string[];
    languageFocusTypes?: string[];
    includeSpeaking?: boolean;
}

export interface ExamFormData {
    schoolLevel: string;
    schoolName?: string;
    subject: string;
    grade: string;
    textbook: string; // Cố định: "Kết nối tri thức với cuộc sống"
    knowledgeContent: string;
    duration: number;
    multipleChoice: QuestionTypeDistribution;
    trueFalse: QuestionTypeDistribution;
    shortAnswer: QuestionTypeDistribution;
    essay: QuestionTypeDistribution;
    additionalRequirements: string;
    examFormat?: string;
    englishSkillsConfig?: EnglishSkillsConfig;
}

export interface ExamResult {
    matrix: string;
    specification: string;
    exam: string;
    answerKey: string;
}

export interface SavedExamItem {
    id: string;
    createdAt: string;
    title: string;
    formData: ExamFormData;
    result: ExamResult;
}

/* =========================================================
   TYPES DÀNH CHO: SOẠN KẾ HOẠCH BÀI DẠY (GIÁO ÁN)
   Format chuẩn hóa theo mẫu văn bản người dùng cung cấp
   Áp dụng Bộ sách Kết nối tri thức với cuộc sống
   Tích hợp Khung năng lực số (TT 02/2025/TT-BGDĐT, CV 3456/BGDĐT-GDPT)
   Tích hợp Khung nội dung giáo dục Trí tuệ nhân tạo AI (Quyết định số 2422/QĐ-BGDĐT)
   Tích hợp Lồng ghép Giáo dục Quốc phòng và An ninh (Thông tư số 08/2024/TT-BGDĐT)
   Kèm bộ mã chuẩn: NLS (VD: NLS 1.1.CB1a) & AI (VD: 4.A1.3; 4.C2.3)
   ========================================================= */

export interface LessonPlanFormData {
    schoolLevel: string; // 'Tiểu học' | 'THCS' | 'THPT'
    grade: string;
    subject: string;
    textbook: string; // Cố định: "Kết nối tri thức với cuộc sống"
    themeName?: string; // Ví dụ: "CHỦ ĐỀ 1: CÔNG NGHỆ VÀ ĐỜI SỐNG"
    lessonName: string; // Ví dụ: "BÀI 2: MỘT SỐ LOẠI HOA, CÂY CẢNH PHỔ BIẾN"
    periodNumber?: string; // Ví dụ: "tiết 1" hoặc "tiết 2"
    durationInPeriods: number; // Số tiết (1, 2...)
    week: string; // Ví dụ: "TUẦN 04"
    prepDate?: string; // Ngày soạn (VD: 20/09/2026)
    teachDate?: string; // Ngày dạy (VD: 28-29-30/09/2026)
    classesTaught?: string; // Lớp dạy (VD: 4A, 4B, 4C, 4D)
    schoolName?: string; // Trường (VD: Trường TH Sơn Hạ)
    teacherName?: string; // Giáo viên (VD: Vũ Hoàng Hiệp)
    approverName?: string; // Người ký duyệt (VD: Nguyễn Thị Pô Ly)
    knowledgeContent: string;
    integrateDigitalCompetence: boolean;
    digitalDomains: string[]; // Các miền năng lực số từ TT 02/2025
    integrateAi2422?: boolean; // Tích hợp Khung nội dung giáo dục Trí tuệ nhân tạo theo QĐ 2422/QĐ-BGDĐT
    aiStrands?: string[]; // 4 mạch kiến thức AI theo QĐ 2422 (Mạch A, Mạch B, Mạch C, Mạch D)
    suggestedAiTools?: string[]; // Công cụ AI đề xuất (Canva Magic, AutoDraw, Teachable Machine, Gemini/ChatGPT Edu...)
    aiPedagogyFocus?: string; // Trọng tâm sư phạm AI (Đạo đức AI, kiểm chứng thông tin, con người làm chủ)
    integrateQpan08?: boolean; // Tích hợp GDQP&AN theo Thông tư số 08/2024/TT-BGDĐT
    qpanThemes?: string[]; // Chủ đề lồng ghép GDQP&AN theo TT 08
    qpanMethods?: string[]; // Hình thức/phương pháp lồng ghép (kể chuyện, tranh ảnh tư liệu, video, liên hệ...)
    pedagogicalMethod?: string; // Dạy học giải quyết vấn đề, STEM, Trạm, Mảnh ghép, Trò chơi...
    additionalRequirements?: string;
}

export interface SavedLessonPlanItem {
    id: string;
    createdAt: string;
    title: string;
    formData: LessonPlanFormData;
    content: string;
}
