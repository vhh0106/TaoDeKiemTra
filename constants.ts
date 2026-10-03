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

/* =====================================================================
   CĂN CỨ QUYẾT ĐỊNH SỐ 2422/QĐ-BGDĐT CỦA BỘ GIÁO DỤC VÀ ĐÀO TẠO
   KHUNG NỘI DUNG GIÁO DỤC TRÍ TUỆ NHÂN TẠO (AI) CHO HỌC SINH PHỔ THÔNG
   (Áp dụng 4 mạch kiến thức chính & 2 giai đoạn giáo dục)
   ===================================================================== */

export interface AiEducationStrand {
    id: string;
    codePrefix: string;
    name: string;
    title: string;
    desc: string;
    focusTopics: string[];
    sampleIndicators: Record<string, string>;
}

export const AI_EDUCATION_STRANDS_QDD2422: AiEducationStrand[] = [
    {
        id: "strandA",
        codePrefix: "A",
        name: "Mạch A: Tư duy lấy con người làm trung tâm (Human-centred mindset)",
        title: "Tư duy lấy con người làm trung tâm",
        desc: "Khẳng định AI là công cụ phục vụ đời sống con người; học sinh làm chủ công nghệ, hiểu rõ nhu cầu và đưa ra quyết định thay vì phụ thuộc máy móc.",
        focusTopics: [
            "Xác định nhu cầu con người trong bài học",
            "Đánh giá tính phù hợp và giới hạn của giải pháp AI",
            "Con người giữ vai trò kiểm soát và chịu trách nhiệm"
        ],
        sampleIndicators: {
            "Tiểu học": "3.A1.2 (Lớp 3); 4.A1.3 (Lớp 4); 5.A2.1 (Lớp 5)",
            "THCS": "6.A1.1 (Lớp 6); 7.A1.2 (Lớp 7); 8.A2.1 (Lớp 8); 9.A1.3 (Lớp 9)",
            "THPT": "10.A1.1 (Lớp 10); 11.A2.2 (Lớp 11); 12.A1.2 (Lớp 12)"
        }
    },
    {
        id: "strandB",
        codePrefix: "B",
        name: "Mạch B: Đạo đức Trí tuệ nhân tạo (AI Ethics)",
        title: "Đạo đức Trí tuệ nhân tạo & An toàn",
        desc: "Nhận diện vấn đề bản quyền, quyền riêng tư, trung thực học thuật (chống sao chép gian lận), an toàn dữ liệu cá nhân và trách nhiệm công dân số.",
        focusTopics: [
            "Bảo vệ dữ liệu cá nhân và thông tin trường học",
            "Tôn trọng bản quyền tác giả và trung thực học thuật",
            "Kiểm chứng thông tin, nhận biết thiên vị và rủi ro giả mạo"
        ],
        sampleIndicators: {
            "Tiểu học": "3.B1.1 (Lớp 3); 4.B1.2 (Lớp 4); 5.B2.1 (Lớp 5)",
            "THCS": "6.B1.1 (Lớp 6); 7.B2.1 (Lớp 7); 8.B1.2 (Lớp 8); 9.B2.2 (Lớp 9)",
            "THPT": "10.B1.2 (Lớp 10); 11.B2.1 (Lớp 11); 12.B1.3 (Lớp 12)"
        }
    },
    {
        id: "strandC",
        codePrefix: "C",
        name: "Mạch C: Kỹ thuật và Ứng dụng AI (AI Techniques & Applications)",
        title: "Kỹ thuật và Ứng dụng AI vào học tập",
        desc: "Hiểu nguyên lý cơ bản của AI (nhận dạng âm thanh/hình ảnh, xử lý ngôn ngữ GenAI); khai thác công cụ AI hỗ trợ tra cứu, minh họa và giải quyết bài tập.",
        focusTopics: [
            "Ứng dụng AI nhận diện đồ vật, cây cỏ, hình ảnh",
            "Trợ lý AI hỗ trợ tóm tắt, giải bài tập và tra cứu",
            "Thực hành với các công cụ tạo nội dung thông minh"
        ],
        sampleIndicators: {
            "Tiểu học": "3.C1.1 (Lớp 3); 4.C2.3 (Lớp 4); 5.C1.2 (Lớp 5)",
            "THCS": "6.C1.2 (Lớp 6); 7.C2.1 (Lớp 7); 8.C1.3 (Lớp 8); 9.C2.2 (Lớp 9)",
            "THPT": "10.C1.3 (Lớp 10); 11.C2.2 (Lớp 11); 12.C1.4 (Lớp 12)"
        }
    },
    {
        id: "strandD",
        codePrefix: "D",
        name: "Mạch D: Thiết kế và giải quyết vấn đề với AI (AI System Design)",
        title: "Thiết kế hệ thống & Sáng tạo với AI",
        desc: "Phát triển kỹ năng đặt câu lệnh (Prompt Engineering), thu thập dữ liệu - huấn luyện mô hình đơn giản và sáng tạo sản phẩm học tập số liên môn.",
        focusTopics: [
            "Kỹ năng đặt câu hỏi và tinh chỉnh câu lệnh (Prompt)",
            "Thử nghiệm tương tác với hệ thống AI",
            "Dự án sáng tạo sản phẩm học tập có ứng dụng AI"
        ],
        sampleIndicators: {
            "Tiểu học": "4.D1.1 (Lớp 4); 5.D1.2 (Lớp 5)",
            "THCS": "6.D1.1 (Lớp 6); 7.D1.2 (Lớp 7); 8.D2.1 (Lớp 8); 9.D1.2 (Lớp 9)",
            "THPT": "10.D1.2 (Lớp 10); 11.D2.1 (Lớp 11); 12.D1.3 (Lớp 12)"
        }
    }
];

export const AI_STAGES_BY_LEVEL: Record<string, { stageName: string; description: string; evaluationNote: string }> = {
    "Tiểu học": {
        stageName: "Giai đoạn giáo dục cơ bản (Tiểu học)",
        description: "Học sinh trải nghiệm các ứng dụng AI đơn giản, trực quan để hình thành khái niệm ban đầu và nhận biết vai trò của AI; rèn luyện ý thức bảo vệ dữ liệu cá nhân.",
        evaluationNote: "Không tổ chức bài thi hoặc đầu điểm riêng cho AI; đánh giá quá trình thông qua sự hứng thú, thảo luận và thao tác có hướng dẫn của GV."
    },
    "THCS": {
        stageName: "Giai đoạn giáo dục cơ bản (THCS)",
        description: "Học sinh sử dụng công cụ AI để tạo sản phẩm số và giải quyết vấn đề học tập; hình thành tư duy phản biện, kiểm chứng thông tin và trách nhiệm công dân số.",
        evaluationNote: "Lồng ghép vào đánh giá quá trình và sản phẩm học tập; chú trọng ý thức trung thực học thuật và không sao chép nguyên văn từ AI."
    },
    "THPT": {
        stageName: "Giai đoạn giáo dục định hướng nghề nghiệp (THPT)",
        description: "Học sinh khám phá kỹ thuật, thiết kế và tối ưu prompt, thực hiện dự án STEM/AI giải quyết bài toán môn học; làm chủ công cụ và hiểu tác động xã hội.",
        evaluationNote: "Đánh giá thông qua báo cáo dự án, sản phẩm học tập số, kỹ năng phản biện giải pháp AI và tuân thủ đạo đức thuật toán."
    }
};

export const RECOMMENDED_AI_TOOLS: Record<string, { name: string; tag: string; desc: string }[]> = {
    "Tiểu học": [
        { name: "AutoDraw / Quick, Draw!", tag: "Thị giác máy tính", desc: "AI nhận diện nét vẽ và gợi ý hình ảnh sinh động." },
        { name: "Teachable Machine", tag: "Máy học trực quan", desc: "Huấn luyện nhận dạng hình ảnh con vật, cây cối đơn giản." },
        { name: "Canva Magic Studio (Edu)", tag: "Sáng tạo số", desc: "Tạo tranh ảnh minh họa an toàn cho học sinh tiểu học." },
        { name: "Google Lens / Dịch hình ảnh", tag: "Tra cứu thực tế", desc: "Nhận diện loài hoa, cây cảnh, đồ vật xung quanh." }
    ],
    "THCS": [
        { name: "Gemini / ChatGPT có định hướng", tag: "GenAI Ngôn ngữ", desc: "Tra cứu, tóm tắt và gợi ý ý tưởng học tập có kiểm chứng." },
        { name: "Quizizz / Kahoot AI", tag: "Tương tác lớp học", desc: "Trò chơi trắc nghiệm và ôn tập kiến thức nhanh." },
        { name: "Scratch AI Extension", tag: "Lập trình AI", desc: "Lập trình khối lệnh tích hợp nhận dạng giọng nói, khuôn mặt." },
        { name: "Phần mềm mô phỏng ảo / PhET", tag: "Thí nghiệm số", desc: "Mô phỏng hiện tượng tự nhiên và khoa học." }
    ],
    "THPT": [
        { name: "Gemini Advanced / Claude / Copilot", tag: "Trợ lý nghiên cứu", desc: "Hỗ trợ lập dàn ý, phản biện luận điểm, phân tích số liệu." },
        { name: "Prompt Engineering Studio", tag: "Tối ưu câu lệnh", desc: "Rèn luyện kỹ năng thiết kế prompt đa bước và kiểm thử." },
        { name: "Google Colab / Python AI", tag: "STEM & Khoa học", desc: "Xử lý dữ liệu thực nghiệm và xây dựng mô hình dự đoán." },
        { name: "Canva / Figma AI", tag: "Thiết kế sản phẩm", desc: "Thiết kế poster, infographic báo cáo dự án học tập." }
    ]
};

/* =====================================================================
   CĂN CỨ THÔNG TƯ SỐ 08/2024/TT-BGDĐT CỦA BỘ GIÁO DỤC VÀ ĐÀO TẠO
   HƯỚNG DẪN LỒNG GHÉP NỘI DUNG GIÁO DỤC QUỐC PHÒNG VÀ AN NINH
   TRONG TRƯỜNG TIỂU HỌC, TRUNG HỌC CƠ SỞ VÀ TRƯỜNG PHỔ THÔNG NHIỀU CẤP HỌC
   (Ban hành ngày 15/05/2024, có hiệu lực từ 01/07/2024)
   ===================================================================== */

export const QPAN_FOCUS_SUBJECTS_BY_LEVEL: Record<string, string[]> = {
    "Tiểu học": [
        "Tiếng Việt",
        "Tự nhiên và Xã hội",
        "Đạo đức",
        "Lịch sử và Địa lí",
        "Nghệ thuật (Âm nhạc, Mĩ thuật)",
        "Hoạt động trải nghiệm"
    ],
    "THCS": [
        "Ngữ văn",
        "Giáo dục công dân",
        "Lịch sử và Địa lí",
        "Nghệ thuật (Âm nhạc, Mĩ thuật)",
        "Nội dung giáo dục địa phương",
        "Hoạt động trải nghiệm, hướng nghiệp"
    ],
    "THPT": [
        "Giáo dục quốc phòng và an ninh (Chính khóa)",
        "Ngữ văn",
        "Lịch sử",
        "Địa lí",
        "Giáo dục kinh tế và pháp luật",
        "Hoạt động trải nghiệm, hướng nghiệp"
    ]
};

export const QPAN_THEMES_BY_GRADE: Record<string, { id: string; title: string; desc: string; focusCode: string }[]> = {
    "Lớp 1": [
        {
            id: "qpan_1_1",
            title: "Tình yêu quê hương, yêu hòa bình, yêu Tổ quốc Việt Nam XHCN",
            desc: "Bồi dưỡng cảm xúc yêu gia đình, quê hương, mái trường và niềm tự hào Tổ quốc Việt Nam.",
            focusCode: "QPAN 1.1"
        },
        {
            id: "qpan_1_2",
            title: "Hình ảnh Quân đội nhân dân và Công an nhân dân Việt Nam",
            desc: "Giới thiệu hình ảnh chú bộ đội, chiến sĩ công an canh giữ bình yên cho đất nước và nhân dân.",
            focusCode: "QPAN 1.2"
        },
        {
            id: "qpan_1_3",
            title: "Di tích lịch sử và danh lam thắng cảnh của địa phương",
            desc: "Khám phá các di tích lịch sử, địa chỉ đỏ và cảnh đẹp quê hương gần gũi với học sinh.",
            focusCode: "QPAN 1.3"
        }
    ],
    "Lớp 2": [
        {
            id: "qpan_2_1",
            title: "Tinh thần đoàn kết toàn dân tộc & Tấm gương các chiến sĩ cách mạng",
            desc: "Giáo dục về sự hy sinh to lớn của các chiến sĩ trong kháng chiến chống Pháp và chống Mỹ.",
            focusCode: "QPAN 2.1"
        },
        {
            id: "qpan_2_2",
            title: "Nhiệm vụ bảo vệ Tổ quốc & Giữ gìn trật tự an toàn xã hội của QĐND và CAND",
            desc: "Nhận biết công việc ngày đêm bảo vệ biên cương, vùng trời, vùng biển và trật tự phố phường của bộ đội, công an.",
            focusCode: "QPAN 2.2"
        },
        {
            id: "qpan_2_3",
            title: "Yêu thương, chia sẻ, giúp đỡ và bảo vệ nhau trong học tập, cuộc sống",
            desc: "Hình thành tinh thần tương thân tương ái, kỷ luật nề nếp và đoàn kết trong tập thể lớp học.",
            focusCode: "QPAN 2.3"
        }
    ],
    "Lớp 3": [
        {
            id: "qpan_3_1",
            title: "Truyền thống chống giặc ngoại xâm của dân tộc Việt Nam",
            desc: "Giới thiệu truyền thống đánh giặc kiên cường, bất khuất của ông cha qua các thời kỳ lịch sử.",
            focusCode: "QPAN 3.1"
        },
        {
            id: "qpan_3_2",
            title: "Tấm gương dũng cảm thiếu niên, nhi đồng & Bà Mẹ Việt Nam anh hùng",
            desc: "Noi gương anh Kim Đồng, chị Võ Thị Sáu, em Lê Văn Tám... và tri ân các Bà Mẹ VNAH trong sự nghiệp cứu nước.",
            focusCode: "QPAN 3.2"
        },
        {
            id: "qpan_3_3",
            title: "Học sinh tham gia bảo vệ môi trường địa phương và trường học",
            desc: "Nâng cao ý thức giữ gìn vệ sinh, trồng và bảo vệ cây xanh, không xả rác, phòng ngừa thiên tai.",
            focusCode: "QPAN 3.3"
        }
    ],
    "Lớp 4": [
        {
            id: "qpan_4_1",
            title: "Bản đồ hành chính Việt Nam & Chủ quyền Hoàng Sa, Trường Sa",
            desc: "Khẳng định chủ quyền không thể tách rời của Việt Nam đối với hai quần đảo Hoàng Sa và Trường Sa trên bản đồ.",
            focusCode: "QPAN 4.1"
        },
        {
            id: "qpan_4_2",
            title: "Bài hát, câu chuyện và hình ảnh về biển, đảo thiêng liêng của Tổ quốc",
            desc: "Tìm hiểu vẻ đẹp, tiềm năng và niềm tự hào biển đảo quê hương qua âm nhạc, thơ ca và hội họa.",
            focusCode: "QPAN 4.2"
        },
        {
            id: "qpan_4_3",
            title: "Ý thức chấp hành pháp luật về trật tự, an toàn giao thông",
            desc: "Tuân thủ đèn tín hiệu, đi bộ đúng phần đường, đội mũ bảo hiểm, phòng tránh tai nạn giao thông học đường.",
            focusCode: "QPAN 4.3"
        }
    ],
    "Lớp 5": [
        {
            id: "qpan_5_1",
            title: "Chủ quyền, quyền chủ quyền biển, đảo của Việt Nam",
            desc: "Hiểu biết về vùng biển, thềm lục địa, hải đảo thiêng liêng của đất nước và trách nhiệm bảo vệ toàn vẹn lãnh thổ.",
            focusCode: "QPAN 5.1"
        },
        {
            id: "qpan_5_2",
            title: "Khai thác tài nguyên, hải sản gắn với bảo đảm quốc phòng, an ninh biển",
            desc: "Ngư dân bám biển vươn khơi là những cột mốc sống khẳng định chủ quyền biển đảo của Tổ quốc.",
            focusCode: "QPAN 5.2"
        },
        {
            id: "qpan_5_3",
            title: "Tấm gương dũng cảm của cán bộ, chiến sĩ QĐND và CAND trong cứu hộ, cứu nạn",
            desc: "Hình ảnh bộ đội, công an quên mình phòng chống bão lũ, thiên tai, hỏa hoạn và cứu hộ nhân dân.",
            focusCode: "QPAN 5.3"
        }
    ],
    "Lớp 6": [
        {
            id: "qpan_6_1",
            title: "Lịch sử và truyền thống vẻ vang của Quân đội nhân dân & Công an nhân dân",
            desc: "Tìm hiểu quá trình xây dựng, chiến đấu và trưởng thành của lực lượng vũ trang nhân dân Việt Nam anh hùng.",
            focusCode: "QPAN 6.1"
        },
        {
            id: "qpan_6_2",
            title: "Địa danh lịch sử gắn với các cuộc kháng chiến chống giặc ngoại xâm",
            desc: "Tìm hiểu các chiến khu, căn cứ cách mạng, di tích lịch sử chiến thắng oanh liệt của quân và dân ta.",
            focusCode: "QPAN 6.2"
        },
        {
            id: "qpan_6_3",
            title: "Nghệ thuật quân sự mưu trí, sáng tạo của quân và dân ta trong đánh giặc",
            desc: "Chiến thuật chiến tranh nhân dân, lấy ít địch nhiều, lấy yếu thắng mạnh, mưu trí dũng cảm trong lịch sử.",
            focusCode: "QPAN 6.3"
        }
    ],
    "Lớp 7": [
        {
            id: "qpan_7_1",
            title: "Hoạt động, hình ảnh bảo vệ chủ quyền biển, đảo Việt Nam",
            desc: "Tìm hiểu đời sống, nhiệm vụ trực chiến bảo vệ chủ quyền của các chiến sĩ Hải quân, Cảnh sát biển, Kiểm ngư.",
            focusCode: "QPAN 7.1"
        },
        {
            id: "qpan_7_2",
            title: "Bảo vệ an toàn thông tin cá nhân khi tham gia mạng xã hội",
            desc: "Cảnh giác trước thông tin xấu độc, không chia sẻ dữ liệu nhạy cảm, phòng chống lừa đảo trên không gian mạng.",
            focusCode: "QPAN 7.2"
        },
        {
            id: "qpan_7_3",
            title: "Chính sách tự do tín ngưỡng, tôn giáo và đại đoàn kết toàn dân tộc",
            desc: "Tôn trọng quyền tự do tín ngưỡng, giữ gìn sự hòa hợp tôn giáo, không để kẻ xấu kích động chia rẽ dân tộc.",
            focusCode: "QPAN 7.3"
        }
    ],
    "Lớp 8": [
        {
            id: "qpan_8_1",
            title: "Lòng tự hào, tự tôn dân tộc và sức mạnh khối đại đoàn kết toàn dân",
            desc: "Phát huy truyền thống yêu nước, tự tôn dân tộc, chung sức đồng lòng vượt qua thử thách lịch sử.",
            focusCode: "QPAN 8.1"
        },
        {
            id: "qpan_8_2",
            title: "Cột mốc quốc giới & Nhiệm vụ bảo vệ chủ quyền lãnh thổ, biên giới quốc gia",
            desc: "Tìm hiểu hệ thống mốc quốc giới trên đất liền, đường biên giới và ý thức bảo vệ từng tấc đất quê hương.",
            focusCode: "QPAN 8.2"
        },
        {
            id: "qpan_8_3",
            title: "Tác hại của tệ nạn xã hội & Trách nhiệm phòng chống bạo lực học đường",
            desc: "Nói không với ma túy, cờ bạc, thuốc lá điện tử; xây dựng môi trường học đường văn minh, không bạo lực.",
            focusCode: "QPAN 8.3"
        }
    ],
    "Lớp 9": [
        {
            id: "qpan_9_1",
            title: "Hậu quả chiến tranh xâm lược & Khát vọng hòa bình của dân tộc Việt Nam",
            desc: "Khắc ghi mất mát hy sinh của các thế hệ đi trước, trân trọng nền độc lập, tự do và hòa bình hôm nay.",
            focusCode: "QPAN 9.1"
        },
        {
            id: "qpan_9_2",
            title: "Phát triển kinh tế, xã hội gắn chặt với củng cố quốc phòng, an ninh",
            desc: "Xây dựng đất nước giàu mạnh đi đôi với nâng cao tiềm lực quốc phòng, bảo vệ Tổ quốc từ sớm, từ xa.",
            focusCode: "QPAN 9.2"
        },
        {
            id: "qpan_9_3",
            title: "Bài ca truyền thống vẻ vang của lực lượng vũ trang nhân dân Việt Nam",
            desc: "Cảm thụ và lan tỏa tinh thần cách mạng qua các ca khúc bất hủ ca ngợi người lính và lực lượng công an.",
            focusCode: "QPAN 9.3"
        },
        {
            id: "qpan_9_4",
            title: "Trách nhiệm của học sinh trong sự nghiệp xây dựng và bảo vệ Tổ quốc",
            desc: "Chăm chỉ học tập, rèn luyện thể lực, gương mẫu chấp hành pháp luật, sẵn sàng cống hiến cho Tổ quốc.",
            focusCode: "QPAN 9.4"
        }
    ],
    "Lớp 10": [
        {
            id: "qpan_10_1",
            title: "Truyền thống đánh giặc giữ nước & Lực lượng vũ trang nhân dân",
            desc: "Nghệ thuật quân sự Việt Nam, tổ chức biên chế Quân đội nhân dân và Công an nhân dân.",
            focusCode: "QPAN 10.1"
        },
        {
            id: "qpan_10_2",
            title: "Bảo vệ an ninh quốc gia & Giữ gìn trật tự an toàn xã hội trên không gian mạng",
            desc: "Luật An ninh mạng, phòng ngừa tội phạm công nghệ cao và bảo vệ nền tảng tư tưởng.",
            focusCode: "QPAN 10.2"
        }
    ],
    "Lớp 11": [
        {
            id: "qpan_11_1",
            title: "Bảo vệ chủ quyền lãnh thổ, biên giới quốc gia và hải đảo",
            desc: "Luật Biển Việt Nam, Luật Biên phòng Việt Nam, xây dựng nền quốc phòng toàn dân vững mạnh.",
            focusCode: "QPAN 11.1"
        },
        {
            id: "qpan_11_2",
            title: "Phòng chống chiến lược 'Diễn biến hòa bình' và tệ nạn xã hội học đường",
            desc: "Nhận diện âm mưu chống phá, xây dựng bản lĩnh chính trị và lối sống lành mạnh cho thanh thiếu niên.",
            focusCode: "QPAN 11.2"
        }
    ],
    "Lớp 12": [
        {
            id: "qpan_12_1",
            title: "Nghĩa vụ quân sự & Trách nhiệm thanh niên xây dựng, bảo vệ Tổ quốc",
            desc: "Luật Nghĩa vụ quân sự, Luật Công an nhân dân, sẵn sàng nhập ngũ và cống hiến cho đất nước.",
            focusCode: "QPAN 12.1"
        },
        {
            id: "qpan_12_2",
            title: "Bảo vệ Tổ quốc từ sớm, từ xa trong kỷ nguyên chuyển đổi số",
            desc: "Nâng cao năng lực tự vệ, bảo vệ an ninh kinh tế, an ninh văn hóa và an ninh phi truyền thống.",
            focusCode: "QPAN 12.2"
        }
    ]
};

export const QPAN_METHODS_OPTIONS = [
    { name: "Kể chuyện lịch sử & Gương anh hùng liệt sĩ", icon: "📖", desc: "Giáo viên kể chuyện ngắn truyền cảm, dẫn chứng người thật việc thật." },
    { name: "Quan sát tranh ảnh, bản đồ chủ quyền & Video tư liệu", icon: "🗺️", desc: "Chiếu bản đồ Hoàng Sa - Trường Sa, hình ảnh chú bộ đội, phim tư liệu lịch sử." },
    { name: "Hát bài hát truyền thống & Tác phẩm nghệ thuật", icon: "🎵", desc: "Lồng ghép bài hát về biển đảo, người lính, quê hương đất nước." },
    { name: "Thảo luận nhóm & Liên hệ thực tế giữ gìn an ninh trật tự", icon: "🤝", desc: "Học sinh trao đổi về an toàn giao thông, phòng chống bạo lực, bảo vệ thông tin." },
    { name: "Trò chơi tìm hiểu & Trắc nghiệm kiến thức QP-AN", icon: "🎯", desc: "Trò chơi ô chữ, giải đố nhanh về di tích lịch sử và biên cương Tổ quốc." }
];

export const isEnglishSubject = (subject?: string): boolean => {
    if (!subject) return false;
    const s = subject.toLowerCase().trim();
    return (
        s.includes('tiếng anh') ||
        s.includes('tieng anh') ||
        s.includes('english') ||
        s.includes('ngoại ngữ 1') ||
        s.includes('ngoai ngu 1')
    );
};

export interface EnglishExamFormatOption {
    id: string;
    label: string;
    description: string;
    badge: string;
    icon: string;
    defaultDuration: number;
    distribution: {
        multipleChoice: { questionCount: number; percentage: number; score: number };
        trueFalse: { questionCount: number; percentage: number; score: number };
        shortAnswer: { questionCount: number; percentage: number; score: number };
        essay: { questionCount: number; percentage: number; score: number };
    };
    promptGuideline: string;
}

export const ENGLISH_EXAM_FORMATS: EnglishExamFormatOption[] = [
    {
        id: "four_skills",
        label: "Đề kiểm tra 4 kỹ năng (Listening, Language Focus, Reading, Writing)",
        badge: "Chuẩn 4 kỹ năng ELT",
        icon: "🎧",
        description: "Bao gồm Nghe hiểu (Listening + audio script), Ngữ âm & Ngữ pháp (Language Focus), Đọc hiểu (Reading), Viết (Writing).",
        defaultDuration: 45,
        distribution: {
            multipleChoice: { questionCount: 12, percentage: 40, score: 4.0 },
            trueFalse: { questionCount: 4, percentage: 20, score: 2.0 },
            shortAnswer: { questionCount: 4, percentage: 20, score: 2.0 },
            essay: { questionCount: 2, percentage: 20, score: 2.0 }
        },
        promptGuideline: `EXAM FORMAT: 4 SKILLS TEST (Listening, Language Focus, Reading, Writing).
The exam paper MUST be structured into clear sections:
- Section I: LISTENING (Provide audio transcript and listening comprehension questions: multiple choice or true/false).
- Section II: LANGUAGE FOCUS / PHONETICS & GRAMMAR (Pronunciation/stress, vocabulary, grammar and communicative phrases).
- Section III: READING COMPREHENSION (Reading passage with comprehension questions and true/false or short answers).
- Section IV: WRITING (Sentence rearrangement, sentence rewriting/transformation, or writing a short paragraph/email).`
    },
    {
        id: "standard_cv7991",
        label: "Đề định kỳ chuẩn CV 7991 / TT 27 (4 dạng câu hỏi chuẩn Bộ GD&ĐT)",
        badge: "Chuẩn Bộ GD&ĐT",
        icon: "📋",
        description: "Phân chia chuẩn xác 4 dạng: Trắc nghiệm (Multiple Choice), Đúng/Sai (True/False), Trả lời ngắn (Short Answer), Tự luận (Writing).",
        defaultDuration: 45,
        distribution: {
            multipleChoice: { questionCount: 8, percentage: 40, score: 4.0 },
            trueFalse: { questionCount: 2, percentage: 20, score: 2.0 },
            shortAnswer: { questionCount: 2, percentage: 20, score: 2.0 },
            essay: { questionCount: 1, percentage: 20, score: 2.0 }
        },
        promptGuideline: `EXAM FORMAT: REGULATORY FORMAT (Dispatch 7991/BGDĐT-GDTrH or Circular 27/2020/TT-BGDĐT).
Follow the strict distribution of:
- Multiple choice questions
- True/False questions (context-based reading or language facts)
- Short answer questions (fill in blanks, sentence completion)
- Essay / Writing questions (sentence building or short paragraph writing).`
    },
    {
        id: "objective_multiple_choice",
        label: "Đề 100% Trắc nghiệm khách quan (Chuẩn thi Tuyển sinh 10 & Tốt nghiệp THPT)",
        badge: "100% Trắc nghiệm",
        icon: "🎯",
        description: "100% câu hỏi trắc nghiệm A, B, C, D: Ngữ âm, Ngữ pháp, Từ vựng, Giao tiếp, Điền từ Cloze test, Đọc hiểu, Tìm lỗi sai.",
        defaultDuration: 50,
        distribution: {
            multipleChoice: { questionCount: 20, percentage: 100, score: 10.0 },
            trueFalse: { questionCount: 0, percentage: 0, score: 0 },
            shortAnswer: { questionCount: 0, percentage: 0, score: 0 },
            essay: { questionCount: 0, percentage: 0, score: 0 }
        },
        promptGuideline: `EXAM FORMAT: 100% OBJECTIVE MULTIPLE CHOICE (Test format for Grade 10 Entrance / National High School Exam).
All questions must be 4-option multiple choice (A, B, C, D) covering:
1. Phonetics (Pronunciation & Word Stress)
2. Grammar and Vocabulary in Context
3. Conversational Exchanges
4. Error Identification
5. Cloze Reading Passage
6. Reading Comprehension Passage
7. Sentence Transformation / Sentence Combination.`
    },
    {
        id: "midterm",
        label: "Đề kiểm tra Giữa học kỳ (Mid-term Assessment)",
        badge: "Giữa học kỳ",
        icon: "📅",
        description: "Đánh giá toàn diện kiến thức nửa đầu học kỳ bám sát các Unit trọng tâm của SGK Global Success.",
        defaultDuration: 45,
        distribution: {
            multipleChoice: { questionCount: 10, percentage: 50, score: 5.0 },
            trueFalse: { questionCount: 2, percentage: 20, score: 2.0 },
            shortAnswer: { questionCount: 2, percentage: 15, score: 1.5 },
            essay: { questionCount: 1, percentage: 15, score: 1.5 }
        },
        promptGuideline: `EXAM FORMAT: MID-TERM EXAM (KIỂM TRA GIỮA HỌC KỲ).
The exam evaluates core competencies covered in mid-term units of Global Success (Kết nối tri thức), testing vocabulary, grammar, reading comprehension, and communicative writing.`
    },
    {
        id: "final_term",
        label: "Đề kiểm tra Cuối học kỳ (End-of-term / Semester Exam)",
        badge: "Cuối học kỳ",
        icon: "🏆",
        description: "Tổng hợp kiến thức toàn bộ học kỳ, cân đối đầy đủ các mức độ nhận thức và kỹ năng ngôn ngữ.",
        defaultDuration: 45,
        distribution: {
            multipleChoice: { questionCount: 12, percentage: 50, score: 5.0 },
            trueFalse: { questionCount: 2, percentage: 20, score: 2.0 },
            shortAnswer: { questionCount: 2, percentage: 15, score: 1.5 },
            essay: { questionCount: 1, percentage: 15, score: 1.5 }
        },
        promptGuideline: `EXAM FORMAT: FINAL SEMESTER EXAM (KIỂM TRA CUỐI HỌC KỲ).
Comprehensive semester assessment across all units, balancing recognition, comprehension, and application levels with high pedagogical accuracy.`
    },
    {
        id: "quiz_15p",
        label: "Đề kiểm tra nhanh 15 phút (Regular Quiz / 15-minute Test)",
        badge: "Kiểm tra 15 phút",
        icon: "⏱️",
        description: "Kiểm tra nhanh từ vựng, ngữ pháp trọng tâm theo từng Unit hoặc bài học cụ thể.",
        defaultDuration: 15,
        distribution: {
            multipleChoice: { questionCount: 10, percentage: 100, score: 10.0 },
            trueFalse: { questionCount: 0, percentage: 0, score: 0 },
            shortAnswer: { questionCount: 0, percentage: 0, score: 0 },
            essay: { questionCount: 0, percentage: 0, score: 0 }
        },
        promptGuideline: `EXAM FORMAT: 15-MINUTE QUIZ (KIỂM TRA THƯỜNG XUYÊN 15 PHÚT).
Focused exclusively on target vocabulary and key sentence patterns of the designated lesson/unit. Fast, clear, and direct.`
    }
];

export interface EnglishSkillQuestionType {
    id: string;
    label: string;
    englishLabel: string;
    desc: string;
    example: string;
    icon: string;
}

export interface EnglishSkillCategory {
    id: 'listening' | 'speaking' | 'reading' | 'writing' | 'languageFocus';
    title: string;
    englishTitle: string;
    icon: string;
    color: string;
    types: EnglishSkillQuestionType[];
}

export const ENGLISH_SKILL_CATEGORIES: EnglishSkillCategory[] = [
    {
        id: 'listening',
        title: 'Kỹ năng Nghe (Listening)',
        englishTitle: 'Section: Listening Comprehension',
        icon: '🎧',
        color: 'sky',
        types: [
            {
                id: 'listen_gap_fill',
                label: 'Nghe điền từ / số vào chỗ trống',
                englishLabel: 'Listen and fill in the blanks / missing words / numbers',
                desc: 'Học sinh nghe mẩu tin/hội thoại và điền 1-2 từ hoặc số còn thiếu vào chỗ trống / bảng thông tin.',
                example: 'VD: Listen and complete the sentences with ONE word or number.',
                icon: '✏️'
            },
            {
                id: 'listen_mcq',
                label: 'Nghe chọn đáp án trắc nghiệm A, B, C, D',
                englishLabel: 'Listen and choose the correct answer (A, B, C, or D)',
                desc: 'Học sinh nghe và chọn đáp án chính xác nhất giữa 3-4 phương án.',
                example: 'VD: Listen to the conversation and choose the correct answer A, B, or C.',
                icon: '🔘'
            },
            {
                id: 'listen_true_false',
                label: 'Nghe xác định Đúng (True) / Sai (False)',
                englishLabel: 'Listen and decide True (T) or False (F)',
                desc: 'Học sinh nghe văn bản và đánh dấu T (True) hoặc F (False) cho mỗi câu khẳng định.',
                example: 'VD: Listen to the audio and tick (✓) True or False for each statement.',
                icon: '⚖️'
            },
            {
                id: 'listen_matching',
                label: 'Nghe nối thông tin / ghép tranh ảnh',
                englishLabel: 'Listen and match speakers / pictures with statements',
                desc: 'Nghe và ghép nối người nói với sở thích, nghề nghiệp, địa điểm hoặc tranh vẽ tương ứng.',
                example: 'VD: Listen and match each person with their favorite activity.',
                icon: '🔗'
            },
            {
                id: 'listen_numbering',
                label: 'Nghe đánh số thứ tự diễn biến tranh',
                englishLabel: 'Listen and number the pictures in order (1, 2, 3...)',
                desc: 'Học sinh nghe bài khóa và đánh số thứ tự từ 1 đến 4/5 theo đúng trình tự các sự việc diễn ra.',
                example: 'VD: Listen and number the pictures from 1 to 4.',
                icon: '🔢'
            }
        ]
    },
    {
        id: 'speaking',
        title: 'Kỹ năng Nói (Speaking - Tùy chọn)',
        englishTitle: 'Section: Speaking Skills',
        icon: '🗣️',
        color: 'amber',
        types: [
            {
                id: 'speak_qa',
                label: 'Hỏi đáp phỏng vấn trực tiếp (Interactive Q&A)',
                englishLabel: 'Interactive Interview & Personal Questions',
                desc: 'Giáo viên hoặc bạn học hỏi 3-5 câu hỏi giao tiếp theo chủ đề, học sinh trả lời bằng tiếng Anh.',
                example: 'VD: Teacher asks 3 personal questions about daily routines/hobbies.',
                icon: '💬'
            },
            {
                id: 'speak_topic_picture',
                label: 'Thuyết trình theo chủ đề hoặc Miêu tả tranh',
                englishLabel: 'Topic Presentation / Describe a Picture',
                desc: 'Học sinh nói 1-2 phút giới thiệu về một chủ đề bài học hoặc miêu tả các chi tiết trong tranh.',
                example: 'VD: Describe the picture / Talk about your favorite school subject (1-2 mins).',
                icon: '🖼️'
            },
            {
                id: 'speak_roleplay',
                label: 'Đóng vai xử lý tình huống giao tiếp',
                englishLabel: 'Role-play Situational Dialogue',
                desc: 'Học sinh làm việc theo cặp đóng vai trong tình huống thực tế (mua sắm, hỏi đường, đặt món...).',
                example: 'VD: Role-play: At the restaurant / Asking for directions.',
                icon: '🎭'
            },
            {
                id: 'speak_read_aloud',
                label: 'Đọc to kiểm tra phát âm, trọng âm & ngữ điệu',
                englishLabel: 'Read Aloud & Pronunciation Assessment',
                desc: 'Học sinh đọc to một đoạn văn ngắn 30-50 từ để chấm điểm độ trôi chảy, phát âm đuôi -s/ed và ngữ điệu.',
                example: 'VD: Read aloud the short paragraph with correct intonation and liaison.',
                icon: '📢'
            }
        ]
    },
    {
        id: 'reading',
        title: 'Kỹ năng Đọc hiểu (Reading)',
        englishTitle: 'Section: Reading Comprehension',
        icon: '📖',
        color: 'emerald',
        types: [
            {
                id: 'read_mcq',
                label: 'Đọc chọn đáp án trắc nghiệm A, B, C, D',
                englishLabel: 'Read passage and choose the correct answer (A, B, C, or D)',
                desc: 'Đọc đoạn văn 100-200 từ và trả lời các câu hỏi đọc hiểu chọn đáp án đúng.',
                example: 'VD: Read the text and choose the best answer A, B, C or D.',
                icon: '🔘'
            },
            {
                id: 'read_cloze',
                label: 'Đọc điền từ vào chỗ trống (Cloze test)',
                englishLabel: 'Read and fill in the blanks / Cloze test with word bank',
                desc: 'Đọc đoạn văn có các chỗ trống và chọn/điền từ thích hợp từ ô từ cho trước.',
                example: 'VD: Read the passage and choose the correct word from the box to fill in each blank.',
                icon: '🧩'
            },
            {
                id: 'read_true_false',
                label: 'Đọc xác định Đúng (True) / Sai (False)',
                englishLabel: 'Read and decide True (T) or False (F)',
                desc: 'Đọc đoạn văn bản và đánh giá các câu phát biểu là Đúng (T) hay Sai (F).',
                example: 'VD: Read the text and write T (True) or F (False) for each sentence.',
                icon: '✅'
            },
            {
                id: 'read_matching',
                label: 'Đọc nối tiêu đề đoạn / nối vế câu',
                englishLabel: 'Read and match headings / sentence halves',
                desc: 'Nối các tiêu đề với từng đoạn văn tương ứng, hoặc nối vế câu bắt đầu với vế kết thúc.',
                example: 'VD: Match each heading (A-D) with the corresponding paragraph (1-4).',
                icon: '↔️'
            },
            {
                id: 'read_qa',
                label: 'Đọc trả lời câu hỏi trực tiếp (Direct Q&A)',
                englishLabel: 'Read and answer the comprehension questions',
                desc: 'Đọc văn bản và viết câu trả lời ngắn bằng tiếng Anh dựa trên dữ kiện trong bài.',
                example: 'VD: Read the passage and answer the questions in full sentences.',
                icon: '📝'
            }
        ]
    },
    {
        id: 'writing',
        title: 'Kỹ năng Viết (Writing)',
        englishTitle: 'Section: Writing',
        icon: '✍️',
        color: 'purple',
        types: [
            {
                id: 'write_rewrite',
                label: 'Viết lại câu không đổi nghĩa (Sentence rewriting)',
                englishLabel: 'Rewrite sentences keeping the same meaning',
                desc: 'Viết lại câu thứ hai bắt đầu bằng từ gợi ý sao cho nghĩa tương đương với câu gốc.',
                example: 'VD: Rewrite the sentence so that it means the same as the first one.',
                icon: '🔄'
            },
            {
                id: 'write_reorder',
                label: 'Sắp xếp từ xáo trộn thành câu hoàn chỉnh',
                englishLabel: 'Reorder words to make meaningful sentences',
                desc: 'Sắp xếp các từ/cụm từ bị xáo trộn vị trí thành một câu tiếng Anh đúng ngữ pháp.',
                example: 'VD: Reorder the given words to make complete sentences.',
                icon: '🔀'
            },
            {
                id: 'write_gap_fill',
                label: 'Cho dạng đúng của từ / Chia động từ (Word form)',
                englishLabel: 'Sentence completion / Correct form of the words in brackets',
                desc: 'Điền dạng đúng của từ trong ngoặc (danh từ, tính từ, thì động từ) để hoàn chỉnh câu.',
                example: 'VD: Supply the correct form of the word in brackets to complete each sentence.',
                icon: '🔤'
            },
            {
                id: 'write_paragraph',
                label: 'Viết đoạn văn / email ngắn 40 - 100 từ',
                englishLabel: 'Write a short paragraph / email / postcard based on prompts',
                desc: 'Viết một đoạn văn ngắn hoặc email theo câu hỏi gợi ý và số từ quy định.',
                example: 'VD: Write a short email (40-60 words) to your friend telling about your weekend.',
                icon: '📄'
            },
            {
                id: 'write_error_correction',
                label: 'Tìm và sửa lỗi sai trong câu (Error correction)',
                englishLabel: 'Find and correct the mistake in each sentence',
                desc: 'Tìm một lỗi sai về ngữ pháp, từ vựng hoặc chính tả trong câu và viết lại phần sửa đúng.',
                example: 'VD: Each sentence has ONE mistake. Find and correct it.',
                icon: '🔍'
            }
        ]
    },
    {
        id: 'languageFocus',
        title: 'Ngữ âm, Từ vựng & Ngữ pháp (Language Focus)',
        englishTitle: 'Section: Language Focus (Phonetics, Vocabulary & Grammar)',
        icon: '🔤',
        color: 'rose',
        types: [
            {
                id: 'lang_phonetics',
                label: 'Phát âm & Trọng âm (Pronunciation & Stress)',
                englishLabel: 'Phonetics: Pronunciation (-s/es, -ed, vowels) & Word Stress',
                desc: 'Chọn từ có phần gạch chân phát âm khác các từ còn lại, hoặc chọn từ có trọng âm chính khác.',
                example: 'VD: Choose the word whose underlined part is pronounced differently from the others.',
                icon: '🎙️'
            },
            {
                id: 'lang_vocab_grammar',
                label: 'Trắc nghiệm từ vựng & ngữ pháp trọng tâm',
                englishLabel: 'Vocabulary and Grammar MCQ in context',
                desc: 'Các câu hỏi trắc nghiệm hoàn thành câu kiểm tra từ vựng SGK Global Success và cấu trúc ngữ pháp.',
                example: 'VD: Choose the best option A, B, C or D to complete each sentence.',
                icon: '💡'
            },
            {
                id: 'lang_communication',
                label: 'Tình huống giao tiếp hàng ngày (Communication)',
                englishLabel: 'Everyday Conversational & Functional Exchanges',
                desc: 'Chọn câu đáp lại tự nhiên, lịch sự và phù hợp nhất trong các tình huống giao tiếp thường ngày.',
                example: 'VD: Choose the most suitable response to complete each exchange.',
                icon: '🤝'
            }
        ]
    }
];

export const DEFAULT_ENGLISH_SKILLS_CONFIG = {
    listeningTypes: ['listen_gap_fill', 'listen_mcq'],
    speakingTypes: [] as string[],
    readingTypes: ['read_mcq', 'read_cloze', 'read_true_false'],
    writingTypes: ['write_rewrite', 'write_reorder', 'write_paragraph'],
    languageFocusTypes: ['lang_phonetics', 'lang_vocab_grammar'],
    includeSpeaking: false,
};

export const ENGLISH_SKILL_PRESETS = [
    {
        id: 'full_variety',
        label: 'Đa dạng tối đa các dạng bài (Đầy đủ nghe điền từ + trắc nghiệm ABC, đọc cloze, viết câu)',
        badge: 'Đa dạng cao nhất',
        icon: '🌟',
        config: {
            listeningTypes: ['listen_gap_fill', 'listen_mcq', 'listen_true_false', 'listen_matching'],
            speakingTypes: [] as string[],
            readingTypes: ['read_mcq', 'read_cloze', 'read_true_false', 'read_qa'],
            writingTypes: ['write_rewrite', 'write_reorder', 'write_paragraph', 'write_gap_fill'],
            languageFocusTypes: ['lang_phonetics', 'lang_vocab_grammar', 'lang_communication'],
            includeSpeaking: false,
        }
    },
    {
        id: 'primary_standard',
        label: 'Chuẩn Tiểu học Lớp 3, 4, 5 (Global Success: Nghe điền từ/chọn tranh, Đọc điền từ/Đúng-Sai, Sắp xếp câu)',
        badge: 'Tiểu học',
        icon: '🎒',
        config: {
            listeningTypes: ['listen_gap_fill', 'listen_mcq', 'listen_numbering'],
            speakingTypes: ['speak_qa'],
            readingTypes: ['read_cloze', 'read_true_false', 'read_matching'],
            writingTypes: ['write_reorder', 'write_gap_fill'],
            languageFocusTypes: ['lang_phonetics', 'lang_vocab_grammar'],
            includeSpeaking: false,
        }
    },
    {
        id: 'secondary_standard',
        label: 'Chuẩn THCS Lớp 6 - 9 (Nghe ABC + điền từ, Đọc cloze + đọc hiểu, Viết lại câu + đoạn văn)',
        badge: 'THCS',
        icon: '📚',
        config: {
            listeningTypes: ['listen_mcq', 'listen_gap_fill', 'listen_true_false'],
            speakingTypes: [] as string[],
            readingTypes: ['read_mcq', 'read_cloze', 'read_true_false'],
            writingTypes: ['write_rewrite', 'write_reorder', 'write_paragraph'],
            languageFocusTypes: ['lang_phonetics', 'lang_vocab_grammar', 'lang_communication'],
            includeSpeaking: false,
        }
    },
    {
        id: 'highschool_standard',
        label: 'Chuẩn THPT Lớp 10 - 12 (Trọng âm, Ngữ âm, Cloze test, Đọc hiểu sâu, Viết chuyển đổi câu)',
        badge: 'THPT',
        icon: '🎓',
        config: {
            listeningTypes: ['listen_mcq', 'listen_gap_fill'],
            speakingTypes: [] as string[],
            readingTypes: ['read_mcq', 'read_cloze', 'read_matching'],
            writingTypes: ['write_rewrite', 'write_paragraph', 'write_error_correction'],
            languageFocusTypes: ['lang_phonetics', 'lang_vocab_grammar', 'lang_communication'],
            includeSpeaking: false,
        }
    },
    {
        id: 'with_speaking',
        label: 'Đề 4 kỹ năng có Phần thi Nói (Listening, Speaking, Reading, Writing)',
        badge: 'Có thi Nói',
        icon: '🎙️',
        config: {
            listeningTypes: ['listen_gap_fill', 'listen_mcq'],
            speakingTypes: ['speak_qa', 'speak_topic_picture', 'speak_roleplay'],
            readingTypes: ['read_mcq', 'read_cloze'],
            writingTypes: ['write_rewrite', 'write_paragraph'],
            languageFocusTypes: ['lang_phonetics', 'lang_vocab_grammar'],
            includeSpeaking: true,
        }
    }
];


