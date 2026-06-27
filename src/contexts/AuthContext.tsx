import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../lib/axios";
import { UserData } from "@/hooks/useAuthActions";
interface AuthResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: UserData;
}
interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  login: (email: string, password: string) => Promise<UserData>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState<boolean>(true);
  const logout = async (): Promise<void> => {
    try {
      await apiClient.post("/logout");
    } catch {
      // *** Handle error if needed
    }
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      if (token && !user) {
        try {
          const response = await apiClient.get<UserData>("/user");
          setUser(response.data);
        } catch (error) {
          if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
          ) {
            await logout();
          }
        }
      }
      setLoading(false);
    };
    void fetchUser();
  }, [token, user]);
  const login = async (email: string, password: string): Promise<UserData> => {
    const response = await apiClient.post<AuthResponse>("/login", {
      email,
      password,
    });
    const { access_token, user: userData } = response.data;

    localStorage.setItem("token", access_token);
    setToken(access_token);
    setUser(userData);

    return userData;
  };

  const register = async (data: RegisterData): Promise<void> => {
    const response = await apiClient.post<AuthResponse>("/register", data);
    const { access_token, user: userData } = response.data;

    // localStorage.setItem("token", access_token);
    sessionStorage.setItem("token", access_token);
    setToken(access_token);
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
