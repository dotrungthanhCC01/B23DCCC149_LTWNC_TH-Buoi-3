import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { ROLE_LABELS } from "@/lib/permissions";
import StatusView from "@/components/StatusView";

export const metadata: Metadata = {
  title: "Không có quyền truy cập",
  robots: { index: false, follow: false },
};

export default async function ForbiddenPage() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <StatusView
      code="403"
      title="Bạn không có quyền truy cập"
      color="#fcd692"
      icon="/illustrations/lock.svg"
      actions={
        <>
          <Link href="/dashboard" className="btn btn-dark">Về Dashboard</Link>
          <Link href="/" className="btn btn-outline">Về trang chủ</Link>
        </>
      }
    >
      Trang <code className="rounded bg-paper px-1.5 py-0.5 text-xs">/admin</code> chỉ dành cho lớp trưởng.
      {role && (
        <>
          {" "}Tài khoản của bạn có vai trò <b className="text-ink">{ROLE_LABELS[role].toLowerCase()}</b> — bạn vẫn có thể
          xem và đánh dấu deadline đã xong.
        </>
      )}
    </StatusView>
  );
}
