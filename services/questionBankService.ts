/**
 * Quản lý Ngân Hàng Câu Hỏi trong LocalStorage (Mục 18)
 */

import type { QuestionItem } from '../types';

const STORAGE_KEY = 'eduai_question_bank_items';

export interface BankQuestionItem extends QuestionItem {
  schoolLevel: string;
  createdAt: string;
  bankId: string;
}

export function getQuestionBank(): BankQuestionItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSeedQuestions();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading question bank:', err);
    return [];
  }
}

export function saveQuestionToBank(question: QuestionItem, schoolLevel = 'THCS'): BankQuestionItem {
  const bank = getQuestionBank();
  const newItem: BankQuestionItem = {
    ...question,
    schoolLevel,
    bankId: 'bank_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toLocaleDateString('vi-VN'),
  };
  const updated = [newItem, ...bank];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newItem;
}

export function saveMultipleQuestionsToBank(questions: QuestionItem[], schoolLevel = 'THCS'): number {
  const bank = getQuestionBank();
  const newItems: BankQuestionItem[] = questions.map((q) => ({
    ...q,
    schoolLevel,
    bankId: 'bank_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toLocaleDateString('vi-VN'),
  }));
  const updated = [...newItems, ...bank];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newItems.length;
}

export function updateQuestionInBank(item: BankQuestionItem): void {
  const bank = getQuestionBank();
  const updated = bank.map((q) => (q.bankId === item.bankId ? item : q));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteQuestionFromBank(bankId: string): void {
  const bank = getQuestionBank();
  const updated = bank.filter((q) => q.bankId !== bankId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function cloneQuestionInBank(bankId: string): BankQuestionItem | null {
  const bank = getQuestionBank();
  const target = bank.find((q) => q.bankId === bankId);
  if (!target) return null;
  const cloned: BankQuestionItem = {
    ...target,
    bankId: 'bank_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    question: target.question + ' (Bản sao)',
    createdAt: new Date().toLocaleDateString('vi-VN'),
  };
  const updated = [cloned, ...bank];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return cloned;
}

function getDefaultSeedQuestions(): BankQuestionItem[] {
  const seed: BankQuestionItem[] = [
    {
      bankId: 'seed_1',
      id: 'Q01',
      schoolLevel: 'THCS',
      grade: 'Lớp 7',
      subject: 'Toán',
      topic: 'Số hữu tỉ',
      questionType: 'mcq_4',
      level: 'Nhận biết',
      question: 'Số nào sau đây là số hữu tỉ dương?',
      options: ['A. -2/3', 'B. 0', 'C. 3/4', 'D. -5'],
      correctAnswer: 'C',
      explanation: 'Số hữu tỉ dương là số hữu tỉ lớn hơn 0. Do đó 3/4 > 0 là số hữu tỉ dương.',
      score: 0.25,
      learningOutcome: 'Nhận biết được số hữu tỉ dương, âm',
      createdAt: '01/03/2026',
    },
    {
      bankId: 'seed_2',
      id: 'Q02',
      schoolLevel: 'THPT',
      grade: 'Lớp 10',
      subject: 'Vật lí',
      topic: 'Chuyển động thẳng đều',
      questionType: 'mcq_4',
      level: 'Thông hiểu',
      question: 'Đồ thị vận tốc theo thời gian của một vật chuyển động thẳng đều là:',
      options: ['A. Một đường cong parabol', 'B. Một đường thẳng song song với trục thời gian', 'C. Một đường thẳng đi qua gốc tọa độ', 'D. Một đường hyperbol'],
      correctAnswer: 'B',
      explanation: 'Trong chuyển động thẳng đều, vận tốc v không đổi theo thời gian nên đồ thị v-t là đường thẳng song song với trục hoành Ot.',
      score: 0.25,
      learningOutcome: 'Hiểu được đặc điểm đồ thị v-t của chuyển động thẳng đều',
      createdAt: '02/03/2026',
    },
    {
      bankId: 'seed_3',
      id: 'Q03',
      schoolLevel: 'Tiểu học',
      grade: 'Lớp 4',
      subject: 'Tiếng Việt',
      topic: 'Từ loại',
      questionType: 'mcq_4',
      level: 'Nhận biết',
      question: 'Từ nào dưới đây là danh từ chỉ người?',
      options: ['A. Thầy giáo', 'B. Cây bàng', 'C. Bàn học', 'D. Chăm chỉ'],
      correctAnswer: 'A',
      explanation: '"Thầy giáo" là danh từ chỉ người làm nghề dạy học.',
      score: 0.5,
      learningOutcome: 'Nhận biết danh từ chỉ người trong câu',
      createdAt: '03/03/2026',
    }
  ];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  } catch {}
  return seed;
}
