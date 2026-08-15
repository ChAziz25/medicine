"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { roleHome } from "@/lib/roles";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? roleHome(user.role) : "/login");
  }, [loading, user, router]);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Chargement…
      </div>
    </div>
  );
}
