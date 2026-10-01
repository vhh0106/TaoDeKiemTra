import type { LessonPlanFormData } from '../types';
import { createLessonPlanPrompt } from './promptBuilder';
import { GoogleGenAI } from '@google/genai';

async function generateLessonPlanClientDirect(data: LessonPlanFormData, apiKey: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = createLessonPlanPrompt(data);
  const systemInstruction =
    data.schoolLevel === 'Tiểu học'
      ? 'You are an expert Vietnamese primary education pedagogical specialist AI creating comprehensive lesson plans adhering strictly to Official Dispatch 2345/BGDĐT-GDTH and Digital Competence Framework Circular 02/2025/TT-BGDĐT.'
      : 'You are an expert Vietnamese secondary education pedagogical specialist AI creating comprehensive lesson plans adhering strictly to Official Dispatch 5512/BGDĐT-GDTrH and Digital Competence Framework Circular 02/2025/TT-BGDĐT.';

  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  let lastError: any = null;
  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.6,
          },
        });
        const text = response.text || '';
        if (text.trim().length > 0) return text;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err || '').toLowerCase();
        if (msg.includes('safety') || msg.includes('block')) {
          throw new Error('Nội dung bài học bị bộ lọc an toàn AI từ chối. Vui lòng điều chỉnh lại thông tin.');
        }
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
          continue;
        }
        break;
      }
    }
  }
  throw lastError || new Error('Không thể kết nối đến hệ thống AI.');
}

export const generateLessonPlan = async (data: LessonPlanFormData): Promise<string> => {
  try {
    // 1. Thử gọi qua backend Express API trước
    const response = await fetch('/api/generate-lesson-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    }).catch(() => null);

    if (response && response.ok) {
      const json = await response.json();
      if (json.text) return json.text;
    }

    // Nếu API trả về lỗi cụ thể (khác 404)
    if (response && response.status !== 404) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.error || `Lỗi máy chủ (${response.status})`);
    }

    // 2. Dự phòng: Khi chạy trên GitHub Pages (máy chủ tĩnh 404 /api/*)
    const clientKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (clientKey) {
      return await generateLessonPlanClientDirect(data, clientKey);
    }

    throw new Error(
      'Không tìm thấy máy chủ API (/api/generate-lesson-plan). Nếu đang triển khai trên GitHub Pages, hãy cấu hình Secret VITE_GEMINI_API_KEY trong GitHub repository.'
    );
  } catch (error: any) {
    console.error('Error in generateLessonPlan:', error);
    throw new Error(error?.message || 'Đã xảy ra lỗi không xác định khi soạn kế hoạch bài dạy.');
  }
};
