import type { LessonPlanFormData } from '../types';

export const generateLessonPlan = async (data: LessonPlanFormData): Promise<string> => {
  try {
    const response = await fetch('/api/generate-lesson-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.error || `Lỗi máy chủ (${response.status})`);
    }

    const json = await response.json();
    if (!json.text) {
      throw new Error('Không nhận được nội dung kế hoạch bài dạy từ hệ thống AI.');
    }

    return json.text;
  } catch (error: any) {
    console.error('Error in generateLessonPlan:', error);
    throw new Error(error?.message || 'Đã xảy ra lỗi không xác định khi soạn kế hoạch bài dạy.');
  }
};
