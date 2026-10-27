"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";

/** Giao diện lỗi dùng chung cho các error.tsx — có nút "Thử lại". */
export default function ErrorView({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page grid place-items-center py-16">
      <div className="card w-full max-w-xl overflow-hidden">
        <div className="flex items-center gap-4 bg-[#fde1df] p-6">
          <span className="grid size-12 place-items-center rounded-xl border-2 border-ink bg-white">
            <TriangleAlert className="size-6 text-[#c0281b]" aria-hidden />
          </span>
          <h1 className="display text-2xl sm:text-3xl">Không tải được dữ liệu</h1>
        </div>
        <div className="p-6">
          <p className="text-sm text-muted">
            Đã có lỗi khi đọc danh sách deadline. Bạn hãy thử lại — nếu vẫn lỗi, báo cho lớp trưởng nhé.
          </p>
          <p className="mt-4 rounded-lg bg-paper px-3 py-2 font-mono text-[11px] text-muted">
            MÃ LỖI: DEADLINES_READ_FAILED{error.digest ? ` · ${error.digest}` : ""}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={reset} className="btn btn-dark">
              <RefreshCw className="size-4 text-lime" aria-hidden /> Thử lại
            </button>
            <Link href="/" className="btn btn-outline">Về trang chủ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
