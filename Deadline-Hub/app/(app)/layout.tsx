import { auth } from "@/auth";
import SiteHeader from "@/components/header/SiteHeader";
import ServerUser from "@/components/header/ServerUser";
import Footer from "@/components/Footer";

/** Layout nhóm (app): đọc session phía server — mọi trang trong nhóm là SSR. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <>
      <SiteHeader role={session?.user?.role ?? null}>
        <ServerUser session={session} />
      </SiteHeader>
      <main className="flex-1 pb-14">{children}</main>
      <Footer />
    </>
  );
}
