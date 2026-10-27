"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { addDeadline, getDeadline, getSubjects, removeDeadline, setDone } from "@/lib/data";
import { can, type Action } from "@/lib/permissions";
import { DEADLINE_TYPES } from "@/lib/types";

/**
 * Mọi Server Action đều tự kiểm tra quyền bằng can() — không tin vào Middleware hay UI,
 * vì Server Action có thể bị gọi trực tiếp bằng một request POST.
 */
async function requirePermission(action: Action) {
  const session = await auth();
  const role = session?.user?.role ?? "guest";
  if (!session?.user || !can(role, action)) return null;
  return session.user;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

const idSchema = z.coerce.number().int().positive().max(1_000_000);

function revalidateDeadlinePages(id: number) {
  // On-demand ISR cho mọi trang /deadlines/[id] (đường dẫn route phải gồm cả route group)
  // + URL cụ thể vừa thêm/xoá (xoá cache 404/200 cũ) + các trang SSR liên quan.
  // /deadlines giữ ISR theo thời gian (60 giây) đúng như yêu cầu.
  revalidatePath("/(public)/deadlines/[id]", "page");
  revalidatePath(`/deadlines/${id}`);
  revalidatePath("/admin");
  revalidatePath("/dashboard", "layout");
}

/* ---------- Sinh viên: đánh dấu đã xong ---------- */

export async function toggleDoneAction(deadlineId: unknown, done: unknown): Promise<ActionResult> {
  const user = await requirePermission("deadline:complete");
  if (!user) return { ok: false, error: "Bạn cần đăng nhập để đánh dấu deadline." };

  const parsed = z.object({ id: idSchema, done: z.boolean() }).safeParse({ id: deadlineId, done });
  if (!parsed.success) return { ok: false, error: "Dữ liệu không hợp lệ." };
  if (!(await getDeadline(parsed.data.id))) return { ok: false, error: "Deadline không tồn tại." };

  await setDone(user.id, parsed.data.id, parsed.data.done);
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

/* ---------- Lớp trưởng: thêm / xoá ---------- */

const createSchema = z.object({
  title: z.string().trim().min(3, "Tên deadline tối thiểu 3 ký tự.").max(120, "Tên deadline tối đa 120 ký tự."),
  subject: z
    .string()
    .refine((slug) => getSubjects().some((s) => s.slug === slug), "Vui lòng chọn môn học hợp lệ."),
  type: z.enum(DEADLINE_TYPES, { error: "Loại deadline không hợp lệ." }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Vui lòng chọn hạn nộp.")
    .refine((v) => {
      const d = new Date(`${v}T23:59:00+07:00`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v && d.getUTCFullYear() >= 2020 && d.getUTCFullYear() <= 2100;
    }, "Ngày không hợp lệ."),
  description: z.string().trim().max(500, "Mô tả tối đa 500 ký tự.").optional().default(""),
});

export type CreateState = {
  ok?: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof createSchema>, string>>;
  values?: Record<string, string>;
};

export async function createDeadlineAction(_prev: CreateState, formData: FormData): Promise<CreateState> {
  const user = await requirePermission("deadline:create");
  if (!user) return { ok: false, message: "Chỉ lớp trưởng mới được thêm deadline." };

  const raw = {
    title: String(formData.get("title") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    type: String(formData.get("type") ?? ""),
    date: String(formData.get("date") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: CreateState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<CreateState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { ok: false, errors, values: raw, message: "Vui lòng kiểm tra lại thông tin." };
  }

  const { title, subject, type, date, description } = parsed.data;
  const created = await addDeadline({
    title,
    subject,
    type,
    due: `${date}T23:59:00+07:00`,
    submission: "Nộp trên LMS",
    description: description || "Lớp trưởng chưa thêm mô tả cho deadline này.",
  });

  revalidateDeadlinePages(created.id);
  return { ok: true, message: `Đã thêm deadline #${created.id}: ${created.title}` };
}

export async function deleteDeadlineAction(deadlineId: unknown): Promise<ActionResult> {
  const user = await requirePermission("deadline:delete");
  if (!user) return { ok: false, error: "Chỉ lớp trưởng mới được xoá deadline." };

  const parsed = idSchema.safeParse(deadlineId);
  if (!parsed.success) return { ok: false, error: "Mã deadline không hợp lệ." };

  if (!(await removeDeadline(parsed.data))) return { ok: false, error: "Deadline không tồn tại hoặc đã bị xoá." };

  revalidateDeadlinePages(parsed.data);
  return { ok: true };
}
