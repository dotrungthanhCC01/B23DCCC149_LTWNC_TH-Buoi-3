"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, Check, Clock, House } from "lucide-react";

type Counts = { all: number; pending: number; done: number };

/** Sidebar dashboard — tô sáng trang hiện tại theo pathname. */
export default function SidebarNav({ counts }: { counts: Counts }) {
  const pathname = usePathname();

  const groups = [
    {
      title: "Của tôi",
      items: [
        { href: "/dashboard", label: "Tổng quan", icon: House, count: counts.all },
        { href: "/dashboard/pending", label: "Chưa xong", icon: Clock, count: counts.pending },
        { href: "/dashboard/done", label: "Đã xong", icon: Check, count: counts.done },
      ],
    },
    {
      title: "Lớp",
      items: [
        { href: "/deadlines", label: "Tất cả deadline", icon: CalendarDays },
        { href: "/subjects/web-nang-cao", label: "Môn học", icon: BookOpen },
      ],
    },
  ];

  return (
    <nav aria-label="Menu dashboard" className="card p-3">
      {groups.map((g) => (
        <div key={g.title} className="mb-2 last:mb-0">
          <p className="px-3 pb-1.5 pt-2 text-[11px] font-bold uppercase tracking-wide text-muted">{g.title}</p>
          <ul className="space-y-1">
            {g.items.map(({ href, label, icon: Icon, ...rest }) => {
              const count = "count" in rest ? rest.count : undefined;
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      active ? "bg-ink text-white" : "hover:bg-paper"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                    <span className="flex-1">{label}</span>
                    {count !== undefined && (
                      <span
                        className={`rounded-full px-2 text-[11px] font-bold ${active ? "bg-lime text-ink" : "bg-paper text-muted"}`}
                      >
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
