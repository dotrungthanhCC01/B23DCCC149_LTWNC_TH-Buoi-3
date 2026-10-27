"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    // Dùng URL thực tế của trình duyệt (đúng domain khi deploy), fallback về URL cấu hình
    const href = typeof window !== "undefined" ? window.location.href.split("#")[0] : url;
    try {
      await navigator.clipboard.writeText(href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Sao chép liên kết:", href);
    }
  }

  return (
    <button type="button" onClick={copy} className="btn btn-outline mt-3 w-full border-line">
      {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
      {copied ? "Đã sao chép" : "Sao chép liên kết"}
    </button>
  );
}
