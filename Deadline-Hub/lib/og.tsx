import "server-only";
import { readFile } from "fs/promises";
import path from "path";

export const OG_SIZE = { width: 1200, height: 630 };

/** Font có dấu tiếng Việt cho ImageResponse (font mặc định của Satori thiếu ký tự tiếng Việt). */
export async function loadOgAssets() {
  const root = process.cwd();
  const [anton, beVietnam, calendar] = await Promise.all([
    readFile(path.join(root, "assets/fonts/Anton-Regular.ttf")),
    readFile(path.join(root, "assets/fonts/BeVietnamPro-SemiBold.ttf")),
    readFile(path.join(root, "public/illustrations/calendar-check.svg")),
  ]);
  return {
    fonts: [
      { name: "Anton", data: anton, weight: 400 as const, style: "normal" as const },
      { name: "BeVietnam", data: beVietnam, weight: 600 as const, style: "normal" as const },
    ],
    calendarSrc: `data:image/svg+xml;base64,${calendar.toString("base64")}`,
  };
}

export function OgLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          display: "flex",
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "#d8f70f",
          border: "3px solid #111",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", width: 26, height: 26, borderRadius: 13, border: "4px solid #111" }} />
      </div>
      <div style={{ fontFamily: "Anton", fontSize: 34, letterSpacing: 1 }}>DEADLINE HUB</div>
    </div>
  );
}

export function OgCircle({ calendarSrc }: { calendarSrc: string }) {
  return (
    <div
      style={{
        position: "absolute",
        right: -70,
        top: 120,
        width: 440,
        height: 440,
        borderRadius: 220,
        background: "#d8f70f",
        border: "4px solid #111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 340,
          height: 340,
          borderRadius: 170,
          border: "4px solid #111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={calendarSrc} width={150} height={150} />
      </div>
    </div>
  );
}
