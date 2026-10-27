import Link from "next/link";
import Image from "next/image";
import MainNav from "./MainNav";
import type { SessionRole } from "@/lib/permissions";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Deadline Hub — Trang chủ">
      <Image src="/logo.svg" alt="" width={30} height={30} priority />
      <span className="font-display text-lg tracking-wide">DEADLINE HUB</span>
    </Link>
  );
}

/**
 * Header dùng chung. Phần bên phải (người dùng) được truyền vào qua children:
 * nhóm (public) dùng client component để trang vẫn tĩnh, nhóm (app) đọc session phía server.
 */
export default function SiteHeader({
  children,
  role,
  nav = true,
}: {
  children?: React.ReactNode;
  role?: SessionRole | null;
  nav?: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3 md:h-16 md:flex-nowrap md:py-0">
        <Logo />
        {nav && (
          <div className="order-3 w-full overflow-x-auto md:order-none md:w-auto">
            <MainNav role={role} />
          </div>
        )}
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}
