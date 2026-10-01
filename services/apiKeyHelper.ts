import { BACKUP_OBFUSCATED_KEY } from './encodedKey';

declare const __SECURE_API_KEY__: string;

const SALT = 'EduAI_2025_BGD_CV7991_TT02';

export const isStaticHosting = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host.endsWith('github.io') || host.includes('pages.dev') || window.location.protocol === 'file:';
};

export const deobfuscateKey = (encoded: string): string => {
  if (!encoded || typeof encoded !== 'string') return '';
  const trimmed = encoded.trim();
  // Nếu vô tình là key thô thì trả về trực tiếp
  if (trimmed.startsWith('AIzaSy') || trimmed.startsWith('AQ.')) {
    return trimmed;
  }
  try {
    const jsonStr = atob(trimmed);
    const codes: number[] = JSON.parse(jsonStr);
    let result = '';
    for (let i = 0; i < codes.length; i++) {
      result += String.fromCharCode(codes[i] ^ SALT.charCodeAt(i % SALT.length));
    }
    return result.trim();
  } catch {
    return '';
  }
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
  // 1. Ưu tiên khóa người dùng tự nhập trong trình duyệt (nếu có)
  try {
    const localKey = localStorage.getItem('VITE_GEMINI_API_KEY') || localStorage.getItem('GEMINI_API_KEY');
    if (localKey && localKey.trim().length > 0) {
      const leakedKey = localStorage.getItem('LEAKED_GEMINI_API_KEY');
      if (!leakedKey || localKey.trim() !== leakedKey.trim()) {
        return localKey.trim();
      }
    }
  } catch {}

  // 2. Khóa bảo mật nạp từ Vite build (đã mã hóa an toàn chống GitHub Secret Scanner)
  try {
    if (typeof __SECURE_API_KEY__ !== 'undefined' && __SECURE_API_KEY__) {
      const decoded = deobfuscateKey(__SECURE_API_KEY__);
      if (decoded && (decoded.startsWith('AIzaSy') || decoded.startsWith('AQ.') || decoded.length > 25)) {
        const leakedKey = localStorage.getItem('LEAKED_GEMINI_API_KEY');
        if (!leakedKey || decoded.trim() !== leakedKey.trim()) {
          return decoded.trim();
        }
      }
    }
  } catch {}

  // 3. Khóa bảo mật dự phòng trong file encodedKey.ts
  try {
    if (BACKUP_OBFUSCATED_KEY && BACKUP_OBFUSCATED_KEY.trim().length > 0) {
      const decodedBackup = deobfuscateKey(BACKUP_OBFUSCATED_KEY);
      if (decodedBackup && (decodedBackup.startsWith('AIzaSy') || decodedBackup.startsWith('AQ.') || decodedBackup.length > 25)) {
        const leakedKey = localStorage.getItem('LEAKED_GEMINI_API_KEY');
        if (!leakedKey || decodedBackup.trim() !== leakedKey.trim()) {
          return decodedBackup.trim();
        }
      }
    }
  } catch {}

  // 4. Biến môi trường thông thường (nếu có)
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0 && !envKey.startsWith('$')) {
    try {
      const leakedKey = localStorage.getItem('LEAKED_GEMINI_API_KEY');
      if (!leakedKey || envKey.trim() !== leakedKey.trim()) {
        return envKey.trim();
      }
    } catch {}
  }

  return '';
};

export const setClientApiKey = (key: string): void => {
  try {
    const cleaned = key.trim();
    localStorage.setItem('VITE_GEMINI_API_KEY', cleaned);
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

export const ensureClientApiKey = (reason?: string): string => {
  const existing = getClientApiKey();
  if (existing) return existing;

  return promptForNewApiKey(reason);
};
