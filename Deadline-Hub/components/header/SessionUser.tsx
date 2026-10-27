"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LogIn } from "lucide-react";
import UserChip from "./UserChip";
import LogoutButton from "./LogoutButton";

/** Khu vực người dùng ở header nhóm (public): đọc session phía client. */
export default function SessionUser() {
  const { data, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return <span className="skeleton h-9 w-36 rounded-full" aria-hidden />;

  if (!data?.user) {
    const callbackUrl = pathname && pathname !== "/" ? `?callbackUrl=${encodeURIComponent(pathname)}` : "";
    return (
      <>
        <span className="hidden text-sm text-muted sm:inline">Khách</span>
        <Link href={`/login${callbackUrl}`} className="btn btn-violet">
          <LogIn className="size-4" aria-hidden /> Đăng nhập
        </Link>
      </>
    );
  }

  return (
    <>
      <UserChip name={data.user.name ?? data.user.email ?? "Bạn"} role={data.user.role} image={data.user.image} />
      <LogoutButton />
    </>
  );
}
