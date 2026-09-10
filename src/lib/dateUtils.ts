/**
 * Date and relative time formatting utilities according to user criteria:
 * - 실제 액션을 취한 일자 및 경과 시간 계산
 * - 경과 기준:
 *   - 1분 미만: '방금 전'
 *   - 1시간 미만: 'N분 전'
 *   - 24시간 미만: 'N시간 전'
 *   - 1일 이상 ~ 29일 이하: 'N일 전' (몇일 전)
 *   - 30일 이상 (1개월 이상): 'N개월 전'
 *   - 365일 이상 (1년 이상): 'N년 전'
 */

export function getActionTimestamp(dateInput?: number | string): number {
  if (!dateInput) return Date.now();
  if (typeof dateInput === 'number') return dateInput;

  const trimmed = dateInput.trim();
  // Numeric string (milliseconds or seconds)
  if (/^\d{10,13}$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    return num < 10000000000 ? num * 1000 : num;
  }

  // Common date formats: "2026.07.24 10:30", "2026.07.24", "2026-07-24"
  const normalized = trimmed.replace(/\./g, '-');
  const parsed = new Date(normalized).getTime();
  return isNaN(parsed) ? Date.now() : parsed;
}

export function formatRelativeTime(dateInput?: number | string, fallbackText?: string): string {
  if (!dateInput && fallbackText) return fallbackText;
  const timeMs = getActionTimestamp(dateInput);
  const now = Date.now();
  const diffMs = Math.max(0, now - timeMs);

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) {
    return '방금 전';
  }
  if (diffMin < 60) {
    return `${diffMin}분 전`;
  }
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }
  // 1일 ~ 29일: 'N일 전'
  if (diffDays < 30) {
    return `${diffDays}일 전`;
  }
  // 30일 이상: 1개월이 지나면 개월 수 단위로 변경
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}개월 전`;
  }
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}년 전`;
}

export function formatActionDate(dateInput?: number | string): string {
  const timeMs = getActionTimestamp(dateInput);
  const d = new Date(timeMs);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function formatActionDateTime(dateInput?: number | string): string {
  const timeMs = getActionTimestamp(dateInput);
  const d = new Date(timeMs);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}
