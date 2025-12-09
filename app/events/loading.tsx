export default function EventsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-10 w-48 bg-zinc-800 rounded animate-pulse mb-2"></div>
        <div className="h-5 w-64 bg-zinc-800 rounded animate-pulse"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-8 flex gap-4 flex-col sm:flex-row">
        <div className="h-10 flex-1 bg-zinc-800 rounded animate-pulse"></div>
        <div className="h-10 w-28 bg-zinc-800 rounded animate-pulse"></div>
      </div>

      {/* Events Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden"
          >
            <div className="h-48 bg-zinc-800 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 w-3/4 bg-zinc-800 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-zinc-800 rounded animate-pulse"></div>
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
