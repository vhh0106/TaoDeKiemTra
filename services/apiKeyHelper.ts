export const isStaticHosting = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host.endsWith('github.io') || host.includes('pages.dev') || window.location.protocol === 'file:';
};

export const markApiKeyAsLeaked = (badKey: string): void => {
  try {
    if (badKey) {
      localStorage.setItem('LEAKED_GEMINI_API_KEY', badKey.trim());
    }
    localStorage.removeItem('VITE_GEMINI_API_KEY');
    localStorage.removeItem('GEMINI_API_KEY');
  } catch {}
};

export const getClientApiKey = (): string => {
  // 1. ƯU TIÊN 1: Khóa do người dùng tự nhập hoặc lưu trong localStorage
  try {
    const localKey = localStorage.getItem('VITE_GEMINI_API_KEY') || localStorage.getItem('GEMINI_API_KEY');
    if (localKey && localKey.trim().length > 0) {
      const leakedKey = localStorage.getItem('LEAKED_GEMINI_API_KEY');
      // Nếu khóa trong localStorage chưa bị đánh dấu là leaked thì sử dụng
      if (!leakedKey || localKey.trim() !== leakedKey.trim()) {
        return localKey.trim();
      }
    }
  } catch {}

  // 2. ƯU TIÊN 2: Khóa được build vào ứng dụng (từ GitHub Actions / env)
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0 && !envKey.startsWith('$')) {
    try {
      const leakedKey = localStorage.getItem('LEAKED_GEMINI_API_KEY');
      // Nếu khóa build-time này từng bị Google báo leaked thì bỏ qua không dùng
      if (leakedKey && envKey.trim() === leakedKey.trim()) {
        return '';
      }
    } catch {}
    return envKey.trim();
  }

  return '';
};

export const setClientApiKey = (key: string): void => {
  try {
    const cleaned = key.trim();
    localStorage.setItem('VITE_GEMINI_API_KEY', cleaned);
    // Xóa cờ leaked nếu người dùng nhập khóa mới khác khóa cũ
    const leakedKey = localStorage.getItem('LEAKED_GEMINI_API_KEY');
    if (leakedKey && leakedKey === cleaned) {
      localStorage.removeItem('LEAKED_GEMINI_API_KEY');
    }
  } catch {}
};

export const clearClientApiKey = (): void => {
  try {
    localStorage.removeItem('VITE_GEMINI_API_KEY');
    localStorage.removeItem('GEMINI_API_KEY');
  } catch {}
};

export const promptForNewApiKey = (reason?: string): string => {
  if (typeof window === 'undefined') return '';

  const defaultMsg =
    'Khóa API hiện tại đã bị Google vô hiệu hóa vì lý do bảo mật (bị lộ lên GitHub công khai - Leaked API Key).\n\n' +
    'Vui lòng nhập một Gemini API Key MỚI để tiếp tục:\n' +
    '(Thầy/cô có thể tạo key mới hoàn toàn MIỄN PHÍ tại: https://aistudio.google.com/app/apikey)';

  const promptMsg = reason ? `${reason}\n\n${defaultMsg}` : defaultMsg;
  const input = window.prompt(promptMsg);

  if (input && input.trim().length > 0) {
    setClientApiKey(input.trim());
    return input.trim();
  }

  return '';
};

export const ensureClientApiKey = (): string => {
  const existing = getClientApiKey();
  if (existing) return existing;

  return promptForNewApiKey();
};
