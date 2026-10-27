export const DEADLINE_TYPES = ["Bài tập", "Lab", "Đồ án", "Báo cáo", "Kiểm tra", "Thuyết trình"] as const;
export type DeadlineType = (typeof DEADLINE_TYPES)[number];

export type SubjectColor = "lavender" | "lime" | "pink" | "peach";

export interface Subject {
  slug: string;
  name: string;
  short: string;
  color: SubjectColor;
  teacher: string;
  code: string;
}

export interface Deadline {
  id: number;
  title: string;
  subject: string; // slug môn học
  type: DeadlineType;
  due: string; // ISO 8601, giờ Việt Nam
  submission: string;
  description: string;
}

/** Bảng màu dùng chung cho server và client */
export const SUBJECT_COLORS: Record<SubjectColor, { bg: string; dot: string }> = {
  lavender: { bg: "#d9c4fc", dot: "#b48cf5" },
  lime: { bg: "#d8f70f", dot: "#b8d400" },
  pink: { bg: "#fbc5e4", dot: "#ee8fc4" },
  peach: { bg: "#fcd692", dot: "#eeb04f" },
};
