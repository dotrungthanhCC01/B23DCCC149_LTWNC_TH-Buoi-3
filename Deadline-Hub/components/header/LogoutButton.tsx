"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

/**
 * Đăng xuất phía client: xoá cookie, cập nhật SessionProvider và tải lại trang,
 * tránh header ở trang tĩnh còn giữ session cũ.
 */
export default function LogoutButton() {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        void signOut({ redirectTo: "/" });
      }}
      className="btn btn-outline border-line"
    >
      <LogOut className="size-4" aria-hidden /> {pending ? "Đang thoát..." : "Đăng xuất"}
    </button>
  );
}
