import type { Metadata } from "next";
import { getDeadlines, getSubjects } from "@/lib/data";
import DeadlineExplorer from "@/components/deadlines/DeadlineExplorer";

// ISR: trang tĩnh, tự dựng lại tối đa mỗi 60 giây khi có request mới.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tất cả deadline",
  description: "Danh sách công khai mọi bài tập, báo cáo, đồ án và bài kiểm tra của lớp, lọc theo môn và trạng thái.",
  alternates: { canonical: "/deadlines" },
};

export default async function DeadlinesPage() {
  const deadlines = await getDeadlines();
  // Sắp tới (gần nhất trước) rồi mới đến quá hạn (mới quá hạn trước); thứ tự được làm mới cùng chu kỳ ISR
  const now = Date.now();
  const upcoming = deadlines.filter((d) => new Date(d.due).getTime() >= now);
  const overdue = deadlines.filter((d) => new Date(d.due).getTime() < now).reverse();
  const summaries = [...upcoming, ...overdue].map(({ id, title, subject, type, due }) => ({ id, title, subject, type, due }));

  return (
    <div className="container-page pt-10">
      <DeadlineExplorer
        deadlines={summaries}
        subjects={getSubjects()}
        heading={
          <div>
            <h1 className="display text-4xl sm:text-5xl">Tất cả deadline</h1>
            <p className="mt-1 text-sm text-muted">Danh sách công khai cho cả lớp. Dữ liệu tự làm mới mỗi 60 giây.</p>
          </div>
        }
      />
    </div>
  );
}
