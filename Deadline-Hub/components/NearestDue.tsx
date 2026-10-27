"use client";

import { getTimeLeft } from "@/lib/time";
import { useNow } from "./useNow";

/** "Gần nhất: còn 3 ngày" — deadline sắp tới gần nhất trong danh sách. */
export default function NearestDue({ dues }: { dues: string[] }) {
  const now = useNow();
  if (now === null) return <span className="opacity-40">Gần nhất: …</span>;
  const next = dues.map((d) => getTimeLeft(d, now)).find((l) => !l.overdue);
  return <span>{next ? `Gần nhất: ${next.label.toLowerCase()}` : "Đã hết deadline"}</span>;
}
