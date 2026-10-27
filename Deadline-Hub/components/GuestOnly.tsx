"use client";

import { useSession } from "next-auth/react";

/** Chỉ hiển thị khi chưa đăng nhập (đọc session ở client để trang vẫn tĩnh). */
export default function GuestOnly({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  return status === "unauthenticated" ? <>{children}</> : null;
}
