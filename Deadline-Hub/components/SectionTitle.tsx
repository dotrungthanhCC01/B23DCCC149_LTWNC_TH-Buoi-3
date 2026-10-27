export default function SectionTitle({
  children,
  aside,
  id,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3 border-b-2 border-ink/15 pb-2">
      <Tag id={id} className={`display ${Tag === "h1" ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"}`}>
        {children}
      </Tag>
      {aside && <div className="shrink-0 text-xs text-muted">{aside}</div>}
    </div>
  );
}
