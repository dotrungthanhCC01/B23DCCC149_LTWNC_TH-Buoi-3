"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createDeadlineAction, type CreateState } from "@/app/actions";
import { DEADLINE_TYPES } from "@/lib/types";

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-xs text-red-600">{message}</p> : null;
}

/** Form thêm deadline. Kiểm tra cơ bản ở trình duyệt, kiểm tra thật (zod + quyền) ở Server Action. */
export default function AddDeadlineForm({ subjects }: { subjects: { slug: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState<CreateState, FormData>(createDeadlineAction, {});
  const v = state.values ?? {};
  const e = state.errors ?? {};

  return (
    <section className="card p-5" aria-labelledby="them-deadline">
      <h2 id="them-deadline" className="display flex items-center gap-2 text-2xl">
        <span className="grid size-9 place-items-center rounded-xl bg-lime">
          <Plus className="size-5" aria-hidden />
        </span>
        Thêm deadline
      </h2>

      <form action={formAction} className="mt-4 space-y-4" key={state.ok ? state.message : "form"}>
        <div>
          <label htmlFor="title" className="label">Tên deadline</label>
          <input id="title" name="title" defaultValue={v.title} required minLength={3} maxLength={120} className="input" placeholder="VD: Bài tập Next.js Middleware" aria-invalid={!!e.title} />
          <FieldError message={e.title} />
        </div>
        <div>
          <label htmlFor="subject" className="label">Môn học</label>
          <select id="subject" name="subject" defaultValue={v.subject ?? ""} required className="input" aria-invalid={!!e.subject}>
            <option value="" disabled>Chọn môn...</option>
            {subjects.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
          <FieldError message={e.subject} />
        </div>
        <div>
          <label htmlFor="type" className="label">Loại</label>
          <select id="type" name="type" defaultValue={v.type ?? DEADLINE_TYPES[0]} className="input" aria-invalid={!!e.type}>
            {DEADLINE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <FieldError message={e.type} />
        </div>
        <div>
          <label htmlFor="date" className="label">Hạn nộp (23:59)</label>
          <input id="date" name="date" type="date" defaultValue={v.date} required className="input" aria-invalid={!!e.date} />
          <FieldError message={e.date} />
        </div>
        <div>
          <label htmlFor="description" className="label">
            Mô tả <span className="block text-xs font-normal text-muted">(không bắt buộc, tối đa 500 ký tự)</span>
          </label>
          <textarea id="description" name="description" defaultValue={v.description} maxLength={500} rows={4} className="input resize-y" placeholder="Yêu cầu, hình thức nộp..." aria-invalid={!!e.description} />
          <FieldError message={e.description} />
        </div>

        {state.message && (
          <p role="status" className={`rounded-xl px-3 py-2 text-xs font-medium ${state.ok ? "bg-lime-soft text-[#3f5800]" : "bg-[#fde1df] text-[#c0281b]"}`}>
            {state.message}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn btn-dark w-full rounded-xl py-3">
          <Plus className="size-4" aria-hidden /> {pending ? "Đang thêm..." : "Thêm deadline"}
        </button>
      </form>
    </section>
  );
}
