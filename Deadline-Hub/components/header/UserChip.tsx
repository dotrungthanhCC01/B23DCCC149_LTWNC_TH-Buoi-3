import Image from "next/image";
import { ROLE_LABELS, type SessionRole } from "@/lib/permissions";

export function initials(name: string) {
  const words = name.trim().split(/\s+/);
  const first = words[0]?.[0] ?? "?";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Avatar + tên + vai trò (không dùng hook, dùng được cả server lẫn client). */
export default function UserChip({ name, role, image }: { name: string; role: SessionRole; image?: string | null }) {
  return (
    <div className="flex items-center gap-2">
      {image ? (
        <Image src={image} alt="" width={34} height={34} className="size-[34px] rounded-full border border-ink/20" />
      ) : (
        <span
          className={`grid size-[34px] place-items-center rounded-full border border-ink/20 text-xs font-bold ${
            role === "admin" ? "bg-lavender" : "bg-pink"
          }`}
          aria-hidden
        >
          {initials(name)}
        </span>
      )}
      <div className="hidden leading-tight sm:block">
        <div className="max-w-40 truncate text-sm font-semibold">{name}</div>
        <span
          className={`inline-block rounded px-1.5 text-[10px] font-semibold ${
            role === "admin" ? "bg-ink text-lime" : "bg-[#efe5fe] text-violet"
          }`}
        >
          {role} · {ROLE_LABELS[role]}
        </span>
      </div>
    </div>
  );
}
