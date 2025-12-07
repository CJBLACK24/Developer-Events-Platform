"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Hide global navbar and background */}
      <style jsx global>{`
        header {
          display: none !important;
        }
        .absolute.inset-0.top-0 {
          display: none !important;
        }
      `}</style>
      <div className="fixed inset-0 bg-black overflow-y-auto">
        {/* Settings Header */}
        <div className="border-b border-zinc-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="h-6 w-px bg-zinc-800" />
              <h1 className="text-lg font-semibold text-white">Settings</h1>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
