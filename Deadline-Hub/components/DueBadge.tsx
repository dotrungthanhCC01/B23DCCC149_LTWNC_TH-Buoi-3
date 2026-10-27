"use client";

import { getTimeLeft, type Tone } from "@/lib/time";
import { useNow } from "./useNow";

export const TONE_CLASSES: Record<Tone, string> = {
  soon: "bg-[#fdf0c2] text-[#8a5300]",
  later: "bg-[#efe5fe] text-[#6420d9]",
  overdue: "bg-[#fde1df] text-[#c0281b]",
};

/** Nhãn "Còn X ngày" / "Quá hạn Y ngày", tính theo giờ của trình duyệt. */
export default function DueBadge({ due, className = "", plain = false }: { due: string; className?: string; plain?: boolean }) {
  const now = useNow();
  if (now === null) {
    return <span className={`inline-block rounded-full bg-paper ${plain ? "h-3 w-14" : "h-6 w-20"} ${className}`} aria-hidden />;
  }
  const left = getTimeLeft(due, now);
  if (plain) {
    return <span className={`block text-[11px] font-medium ${left.overdue ? "text-[#c0281b]" : "text-violet"} ${className}`}>{left.label}</span>;
  }
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-semibold ${TONE_CLASSES[left.tone]} ${className}`}
    >
      {left.label}
    </span>
  );
}
