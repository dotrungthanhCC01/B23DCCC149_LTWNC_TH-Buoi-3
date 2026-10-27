import { SUBJECT_COLORS, type Subject } from "@/lib/types";

/** Chấm màu + tên môn */
export default function SubjectDot({ subject, short = false, className = "" }: { subject: Subject; short?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className="size-2 shrink-0 rounded-full ring-1 ring-black/20"
        style={{ background: SUBJECT_COLORS[subject.color].dot }}
        aria-hidden
      />
      {short ? subject.short : subject.name}
    </span>
  );
}
