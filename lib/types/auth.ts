export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "admin" | "customer";
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "admin";
}

export interface LoginData {
  identifier: string;
  password: string;
}

export interface GoogleAuthData {
  idToken: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  googleAuth: (idToken: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
