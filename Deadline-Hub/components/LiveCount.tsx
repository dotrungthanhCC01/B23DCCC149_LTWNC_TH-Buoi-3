"use client";

import { isDueThisWeek, isOverdue } from "@/lib/time";
import { useNow } from "./useNow";

/** Đếm số deadline theo thời điểm hiện tại (sắp tới / quá hạn / trong 7 ngày). */
export default function LiveCount({ dues, kind }: { dues: string[]; kind: "upcoming" | "overdue" | "week" }) {
  const now = useNow();
  if (now === null) return <span className="opacity-30">–</span>;
  const count = dues.filter((due) =>
    kind === "overdue" ? isOverdue(due, now) : kind === "week" ? isDueThisWeek(due, now) : !isOverdue(due, now),
  ).length;
  return <>{count}</>;
}
