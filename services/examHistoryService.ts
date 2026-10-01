import type { ExamFormData, ExamResult, SavedExamItem } from '../types';

const STORAGE_KEY = 'cv7991_exam_history';
const MAX_HISTORY_ITEMS = 30;

export const getSavedExams = (): SavedExamItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error('Lỗi khi đọc lịch sử đề thi từ localStorage:', error);
    return [];
  }
};

export const saveExamToHistory = (
  formData: ExamFormData,
  result: ExamResult
): SavedExamItem => {
  const currentList = getSavedExams();

  const title = `Đề ${formData.subject} ${formData.grade} (${formData.textbook})`;
  const newItem: SavedExamItem = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    title,
    formData: JSON.parse(JSON.stringify(formData)),
    result: JSON.parse(JSON.stringify(result)),
  };

  // Add new item at the top and avoid duplicates with identical result and formData if generated within seconds
  let updatedList = [
    newItem,
    ...currentList.filter(
      (item) =>
        item.formData.subject !== formData.subject ||
        item.formData.grade !== formData.grade ||
        item.formData.knowledgeContent !== formData.knowledgeContent ||
        Math.abs(new Date(item.createdAt).getTime() - Date.now()) > 60000
    ),
  ];

  if (updatedList.length > MAX_HISTORY_ITEMS) {
    updatedList = updatedList.slice(0, MAX_HISTORY_ITEMS);
  }

  // Attempt to save, pruning older entries if quota exceeded
  let saved = false;
  while (!saved && updatedList.length > 0) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      saved = true;
    } catch (e: any) {
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        console.warn('LocalStorage quota exceeded, trimming oldest exam history...');
        updatedList.pop();
      } else {
        console.error('Không thể lưu đề thi vào localStorage:', e);
        break;
      }
    }
  }

  return newItem;
};

export const deleteExamFromHistory = (id: string): SavedExamItem[] => {
  try {
    const currentList = getSavedExams();
    const updatedList = currentList.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (error) {
    console.error('Lỗi khi xóa đề thi khỏi lịch sử:', error);
    return getSavedExams();
  }
};

export const clearAllExamHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Lỗi khi xóa toàn bộ lịch sử đề thi:', error);
  }
};
