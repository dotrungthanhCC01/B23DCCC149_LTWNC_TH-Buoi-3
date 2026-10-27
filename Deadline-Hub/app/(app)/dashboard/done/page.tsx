import type { Metadata } from "next";
import DashboardView from "@/components/dashboard/DashboardView";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Đã xong" };

export default function DonePage() {
  return <DashboardView filter="done" />;
}
