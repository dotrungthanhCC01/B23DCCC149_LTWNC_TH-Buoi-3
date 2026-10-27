import type { NextAuthConfig } from "next-auth";
import { isSessionRole } from "@/lib/permissions";

/**
 * Cấu hình dùng chung, không phụ thuộc Node API (fs, bcrypt)
 * nên chạy được trong Middleware (Edge runtime).
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        // Đăng nhập GitHub: id ổn định theo tài khoản GitHub, vai trò mặc định là sinh viên
        token.id = account?.provider === "github" ? `github:${account.providerAccountId}` : String(user.id);
        token.role = isSessionRole(user.role) ? user.role : "user";
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
