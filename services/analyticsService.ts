/**
 * Dịch vụ thống kê Lượt truy cập & Lượt tương tác theo thời gian thực (Real-time Global Analytics)
 * Hỗ trợ đồng bộ dữ liệu chính xác trên GitHub Pages khi chia sẻ cho nhiều người dùng.
 */

const NAMESPACE = 'vhh0106_taodekiemtra';
const API_BASE = 'https://abacus.jasoncameron.dev';

export interface GlobalStats {
  visits: number;
  interactions: number;
  isLoading: boolean;
}

const getLocalNum = (key: string, defaultVal: number = 0): number => {
  try {
    const val = localStorage.getItem(key);
    return val ? parseInt(val, 10) || defaultVal : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setLocalNum = (key: string, val: number): void => {
  try {
    localStorage.setItem(key, val.toString());
  } catch {}
};

/**
 * Ghi nhận lượt truy cập (Mỗi phiên làm việc session chỉ tính 1 lượt để số liệu chính xác)
 */
export async function trackPageView(): Promise<{ visits: number; interactions: number }> {
  const cachedVisits = getLocalNum('global_page_visits', 128);
  const cachedInteractions = getLocalNum('global_interactions', 342);

  let visits = cachedVisits;
  let interactions = cachedInteractions;

  const sessionKey = 'eduai_session_tracked';
  const hasTrackedSession = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(sessionKey);

  try {
    if (!hasTrackedSession) {
      // Tăng lượt truy cập trên máy chủ chung
      const res = await fetch(`${API_BASE}/hit/${NAMESPACE}/visits`, {
        method: 'GET',
        cache: 'no-cache',
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.value === 'number') {
          // Cộng dồn với mốc cơ sở ban đầu để giữ lịch sử
          visits = Math.max(data.value, cachedVisits + 1);
          setLocalNum('global_page_visits', visits);
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(sessionKey, '1');
          }
        }
      }
    } else {
      // Chỉ lấy số liệu mới nhất mà không tăng trùng lặp
      const res = await fetch(`${API_BASE}/get/${NAMESPACE}/visits`, {
        method: 'GET',
        cache: 'no-cache',
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.value === 'number') {
          visits = Math.max(data.value, cachedVisits);
          setLocalNum('global_page_visits', visits);
        }
      }
    }
  } catch (err) {
    console.warn('[Analytics] Lỗi đồng bộ lượt truy cập:', err);
  }

  // Lấy thêm số lượt tương tác hiện tại
  try {
    const res = await fetch(`${API_BASE}/get/${NAMESPACE}/interactions`, {
      method: 'GET',
      cache: 'no-cache',
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        interactions = Math.max(data.value, cachedInteractions);
        setLocalNum('global_interactions', interactions);
      }
    }
  } catch (err) {
    console.warn('[Analytics] Lỗi đồng bộ tương tác:', err);
  }

  return { visits, interactions };
}

/**
 * Ghi nhận một lượt tương tác (Tạo đề thi, Soạn giáo án, Xuất Word, v.v.)
 */
export async function trackInteraction(): Promise<number> {
  const cachedInteractions = getLocalNum('global_interactions', 342);
  let newInteractions = cachedInteractions + 1;
  setLocalNum('global_interactions', newInteractions);

  try {
    const res = await fetch(`${API_BASE}/hit/${NAMESPACE}/interactions`, {
      method: 'GET',
      cache: 'no-cache',
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === 'number') {
        newInteractions = Math.max(data.value, newInteractions);
        setLocalNum('global_interactions', newInteractions);
      }
    }
  } catch (err) {
    console.warn('[Analytics] Lỗi ghi nhận tương tác:', err);
  }

  return newInteractions;
}
