"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType, User, LoginData, SignupData } from "@/lib/types/auth";
import { authService } from "@/lib/services/authService";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    console.log("🔍 Auth Check:", {
      hasToken: !!accessToken,
      hasUserData: !!userData,
    });

    try {
      if (accessToken && userData) {
        const parsedUser = JSON.parse(userData);
        console.log("👤 User from storage:", parsedUser);

        // Only allow admin users
        if (parsedUser.role === "admin") {
          console.log("✅ Admin user authenticated - setting user state");
          // Set user first, then set loading to false
          // Using setTimeout to ensure React processes the user state update first
          setUser(parsedUser);
          setTimeout(() => {
            console.log("🏁 Setting isLoading to false");
            setIsLoading(false);
          }, 0);
          return;
        } else {
          // Not an admin, clear storage
          console.log("❌ User is not admin, clearing storage");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          toast.error("Access denied. Admin privileges required.");
        }
      } else {
        console.log("❌ No token or user data found");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }

    // If we get here, user is not authenticated
    console.log("🏁 Setting isLoading to false (no valid user)");
    setIsLoading(false);
  };

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);

      console.log("🔑 Login response received:", response);
      console.log("🔑 Response structure:", {
        hasAccessToken: !!response.accessToken,
        hasRefreshToken: !!response.refreshToken,
        hasUser: !!response.user,
        userRole: response.user?.role,
      });

      // Check if user is admin
      if (response.user.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        return;
      }

      // Save to localStorage first
      console.log("💾 Saving to localStorage...");
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Verify what was saved
      console.log("✅ Saved to localStorage:", {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        user: localStorage.getItem("user"),
      });

      toast.success("Login successful!");

      console.log("🔄 Redirecting to /dashboard...");
      // Use full page reload to ensure AuthContext properly reads from localStorage
      // This prevents race conditions with state updates
      window.location.href = "/dashboard";
    } catch (error: any) {
      const errorMessage = error.message || "Login failed";
      toast.error(errorMessage);

      // Show additional help if it's a connection error
      if (errorMessage.includes("Cannot connect to backend")) {
        toast.error("💡 Tip: Start your backend server and try again", {
          duration: 5000,
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      // Ensure role is set to admin
      const signupData = { ...data, role: "admin" as const };
      const response = await authService.signup(signupData);

      // DEV ONLY - TODO: Remove before production deployment
      console.log("✅ Signup successful! Check the response for OTP details:");
      console.log("Response:", response);
      console.log(
        "Note: Email service not configured - OTP may be in backend logs or response"
      );
      // END DEV ONLY

      toast.success(
        "Account created! Please check your email for OTP verification."
      );
      // Don't auto-login, wait for OTP verification
    } catch (error: any) {
      const errorMessage = error.message || "Signup failed";
      toast.error(errorMessage);

      // Show additional help if it's a connection error
      if (errorMessage.includes("Cannot connect to backend")) {
        toast.error("💡 Tip: Start your backend server and try again", {
          duration: 5000,
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      await authService.confirmRegistration(email, otp);
      toast.success("Account verified successfully! Please login.");
    } catch (error: any) {
      toast.error(error.message || "OTP verification failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleAuth = async (idToken: string) => {
    try {
      setIsLoading(true);
      const response = await authService.googleAuth({ idToken });

      // Check if user is admin
      if (response.user.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        return;
      }

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);
      toast.success("Google authentication successful!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Google authentication failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/auth");
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const response = await authService.refreshToken(refreshToken);
      localStorage.setItem("accessToken", response.accessToken);
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        verifyOtp,
        googleAuth,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
