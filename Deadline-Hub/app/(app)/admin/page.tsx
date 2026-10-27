import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { getDeadlines, getSubjects } from "@/lib/data";
import { can } from "@/lib/permissions";
import { formatDate } from "@/lib/time";
import { SUBJECT_COLORS } from "@/lib/types";
import DueBadge from "@/components/DueBadge";
import AddDeadlineForm from "@/components/admin/AddDeadlineForm";
import DeleteButton from "@/components/admin/DeleteButton";

// SSR + tự kiểm tra quyền (không chỉ dựa vào Middleware).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản lý deadline",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (!can(session.user.role, "deadline:create")) redirect("/403");

  const [deadlines, subjects] = [await getDeadlines(), getSubjects()];
  const canDelete = can(session.user.role, "deadline:delete");

  return (
    <div className="container-page pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink/15 pb-3">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#efe5fe] px-2.5 py-1 text-[11px] font-semibold text-violet">
            <ShieldCheck className="size-3.5" aria-hidden /> Chỉ lớp trưởng
          </span>
          <h1 className="display mt-2 text-4xl sm:text-5xl">Quản lý deadline</h1>
        </div>
        <dl className="flex gap-2">
          {[
            { label: "Deadline", value: deadlines.length },
            { label: "Môn học", value: subjects.length },
          ].map((s) => (
            <div key={s.label} className="card min-w-20 px-4 py-2">
              <dd className="font-display text-2xl">{s.value}</dd>
              <dt className="text-[11px] text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[320px_1fr]">
        <AddDeadlineForm subjects={subjects.map(({ slug, name }) => ({ slug, name }))} />

        <section className="card min-w-0 p-5" aria-labelledby="ds-admin">
          <div className="mb-3 flex items-end justify-between">
            <h2 id="ds-admin" className="display text-2xl">Danh sách ({deadlines.length})</h2>
            <span className="text-xs text-muted">Sắp xếp theo hạn nộp</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-paper text-xs text-muted">
                <tr>
                  <th scope="col" className="px-3 py-2.5 font-semibold">#</th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">Deadline</th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">Môn</th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">Hạn nộp</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {deadlines.map((d) => {
                  const s = subjects.find((x) => x.slug === d.subject);
                  return (
                    <tr key={d.id}>
                      <td className="px-3 py-2.5 text-xs text-muted">{d.id}</td>
                      <td className="px-3 py-2.5">
                        <p className="font-semibold">{d.title}</p>
                        <p className="text-xs text-muted">{d.type}</p>
                      </td>
                      <td className="px-3 py-2.5">
                        {s && (
                          <span
                            className="whitespace-nowrap rounded-full border border-ink/20 px-2 py-0.5 text-[11px] font-semibold"
                            style={{ background: SUBJECT_COLORS[s.color].bg }}
                          >
                            {s.short}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="text-xs font-semibold">{formatDate(d.due)}</p>
                        <DueBadge due={d.due} plain />
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex justify-end gap-1.5">
                          <Link href={`/deadlines/${d.id}`} className="btn btn-outline border-line px-3 py-1.5 text-xs">
                            Xem
                          </Link>
                          {canDelete && <DeleteButton id={d.id} title={d.title} />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
