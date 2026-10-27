// Kiểm tra nhanh bản production đang chạy: route, 404, Middleware, đăng nhập,
// phân quyền ở Server Action, robots/sitemap/noindex, metadata, JSON-LD.
// Cách dùng: npm run build && npm start   (cửa sổ khác)   rồi   node scripts/verify.mjs [baseUrl]
import { readFileSync } from "node:fs";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
let pass = 0;
let fail = 0;

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

function check(label, actual, ok) {
  ok ? pass++ : fail++;
  console.log(`  ${ok ? green("✓") : red("✗")} ${label.padEnd(44)} ${actual}`);
}
const section = (title) => console.log(`\n${bold(title)}`);

/* ---------- cookie jar tối giản ---------- */
function jar() {
  const store = new Map();
  return {
    header: () => [...store].map(([k, v]) => `${k}=${v}`).join("; "),
    save(res) {
      for (const c of res.headers.getSetCookie?.() ?? []) {
        const [pair] = c.split(";");
        const i = pair.indexOf("=");
        store.set(pair.slice(0, i), pair.slice(i + 1));
      }
    },
  };
}

async function get(path, j) {
  const res = await fetch(BASE + path, { redirect: "manual", headers: j ? { cookie: j.header() } : {} });
  j?.save(res);
  return res;
}

async function login(email, password) {
  const j = jar();
  const { csrfToken } = await (await get("/api/auth/csrf", j)).json();
  const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    redirect: "manual",
    headers: { cookie: j.header(), "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ csrfToken, email, password }),
  });
  j.save(res);
  return { j, res };
}

const short = (url) => (url ?? "").replace(BASE, "");

/* ---------- 1. Route + 404 ---------- */
section("1. Rendering & trang 404");
for (const [path, want] of [
  ["/", 200],
  ["/subjects/web-nang-cao", 200],
  ["/subjects/khong-ton-tai", 404],
  ["/deadlines", 200],
  ["/deadlines/1", 200],
  ["/deadlines/99", 404],
  ["/deadlines/abc", 404],
]) {
  const res = await get(path);
  check(`GET ${path}`, res.status, res.status === want);
}

/* ---------- 2. Middleware khi chưa đăng nhập ---------- */
section("2. Middleware — khách (chưa đăng nhập)");
for (const path of ["/dashboard", "/admin"]) {
  const res = await get(path);
  const loc = short(res.headers.get("location"));
  check(`GET ${path}`, `${res.status} → ${loc}`, res.status === 307 && loc.startsWith(`/login?callbackUrl=${encodeURIComponent(path)}`));
}

/* ---------- 3. Đăng nhập + session ---------- */
section("3. NextAuth Credentials + session JWT (id, role)");
const sv = await login("sv@ptit.edu.vn", "sv123456");
const svSession = await (await get("/api/auth/session", sv.j)).json();
check("Đăng nhập sv@ptit.edu.vn", `role=${svSession.user?.role} id=${svSession.user?.id}`, svSession.user?.role === "user" && !!svSession.user?.id);
const ad = await login("admin@ptit.edu.vn", "admin123");
const adSession = await (await get("/api/auth/session", ad.j)).json();
check("Đăng nhập admin@ptit.edu.vn", `role=${adSession.user?.role} id=${adSession.user?.id}`, adSession.user?.role === "admin" && !!adSession.user?.id);
const bad = await login("sv@ptit.edu.vn", "sai-mat-khau");
check("Sai mật khẩu bị từ chối", short(bad.res.headers.get("location")), short(bad.res.headers.get("location")).includes("error=CredentialsSignin"));

section("4. Middleware — đã đăng nhập");
let r = await get("/dashboard", sv.j);
check("Sinh viên GET /dashboard", r.status, r.status === 200);
r = await get("/admin", sv.j);
check("Sinh viên GET /admin", `${r.status} → ${short(r.headers.get("location"))}`, r.status === 307 && short(r.headers.get("location")) === "/403");
r = await get("/admin", ad.j);
check("Admin GET /admin", r.status, r.status === 200);

/* ---------- 5. Server Action tự kiểm tra quyền ---------- */
section("5. Server Action tự kiểm tra quyền (POST thẳng tới /deadlines/1, không qua Middleware)");
const manifest = JSON.parse(readFileSync(".next/server/server-reference-manifest.json", "utf8"));
const ids = Object.fromEntries(Object.entries(manifest.node).map(([id, v]) => [v.exportedName, id]));
async function action(name, args, j) {
  const res = await fetch(`${BASE}/deadlines/1`, {
    method: "POST",
    headers: {
      "Next-Action": ids[name],
      Accept: "text/x-component",
      "Content-Type": "text/plain;charset=UTF-8",
      ...(j ? { cookie: j.header() } : {}),
    },
    body: JSON.stringify(args),
  });
  return (await res.text()).match(/\{"ok":[^}]*\}/)?.[0] ?? "(không có kết quả)";
}
const before = JSON.parse(readFileSync("data/deadlines.json", "utf8")).length;
for (const [who, j, name, args] of [
  ["Khách", null, "deleteDeadlineAction", [1]],
  ["Sinh viên", sv.j, "deleteDeadlineAction", [1]],
  ["Sinh viên", sv.j, "createDeadlineAction", [{}, "$K1"]],
  ["Khách", null, "toggleDoneAction", [1, true]],
  ["Sinh viên", sv.j, "toggleDoneAction", ["abc", true]],
]) {
  const out = await action(name, args, j);
  check(`${who}: ${name}(${JSON.stringify(args[0])})`, out, out.includes('"ok":false'));
}
const after = JSON.parse(readFileSync("data/deadlines.json", "utf8")).length;
check("Dữ liệu không bị thay đổi", `${before} → ${after} deadline`, before === after);

/* ---------- 6. SEO ---------- */
section("6. SEO");
const robots = await (await get("/robots.txt")).text();
check("robots.txt chặn /dashboard, /admin", robots.match(/Disallow: \S+/g)?.join(" "), robots.includes("Disallow: /dashboard") && robots.includes("Disallow: /admin"));
const sitemap = await (await get("/sitemap.xml")).text();
const locs = sitemap.match(/<loc>[^<]+<\/loc>/g) ?? [];
const deadlineCount = JSON.parse(readFileSync("data/deadlines.json", "utf8")).length;
const inSitemap = locs.filter((l) => /\/deadlines\/\d+</.test(l)).length;
check("sitemap.xml gồm mọi deadline", `${inSitemap}/${deadlineCount} deadline, ${locs.length} URL`, inSitemap === deadlineCount);
for (const [path, j] of [["/login", null], ["/dashboard", sv.j]]) {
  const html = await (await get(path, j)).text();
  const meta = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  check(`${path} noindex`, meta ?? "(không có)", meta?.includes("noindex") ?? false);
}
const detail = await (await get("/deadlines/1")).text();
const title = detail.match(/<title>([^<]+)<\/title>/)?.[1];
check("Metadata động /deadlines/1", title, !!title && title.includes("BPMN"));
const ogImage = detail.match(/property="og:image" content="([^"]+)"/)?.[1];
const og = ogImage ? await fetch(ogImage.replace(/^https?:\/\/[^/]+/, BASE)) : null;
check("Ảnh chia sẻ og:image", `${og?.status} ${og?.headers.get("content-type")}`, og?.status === 200 && og.headers.get("content-type") === "image/png");
const ld = detail.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
const ldType = ld ? JSON.parse(ld)["@type"] : null;
check("JSON-LD BreadcrumbList", ldType ?? "(không có)", ldType === "BreadcrumbList");

console.log(`\n${bold("Kết quả:")} ${green(`${pass} đạt`)}${fail ? `, ${red(`${fail} lỗi`)}` : ""}\n`);
process.exit(fail ? 1 : 0);
