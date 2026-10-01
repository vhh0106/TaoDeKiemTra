import type { LessonPlanFormData } from '../types';
import { createLessonPlanPrompt } from './promptBuilder';
import { isStaticHosting, ensureClientApiKey } from './apiKeyHelper';
import { GoogleGenAI } from '@google/genai';

async function generateLessonPlanClientDirect(data: LessonPlanFormData, apiKey: string): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

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
        console.log(`[Gemini Client] Generating lesson plan with model ${model} (attempt ${attempt}/2)...`);
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
        throw new Error('Mô hình AI trả về nội dung rỗng.');
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err || '').toLowerCase();
        console.warn(`[Gemini Client] Model ${model} attempt ${attempt} failed: ${msg}`);

        if (msg.includes('safety') || msg.includes('block')) {
          throw new Error('Nội dung bài học bị bộ lọc an toàn AI từ chối. Vui lòng điều chỉnh lại thông tin.');
        }

        const isTransient =
          msg.includes('503') ||
          msg.includes('unavailable') ||
          msg.includes('high demand') ||
          msg.includes('temporarily') ||
          msg.includes('429') ||
          msg.includes('resource_exhausted') ||
          msg.includes('quota');

        if (isTransient) {
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
            continue;
          }
          break;
        }

        break;
      }
    }
  }

  throw lastError || new Error('Không thể kết nối đến hệ thống AI.');
}

export const generateLessonPlan = async (data: LessonPlanFormData): Promise<string> => {
  try {
    // 1. Nếu đang chạy trên máy chủ tĩnh (GitHub Pages), không gọi /api/ vì chắc chắn sẽ bị 405 Method Not Allowed
    if (isStaticHosting()) {
      const apiKey = ensureClientApiKey();
      if (!apiKey) {
        throw new Error(
          'Chưa có Gemini API Key. Khi triển khai trên GitHub Pages, bạn cần cấu hình Secret VITE_GEMINI_API_KEY trong GitHub repository hoặc nhập API Key khi được yêu cầu.'
        );
      }
      return await generateLessonPlanClientDirect(data, apiKey);
    }

    // 2. Chạy trên môi trường server thông thường (Node/Cloud Run)
    let response: Response | null = null;
    try {
      response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
    } catch (netErr) {
      console.warn('Network error calling /api/generate-lesson-plan, falling back to client mode if key exists', netErr);
    }

    if (response && response.ok) {
      const json = await response.json();
      if (json.text) return json.text;
    }

    // Nếu server trả về 404 hoặc 405 (không có endpoint POST), thử fallback qua client key
    if (!response || response.status === 404 || response.status === 405 || response.status === 501) {
      const apiKey = ensureClientApiKey();
      if (apiKey) {
        return await generateLessonPlanClientDirect(data, apiKey);
      }
      throw new Error(
        'Máy chủ không hỗ trợ endpoint /api/generate-lesson-plan (Lỗi ' + (response?.status || 'kết nối') + '). Vui lòng kiểm tra lại cấu hình server hoặc cung cấp Gemini API Key.'
      );
    }

    // Nếu server trả về lỗi nghiệp vụ có thông điệp
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.error || `Lỗi máy chủ (${response.status})`);
  } catch (error: any) {
    console.error('Error in generateLessonPlan:', error);
    throw new Error(error?.message || 'Đã xảy ra lỗi không xác định khi soạn kế hoạch bài dạy.');
  }
};
