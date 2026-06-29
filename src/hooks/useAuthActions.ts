import { useState } from "react";
import {
  useAuth,
  RegisterStudentData,
  RegisterDoctorData,
} from "../contexts/AuthContext";
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
  const { login, registerStudent, registerDoctor } = useAuth();
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

  const handleRegisterStu = async (
    formData: Record<string, string>,
    onSuccess: (user: UserData) => void,
  ): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: RegisterStudentData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        department_id: Number(formData.department_id),
        year_id: Number(formData.year_id),
        student_number: formData.student_number,
        admission_type: formData.admission_type,
        birth_date: formData.birth_date,
        phone: formData.phone,
        address: formData.address,
      };

      const user = await registerStudent(payload);
      onSuccess(user);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<LaravelErrorResponse>;
      setError(
        axiosError.response?.data?.message ||
          "حدث خطأ أثناء إنشاء حساب الطالب. يرجى المحاولة مجدداً.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRegisterDoctor = async (
    formData: Record<string, string>,
    onSuccess: (user: UserData) => void,
  ): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: RegisterDoctorData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        specialization: formData.specialization,
        university: formData.university,
        graduation_year: Number(formData.graduation_year),
        employment_year: Number(formData.employment_year),
        work_history: formData.work_history,
        role: "doctor",
      };

      const user = await registerDoctor(payload);
      onSuccess(user);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<LaravelErrorResponse>;
      setError(
        axiosError.response?.data?.message ||
          "حدث خطأ أثناء إنشاء حساب الطبيب. يرجى المحاولة مجدداً.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleLogin,
    handleRegisterStu,
    handleRegisterDoctor,
    isSubmitting,
    error,
  };
};
