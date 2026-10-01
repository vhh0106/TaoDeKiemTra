import type { ExamFormData } from '../types';
import { getExamPromptAndInstruction } from './promptBuilder';
import { GoogleGenAI } from '@google/genai';

async function generateExamClientDirect(data: ExamFormData, apiKey: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const { prompt, systemInstruction } = getExamPromptAndInstruction(data);
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
            temperature: 0.5,
          },
        });
        const text = response.text || '';
        if (text.trim().length > 0) return text;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err || '').toLowerCase();
        if (msg.includes('safety') || msg.includes('block')) {
          throw new Error('Nội dung đề kiểm tra bị bộ lọc an toàn AI từ chối. Vui lòng điều chỉnh lại thông tin.');
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

export const generateExam = async (data: ExamFormData): Promise<string> => {
  try {
    // 1. Thử gọi qua backend Express API trước
    const response = await fetch('/api/generate-exam', {
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

    // Nếu API trả về lỗi nhưng có thông điệp cụ thể (khác 404)
    if (response && response.status !== 404) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.error || `Lỗi máy chủ (${response.status})`);
    }

    // 2. Dự phòng: Khi chạy trên GitHub Pages (máy chủ tĩnh 404 /api/*)
    const clientKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (clientKey) {
      return await generateExamClientDirect(data, clientKey);
    }

    throw new Error(
      'Không tìm thấy máy chủ API (/api/generate-exam). Nếu đang triển khai trên GitHub Pages, hãy cấu hình Secret VITE_GEMINI_API_KEY trong GitHub repository.'
    );
  } catch (error: any) {
    console.error('Error in generateExam:', error);
    throw new Error(error?.message || 'Đã xảy ra lỗi không xác định khi tạo đề thi.');
  }
};
