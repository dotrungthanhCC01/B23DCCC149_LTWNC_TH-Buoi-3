import { ImageResponse } from "next/og";
import { getDeadline, getSubject } from "@/lib/data";
import { formatTimeDate, getTimeLeft } from "@/lib/time";
import { loadOgAssets, OG_SIZE, OgCircle, OgLogo } from "@/lib/og";

export const alt = "Ảnh chia sẻ deadline — Class Deadline Hub";
export const size = OG_SIZE;
export const contentType = "image/png";

const TONE = {
  soon: { bg: "#fdf0c2", fg: "#8a5300" },
  later: { bg: "#efe5fe", fg: "#6420d9" },
  overdue: { bg: "#fde1df", fg: "#c0281b" },
};

/** Ảnh xem trước riêng cho từng deadline (Open Graph 1200×630). */
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deadline = /^\d+$/.test(id) ? await getDeadline(Number(id)) : undefined;
  const { fonts, calendarSrc } = await loadOgAssets();

  const subject = deadline ? getSubject(deadline.subject) : undefined;
  const left = deadline ? getTimeLeft(deadline.due, Date.now()) : null;
  const tone = left ? TONE[left.tone] : TONE.later;
  const title = deadline?.title ?? "Không tìm thấy deadline";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ecf6c9",
          padding: "64px 72px",
          fontFamily: "BeVietnam",
          color: "#111",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 330,
            top: 50,
            width: 90,
            height: 56,
            borderRadius: 45,
            background: "#d8f70f",
            border: "4px solid #111",
            transform: "rotate(-15deg)",
          }}
        />
        <OgCircle calendarSrc={calendarSrc} />
        <OgLogo />

        <div style={{ display: "flex", gap: 14, marginTop: 70, fontSize: 28 }}>
          {subject && <div style={{ background: "#fff", borderRadius: 999, padding: "8px 22px" }}>{subject.name}</div>}
          {deadline && <div style={{ background: "#111", color: "#fff", borderRadius: 999, padding: "8px 22px" }}>{deadline.type}</div>}
        </div>

        <div
          style={{
            fontFamily: "Anton",
            fontSize: title.length > 34 ? 84 : 100,
            lineHeight: 1.12,
            marginTop: 22,
            maxWidth: 760,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>

        {deadline && left && (
          <div style={{ display: "flex", gap: 18, marginTop: "auto", alignItems: "center" }}>
            <div style={{ background: "#fff", borderRadius: 18, padding: "18px 26px", fontSize: 32 }}>
              {`Hạn nộp ${formatTimeDate(deadline.due)}`}
            </div>
            <div
              style={{
                background: tone.bg,
                color: tone.fg,
                borderRadius: 18,
                padding: "18px 26px",
                fontFamily: "Anton",
                fontSize: 36,
                textTransform: "uppercase",
              }}
            >
              {left.label}
            </div>
          </div>
        )}
      </div>
    ),
    { ...size, fonts },
  );
}
