import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ExamFormData, LessonPlanFormData } from './types.ts';
import {
  getExamPromptAndInstruction,
  createLessonPlanPrompt,
  createSlidePresentationPrompt,
} from './services/promptBuilder.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function generateExamWithRetryAndFallback(options: {
  contents: string;
  systemInstruction: string;
  temperature?: number;
}): Promise<string> {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini] Calling model ${model} (attempt ${attempt}/2)...`);
        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: {
            systemInstruction: options.systemInstruction,
            temperature: options.temperature ?? 0.5,
          },
        });

        const text = response.text || '';
        if (text.trim().length > 0) {
          console.log(`[Gemini] Successfully generated exam with model: ${model}`);
          return text;
        }
        throw new Error('Mô hình AI trả về kết quả rỗng.');
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || err || '');
        console.warn(`[Gemini] Model ${model} attempt ${attempt} failed: ${errMsg}`);

        const isTransient =
          errMsg.includes('503') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('high demand') ||
          errMsg.includes('temporarily') ||
          errMsg.includes('429') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('Overloaded');

        if (isTransient) {
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
            continue;
          }
          break;
        }

        if (errMsg.toLowerCase().includes('safety') || errMsg.toLowerCase().includes('block')) {
          throw err;
        }

        break;
      }
    }
  }

  throw lastError || new Error('Không thể kết nối đến hệ thống AI.');
}

app.post('/api/generate-exam', async (req, res) => {
  try {
    const { data } = req.body as { data: ExamFormData };
    if (!data) {
      return res.status(400).json({ error: 'Dữ liệu đề kiểm tra không hợp lệ.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra Settings > Secrets.',
      });
    }

    const { prompt, systemInstruction } = getExamPromptAndInstruction(data);

    const text = await generateExamWithRetryAndFallback({
      contents: prompt,
      systemInstruction,
      temperature: 0.5,
    });

    return res.json({ text });
  } catch (error: any) {
    console.error('Error in /api/generate-exam:', error);
    const rawMsg = String(error?.message || error || '');

    let parsedMessage = rawMsg;
    try {
      if (rawMsg.includes('{') && rawMsg.includes('}')) {
        const jsonStart = rawMsg.indexOf('{');
        const jsonEnd = rawMsg.lastIndexOf('}');
        const parsed = JSON.parse(rawMsg.slice(jsonStart, jsonEnd + 1));
        if (parsed?.error?.message) {
          parsedMessage = parsed.error.message;
        }
      }
    } catch {}

    const lower = (rawMsg + ' ' + parsedMessage).toLowerCase();

    if (lower.includes('safety') || lower.includes('block')) {
      return res.status(400).json({
        error: 'Yêu cầu của bạn đã bị bộ lọc an toàn AI từ chối. Vui lòng kiểm tra lại nội dung kiến thức và yêu cầu bổ sung.',
      });
    }

    if (lower.includes('503') || lower.includes('unavailable') || lower.includes('high demand')) {
      return res.status(503).json({
        error: 'Mô hình AI hiện đang chịu tải cao (503 High Demand). Vui lòng nhấn nút "Thử lại ngay" sau vài giây!',
      });
    }

    if (lower.includes('429') || lower.includes('resource_exhausted') || lower.includes('quota')) {
      return res.status(429).json({
        error: 'Đã vượt quá giới hạn tần suất yêu cầu AI (429 Rate Limit). Vui lòng đợi 20-30 giây rồi thử lại.',
      });
    }

    return res.status(500).json({ error: `Đã xảy ra lỗi khi tạo đề: ${parsedMessage}` });
  }
});

app.post('/api/generate-lesson-plan', async (req, res) => {
  try {
    const { data } = req.body as { data: LessonPlanFormData };
    if (!data || !data.lessonName) {
      return res.status(400).json({ error: 'Dữ liệu kế hoạch bài dạy không hợp lệ. Vui lòng nhập tên bài học.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra Settings > Secrets.',
      });
    }

    const prompt = createLessonPlanPrompt(data);
    const systemInstruction = data.schoolLevel === 'Tiểu học'
      ? "You are an expert Vietnamese primary education pedagogical specialist AI creating comprehensive lesson plans adhering strictly to Official Dispatch 2345/BGDĐT-GDTH and Digital Competence Framework Circular 02/2025/TT-BGDĐT."
      : "You are an expert Vietnamese secondary education pedagogical specialist AI creating comprehensive lesson plans adhering strictly to Official Dispatch 5512/BGDĐT-GDTrH and Digital Competence Framework Circular 02/2025/TT-BGDĐT.";

    const text = await generateExamWithRetryAndFallback({
      contents: prompt,
      systemInstruction,
      temperature: 0.6,
    });

    return res.json({ text });
  } catch (error: any) {
    console.error('Error in /api/generate-lesson-plan:', error);
    const rawMsg = String(error?.message || error || '');

    let parsedMessage = rawMsg;
    try {
      if (rawMsg.includes('{') && rawMsg.includes('}')) {
        const jsonStart = rawMsg.indexOf('{');
        const jsonEnd = rawMsg.lastIndexOf('}');
        const parsed = JSON.parse(rawMsg.slice(jsonStart, jsonEnd + 1));
        if (parsed?.error?.message) {
          parsedMessage = parsed.error.message;
        }
      }
    } catch {}

    const lower = (rawMsg + ' ' + parsedMessage).toLowerCase();

    if (lower.includes('safety') || lower.includes('block')) {
      return res.status(400).json({
        error: 'Yêu cầu của bạn đã bị bộ lọc an toàn AI từ chối. Vui lòng kiểm tra lại nội dung bài học.',
      });
    }

    if (lower.includes('503') || lower.includes('unavailable') || lower.includes('high demand')) {
      return res.status(503).json({
        error: 'Mô hình AI hiện đang chịu tải cao (503 High Demand). Vui lòng nhấn nút "Thử lại ngay" sau vài giây!',
      });
    }

    if (lower.includes('429') || lower.includes('resource_exhausted') || lower.includes('quota')) {
      return res.status(429).json({
        error: 'Đã vượt quá giới hạn tần suất yêu cầu AI (429 Rate Limit). Vui lòng đợi 20-30 giây rồi thử lại.',
      });
    }

    return res.status(500).json({ error: `Đã xảy ra lỗi khi soạn giáo án: ${parsedMessage}` });
  }
});

app.post('/api/generate-slides', async (req, res) => {
  try {
    const { data, lessonPlanContent } = req.body as {
      data: LessonPlanFormData;
      lessonPlanContent: string;
    };
    if (!data || !lessonPlanContent) {
      return res.status(400).json({ error: 'Dữ liệu không hợp lệ. Cần có kế hoạch bài dạy để tạo slide.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra Settings > Secrets.',
      });
    }

    const { prompt, systemInstruction } = createSlidePresentationPrompt(data, lessonPlanContent);

    const text = await generateExamWithRetryAndFallback({
      contents: prompt,
      systemInstruction,
      temperature: 0.6,
    });

    return res.json({ text });
  } catch (error: any) {
    console.error('Error in /api/generate-slides:', error);
    const rawMsg = String(error?.message || error || '');
    return res.status(500).json({ error: `Lỗi khi tạo slide bài giảng: ${rawMsg}` });
  }
});

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.use((_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
