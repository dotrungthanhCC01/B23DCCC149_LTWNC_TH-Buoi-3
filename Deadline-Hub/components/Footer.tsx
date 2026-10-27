import { CLASS_CODE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="container-page flex flex-col gap-1 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Class Deadline Hub · Lớp {CLASS_CODE} — PTIT</span>
        <span>Dữ liệu cập nhật bởi lớp trưởng</span>
      </div>
    </footer>
  );
}
