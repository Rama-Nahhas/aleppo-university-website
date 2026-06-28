import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AxiosError } from "axios";
export interface UserData {
  id: number;
  role_id: number;
  department_id: number | null;
  year_id: number | null;
  hospital_department_id: number | null;
  directorate_id: number | null;
  name: string;
  email: string;
  is_active: number;
  student_number: string | null;
  admission_type: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}
interface LaravelErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export const useAuthActions = () => {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async (
    credentials: Record<string, string>,
    onSuccess: (user: UserData) => void,
  ): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const user = await login(credentials.email, credentials.password);
      onSuccess(user);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<LaravelErrorResponse>;

      setError(
        axiosError.response?.data?.message ||
          "خطأ في البريد الإلكتروني أو كلمة المرور. يرجى المحاولة مجدداً.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleLogin, isSubmitting, error };
};
