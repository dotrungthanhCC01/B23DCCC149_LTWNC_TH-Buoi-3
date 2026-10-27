import { ImageResponse } from "next/og";
import { loadOgAssets, OG_SIZE, OgCircle, OgLogo } from "@/lib/og";

export const alt = "Class Deadline Hub — Không bỏ lỡ deadline nào của lớp";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Ảnh chia sẻ mặc định cho toàn site. */
export default async function Image() {
  const { fonts, calendarSrc } = await loadOgAssets();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#d9c4fc",
          padding: "64px 72px",
          fontFamily: "BeVietnam",
          color: "#111",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <OgCircle calendarSrc={calendarSrc} />
        <OgLogo />
        <div style={{ fontFamily: "Anton", fontSize: 104, lineHeight: 1.02, marginTop: 90, maxWidth: 720, textTransform: "uppercase" }}>
          Không bỏ lỡ deadline nào của lớp
        </div>
        <div style={{ fontSize: 30, marginTop: "auto", maxWidth: 700 }}>
          Bài tập, báo cáo, đồ án của cả lớp — trong một trang.
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
