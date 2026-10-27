/** Skeleton hiển thị trong lúc tải danh sách deadline. */
export default function Loading() {
  return (
    <div className="container-page pt-10" aria-busy="true" aria-label="Đang tải">
      <div className="flex items-end justify-between border-b-2 border-line pb-3">
        <div>
          <div className="skeleton h-12 w-64" />
          <div className="skeleton mt-3 h-3 w-48" />
        </div>
        <div className="skeleton h-9 w-48 rounded-xl" />
      </div>
      <div className="mt-5 flex gap-3">
        <div className="skeleton h-11 flex-1 rounded-full" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton hidden h-11 w-20 rounded-full lg:block" />
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="card p-5">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="skeleton h-3.5 w-40" />
                <div className="skeleton h-3.5 w-24" />
              </div>
              <div className="h-5 w-14 animate-pulse rounded-full bg-[#f1ebfd]" />
            </div>
            <div className="mt-5 space-y-3 border-y border-line py-3">
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-4/5" />
              <div className="skeleton h-3 w-3/5" />
            </div>
            <div className="mt-4 flex justify-end">
              <div className="skeleton h-8 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
