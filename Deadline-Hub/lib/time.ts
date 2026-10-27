/** Tiện ích ngày giờ — an toàn cho cả Server lẫn Client Component. */
const TZ = "Asia/Ho_Chi_Minh";
export const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

const formatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: TZ,
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function parts(iso: string) {
  const map: Record<string, string> = {};
  for (const p of formatter.formatToParts(new Date(iso))) map[p.type] = p.value;
  return {
    day: map.day,
    month: map.month,
    year: map.year,
    hour: map.hour,
    minute: map.minute,
    weekday: map.weekday.charAt(0).toUpperCase() + map.weekday.slice(1),
  };
}

/** 29/10/2026 */
export function formatDate(iso: string) {
  const p = parts(iso);
  return `${p.day}/${p.month}/${p.year}`;
}

/** 29/10/2026 23:59 */
export function formatDateTime(iso: string) {
  const p = parts(iso);
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
}

/** 23:59 · 29/10/2026 */
export function formatTimeDate(iso: string) {
  const p = parts(iso);
  return `${p.hour}:${p.minute} · ${p.day}/${p.month}/${p.year}`;
}

/** 23:59 · Thứ Năm, 29/10/2026 */
export function formatDueLong(iso: string) {
  const p = parts(iso);
  return `${p.hour}:${p.minute} · ${p.weekday}, ${p.day}/${p.month}/${p.year}`;
}

/** Thứ Ba, 27/10/2026 */
export function formatWeekdayDate(iso: string) {
  const p = parts(iso);
  return `${p.weekday}, ${p.day}/${p.month}/${p.year}`;
}

/** { day: "24", month: "TH10" } cho ô lịch nhỏ */
export function dayBlock(iso: string) {
  const p = parts(iso);
  return { day: p.day, month: `TH${Number(p.month)}` };
}

export type Tone = "soon" | "later" | "overdue";

export interface TimeLeft {
  overdue: boolean;
  days: number;
  hours: number;
  minutes: number;
  label: string;
  tone: Tone;
}

export function getTimeLeft(dueIso: string, now: number): TimeLeft {
  const diff = new Date(dueIso).getTime() - now;
  if (diff < 0) {
    const days = Math.max(1, Math.ceil(-diff / DAY));
    return { overdue: true, days, hours: 0, minutes: 0, label: `Quá hạn ${days} ngày`, tone: "overdue" };
  }
  const days = Math.floor(diff / DAY);
  const hours = Math.floor((diff % DAY) / HOUR);
  const minutes = Math.floor((diff % HOUR) / 60000);
  const label = days >= 1 ? `Còn ${days} ngày` : hours >= 1 ? `Còn ${hours} giờ` : `Còn ${minutes} phút`;
  return { overdue: false, days, hours, minutes, label, tone: days < 4 ? "soon" : "later" };
}

export function isOverdue(dueIso: string, now: number) {
  return new Date(dueIso).getTime() < now;
}

/** Đến hạn trong 7 ngày tới */
export function isDueThisWeek(dueIso: string, now: number) {
  const diff = new Date(dueIso).getTime() - now;
  return diff >= 0 && diff <= 7 * DAY;
}
