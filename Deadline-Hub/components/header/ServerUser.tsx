import Link from "next/link";
import { LogIn } from "lucide-react";
import type { Session } from "next-auth";
import UserChip from "./UserChip";
import LogoutButton from "./LogoutButton";

/** Khu vực người dùng ở header nhóm (app): session có sẵn từ server. */
export default function ServerUser({ session }: { session: Session | null }) {
  if (!session?.user) {
    return (
      <Link href="/login" className="btn btn-violet">
        <LogIn className="size-4" aria-hidden /> Đăng nhập
      </Link>
    );
  }

  return (
    <>
      <UserChip name={session.user.name ?? session.user.email ?? "Bạn"} role={session.user.role} image={session.user.image} />
      <LogoutButton />
    </>
  );
}
