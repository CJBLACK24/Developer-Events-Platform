"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/sign-in");
      } else if (profile?.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user || profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">
            You do not have permission to access this area.
          </p>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-dark-100">{children}</div>;
}
