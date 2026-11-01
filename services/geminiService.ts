import type { ExamFormData } from '../types';
import { getExamPromptAndInstruction } from './promptBuilder';
import { isStaticHosting, ensureClientApiKey, markApiKeyAsLeaked } from './apiKeyHelper';
import { GoogleGenAI } from '@google/genai';

async function generateExamClientDirect(data: ExamFormData, apiKey: string): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const { prompt, systemInstruction } = getExamPromptAndInstruction(data);
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite'];

  let lastError: any = null;
  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini Client] Generating exam with model ${model} (attempt ${attempt}/2)...`);
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
        throw new Error('Mô hình AI trả về nội dung rỗng.');
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err || '').toLowerCase();
        console.warn(`[Gemini Client] Model ${model} attempt ${attempt} failed: ${msg}`);

        // Xử lý đặc biệt nếu khóa API bị lộ (leaked)
        if (msg.includes('leaked') || msg.includes('use another api key')) {
          markApiKeyAsLeaked(apiKey);
          throw new Error(
            'Khóa API này đã bị Google vô hiệu hóa vì lý do bảo mật (bị lộ lên GitHub công khai - Leaked API key). Vui lòng nhấn nút "Đổi API Key" để nhập khóa mới.'
          );
        }

        if (msg.includes('api_key_invalid') || msg.includes('api key not valid')) {
          markApiKeyAsLeaked(apiKey);
          throw new Error('Khóa API không hợp lệ. Vui lòng kiểm tra lại API Key hoặc nhập khóa mới.');
        }

        if (msg.includes('safety') || msg.includes('block')) {
          throw new Error('Nội dung đề kiểm tra bị bộ lọc an toàn AI từ chối. Vui lòng điều chỉnh lại thông tin.');
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

export const generateExam = async (data: ExamFormData): Promise<string> => {
  try {
    // 1. Nếu đang chạy trên máy chủ tĩnh (GitHub Pages), trực tiếp gọi client direct
    if (isStaticHosting()) {
      const apiKey = ensureClientApiKey();
      if (!apiKey) {
        throw new Error(
          'Chưa có Gemini API Key. Khi triển khai trên GitHub Pages, bạn cần cung cấp một Gemini API Key (tạo miễn phí tại aistudio.google.com/app/apikey).'
        );
      }
      return await generateExamClientDirect(data, apiKey);
    }

    // 2. Chạy trên môi trường server thông thường (Node/Cloud Run)
    let response: Response | null = null;
    let responseText = '';
    let isJson = false;

    try {
      response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      if (response) {
        const contentType = response.headers.get('content-type') || '';
        responseText = await response.text();
        isJson =
          contentType.includes('application/json') ||
          (responseText.trim().startsWith('{') && responseText.trim().endsWith('}'));
      }
    } catch (netErr) {
      console.warn('Network error calling /api/generate-exam:', netErr);
    }

    // Trường hợp server phản hồi thành công và trả về JSON hợp lệ
    if (response && response.ok && isJson && responseText) {
      try {
        const json = JSON.parse(responseText);
        if (json.text) return json.text;
      } catch (jsonErr) {
        console.warn('Failed to parse server JSON response:', jsonErr);
      }
    }

    // Nếu server trả về lỗi dạng JSON có thông điệp
    if (isJson && responseText) {
      try {
        const errJson = JSON.parse(responseText);
        if (errJson?.error) {
          throw new Error(errJson.error);
        }
      } catch (e: any) {
        if (e.message && !e.message.includes('Unexpected token') && !e.message.includes('is not valid JSON')) {
          throw e;
        }
      }
    }

    // Trường hợp server trả về HTML (<!doctype html> do SPA rewrite hoặc lỗi proxy 502/503) hoặc mất kết nối:
    // Tự động fallback sang gọi trực tiếp từ Client bằng API Key nội bộ/người dùng
    const clientKey = ensureClientApiKey(
      'Máy chủ AI tạm thời trả về phản hồi không hợp lệ. Vui lòng cung cấp Gemini API Key để tiếp tục tạo đề thi:'
    );
    if (clientKey) {
      console.log('[Exam] Falling back to client-side direct generation...');
      return await generateExamClientDirect(data, clientKey);
    }

    throw new Error(
      `Máy chủ AI tạm thời không thể xử lý yêu cầu (Lỗi ${response?.status || 'kết nối'}). Vui lòng nhấn "Thử lại ngay" sau vài giây!`
    );
  } catch (error: any) {
    console.error('Error in generateExam:', error);
    const msg = error?.message || 'Đã xảy ra lỗi không xác định khi tạo đề thi.';
    // Làm sạch thông điệp nếu vô tình chứa lỗi parser JSON
    if (msg.includes('is not valid JSON') || msg.includes('Unexpected token')) {
      throw new Error('Máy chủ AI đang quá tải hoặc phản hồi chậm. Vui lòng nhấn nút "Thử lại ngay"!');
    }
    throw new Error(msg);
  }
};
