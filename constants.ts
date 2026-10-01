export const SCHOOL_LEVELS: string[] = ["Tiểu học", "THCS", "THPT"];

export const GRADES_BY_LEVEL: Record<string, string[]> = {
    "Tiểu học": ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"],
    "THCS": ["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"],
    "THPT": ["Lớp 10", "Lớp 11", "Lớp 12"],
};

export const SUBJECTS_BY_LEVEL: Record<string, string[]> = {
    "Tiểu học": [
        "Tiếng Việt",
        "Toán",
        "Ngoại ngữ 1 (Tiếng Anh)",
        "Tự nhiên và Xã hội",
        "Khoa học",
        "Lịch sử và Địa lí",
        "Tin học",
        "Công nghệ",
        "Đạo đức",
        "Hoạt động trải nghiệm",
        "Mĩ thuật",
        "Âm nhạc"
    ],
    "THCS": [
        "Toán",
        "Ngữ văn",
        "Ngoại ngữ 1 (Tiếng Anh)",
        "Khoa học tự nhiên",
        "Lịch sử và Địa lí",
        "Tin học",
        "Công nghệ",
        "Giáo dục công dân",
        "Hoạt động trải nghiệm, hướng nghiệp",
        "Vật lí",
        "Hóa học",
        "Sinh học",
        "Lịch sử",
        "Địa lí"
    ],
    "THPT": [
        "Toán",
        "Ngữ văn",
        "Ngoại ngữ 1 (Tiếng Anh)",
        "Vật lí",
        "Hóa học",
        "Sinh học",
        "Lịch sử",
        "Địa lí",
        "Giáo dục kinh tế và pháp luật",
        "Tin học",
        "Công nghệ",
        "Hoạt động trải nghiệm, hướng nghiệp"
    ]
};

export const GENERAL_TEXTBOOKS: string[] = [
    "Kết nối tri thức với cuộc sống"
];

export const TEXTBOOKS_BY_SUBJECT: Record<string, string[]> = {
    "Ngoại ngữ 1 (Tiếng Anh)": [
        "Global Success (Kết nối tri thức)"
    ],
};

/* =====================================================================
   CĂN CỨ THÔNG TƯ 02/2025/TT-BGDĐT & CÔNG VĂN 3456/BGDĐT-GDPT
   KHUNG NĂNG LỰC SỐ (NLS) CHO HỌC SINH PHỔ THÔNG
   ===================================================================== */

export const DIGITAL_COMPETENCE_DOMAINS = [
    {
        id: "domain1",
        name: "Miền 1: Khai thác dữ liệu và thông tin",
        desc: "Duyệt, tìm kiếm, đánh giá và quản lý dữ liệu, thông tin và nội dung số an toàn, đáng tin cậy."
    },
    {
        id: "domain2",
        name: "Miền 2: Giao tiếp và hợp tác trong môi trường số",
        desc: "Tương tác, chia sẻ tài nguyên, hợp tác số, tuân thủ quy tắc ứng xử trên mạng và quản lý danh tính số."
    },
    {
        id: "domain3",
        name: "Miền 3: Sáng tạo nội dung số",
        desc: "Tạo lập, chỉnh sửa nội dung đa phương tiện, tích hợp kiến thức số, tôn trọng bản quyền số và lập trình cơ bản."
    },
    {
        id: "domain4",
        name: "Miền 4: An toàn số",
        desc: "Bảo vệ thiết bị số, dữ liệu cá nhân, quyền riêng tư; giữ gìn sức khỏe thể chất, tinh thần và bảo vệ môi trường."
    },
    {
        id: "domain5",
        name: "Miền 5: Giải quyết vấn đề",
        desc: "Xác định nhu cầu, khắc phục lỗi kỹ thuật, lựa chọn công cụ số phù hợp và sử dụng sáng tạo công nghệ số."
    },
    {
        id: "domain6",
        name: "Miền 6: Ứng dụng Trí tuệ nhân tạo (AI)",
        desc: "Hiểu biết nguyên lý AI/GenAI, sử dụng AI có trách nhiệm và đạo đức trong học tập, đánh giá phản biện công cụ AI."
    }
];

export const DIGITAL_LEVEL_BY_GRADE: Record<string, string> = {
    "Lớp 1": "Cơ bản 1 (Nhiệm vụ đơn giản, có sự hướng dẫn của giáo viên)",
    "Lớp 2": "Cơ bản 1 (Nhiệm vụ đơn giản, có sự hướng dẫn của giáo viên)",
    "Lớp 3": "Cơ bản 1 (Nhiệm vụ đơn giản, có sự hướng dẫn của giáo viên)",
    "Lớp 4": "Cơ bản 2 (Nhiệm vụ đơn giản, tự chủ và có hướng dẫn khi cần thiết)",
    "Lớp 5": "Cơ bản 2 (Nhiệm vụ đơn giản, tự chủ và có hướng dẫn khi cần thiết)",
    "Lớp 6": "Trung cấp 1 (Nhiệm vụ xác định rõ ràng, thường xuyên; tự chủ hoàn toàn)",
    "Lớp 7": "Trung cấp 1 (Nhiệm vụ xác định rõ ràng, thường xuyên; tự chủ hoàn toàn)",
    "Lớp 8": "Trung cấp 2 (Nhiệm vụ rõ ràng, không thường xuyên; độc lập theo nhu cầu cá nhân)",
    "Lớp 9": "Trung cấp 2 (Nhiệm vụ rõ ràng, không thường xuyên; độc lập theo nhu cầu cá nhân)",
    "Lớp 10": "Nâng cao 1 (Nhiệm vụ và vấn đề đa dạng; có khả năng hướng dẫn người khác)",
    "Lớp 11": "Nâng cao 1 (Nhiệm vụ và vấn đề đa dạng; có khả năng hướng dẫn người khác)",
    "Lớp 12": "Nâng cao 1 (Nhiệm vụ và vấn đề đa dạng; có khả năng hướng dẫn người khác)"
};

export const PEDAGOGICAL_METHODS: string[] = [
    "Dạy học khám phá và giải quyết vấn đề",
    "Dạy học tích hợp giáo dục STEM / STEAM",
    "Phương pháp Bàn tay nặn bột",
    "Dạy học theo dự án (PBL)",
    "Dạy học hợp tác theo nhóm & Kỹ thuật mảnh ghép",
    "Kỹ thuật khăn trải bàn & Trạm học tập",
    "Ứng dụng trò chơi học tập và công nghệ số tương tác (Kahoot, Quizizz, Padlet, Canva, GenAI)"
];
