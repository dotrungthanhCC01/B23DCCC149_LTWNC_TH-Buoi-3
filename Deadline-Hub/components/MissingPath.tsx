"use client";

import { usePathname } from "next/navigation";

/** Nêu rõ id deadline không tồn tại (trang not-found không nhận được params). */
export default function MissingPath() {
  const pathname = usePathname();
  const id = pathname?.match(/^\/deadlines\/([^/]+)/)?.[1];

  if (id) {
    return (
      <p>
        Deadline <b className="text-ink">#{decodeURIComponent(id)}</b> không tồn tại hoặc đã bị lớp trưởng xoá. Kiểm tra lại
        đường dẫn hoặc xem danh sách đầy đủ.
      </p>
    );
  }
  return <p>Trang bạn tìm không tồn tại hoặc đã bị xoá. Kiểm tra lại đường dẫn hoặc xem danh sách deadline đầy đủ.</p>;
}
