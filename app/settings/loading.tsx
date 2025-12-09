export default function SettingsLoading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Tabs Navigation Skeleton */}
        <div className="flex gap-4 border-b border-zinc-800 pb-1">
          <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-zinc-800 rounded animate-pulse"></div>
        </div>

        {/* Profile Card Skeleton */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 bg-zinc-800 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-3 w-48 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {/* Avatar Skeleton */}
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-3 w-48 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Fields Skeleton */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-zinc-800 rounded animate-pulse"></div>
              </div>
            ))}

            {/* Button Skeleton */}
            <div className="h-10 w-32 bg-zinc-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
