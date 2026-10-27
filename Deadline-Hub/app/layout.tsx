import type { Metadata, Viewport } from "next";
import { Anton, Be_Vietnam_Pro } from "next/font/google";
import Providers from "@/components/Providers";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-anton",
});

const beVietnam = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Không bỏ lỡ deadline nào của lớp`, template: `%s | ${SITE_NAME}` },
  description: "Tất cả bài tập, báo cáo, đồ án của 4 môn học trong một trang. Ai cũng xem được — đăng nhập để đánh dấu việc đã xong.",
  applicationName: SITE_NAME,
  icons: { icon: "/logo.svg" },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "vi_VN" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#d8f70f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${anton.variable} ${beVietnam.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
