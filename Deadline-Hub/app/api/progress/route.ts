import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDoneIds } from "@/lib/data";
import { can } from "@/lib/permissions";

/** Danh sách id deadline mà người dùng hiện tại đã đánh dấu xong (dùng ở trang chi tiết tĩnh). */
export async function GET() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, "deadline:complete")) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  return NextResponse.json({ done: await getDoneIds(session.user.id) }, { headers: { "Cache-Control": "private, no-store" } });
}
