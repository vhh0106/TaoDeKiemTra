/**
 * Dịch vụ Gọi Gemini AI Chuyển hóa Kế Hoạch Bài Dạy thành Slide Giảng Dạy Cho Học Sinh
 * Hỗ trợ cả máy chủ nội bộ (Fullstack) lẫn GitHub Pages (Client Direct API Key).
 */

import type { LessonPlanFormData } from '../types';
import { createSlidePresentationPrompt } from './promptBuilder';
import { isStaticHosting, ensureClientApiKey, markApiKeyAsLeaked } from './apiKeyHelper';
import { GoogleGenAI } from '@google/genai';

export interface SlideItem {
  type: 'cover' | 'goals' | 'warmup' | 'knowledge' | 'practice' | 'quiz' | 'application' | 'homework';
  tag?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  bullets?: string[];
  highlightBox?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  speakerNotes?: string;
}

export interface SlidePresentationData {
  lessonTitle: string;
  subject: string;
  grade: string;
  slides: SlideItem[];
}

function cleanAndParseJson(rawText: string): SlidePresentationData {
  let cleaned = rawText.trim();

  // Bỏ khối code fence ```json ... ``` hoặc ``` ... ```
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    cleaned = codeBlockMatch[1].trim();
  }

  // Tìm vị trí mở ngoặc { đầu tiên và đóng ngoặc } cuối cùng
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Loại bỏ các dấu phẩy thừa trước dấu đóng ngoặc ] hoặc }
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      throw new Error('Dữ liệu slide trả về không đúng danh sách');
    }
    return parsed as SlidePresentationData;
  } catch (err) {
    console.error('Failed to parse AI slides JSON:', err, 'Raw text:', rawText);
    // Thử trích xuất dự phòng nếu có cấu trúc
    throw new Error('Mô hình AI chưa trả về cấu trúc slide đúng định dạng. Vui lòng bấm "Thử lại"!');
  }
}

/**
 * Gọi trực tiếp từ Client (GitHub Pages)
 */
async function generateSlidesClientDirect(
  data: LessonPlanFormData,
  lessonPlanContent: string,
  apiKey: string
): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const { prompt, systemInstruction } = createSlidePresentationPrompt(data, lessonPlanContent);
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  let lastError: any = null;
  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini Client] Generating teaching slides with ${model} (attempt ${attempt}/2)...`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.5,
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        if (text.trim().length > 0) return text;
        throw new Error('Mô hình AI trả về nội dung rỗng.');
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err || '').toLowerCase();
        console.warn(`[Gemini Client] Slide generation with ${model} failed: ${msg}`);

        if (msg.includes('leaked') || msg.includes('use another api key')) {
          markApiKeyAsLeaked(apiKey);
          throw new Error('Khóa API đã bị vô hiệu hóa vì bị lộ (Leaked API Key). Vui lòng đổi khóa mới.');
        }

        if (msg.includes('api_key_invalid') || msg.includes('api key not valid')) {
          markApiKeyAsLeaked(apiKey);
          throw new Error('Khóa API không hợp lệ. Vui lòng kiểm tra lại API Key.');
        }
      }
    }
  }

  throw lastError || new Error('Không thể kết nối đến mô hình Gemini để thiết kế slide.');
}

/**
 * Hàm chính sinh cấu trúc Slide bài giảng từ Kế hoạch bài dạy
 */
export async function generateStudentTeachingSlides(
  data: LessonPlanFormData,
  lessonPlanContent: string
): Promise<SlidePresentationData> {
  // 1. Kiểm tra môi trường Static Hosting (GitHub Pages)
  if (isStaticHosting()) {
    const clientKey = await ensureClientApiKey(
      'Ứng dụng đang chạy trên GitHub Pages. Vui lòng nhập Gemini API Key để AI chuyển hóa giáo án thành Slide bài giảng trực quan:'
    );
    const rawAiText = await generateSlidesClientDirect(data, lessonPlanContent, clientKey);
    return cleanAndParseJson(rawAiText);
  }

  // 2. Môi trường Fullstack (Dev server / Cloud Run)
  try {
    const response = await fetch('/api/generate-slides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, lessonPlanContent }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Lỗi máy chủ (${response.status})`);
    }

    const resJson = await response.json();
    return cleanAndParseJson(resJson.text);
  } catch (err) {
    console.warn('[Server Slide API Failed, trying client fallback]:', err);
    // Dự phòng gọi trực tiếp nếu server không có API key hoặc lỗi mạng
    const clientKey = await ensureClientApiKey();
    const rawAiText = await generateSlidesClientDirect(data, lessonPlanContent, clientKey);
    return cleanAndParseJson(rawAiText);
  }
}
