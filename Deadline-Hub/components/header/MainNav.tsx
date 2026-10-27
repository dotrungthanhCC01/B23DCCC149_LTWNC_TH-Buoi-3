"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { can, type SessionRole } from "@/lib/permissions";

/** Menu chính — tô sáng mục đang xem. */
export default function MainNav({ role }: { role?: SessionRole | null }) {
  const pathname = usePathname();
  const { data } = useSession();
  const currentRole = role === undefined ? data?.user?.role : role;

  const items = [
    { href: "/", label: "Trang chủ", match: (p: string) => p === "/" },
    { href: "/deadlines", label: "Deadline", match: (p: string) => p.startsWith("/deadlines") },
    { href: "/subjects/web-nang-cao", label: "Môn học", match: (p: string) => p.startsWith("/subjects") },
    ...(currentRole ? [{ href: "/dashboard", label: "Dashboard", match: (p: string) => p.startsWith("/dashboard") }] : []),
    ...(can(currentRole, "deadline:create")
      ? [{ href: "/admin", label: "Quản trị", match: (p: string) => p.startsWith("/admin") }]
      : []),
  ];

  return (
    <nav aria-label="Menu chính" className="flex w-max items-center gap-1 rounded-full bg-paper p-1">
      {items.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              active ? "bg-ink text-white" : "text-ink/80 hover:bg-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
