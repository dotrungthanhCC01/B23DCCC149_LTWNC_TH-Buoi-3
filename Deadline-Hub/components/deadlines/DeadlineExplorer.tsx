"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Deadline, Subject } from "@/lib/types";
import { SUBJECT_COLORS } from "@/lib/types";
import { formatDateTime, isOverdue } from "@/lib/time";
import DueBadge from "@/components/DueBadge";
import SubjectDot from "@/components/SubjectDot";
import { useNow } from "@/components/useNow";

export type DeadlineSummary = Pick<Deadline, "id" | "title" | "subject" | "type" | "due">;
type Status = "all" | "upcoming" | "overdue";

/** Bộ lọc deadline (tìm theo tên, môn, trạng thái) — chạy hoàn toàn ở client nên trang vẫn là ISR. */
export default function DeadlineExplorer({
  deadlines,
  subjects,
  heading,
}: {
  deadlines: DeadlineSummary[];
  subjects: Subject[];
  heading: React.ReactNode;
}) {
  const now = useNow();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string>("all");
  const [status, setStatus] = useState<Status>("all");

  const counts = useMemo(() => {
    if (now === null) return null;
    const overdue = deadlines.filter((d) => isOverdue(d.due, now)).length;
    return { all: deadlines.length, upcoming: deadlines.length - overdue, overdue };
  }, [deadlines, now]);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("vi");
    return deadlines.filter((d) => {
      if (subject !== "all" && d.subject !== subject) return false;
      if (q && !d.title.toLocaleLowerCase("vi").includes(q)) return false;
      if (status !== "all" && now !== null && isOverdue(d.due, now) !== (status === "overdue")) return false;
      return true;
    });
  }, [deadlines, query, subject, status, now]);

  const subjectOf = (slug: string) => subjects.find((s) => s.slug === slug);

  const tabs: { key: Status; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "upcoming", label: "Sắp tới" },
    { key: "overdue", label: "Quá hạn" },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink/15 pb-3">
        {heading}
        <div role="tablist" aria-label="Lọc theo trạng thái" className="flex gap-1 rounded-xl bg-white p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={status === t.key}
              onClick={() => setStatus(t.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                status === t.key ? "bg-ink text-white" : "text-ink/70 hover:bg-paper"
              }`}
            >
              {t.label} <span className="opacity-70">{counts ? counts[t.key] : "–"}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Tìm theo tên deadline</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên deadline..."
            className="input rounded-full py-3 pl-10"
          />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Lọc theo môn">
          {[{ slug: "all", short: "Tất cả môn", dot: "#ffffff" }, ...subjects.map((s) => ({ slug: s.slug, short: s.short, dot: SUBJECT_COLORS[s.color].dot }))].map(
            (s) => (
              <button
                key={s.slug}
                type="button"
                aria-pressed={subject === s.slug}
                onClick={() => setSubject(s.slug)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  subject === s.slug ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40"
                }`}
              >
                <span className="size-2 rounded-full ring-1 ring-black/20" style={{ background: s.dot }} aria-hidden />
                {s.short}
              </button>
            ),
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted" aria-live="polite">
        Hiển thị <b className="text-ink">{visible.length}</b> / {deadlines.length} deadline
      </p>

      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {visible.map((d) => {
          const s = subjectOf(d.subject);
          return (
            <li key={d.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[15px] font-bold leading-snug">{d.title}</h2>
                <DueBadge due={d.due} />
              </div>
              <dl className="mt-4 divide-y divide-line border-y border-line text-xs">
                <div className="flex justify-between gap-2 py-2">
                  <dt className="text-muted">Môn</dt>
                  <dd className="text-right font-medium">{s ? <SubjectDot subject={s} /> : d.subject}</dd>
                </div>
                <div className="flex justify-between gap-2 py-2">
                  <dt className="text-muted">Hạn nộp</dt>
                  <dd className="font-semibold">{formatDateTime(d.due).replace(" ", " · ")}</dd>
                </div>
                <div className="flex justify-between gap-2 py-2">
                  <dt className="text-muted">Loại</dt>
                  <dd className="font-medium">{d.type}</dd>
                </div>
              </dl>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-xs text-muted">#{d.id}</span>
                <Link href={`/deadlines/${d.id}`} className="btn btn-dark px-4 py-2 text-xs" aria-label={`Xem chi tiết: ${d.title}`}>
                  Xem chi tiết
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
      {visible.length === 0 && (
        <div className="card mt-3 p-10 text-center text-sm text-muted">Không có deadline nào khớp bộ lọc.</div>
      )}
    </>
  );
}
