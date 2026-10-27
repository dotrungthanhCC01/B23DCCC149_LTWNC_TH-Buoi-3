import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";
import { auth } from "@/auth";
import { getDeadlines, getDoneIds } from "@/lib/data";
import { can } from "@/lib/permissions";
import SidebarNav from "@/components/dashboard/SidebarNav";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/** Layout lồng nhau của /dashboard: sidebar + nội dung trang con. */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const [deadlines, doneIds] = await Promise.all([getDeadlines(), getDoneIds(session.user.id)]);
  const done = deadlines.filter((d) => doneIds.includes(d.id)).length;
  const role = session.user.role;

  const rights = [
    can(role, "deadline:view") && "Xem deadline",
    can(role, "deadline:complete") && "Đánh dấu đã xong",
    can(role, "deadline:create") && "Thêm deadline",
    can(role, "deadline:delete") && "Xoá deadline",
  ].filter(Boolean);

  return (
    <div className="container-page grid items-start gap-6 pt-6 lg:grid-cols-[230px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-20">
        <SidebarNav counts={{ all: deadlines.length, pending: deadlines.length - done, done }} />
        <div className="rounded-3xl bg-lime-soft p-4 text-xs">
          <p className="flex items-center gap-1.5 font-bold">
            <UserRound className="size-3.5" aria-hidden /> Quyền của bạn
          </p>
          <p className="mt-1.5 leading-relaxed text-ink/75">
            {rights.join(" · ")}.
            {!can(role, "deadline:create") && " Thêm/xoá deadline chỉ dành cho lớp trưởng."}
          </p>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
