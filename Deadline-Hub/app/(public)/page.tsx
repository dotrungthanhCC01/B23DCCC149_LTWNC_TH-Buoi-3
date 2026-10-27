import Link from "next/link";
import Image from "next/image";
import { AlarmClock, ArrowRight, BookOpen, ChevronRight, Clock, Layers } from "lucide-react";
import { getDeadlines, getSubjects } from "@/lib/data";
import { formatDateTime, formatDueLong } from "@/lib/time";
import { CLASS_CODE, SEMESTER } from "@/lib/site";
import { SUBJECT_COLORS } from "@/lib/types";
import Burst from "@/components/Burst";
import Countdown from "@/components/Countdown";
import GuestOnly from "@/components/GuestOnly";
import DueBadge from "@/components/DueBadge";
import LiveCount from "@/components/LiveCount";
import NearestDue from "@/components/NearestDue";
import SectionTitle from "@/components/SectionTitle";

// SSG: trang được dựng một lần lúc build. Phần phụ thuộc thời gian (đếm ngược, số quá hạn) tính ở client.
export const dynamic = "force-static";

export default async function HomePage() {
  const [deadlines, subjects] = [await getDeadlines(), getSubjects()];
  const subjectOf = (slug: string) => subjects.find((s) => s.slug === slug)!;
  const buildTime = Date.now();
  const upcoming = deadlines.filter((d) => new Date(d.due).getTime() > buildTime).slice(0, 5);
  const nearest = upcoming[0];
  const dues = deadlines.map((d) => d.due);

  return (
    <div className="container-page pt-8">
      {/* HERO */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card flex flex-col justify-center p-7 sm:p-9">
          <span className="mb-4 inline-flex w-max items-center gap-2 rounded-full bg-paper px-3 py-1 text-xs font-medium">
            <span className="size-2 rounded-full bg-violet" aria-hidden /> Lớp {CLASS_CODE} · {SEMESTER}
          </span>
          <h1 className="display text-5xl sm:text-6xl">Không bỏ lỡ deadline nào của lớp</h1>
          <p className="mt-4 max-w-md text-sm text-muted">
            Tất cả bài tập, báo cáo, đồ án của {subjects.length} môn học trong một trang. Ai cũng xem được — đăng nhập để
            đánh dấu việc đã xong.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/deadlines" className="btn btn-lime">
              Xem tất cả deadline <ArrowRight className="size-4" aria-hidden />
            </Link>
            <GuestOnly>
              <Link href="/login" className="btn btn-outline">
                Đăng nhập để theo dõi
              </Link>
            </GuestOnly>
          </div>
        </div>

        {nearest ? (
          <div className="relative overflow-hidden rounded-3xl bg-lime-soft p-7 sm:p-9">
            <span className="absolute right-20 top-4 h-5 w-8 -rotate-12 rounded-[50%] border-2 border-ink bg-lime" aria-hidden />
            <span className="absolute -right-6 top-6 grid size-36 place-items-center rounded-full border-2 border-ink bg-lime" aria-hidden>
              <span className="grid size-28 place-items-center rounded-full border-2 border-ink">
                <Image src="/illustrations/calendar-check.svg" alt="" width={56} height={56} />
              </span>
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-[#4d6b00]">Deadline gần nhất</p>
            <span className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold">
              {subjectOf(nearest.subject).name}
            </span>
            <h2 className="display mt-3 max-w-[75%] text-3xl sm:text-4xl">{nearest.title}</h2>
            <p className="mt-1 text-sm text-muted">Hạn nộp {formatDueLong(nearest.due)}</p>
            <div className="mt-8 flex flex-wrap items-end gap-4">
              <Countdown due={nearest.due} />
              <Link href={`/deadlines/${nearest.id}`} className="mb-2 inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4">
                Xem chi tiết <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center rounded-3xl bg-lime-soft p-9 text-center">
            <p className="display text-3xl">Lớp đang không có deadline nào 🎉</p>
          </div>
        )}
      </section>

      {/* THỐNG KÊ */}
      <section aria-label="Thống kê" className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { color: "#d9c4fc", icon: Layers, value: deadlines.length, label: "Deadline", sub: "Tổng trong học kỳ" },
          { color: "#d8f70f", icon: BookOpen, value: subjects.length, label: "Môn học", sub: "Đang theo dõi" },
          { color: "#fcd692", icon: Clock, value: <LiveCount dues={dues} kind="week" />, label: "Tuần này", sub: "Đến hạn trong 7 ngày" },
          { color: "#fbc5e4", icon: AlarmClock, value: <LiveCount dues={dues} kind="overdue" />, label: "Quá hạn", sub: "Đã qua hạn nộp" },
        ].map(({ color, icon: Icon, value, label, sub }) => (
          <div key={label} className="card flex items-center gap-3 p-4">
            <Burst color={color} size={44} stroke="#111">
              <Icon className="size-4" aria-hidden />
            </Burst>
            <div>
              <p className="display text-xl sm:text-2xl">
                {value} {label}
              </p>
              <p className="text-xs text-muted">{sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* MÔN HỌC */}
      <section className="mt-10" aria-labelledby="mon-hoc">
        <SectionTitle id="mon-hoc" aside={`${subjects.length} môn · ${deadlines.length} deadline`}>
          Môn học
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {subjects.map((s) => {
            const list = deadlines.filter((d) => d.subject === s.slug);
            return (
              <Link key={s.slug} href={`/subjects/${s.slug}`} className="card group overflow-hidden p-2 transition-shadow hover:shadow-lg">
                <div className="flex h-24 items-end justify-between rounded-2xl p-3" style={{ background: SUBJECT_COLORS[s.color].bg }}>
                  <span className="display text-2xl sm:text-3xl">{s.short}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold">{list.length} deadline</span>
                </div>
                <div className="px-2 pb-1 pt-3">
                  <p className="truncate text-sm font-semibold group-hover:underline">{s.name}</p>
                  <p className="text-xs text-muted">
                    <NearestDue dues={list.map((d) => d.due)} />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SẮP ĐẾN HẠN */}
      <section className="mt-10" aria-labelledby="sap-den-han">
        <SectionTitle
          id="sap-den-han"
          aside={
            <Link href="/deadlines" className="font-semibold text-ink underline underline-offset-4">
              Xem tất cả {deadlines.length} deadline →
            </Link>
          }
        >
          Sắp đến hạn
        </SectionTitle>
        <ol className="card space-y-2 p-3">
          {upcoming.map((d, i) => {
            const s = subjectOf(d.subject);
            return (
              <li key={d.id} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-ink/30 text-xs font-bold"
                  style={{ background: SUBJECT_COLORS[s.color].bg }}
                >
                  #{i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={`/deadlines/${d.id}`} className="display block truncate text-lg hover:underline">
                    {d.title}
                  </Link>
                  <p className="truncate text-xs text-muted">
                    {s.name} · {d.type} · Hạn {formatDateTime(d.due)}
                  </p>
                </div>
                <DueBadge due={d.due} className="hidden sm:inline-flex" />
                <Link href={`/deadlines/${d.id}`} className="btn btn-lime px-3 py-1.5 text-xs" aria-label={`Chi tiết: ${d.title}`}>
                  Chi tiết <ChevronRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            );
          })}
          {upcoming.length === 0 && <li className="p-6 text-center text-sm text-muted">Không có deadline sắp tới.</li>}
        </ol>
      </section>
    </div>
  );
}
