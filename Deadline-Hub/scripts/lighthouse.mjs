// Đo Lighthouse cho / và /deadlines/1 (mobile + desktop) trên bản production đang chạy,
// lưu báo cáo HTML vào docs/lighthouse/ và in bảng điểm.
// Cách dùng: npm run build && npm start   (cửa sổ khác)   rồi   node scripts/lighthouse.mjs [baseUrl]
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const OUT = "docs/lighthouse";
mkdirSync(OUT, { recursive: true });

const rows = [];
for (const [name, path] of [["home", "/"], ["deadline-1", "/deadlines/1"]]) {
  for (const preset of ["mobile", "desktop"]) {
    process.stdout.write(`Đang đo ${path} (${preset})... `);
    const file = `${OUT}/${name}-${preset}`;
    execFileSync(
      "npx",
      [
        "-y", "lighthouse@12", BASE + path, "--quiet",
        "--chrome-flags=--headless=new",
        "--output=json", "--output=html", `--output-path=${file}`,
        ...(preset === "desktop" ? ["--preset=desktop"] : []),
      ],
      { stdio: "ignore", shell: true },
    );
    const r = JSON.parse(readFileSync(`${file}.report.json`, "utf8"));
    const s = (k) => Math.round(r.categories[k].score * 100);
    rows.push({
      Trang: path,
      "Thiết bị": preset,
      Performance: s("performance"),
      Accessibility: s("accessibility"),
      "Best Practices": s("best-practices"),
      SEO: s("seo"),
      LCP: r.audits["largest-contentful-paint"].displayValue,
      CLS: r.audits["cumulative-layout-shift"].displayValue,
    });
    console.log("xong");
  }
}
console.log();
console.table(rows);
console.log(`Báo cáo HTML: ${OUT}/*.report.html`);
