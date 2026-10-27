"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { toggleDoneAction } from "@/app/actions";
import type { Deadline, Subject } from "@/lib/types";
import { formatDateTime } from "@/lib/time";
import DueBadge from "@/components/DueBadge";
import SubjectDot from "@/components/SubjectDot";

/** Một dòng deadline có ô đánh dấu đã xong (cập nhật lạc quan, rồi server xác nhận). */
export default function CheckRow({ deadline, subject, done }: { deadline: Deadline; subject: Subject; done: boolean }) {
  const [optimisticDone, setOptimisticDone] = useOptimistic(done);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    const next = !optimisticDone;
    setError(null);
    startTransition(async () => {
      setOptimisticDone(next);
      const res = await toggleDoneAction(deadline.id, next);
      if (!res.ok) setError(res.error);
    });
  }

  return (
    <li className={`flex items-center gap-3 rounded-2xl border border-line p-3 ${optimisticDone ? "bg-paper/60" : ""}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={optimisticDone}
        aria-label={`Đánh dấu "${deadline.title}" ${optimisticDone ? "chưa xong" : "đã xong"}`}
        onClick={toggle}
        disabled={pending}
        className={`grid size-9 shrink-0 place-items-center rounded-xl border-2 transition-colors ${
          optimisticDone ? "border-ink bg-lime" : "border-ink/70 bg-white hover:bg-lime-soft"
        }`}
      >
        {optimisticDone && <Check className="size-5" strokeWidth={3} aria-hidden />}
      </button>
      <div className="min-w-0 flex-1">
        <Link
          href={`/deadlines/${deadline.id}`}
          className={`block truncate text-sm font-semibold hover:underline ${optimisticDone ? "text-muted line-through" : ""}`}
        >
          {deadline.title}
        </Link>
        <p className="flex flex-wrap items-center gap-x-1 text-xs text-muted">
          <SubjectDot subject={subject} /> · {formatDateTime(deadline.due)}
        </p>
        {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      </div>
      {optimisticDone ? (
        <span className="inline-flex h-6 items-center rounded-full bg-lime px-2.5 text-xs font-semibold">Đã xong</span>
      ) : (
        <DueBadge due={deadline.due} />
      )}
    </li>
  );
}
