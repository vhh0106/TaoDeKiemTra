export const isStaticHosting = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host.endsWith('github.io') || host.includes('pages.dev') || window.location.protocol === 'file:';
};

export const getClientApiKey = (): string => {
  // 1. Kiểm tra biến môi trường được build vào ứng dụng
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0 && !envKey.startsWith('$')) {
    return envKey.trim();
  }

  // 2. Kiểm tra localStorage (nếu người dùng đã nhập trên GitHub Pages)
  try {
    const localKey = localStorage.getItem('VITE_GEMINI_API_KEY') || localStorage.getItem('GEMINI_API_KEY');
    if (localKey && localKey.trim().length > 0) {
      return localKey.trim();
    }
  } catch {}

  return '';
};

export const setClientApiKey = (key: string): void => {
  try {
    localStorage.setItem('VITE_GEMINI_API_KEY', key.trim());
  } catch {}
};

export const ensureClientApiKey = (): string => {
  const existing = getClientApiKey();
  if (existing) return existing;

  if (typeof window !== 'undefined') {
    const input = window.prompt(
      'Ứng dụng đang chạy trên GitHub Pages (máy chủ tĩnh không có backend).\n\nVui lòng nhập Gemini API Key của bạn để tiếp tục (Lấy miễn phí tại https://aistudio.google.com/app/apikey):\n\n(Key sẽ được lưu trong trình duyệt của bạn cho các lần sử dụng tiếp theo)'
    );

    if (input && input.trim().length > 0) {
      setClientApiKey(input.trim());
      return input.trim();
    }
  }

  return '';
};
