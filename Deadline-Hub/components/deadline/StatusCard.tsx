"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { toggleDoneAction } from "@/app/actions";
import { can } from "@/lib/permissions";

/** "Trạng thái của bạn" ở trang chi tiết: trang là ISR nên trạng thái cá nhân được tải ở client. */
export default function StatusCard({ deadlineId }: { deadlineId: number }) {
  const { data: session, status } = useSession();
  const [done, setDone] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const allowed = can(session?.user?.role, "deadline:complete");

  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;
    fetch("/api/progress", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { done: [] }))
      .then((json: { done: number[] }) => !cancelled && setDone(json.done.includes(deadlineId)))
      .catch(() => !cancelled && setDone(false));
    return () => {
      cancelled = true;
    };
  }, [allowed, deadlineId]);

  function toggle() {
    const next = !done;
    setDone(next);
    setError(null);
    startTransition(async () => {
      const res = await toggleDoneAction(deadlineId, next);
      if (!res.ok) {
        setDone(!next);
        setError(res.error);
      }
    });
  }

  return (
    <div className="card p-5">
      <h2 className="text-sm font-bold">Trạng thái của bạn</h2>
      {status === "loading" || (allowed && done === null) ? (
        <div className="mt-3 space-y-2">
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      ) : !allowed ? (
        <>
          <p className="mt-3 flex gap-2 rounded-xl bg-paper p-3 text-xs text-muted">
            <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden /> Đăng nhập để đánh dấu deadline đã xong.
          </p>
          <Link href={`/login?callbackUrl=/deadlines/${deadlineId}`} className="btn btn-violet mt-3 w-full rounded-xl py-2.5">
            Đăng nhập
          </Link>
        </>
      ) : (
        <>
          <p className={`mt-3 flex items-center gap-2 rounded-xl p-3 text-xs font-medium ${done ? "bg-lime-soft" : "bg-paper text-muted"}`}>
            {done ? <CheckCircle2 className="size-4 text-[#4d6b00]" aria-hidden /> : <Circle className="size-4" aria-hidden />}
            {done ? "Bạn đã hoàn thành deadline này." : "Bạn chưa hoàn thành deadline này."}
          </p>
          <button
            type="button"
            onClick={toggle}
            disabled={pending}
            className={`btn mt-3 w-full rounded-xl py-2.5 ${done ? "btn-outline" : "btn-dark"}`}
          >
            {done ? "Bỏ đánh dấu" : "Đánh dấu đã xong"}
          </button>
          {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
        </>
      )}
    </div>
  );
}
