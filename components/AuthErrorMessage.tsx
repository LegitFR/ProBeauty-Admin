"use client";

import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function AuthErrorMessage({ message, onRetry }: AuthErrorMessageProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth");
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
        <p className="text-muted-foreground mb-6">
          {message ||
            "Your session has expired. Please login again to continue."}
        </p>
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Try Again
            </Button>
          )}
          <Button onClick={handleLogin}>Login</Button>
        </div>
      </div>
    </div>
  );
}
