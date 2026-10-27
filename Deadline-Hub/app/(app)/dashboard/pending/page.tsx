import type { Metadata } from "next";
import DashboardView from "@/components/dashboard/DashboardView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Chưa xong" };

export default function PendingPage() {
  return <DashboardView filter="pending" />;
}
