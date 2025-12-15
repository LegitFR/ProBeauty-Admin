"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Sparkles,
  Lock,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, verifyOtp } = useAuth();

  useEffect(() => {
    // Check if user was redirected due to authentication error
    const wasRedirected = sessionStorage.getItem("auth_redirect");
    if (wasRedirected === "true") {
      toast.error("Your session has expired. Please login again.", {
        duration: 5000,
      });
      sessionStorage.removeItem("auth_redirect");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login({
          identifier: formData.email,
          password: formData.password,
        });
      } else {
        await signup({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "admin",
        });
        // Show OTP verification screen after successful signup
        setShowOtpVerification(true);
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await verifyOtp(formData.email, otp);
      // Reset form and show login
      setShowOtpVerification(false);
      setIsLogin(true);
      setFormData({ name: "", email: "", phone: "", password: "" });
      setOtp("");
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // If showing OTP verification, render that UI
  if (showOtpVerification) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50/50 dark:from-black dark:via-gray-950 dark:to-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-200 dark:bg-orange-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-60 dark:opacity-40 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-orange-300 dark:bg-orange-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-60 dark:opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-200 dark:bg-orange-400/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-60 dark:opacity-40 animate-blob animation-delay-4000"></div>
        </div>

        <Card className="w-full max-w-md mx-4 p-8 bg-white/90 dark:bg-black/90 backdrop-blur-lg shadow-2xl border border-gray-200 dark:border-orange-600/30 relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF6A00] to-[#E55A00] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Enter the 6-digit code sent to {formData.email}
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="otp"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Verification Code
              </Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="h-14 text-center text-2xl tracking-widest bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#FF6A00] focus:ring-[#FF6A00] rounded-xl"
                placeholder="000000"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full h-12 bg-gradient-to-r from-[#FF6A00] to-[#E55A00] hover:from-[#E55A00] hover:to-[#CC5000] text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                <span>Verify Account</span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowOtpVerification(false)}
              className="text-[#FF6A00] hover:text-[#E55A00] dark:text-[#FF6A00] dark:hover:text-[#FFA366] font-medium transition-colors"
            >
              Back to signup
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 text-xs">
            <Lock className="w-3 h-3" />
            <span>OTP valid for 10 minutes</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50/50 dark:from-black dark:via-gray-950 dark:to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-200 dark:bg-orange-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-60 dark:opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-orange-300 dark:bg-orange-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-60 dark:opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-200 dark:bg-orange-400/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-60 dark:opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md mx-4 p-8 bg-white/90 dark:bg-black/90 backdrop-blur-lg shadow-2xl border border-gray-200 dark:border-orange-600/30 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FF6A00] to-[#E55A00] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? "Welcome Back" : "Join ProBeauty"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            {isLogin
              ? "Admin portal - Sign in to manage your salon empire"
              : "Create your admin account to get started"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-[#1e1e1e] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#FF6A00] focus:ring-[#FF6A00] dark:focus:border-[#FF6A00] dark:focus:ring-[#FF6A00] rounded-xl"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10 h-12 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-[#1e1e1e] dark:text-[#1e1e1e] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#FF6A00] focus:ring-[#FF6A00] dark:focus:border-[#FF6A00] dark:focus:ring-[#FF6A00] rounded-xl"
                placeholder="admin@probeauty.com"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required={!isLogin}
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 h-12 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-[#1e1e1e] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#FF6A00] focus:ring-[#FF6A00] dark:focus:border-[#FF6A00] dark:focus:ring-[#FF6A00] rounded-xl"
                  placeholder="9876543210"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 pr-10 h-12 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-[#1e1e1e] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#FF6A00] focus:ring-[#FF6A00] dark:focus:border-[#FF6A00] dark:focus:ring-[#FF6A00] rounded-xl"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="flex items-center space-x-2 bg-orange-50 dark:bg-orange-950/50 p-4 rounded-xl border border-orange-200 dark:border-orange-700/50">
              <Shield className="w-5 h-5 text-[#FF6A00] dark:text-[#FF6A00] flex-shrink-0" />
              <p className="text-sm text-orange-900 dark:text-orange-200">
                This account will be registered as an <strong>Admin</strong>{" "}
                with full access privileges.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-[#FF6A00] to-[#E55A00] hover:from-[#E55A00] hover:to-[#CC5000] text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>{isLogin ? "Sign In" : "Create Admin Account"}</span>
              </div>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#FF6A00] hover:text-[#E55A00] dark:text-[#FF6A00] dark:hover:text-[#FFA366] font-medium transition-colors"
          >
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span className="underline">Create admin account</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="underline">Sign in</span>
              </>
            )}
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 text-xs">
          <Lock className="w-3 h-3" />
          <span>Secured with admin-level authentication</span>
        </div>
      </Card>
    </div>
  );
}
