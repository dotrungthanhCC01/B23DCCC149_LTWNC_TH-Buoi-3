import DashboardView from "@/components/dashboard/DashboardView";

// SSR: nội dung khác nhau theo từng người dùng, dựng lại ở mỗi request.
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return <DashboardView filter="all" />;
}
