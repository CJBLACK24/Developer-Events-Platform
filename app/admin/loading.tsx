export default function AdminLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-10 w-48 bg-zinc-800 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-zinc-800 rounded animate-pulse"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-8 w-12 bg-zinc-800 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-10 bg-zinc-800 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse"></div>
        </div>
        <div className="divide-y divide-zinc-800">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="h-16 w-24 bg-zinc-800 rounded animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-20 bg-zinc-800 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
