import type { ExamFormData } from '../types';

export const generateExam = async (data: ExamFormData): Promise<string> => {
  try {
    const response = await fetch('/api/generate-exam', {
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
      throw new Error('Không nhận được nội dung từ hệ thống AI.');
    }

    return json.text;
  } catch (error: any) {
    console.error('Error in generateExam:', error);
    throw new Error(error?.message || 'Đã xảy ra lỗi không xác định khi tạo đề thi.');
  }
};
