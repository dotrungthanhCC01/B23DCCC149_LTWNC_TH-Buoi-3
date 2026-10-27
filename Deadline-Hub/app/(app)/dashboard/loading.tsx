export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Đang tải">
      <div className="skeleton h-3 w-28" />
      <div className="skeleton mt-3 h-11 w-80" />
      <div className="card mt-4 grid gap-3 p-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-28 rounded-2xl" />
        ))}
      </div>
      <div className="card mt-8 space-y-2 p-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-line p-3">
            <div className="skeleton size-9 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-1/2" />
              <div className="skeleton h-3 w-1/3" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-[#f1ebfd]" />
          </div>
        ))}
      </div>
    </div>
  );
}
