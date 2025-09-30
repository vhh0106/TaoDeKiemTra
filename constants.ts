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
        "Đạo đức",
    ],
    "THCS": [
        "Công nghệ",
        "Địa lí",
        "Giáo dục công dân",
        "Hóa học",
        "Khoa học tự nhiên",
        "Lịch sử",
        "Lịch sử và Địa lí",
        "Ngữ văn",
        "Ngoại ngữ 1 (Tiếng Anh)",
        "Sinh học",
        "Tin học",
        "Toán",
        "Vật lí",
    ],
    "THPT": [
        "Công nghệ",
        "Địa lí",
        "Giáo dục công dân",
        "Giáo dục kinh tế và pháp luật",
        "Hóa học",
        "Lịch sử",
        "Ngữ văn",
        "Ngoại ngữ 1 (Tiếng Anh)",
        "Sinh học",
        "Tin học",
        "Toán",
        "Vật lí",
    ]
};

export const GENERAL_TEXTBOOKS: string[] = [
    "Cánh diều",
    "Kết nối tri thức",
    "Chân trời sáng tạo"
];

export const TEXTBOOKS_BY_SUBJECT: Record<string, string[]> = {
    "Ngoại ngữ 1 (Tiếng Anh)": [
        "Global Success",
        "i-Learn Smart World",
        "English Discovery",
        "Right On!",
        "Friends Plus",
        "Explore English",
        "Explore New Worlds",
        "Bright"
    ],
};