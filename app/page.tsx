"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Redirect based on authentication status and admin role
      if (isAuthenticated && user?.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/auth");
      }
    }
  }, [router, isAuthenticated, isLoading, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900">
          Loading ProBeauty Admin...
        </h1>
      </div>
    </div>
  );
}
