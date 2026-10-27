"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

const DEMO_ACCOUNTS = [
  { email: "admin@ptit.edu.vn", password: "admin123", label: "Lớp trưởng" },
  { email: "sv@ptit.edu.vn", password: "sv123456", label: "Sinh viên" },
];

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.2-3.1-.1-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

export default function LoginForm({ callbackUrl, githubEnabled }: { callbackUrl: string; githubEnabled: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Email không hợp lệ.");
    if (password.length < 6) return setError("Mật khẩu tối thiểu 6 ký tự.");

    setPending(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (!res || res.error) {
      setPending(false);
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }
    // Tải lại toàn trang để header/session cập nhật ngay
    window.location.assign(callbackUrl);
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ban@ptit.edu.vn"
            className="input"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="label">Mật khẩu</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tối thiểu 6 ký tự"
            className="input"
            required
            minLength={6}
          />
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-[#fde1df] px-3 py-2 text-xs font-medium text-[#c0281b]">
            {error}
          </p>
        )}
        <button type="submit" disabled={pending} className="btn btn-dark w-full rounded-xl py-3">
          {pending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" /> hoặc <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        disabled={!githubEnabled}
        title={githubEnabled ? undefined : "Chưa cấu hình AUTH_GITHUB_ID / AUTH_GITHUB_SECRET"}
        onClick={() => signIn("github", { redirectTo: callbackUrl })}
        className="btn btn-outline w-full rounded-xl border-line py-3"
      >
        <GitHubIcon /> Đăng nhập với GitHub
      </button>

      <div className="mt-5 rounded-2xl bg-paper p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Tài khoản demo — bấm để điền</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.email}
              type="button"
              onClick={() => {
                setEmail(a.email);
                setPassword(a.password);
                setError(null);
              }}
              className="rounded-xl border border-line bg-white px-3 py-2 text-left hover:border-ink/40"
            >
              <span className="block truncate text-xs font-semibold">{a.email}</span>
              <span className="text-[11px] text-muted">
                {a.password} · {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
