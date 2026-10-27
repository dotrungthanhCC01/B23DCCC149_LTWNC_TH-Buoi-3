"use client";

import { SessionProvider } from "next-auth/react";

/** Session được lấy phía client để các trang SSG/ISR vẫn tĩnh. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
