import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, githubEnabled } from "@/auth";
import { getDeadlines, getSubjects } from "@/lib/data";
import { Logo } from "@/components/header/SiteHeader";
import Burst from "@/components/Burst";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

/** Chỉ chấp nhận đường dẫn nội bộ để tránh open redirect. */
function safeCallback(value: string | string[] | undefined) {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : "/dashboard";
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const callbackUrl = safeCallback(params.callbackUrl);
  const session = await auth();
  if (session?.user) redirect(callbackUrl);

  const [deadlines, subjects] = [await getDeadlines(), getSubjects()];

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="card grid w-full max-w-4xl gap-6 p-3 md:grid-cols-2">
        <section className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[20px] bg-lavender p-7">
          <Logo />
          <Burst color="#d8f70f" stroke="#111" size={190} points={16} inner={0.78} className="absolute -right-8 top-16">
            <Image src="/illustrations/calendar-check.svg" alt="" width={72} height={72} />
          </Burst>
          <div className="mt-auto pt-40">
            <h1 className="display max-w-[75%] text-4xl sm:text-5xl">Theo dõi tiến độ của riêng bạn</h1>
            <p className="mt-3 max-w-sm text-sm text-ink/75">
              Đánh dấu deadline đã xong, xem việc còn lại theo từng môn. Lớp trưởng đăng nhập để thêm hoặc xoá deadline.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white px-3 py-1">{deadlines.length} deadline</span>
              <span className="rounded-full bg-white px-3 py-1">{subjects.length} môn học</span>
              <span className="rounded-full bg-ink px-3 py-1 text-white">Học kỳ 1 · 2026</span>
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center px-3 py-6 sm:px-6">
          <h2 className="display text-4xl">Đăng nhập</h2>
          <p className="mt-1 text-xs text-muted">
            Sau khi đăng nhập, bạn sẽ quay lại{" "}
            <code className="rounded bg-[#fde8f3] px-1.5 py-0.5 text-[11px] text-[#b0246f]">{callbackUrl}</code>
          </p>
          <LoginForm callbackUrl={callbackUrl} githubEnabled={githubEnabled} />
          <Link href="/" className="mt-6 w-max text-xs font-semibold text-violet underline underline-offset-4">
            ← Quay lại trang chủ
          </Link>
        </section>
      </div>
    </main>
  );
}
