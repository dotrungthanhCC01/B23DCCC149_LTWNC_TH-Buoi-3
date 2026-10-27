import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import { can } from "@/lib/permissions";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const user = req.auth?.user;

  // Chưa đăng nhập → /login, giữ đường dẫn quay lại
  if (!user) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }

  // Đã đăng nhập nhưng không phải admin → /403
  if (pathname.startsWith("/admin") && !can(user.role, "deadline:create")) {
    return NextResponse.redirect(new URL("/403", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
