"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🛡️ ProtectedRoute check:", {
      isLoading,
      isAuthenticated,
      userRole: user?.role,
    });

    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("🔴 Not authenticated, redirecting to /auth");
        router.replace("/auth");
      } else if (user?.role !== "admin") {
        // Extra check: if somehow a non-admin got through, redirect them
        console.log("🔴 Not admin, redirecting to /auth");
        router.replace("/auth");
      } else {
        console.log("✅ User is authenticated and is admin");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
