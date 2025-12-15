import {
  AuthResponse,
  SignupData,
  LoginData,
  GoogleAuthData,
} from "@/lib/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://probeauty-backend.onrender.com";
const AUTH_BASE_PATH = "/api/v1/auth";

// Use proxy to bypass CORS in development
const USE_PROXY = process.env.NODE_ENV === "development";

class AuthService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    let url: string;

    if (USE_PROXY) {
      // Use Next.js API proxy to bypass CORS
      const fullPath = `${AUTH_BASE_PATH}${endpoint}`;
      url = `/api/proxy?path=${encodeURIComponent(fullPath)}`;
    } else {
      // Direct call in production
      url = `${API_BASE_URL}${AUTH_BASE_PATH}${endpoint}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return data;
    } catch (error: any) {
      // Check for CORS error
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        console.error("❌ Request failed!");
        console.error("URL:", url);

        if (!USE_PROXY) {
          console.error(
            "💡 TIP: CORS error detected. Enable proxy in development."
          );
        }

        throw new Error(
          error.message ||
            "Request failed. Please check your network connection."
        );
      }
      throw error;
    }
  }

  async signup(data: SignupData): Promise<{ message: string; userId: string }> {
    const response = await this.request<{ message: string; userId: string }>(
      "/signup",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    // DEV ONLY - TODO: Remove before production deployment
    console.log(
      "🔐 OTP SENT - Check console for OTP (email service not configured)"
    );
    console.log("📧 Response:", response);
    // END DEV ONLY

    return response;
  }

  async confirmRegistration(
    email: string,
    otp: string
  ): Promise<{ message: string }> {
    return this.request("/confirm-registration", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async googleAuth(data: GoogleAuthData): Promise<AuthResponse> {
    return this.request("/google", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request("/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyForgotPasswordOTP(
    email: string,
    otp: string
  ): Promise<{ message: string }> {
    return this.request("/verify-forgot-password-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  async resendForgotPasswordOTP(email: string): Promise<{ message: string }> {
    return this.request("/resend-forgot-password-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ message: string }> {
    return this.request("/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    });
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ message: string; accessToken: string }> {
    return this.request("/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }
}

export const authService = new AuthService();
