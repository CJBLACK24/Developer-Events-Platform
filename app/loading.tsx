export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Loading Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#59DECA] animate-spin"></div>
        </div>
        <p className="text-zinc-400 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
