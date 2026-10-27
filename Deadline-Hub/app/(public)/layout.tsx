import SiteHeader from "@/components/header/SiteHeader";
import SessionUser from "@/components/header/SessionUser";
import Footer from "@/components/Footer";

/** Layout nhóm (public): không đọc cookie phía server nên các trang giữ được SSG/ISR. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader>
        <SessionUser />
      </SiteHeader>
      <main className="flex-1 pb-14">{children}</main>
      <Footer />
    </>
  );
}
