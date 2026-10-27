"use client";

import { getTimeLeft } from "@/lib/time";
import { useNow } from "./useNow";

const pad = (n: number) => String(n).padStart(2, "0");

/** Đếm ngược ngày/giờ/phút. variant "boxes" cho hero, "inline" cho trang chi tiết. */
export default function Countdown({ due, variant = "boxes" }: { due: string; variant?: "boxes" | "inline" }) {
  const now = useNow();
  const left = now === null ? null : getTimeLeft(due, now);
  const values = left && !left.overdue ? [left.days, left.hours, left.minutes] : [0, 0, 0];
  const text = (i: number) => (left ? pad(values[i]) : "--");

  if (variant === "inline") {
    return (
      <span className="inline-flex items-center rounded-xl bg-white px-3 py-2 font-display text-xl tracking-wide" aria-live="polite">
        {left?.overdue ? "Đã hết hạn" : `${text(0)}d : ${text(1)}h : ${text(2)}m`}
      </span>
    );
  }

  return (
    <div className="flex gap-2" aria-live="polite">
      {["ngày", "giờ", "phút"].map((unit, i) => (
        <div key={unit} className="w-16 rounded-xl bg-white py-2 text-center">
          <div className="font-display text-2xl leading-none">{text(i)}</div>
          <div className="mt-1 text-[11px] text-muted">{unit}</div>
        </div>
      ))}
    </div>
  );
}
