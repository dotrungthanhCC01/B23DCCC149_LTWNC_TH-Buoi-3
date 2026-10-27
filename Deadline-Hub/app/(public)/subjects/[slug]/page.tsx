import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getDeadlines, getSubject, getSubjects } from "@/lib/data";
import { dayBlock, formatDateTime } from "@/lib/time";
import { SUBJECT_COLORS } from "@/lib/types";
import Burst from "@/components/Burst";
import DueBadge from "@/components/DueBadge";
import LiveCount from "@/components/LiveCount";
import SectionTitle from "@/components/SectionTitle";

// SSG: 4 môn học được dựng sẵn lúc build; slug khác → 404.
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getSubjects().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subject = getSubject((await params).slug);
  if (!subject) return {};
  return {
    title: `Môn ${subject.name}`,
    description: `Tất cả deadline môn ${subject.name}: bài tập, báo cáo, đồ án và lịch kiểm tra.`,
    alternates: { canonical: `/subjects/${subject.slug}` },
  };
}

export default async function SubjectPage({ params }: Props) {
  const subject = getSubject((await params).slug);
  if (!subject) notFound();

  const subjects = getSubjects();
  const deadlines = (await getDeadlines()).filter((d) => d.subject === subject.slug);
  const dues = deadlines.map((d) => d.due);
  const color = SUBJECT_COLORS[subject.color];

  return (
    <div className="container-page pt-6">
      <nav aria-label="Chọn môn học" className="flex flex-wrap gap-2">
        {subjects.map((s) => {
          const active = s.slug === subject.slug;
          return (
            <Link
              key={s.slug}
              href={`/subjects/${s.slug}`}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold ${
                active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40"
              }`}
            >
              <span className="size-2 rounded-full ring-1 ring-black/20" style={{ background: SUBJECT_COLORS[s.color].dot }} aria-hidden />
              {s.short}
            </Link>
          );
        })}
      </nav>

      <section className="relative mt-4 overflow-hidden rounded-3xl p-6 sm:p-8" style={{ background: color.bg }}>
        <Burst color="#f6f2ff" size={130} points={16} className="absolute -top-8 right-6 hidden sm:inline-flex">
          <Image src="/illustrations/document.svg" alt="" width={48} height={48} />
        </Burst>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">Môn học · /subjects/{subject.slug}</span>
            <h1 className="display mt-3 text-4xl sm:text-5xl">{subject.name}</h1>
            <p className="mt-1 text-sm text-ink/70">
              Giảng viên: {subject.teacher} · Mã học phần: {subject.code}
            </p>
          </div>
          <dl className="grid shrink-0 grid-cols-3 gap-2 md:mt-10">
            {[
              { label: "Deadline", value: deadlines.length, cls: "" },
              { label: "Sắp tới", value: <LiveCount dues={dues} kind="upcoming" />, cls: "" },
              { label: "Quá hạn", value: <LiveCount dues={dues} kind="overdue" />, cls: "text-[#c0281b]" },
            ].map((s) => (
              <div key={s.label} className="w-24 rounded-2xl bg-white p-3 sm:w-28">
                <dd className={`font-display text-3xl ${s.cls}`}>{s.value}</dd>
                <dt className="text-xs text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="deadline-cua-mon">
        <SectionTitle
          id="deadline-cua-mon"
          aside={
            <Link href="/#mon-hoc" className="font-semibold text-ink underline underline-offset-4">
              Xem mọi môn →
            </Link>
          }
        >
          Deadline của môn
        </SectionTitle>
        <ul className="card space-y-2 p-3">
          {deadlines.map((d) => {
            const block = dayBlock(d.due);
            return (
              <li key={d.id} className="flex items-center gap-4 rounded-2xl border border-line p-3">
                <div className="w-12 shrink-0 border-r border-line pr-3 text-center">
                  <div className="font-display text-2xl leading-none">{block.day}</div>
                  <div className="mt-1 text-[10px] font-semibold text-muted">{block.month}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/deadlines/${d.id}`} className="display block truncate text-lg hover:underline">
                    {d.title}
                  </Link>
                  <p className="text-xs text-muted">
                    {d.type} · Hạn {formatDateTime(d.due)}
                  </p>
                </div>
                <DueBadge due={d.due} className="hidden sm:inline-flex" />
                <Link href={`/deadlines/${d.id}`} className="btn btn-lime px-3 py-1.5 text-xs" aria-label={`Chi tiết: ${d.title}`}>
                  Chi tiết <ChevronRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            );
          })}
          {deadlines.length === 0 && <li className="p-6 text-center text-sm text-muted">Môn này chưa có deadline.</li>}
        </ul>
      </section>
    </div>
  );
}
