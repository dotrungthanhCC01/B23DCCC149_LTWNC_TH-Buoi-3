import { redirect } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { auth } from "@/auth";
import { getDeadlines, getDoneIds, getSubjects } from "@/lib/data";
import { formatWeekdayDate, isOverdue } from "@/lib/time";
import CheckRow from "./CheckRow";

type Filter = "all" | "pending" | "done";

const TITLES: Record<Filter, string> = {
  all: "Tất cả deadline của tôi",
  pending: "Deadline chưa xong",
  done: "Deadline đã xong",
};

/** Nội dung dashboard (SSR): đọc session + tiến độ của người dùng ở mỗi request. */
export default async function DashboardView({ filter }: { filter: Filter }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const [deadlines, doneIds] = await Promise.all([getDeadlines(), getDoneIds(session.user.id)]);
  const subjects = getSubjects();
  const now = Date.now();
  const doneSet = new Set(doneIds);

  const total = deadlines.length;
  const done = deadlines.filter((d) => doneSet.has(d.id)).length;
  const remaining = total - done;
  const overdueOpen = deadlines.filter((d) => !doneSet.has(d.id) && isOverdue(d.due, now)).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const firstName = (session.user.name ?? "bạn").trim().split(/\s+/).pop();

  const items = deadlines
    .filter((d) => (filter === "all" ? true : filter === "done" ? doneSet.has(d.id) : !doneSet.has(d.id)))
    .sort((a, b) => Number(doneSet.has(a.id)) - Number(doneSet.has(b.id)));

  return (
    <div>
      <p className="text-xs text-muted">{formatWeekdayDate(new Date(now).toISOString())}</p>
      <h1 className="display mt-1 text-4xl sm:text-5xl">
        Chào {firstName}, còn {remaining} việc
      </h1>

      <section aria-label="Tiến độ" className="card mt-4 grid gap-3 p-3 md:grid-cols-[1.8fr_1fr_1fr_1fr]">
        <div className="flex flex-col justify-between gap-6 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-sm font-bold">Tiến độ học kỳ</span>
            <span className="flex items-center gap-1 text-muted">
              <CircleCheck className="size-3.5" aria-hidden /> {percent} % hoàn thành
            </span>
          </div>
          <div
            className="h-8 overflow-hidden rounded-lg border border-line bg-paper"
            role="progressbar"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label="Số deadline đã xong"
          >
            <div className="flex h-full min-w-12 items-center bg-pink px-2 text-xs font-bold" style={{ width: `${percent}%` }}>
              {done}/{total}
            </div>
          </div>
        </div>
        {[
          { label: "Đã xong", value: done, cls: "bg-paper" },
          { label: "Còn lại", value: remaining, cls: "bg-paper" },
          { label: "Quá hạn chưa xong", value: overdueOpen, cls: "bg-[#fde1df] text-[#c0281b]" },
        ].map((s) => (
          <div key={s.label} className={`flex min-h-28 flex-col justify-end rounded-2xl p-4 ${s.cls}`}>
            <span className="font-display text-4xl leading-none">{s.value}</span>
            <span className="mt-1 text-xs">{s.label}</span>
          </div>
        ))}
      </section>

      <section className="mt-8" aria-labelledby="ds">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="ds" className="display text-2xl sm:text-3xl">{TITLES[filter]}</h2>
          <span className="text-xs text-muted">{items.length} mục</span>
        </div>
        <ul className="card space-y-2 p-3">
          {items.map((d) => {
            const s = subjects.find((x) => x.slug === d.subject)!;
            return <CheckRow key={d.id} deadline={d} subject={s} done={doneSet.has(d.id)} />;
          })}
          {items.length === 0 && (
            <li className="p-8 text-center text-sm text-muted">
              {filter === "done" ? "Bạn chưa đánh dấu deadline nào." : "Tuyệt! Bạn đã xong hết deadline. 🎉"}
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
