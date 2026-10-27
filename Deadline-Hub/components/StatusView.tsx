import Image from "next/image";
import Burst from "./Burst";

/** Khung chung cho trang 404 / 403. */
export default function StatusView({
  code,
  title,
  color,
  icon,
  children,
  actions,
}: {
  code: string;
  title: string;
  color: string;
  icon: string;
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  return (
    <div className="container-page grid flex-1 place-items-center py-16">
      <div className="card flex w-full max-w-3xl flex-col items-center gap-8 p-8 sm:flex-row sm:p-12">
        <Burst color={color} size={190} points={16} inner={0.8}>
          <Image src={icon} alt="" width={80} height={80} />
        </Burst>
        <div>
          <p className="font-display text-7xl leading-none sm:text-8xl">{code}</p>
          <h1 className="display mt-2 text-2xl sm:text-3xl">{title}</h1>
          <div className="mt-2 max-w-md text-sm text-muted">{children}</div>
          <div className="mt-5 flex flex-wrap gap-2">{actions}</div>
        </div>
      </div>
    </div>
  );
}
