"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteDeadlineAction } from "@/app/actions";

export default function DeleteButton({ id, title }: { id: number; title: string }) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!window.confirm(`Xoá deadline #${id} "${title}"?`)) return;
    startTransition(async () => {
      const res = await deleteDeadlineAction(id);
      if (!res.ok) window.alert(res.error);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={`Xoá deadline ${title}`}
      className="btn border border-[#f5c2bd] bg-white px-2.5 py-1.5 text-[#c0281b] hover:bg-[#fde1df]"
    >
      <Trash2 className="size-3.5" aria-hidden />
    </button>
  );
}
