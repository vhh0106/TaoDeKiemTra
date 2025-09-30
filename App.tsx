
import React, { useState, useEffect, useRef } from 'react';
import { ExamFormData, ExamResult } from './types';
import ExamForm from './components/ExamForm';
import ResultsDisplay from './components/ResultsDisplay';
import { generateExam } from './services/geminiService';

const Header: React.FC<{ onGuideClick: () => void }> = ({ onGuideClick }) => (
    <header className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-slate-200/80 mb-8 sticky top-4 z-40">
        <div className="flex items-center justify-between p-4 sm:p-5">
            <div className="flex items-center gap-3">
                 <div className="bg-gradient-to-br from-indigo-500 to-blue-500 p-2 rounded-xl text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6.108V18a2.25 2.25 0 0 0 2.25 2.25h.375m1.5-15.118a.75.75 0 0 0-.75.75v3.75a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75v-3.75a.75.75 0 0 0-.75-.75h-4.5Z" />
                    </svg>
                 </div>
                 <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Tạo Đề Kiểm Tra Theo CV7991</h1>
            </div>
            <div className="flex items-center gap-4">
                 <button 
                    onClick={onGuideClick}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200 bg-slate-100 hover:bg-indigo-100 px-4 py-2 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Hướng dẫn</span>
                </button>
                <a href="https://www.facebook.com/vhh0106/" target="_blank" rel="noopener noreferrer" className="ring-2 ring-offset-2 ring-offset-white ring-indigo-300 rounded-full">
                    <img
                        src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/543117120_4112665879051174_5463830652082981920_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=UVFebXqE6DoQ7kNvwFowOHQ&_nc_oc=AdmhktLbevr1HwLq1ht2moviLk2zVcWIB2m7KnbFDyjM7V8tdclS40bSW9EwXfKC700&_nc_zt=23&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=KDlMF5jWrA3zBsxQviGygQ&oh=00_AfYEa6uqpXpHC-CoX3Ucp23saX44j7BpCJPnMQ5VltNtJQ&oe=68E00E10"
                        alt="Logo"
                        className="h-10 w-10 rounded-full object-cover transition-transform transform hover:scale-110"
                    />
                </a>
            </div>
        </div>
    </header>
);

const UserGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const guideSteps = [
        { title: "Bước 1: Thiết lập Thông số Chung", description: "Xác định các tham số cơ bản của kỳ kiểm tra: Cấp học, Lớp, Môn học. Lựa chọn bộ sách giáo khoa đang giảng dạy và quy định Thời gian làm bài (phút)." },
        { title: "Bước 2: Cung cấp Phạm vi Kiến thức", description: "Liệt kê chi tiết tên các chương, bài hoặc chủ đề cụ thể cần đánh giá. Mẹo: Cung cấp càng chi tiết, ma trận và đề thi do AI tạo ra sẽ càng bám sát mục tiêu của bạn." },
        { title: "Bước 3: Phân bổ Cấu trúc Đề", description: "Phân bổ trọng số cho từng hình thức câu hỏi (Trắc nghiệm, Đúng/Sai, v.v.). Điều chỉnh số lượng câu, tỉ lệ phần trăm (%) và điểm số. Hệ thống sẽ kiểm tra để đảm bảo tổng điểm là 10 và tổng tỉ lệ là 100%." },
        { title: "Bước 4: Tinh chỉnh (Tùy chọn)", description: "Đưa ra các chỉ dẫn đặc thù cho AI trong ô 'Yêu cầu bổ sung'. Ví dụ: yêu cầu câu hỏi liên hệ thực tiễn, tập trung vào một dạng kiến thức nào đó, v.v." },
        { title: "Bước 5: Khởi tạo & Chờ kết quả", description: "Nhấn nút '🚀 Tạo đề ngay!'. Hệ thống sẽ gửi yêu cầu đến AI và xử lý trong khoảng 1-2 phút. Vui lòng không đóng trình duyệt trong quá trình này." },
        { title: "Bước 6: Khai thác & Sử dụng", description: "Duyệt qua các kết quả (Ma trận, Đặc tả, Đề thi, Đáp án) bằng các tab. Sử dụng các công cụ: 'Sao chép', 'Xuất .Docx', hoặc 'Tạo lại' nếu cần điều chỉnh." }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300" onClick={onClose}>
            <div 
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 m-4 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="text-center mb-8">
                     <h2 className="text-3xl font-bold text-indigo-700">Hướng dẫn sử dụng</h2>
                     <p className="mt-2 text-lg text-slate-600">Quy trình chuyên nghiệp để tạo một bộ đề kiểm tra hoàn chỉnh</p>
                </div>
                <div className="space-y-6">
                    {guideSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-5 p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                           <div className="flex-shrink-0 flex items-center justify-center bg-indigo-100 rounded-full h-12 w-12 text-indigo-600 font-bold text-xl">
                                {index + 1}
                           </div>
                           <div className="flex-grow">
                                <h3 className="text-xl font-semibold text-slate-800">{step.title}</h3>
                                <p className="text-slate-600 mt-1">{step.description}</p>
                           </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-6 border-t border-dashed">
                    <p className="text-center font-semibold text-red-600 bg-red-50 p-4 rounded-lg text-base">
                        <span className="font-bold">Lưu ý quan trọng:</span> Luôn kiểm tra và thẩm định kỹ lưỡng nội dung do AI tạo ra trước khi sử dụng trong môi trường giáo dục chính thức.
                    </p>
                </div>
            </div>
        </div>
    );
};


const Footer: React.FC<{ visits: number; clicks: number }> = ({ visits, clicks }) => (
    <footer className="text-center py-8 mt-12 border-t border-slate-200 text-slate-500 text-sm">
        <p>Phát triển bởi: <a href="https://www.facebook.com/vhh0106/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Vũ Hoàng Hiệp</a> | Zalo: 0348554851</p>
        { (visits > 0 || clicks > 0) && (
            <p className="mt-2 text-slate-600 font-medium">
                <span className="inline-block mx-2">📊</span>
                {visits.toLocaleString('vi-VN')} lượt truy cập & {clicks.toLocaleString('vi-VN')} lượt tạo đề
            </p>
        )}
    </footer>
);

const LoadingIndicator: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
    const steps = [
        { text: "Đang gửi yêu cầu đến AI...", duration: 2000, progress: 10 },
        { text: "AI đang phân tích cấu trúc đề...", duration: 15000, progress: 35 },
        { text: "AI đang tạo Ma trận & Bản đặc tả...", duration: 20000, progress: 70 },
        { text: "AI đang soạn câu hỏi & đáp án...", duration: 15000, progress: 95 },
        { text: "Sắp xong! Đang hoàn thiện kết quả...", duration: 5000, progress: 100 },
    ];
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const currentStep = steps[currentStepIndex];
        setProgress(currentStep.progress);

        if (currentStepIndex < steps.length - 1) {
            const timer = setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, currentStep.duration);
            return () => clearTimeout(timer);
        }
    }, [currentStepIndex]);

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-xl border border-slate-200/80 w-full">
            <svg className="animate-spin h-12 w-12 text-indigo-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">{steps[currentStepIndex].text}</h3>
            <div className="w-full max-w-lg bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner my-2">
                <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="mt-2 text-lg font-semibold text-indigo-700">{progress}%</p>
            <p className="mt-6 text-sm text-slate-500 text-center">Quá trình này có thể mất khoảng một phút. Vui lòng không đóng tab.</p>
            <button
                onClick={onCancel}
                className="mt-8 px-8 py-3 text-base font-semibold rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
                Hủy bỏ
            </button>
        </div>
    );
};


const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="p-6 bg-red-50/80 border-l-4 border-red-500 text-red-800 rounded-xl shadow-lg flex items-start gap-4">
        <div className="flex-shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div>
            <p className="font-bold text-lg">Đã xảy ra lỗi</p>
            <p className="mt-1">{message}</p>
        </div>
    </div>
);

const App: React.FC = () => {
    const [formData, setFormData] = useState<ExamFormData>({
        schoolLevel: 'Cấp 1',
        subject: 'Tin học',
        grade: 'Lớp 5',
        textbook: 'Kết nối tri thức',
        knowledgeContent: '',
        duration: 45,
        multipleChoice: { percentage: 30, score: 3.0, questionCount: 6 },
        trueFalse: { percentage: 20, score: 2.0, questionCount: 4 },
        shortAnswer: { percentage: 20, score: 2.0, questionCount: 2 },
        essay: { percentage: 30, score: 3.0, questionCount: 1 },
        additionalRequirements: '',
    });
    const [examResult, setExamResult] = useState<ExamResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [pageVisits, setPageVisits] = useState<number>(0);
    const [generationClicks, setGenerationClicks] = useState<number>(0);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    
    const isCancelledRef = useRef(false);

    const getStat = (key: string): number => {
        try {
            return parseInt(localStorage.getItem(key) || '0', 10);
        } catch { return 0; }
    };

    const incrementStat = (key: string): number => {
        const currentVal = getStat(key);
        const newVal = currentVal + 1;
        try {
            localStorage.setItem(key, newVal.toString());
        } catch (error) {
            console.error(`Failed to update stat '${key}' in localStorage:`, error);
        }
        return newVal;
    };


    useEffect(() => {
        const newVisits = incrementStat('pageVisits');
        setPageVisits(newVisits);
        const currentClicks = getStat('generationClicks');
        setGenerationClicks(currentClicks);
    }, []);

    const handleCancelLoading = () => {
        isCancelledRef.current = true;
        setIsLoading(false);
    };

    const handleStartGeneration = async (data: ExamFormData) => {
        const newClicks = incrementStat('generationClicks');
        setGenerationClicks(newClicks);

        setIsLoading(true);
        setError(null);
        setExamResult(null);
        isCancelledRef.current = false;

        try {
            const resultText = await generateExam(data);
            if (isCancelledRef.current) return;

            const cleanText = (text: string) => text.replace(/\*\*/g, '').replace(/<br>/gi, '\n').replace(/^---+\s*$/gm, '').trim();
            
            const flexibleHeader = (text: string) => `(?:\\*\\*\\s*)?${text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}(?:\\s*\\*\\*)?`;

            let fullRegex: RegExp;

            if (data.subject === 'Ngoại ngữ 1 (Tiếng Anh)') {
                const p1 = "PART 1: EXAM MATRIX";
                const p2 = "PART 2: TEST SPECIFICATION GRID";
                const p3 = "PART 3: EXAM PAPER";
                const p4 = "PART 4: ANSWER KEY & GRADING GUIDE";
                fullRegex = new RegExp(
                    `${flexibleHeader(p1)}([\\s\\S]*?)` +
                    `${flexibleHeader(p2)}([\\s\\S]*?)` +
                    `${flexibleHeader(p3)}([\\s\\S]*?)` +
                    `${flexibleHeader(p4)}([\\s\\S]*)`,
                    'i'
                );
            } else {
                const p1 = "PHẦN 1: MA TRẬN ĐỀ KIỂM TRA";
                const p2 = "PHẦN 2: BẢN ĐẶC TẢ CHI TIẾT";
                const p3 = "PHẦN 3: NỘI DUNG ĐỀ KIỂM TRA";
                const p4 = "PHẦN 4: HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN";
                fullRegex = new RegExp(
                    `${flexibleHeader(p1)}([\\s\\S]*?)` +
                    `${flexibleHeader(p2)}([\\s\\S]*?)` +
                    `${flexibleHeader(p3)}([\\s\\S]*?)` +
                    `${flexibleHeader(p4)}([\\s\\S]*)`,
                    'i'
                );
            }
            
            const matches = resultText.match(fullRegex);
            
            if (isCancelledRef.current) return;

            if (!matches || matches.length < 5) {
                console.warn("Could not parse all sections, showing raw output.");
                setExamResult({
                    matrix: "Không thể phân tích Ma trận từ kết quả trả về.",
                    specification: "Không thể phân tích Bản đặc tả từ kết quả trả về.",
                    exam: "Không thể phân tích Đề kiểm tra từ kết quả trả về.",
                    answerKey: `Vui lòng kiểm tra kết quả thô:\n\n${cleanText(resultText)}`,
                });
            } else {
                 setExamResult({
                    matrix: cleanText(matches[1]),
                    specification: cleanText(matches[2]),
                    exam: cleanText(matches[3]),
                    answerKey: cleanText(matches[4])
                });
            }

        } catch (err) {
            if (!isCancelledRef.current) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            }
        } finally {
            if (!isCancelledRef.current) {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl flex-grow">
                <Header onGuideClick={() => setIsGuideOpen(true)} />
                <main>
                    <ExamForm 
                        formData={formData} 
                        setFormData={setFormData}
                        onSubmit={handleStartGeneration}
                        isLoading={isLoading}
                    />
                    <div className="mt-12">
                        {isLoading && <LoadingIndicator onCancel={handleCancelLoading} />}
                        {error && <ErrorMessage message={error} />}
                        {examResult && !isLoading && <ResultsDisplay result={examResult} onRegenerate={() => handleStartGeneration(formData)} />}
                    </div>
                </main>
            </div>
            <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
            <Footer visits={pageVisits} clicks={generationClicks} />
        </div>
    );
};

export default App;
