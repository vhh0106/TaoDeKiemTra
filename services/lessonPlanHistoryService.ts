import type { LessonPlanFormData, SavedLessonPlanItem } from '../types';

const STORAGE_KEY = 'eduai_lesson_plan_history';
const MAX_HISTORY_ITEMS = 30;

export const getSavedLessonPlans = (): SavedLessonPlanItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error('Lỗi khi đọc lịch sử kế hoạch bài dạy:', error);
    return [];
  }
};

export const saveLessonPlanToHistory = (
  formData: LessonPlanFormData,
  content: string
): SavedLessonPlanItem => {
  const currentList = getSavedLessonPlans();

  const title = `${formData.lessonName} - ${formData.subject} ${formData.grade}`;
  const newItem: SavedLessonPlanItem = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    title,
    formData: JSON.parse(JSON.stringify(formData)),
    content,
  };

  let updatedList = [
    newItem,
    ...currentList.filter(
      (item) =>
        item.formData.lessonName !== formData.lessonName ||
        item.formData.subject !== formData.subject ||
        item.formData.grade !== formData.grade ||
        Math.abs(new Date(item.createdAt).getTime() - Date.now()) > 60000
    ),
  ];

  if (updatedList.length > MAX_HISTORY_ITEMS) {
    updatedList = updatedList.slice(0, MAX_HISTORY_ITEMS);
  }

  let saved = false;
  while (!saved && updatedList.length > 0) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      saved = true;
    } catch (e: any) {
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        console.warn('LocalStorage quota exceeded, trimming oldest lesson plan...');
        updatedList.pop();
      } else {
        console.error('Không thể lưu kế hoạch bài dạy vào localStorage:', e);
        break;
      }
    }
  }

  return newItem;
};

export const deleteLessonPlanFromHistory = (id: string): SavedLessonPlanItem[] => {
  try {
    const currentList = getSavedLessonPlans();
    const updatedList = currentList.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (error) {
    console.error('Lỗi khi xóa kế hoạch bài dạy:', error);
    return getSavedLessonPlans();
  }
};

export const clearAllLessonPlanHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Lỗi khi xóa toàn bộ lịch sử kế hoạch bài dạy:', error);
  }
};
