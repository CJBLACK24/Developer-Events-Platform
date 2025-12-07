"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hide the global navbar by positioning auth content over it */}
      <style jsx global>{`
        header {
          display: none !important;
        }
        .absolute.inset-0.top-0 {
          display: none !important;
        }
      `}</style>
      <div className="fixed inset-0 z-50 overflow-hidden">{children}</div>
    </>
  );
}
