import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/header/SiteHeader";
import SessionUser from "@/components/header/SessionUser";
import StatusView from "@/components/StatusView";
import MissingPath from "@/components/MissingPath";

export const metadata: Metadata = {
  title: "Không tìm thấy",
  robots: { index: false },
};

/** Trang 404 của dự án (dùng cho notFound() và mọi URL không khớp). */
export default function NotFound() {
  return (
    <>
      <SiteHeader nav={false}>
        <SessionUser />
      </SiteHeader>
      <main className="flex flex-1 flex-col">
        <StatusView
          code="404"
          title="Không tìm thấy deadline"
          color="#d9c4fc"
          icon="/illustrations/calendar-question.svg"
          actions={
            <>
              <Link href="/deadlines" className="btn btn-lime">Xem tất cả deadline</Link>
              <Link href="/" className="btn btn-outline">Về trang chủ</Link>
            </>
          }
        >
          <MissingPath />
        </StatusView>
      </main>
    </>
  );
}
