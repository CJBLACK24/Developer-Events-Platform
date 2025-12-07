"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    } else if (profile) {
      setFullName(profile.full_name || "");
    }
  }, [user, profile, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpdating(true);

    try {
      // Update custom profile table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (authError) throw authError;

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !user) return <p className="p-10 text-center">Loading...</p>;

  return (
    <section className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-muted/50 p-6 rounded-lg border space-y-6">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={user.email}
              disabled
              className="bg-muted cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <div className="p-2 border rounded-md bg-muted text-sm uppercase font-mono">
              {profile?.role || "GUEST"}
            </div>
          </div>

          <Button disabled={updating}>
            {updating ? "Saving..." : "Update Profile"}
          </Button>
        </form>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <Button variant="outline" asChild>
            <a href="/auth/update-password">Change Password</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
