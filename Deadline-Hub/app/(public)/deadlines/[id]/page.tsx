import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDeadline, getDeadlines, getSubject } from "@/lib/data";
import { formatDateTime, formatTimeDate } from "@/lib/time";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Countdown from "@/components/Countdown";
import DueBadge from "@/components/DueBadge";
import StatusCard from "@/components/deadline/StatusCard";
import CopyLinkButton from "@/components/deadline/CopyLinkButton";

// ISR on-demand: dựng sẵn lúc build, chỉ dựng lại khi lớp trưởng thêm/xoá (revalidatePath trong Server Action).
// Deadline mới thêm sau khi build vẫn được dựng ở request đầu tiên rồi cache lại.
export const dynamicParams = true;

type Props = { params: Promise<{ id: string }> };

async function load(idParam: string) {
  if (!/^\d+$/.test(idParam)) return undefined;
  return getDeadline(Number(idParam));
}

export async function generateStaticParams() {
  return (await getDeadlines()).map((d) => ({ id: String(d.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const deadline = await load((await params).id);
  if (!deadline) return { title: "Không tìm thấy deadline", robots: { index: false } };

  const subject = getSubject(deadline.subject);
  const title = `${deadline.title} — hạn ${formatDateTime(deadline.due)}`;
  const description = `${subject?.name ?? ""} · ${deadline.type} · Hạn nộp ${formatTimeDate(deadline.due)}. ${deadline.description.split("\n")[0]}`.slice(0, 160);

  return {
    title: deadline.title,
    description,
    alternates: { canonical: `/deadlines/${deadline.id}` },
    openGraph: { type: "article", title, description, url: `/deadlines/${deadline.id}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function DeadlineDetailPage({ params }: Props) {
  const deadline = await load((await params).id);
  if (!deadline) notFound();

  const subject = getSubject(deadline.subject);
  const related = (await getDeadlines()).filter((d) => d.subject === deadline.subject && d.id !== deadline.id);
  const pageUrl = `${SITE_URL}/deadlines/${deadline.id}`;

  const lines = deadline.description.split("\n").filter(Boolean);
  const paragraphs = lines.filter((l) => !l.startsWith("- "));
  const bullets = lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Deadline", item: `${SITE_URL}/deadlines` },
      { "@type": "ListItem", position: 3, name: deadline.title, item: pageUrl },
    ],
  };

  return (
    <div className="container-page pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-ink">Trang chủ</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/deadlines" className="hover:text-ink">Deadline</Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-semibold text-ink">{deadline.title}</li>
        </ol>
      </nav>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <article className="card overflow-hidden">
            <header className="relative overflow-hidden bg-lime-soft p-6 sm:p-8">
              <span className="absolute -right-5 -top-5 grid size-32 place-items-center rounded-full border-2 border-ink bg-lime" aria-hidden>
                <Image src="/illustrations/clock.svg" alt="" width={64} height={64} />
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white px-3 py-1">{subject?.name}</span>
                <span className="rounded-full bg-ink px-3 py-1 text-white">{deadline.type}</span>
                <span className="rounded-full bg-white px-3 py-1">#{deadline.id}</span>
              </div>
              <h1 className="display mt-4 max-w-[80%] text-4xl sm:text-5xl">{deadline.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Countdown due={deadline.due} variant="inline" />
                <DueBadge due={deadline.due} />
              </div>
            </header>

            <dl className="grid grid-cols-2 gap-4 border-b border-line p-6 text-sm sm:grid-cols-4 sm:px-8">
              {[
                ["Hạn nộp", formatTimeDate(deadline.due)],
                ["Môn học", subject?.name ?? deadline.subject],
                ["Hình thức nộp", deadline.submission],
                ["Giảng viên", subject?.teacher ?? "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="mt-0.5 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            <section className="p-6 sm:px-8" aria-labelledby="mo-ta">
              <h2 id="mo-ta" className="display text-2xl">Mô tả</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/80">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {bullets.length > 0 && (
                  <ul className="list-disc space-y-1 pl-5">
                    {bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </article>

          {related.length > 0 && subject && (
            <section aria-labelledby="cung-mon">
              <h2 id="cung-mon" className="display mb-3 text-2xl">Cùng môn {subject.name}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/deadlines/${r.id}`} className="card flex items-center justify-between gap-3 px-4 py-3 hover:shadow-md">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{r.title}</p>
                        <p className="text-xs text-muted">{formatDateTime(r.due).replace(" ", " · ")}</p>
                      </div>
                      <DueBadge due={r.due} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <StatusCard deadlineId={deadline.id} />

          <div className="card p-5">
            <h2 className="text-sm font-bold">Chia sẻ cho lớp</h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-line">
              <div className="relative h-32 overflow-hidden bg-lime-soft p-3">
                <p className="font-display text-[10px]">DEADLINE HUB</p>
                <p className="display mt-2 max-w-[70%] text-lg">{deadline.title}</p>
                <span className="mt-2 inline-block rounded-full bg-ink px-2 py-0.5 text-[10px] text-white">
                  Hạn {formatDateTime(deadline.due).slice(0, 5)} · {formatDateTime(deadline.due).slice(11)}
                </span>
                <span className="absolute -bottom-6 -right-6 size-20 rounded-full border-2 border-ink bg-lime" aria-hidden />
              </div>
              <div className="px-3 py-2">
                <p className="text-[11px] text-muted">{new URL(SITE_URL).host}</p>
                <p className="truncate text-xs font-semibold">
                  {deadline.title} | {SITE_NAME}
                </p>
              </div>
            </div>
            <CopyLinkButton url={pageUrl} />
          </div>
        </aside>
      </div>
    </div>
  );
}
