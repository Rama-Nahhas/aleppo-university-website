// import React, { createContext, useContext, useState, useCallback } from 'react';
// import axios from 'axios'; 
// import type { User, RoleName } from '@/types';

// const API_URL = 'http://127.0.0.1:8000/api'; 

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   hasRole: (role: RoleName) => boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   // نقرأ المستخدم والـ Token المحفوظين مسبقاً من المتصفح عند إقلاع التطبيق
 
//   const [user, setUser] = useState<User | null>(() => {
//     const User = localStorage.getItem('auth_user');
//     return User ? JSON.parse(User) : null;
//   });

//   const [token, setToken] = useState<string | null>(() => {
//     return localStorage.getItem('auth_token');
//   });

//   const login = useCallback(async (email: string, password: string) => {
//     try {
      
//       const response = await axios.post(`${API_URL}/login`, { email, password });
      
//       // نفترض أن الباك آيند يعيد كائن يحتوي على الـ user والـ token
//       const { user: backendUser, token: backendToken } = response.data;

//       // حفظ البيانات في الـ State
//       setUser(backendUser);
//       setToken(backendToken);

//       // تخزين البيانات في المتصفح ليبقى المستخدم مسجلاً
//       localStorage.setItem('auth_user', JSON.stringify(backendUser));
//       localStorage.setItem('auth_token', backendToken);

//       return { success: true };
//     } catch (error: any) {
//       // التعامل مع الأخطاء (مثل: كلمة مرور خاطئة أو إيميل غير موجود)
//       const errorMessage = error.response?.data?.message || 'فشل تسجيل الدخول، يرجى المحاولة لاحقاً';
//       return { success: false, message: errorMessage };
//     }
//   }, []);

  
//   const logout = useCallback(() => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('auth_user');
//     localStorage.removeItem('auth-token');
    

//     // axios.post(`${API_URL}/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });
//   }, []);


//   const hasRole = useCallback((role: RoleName) => {
//     if (!user?.role) return false;
//     if (user.role.name === 'admin') return true;
//     return user.role.name === role;
//   }, [user]);

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, hasRole }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
//   };

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import type { User, RoleName } from '@/types';

const API_URL = 'http://127.0.0.1:8000/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, password_confirmation?: string) => Promise<{ success: boolean; message?: string }>;
  changePassword: (current_password: string, password: string, password_confirmation?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: RoleName) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      const backendUser = response.data.user ?? response.data;
      const backendToken = response.data.access_token ?? response.data.token ?? null;

      setUser(backendUser);
      setToken(backendToken ?? null);

      localStorage.setItem('auth_user', JSON.stringify(backendUser));
      if (backendToken) {
        localStorage.setItem('auth_token', backendToken);
        axios.defaults.headers.common.Authorization = `Bearer ${backendToken}`;
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'فشل تسجيل الدخول، يرجى المحاولة لاحقاً';
      return { success: false, message: errorMessage };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, password_confirmation?: string) => {
    try {
      const payload = { name, email, password, password_confirmation: password_confirmation ?? password };
      const response = await axios.post(`${API_URL}/register`, payload);

      const backendUser = response.data.user ?? response.data;
      const backendToken = response.data.access_token ?? response.data.token ?? null;

      setUser(backendUser);
      setToken(backendToken ?? null);

      localStorage.setItem('auth_user', JSON.stringify(backendUser));
      if (backendToken) {
        localStorage.setItem('auth_token', backendToken);
        axios.defaults.headers.common.Authorization = `Bearer ${backendToken}`;
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'فشل التسجيل، يرجى المحاولة لاحقاً';
      return { success: false, message: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (e) {
      // ignore errors on logout request, still clear local state
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  const changePassword = useCallback(async (current_password: string, password: string, password_confirmation?: string) => {
    try {
      const payload = {
        current_password: current_password,
        password: password,
        password_confirmation: password_confirmation ?? password,
      };

      await axios.post(`${API_URL}/change-password`, payload);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'فشل تغيير كلمة المرور، يرجى المحاولة لاحقاً';
      return { success: false, message: errorMessage };
    }
  }, []);

  const hasRole = useCallback((role: RoleName) => {
    if (!user?.role) return false;
    if (user.role.name === 'admin') return true;
    return user.role.name === role;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, changePassword, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};