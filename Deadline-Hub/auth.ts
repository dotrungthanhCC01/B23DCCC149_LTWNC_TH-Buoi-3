import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { findUserByEmail } from "@/lib/data";

const credentialsSchema = z.object({
  email: z.email().max(100),
  password: z.string().min(6).max(100),
});

export const githubEnabled = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Mật khẩu", type: "password" },
    },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;

      const user = await findUserByEmail(parsed.data.email);
      if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null;

      return { id: user.id, name: user.name, email: user.email, role: user.role };
    },
  }),
];

if (githubEnabled) providers.push(GitHub);

export const { handlers, auth, signIn, signOut } = NextAuth({ ...authConfig, providers });
