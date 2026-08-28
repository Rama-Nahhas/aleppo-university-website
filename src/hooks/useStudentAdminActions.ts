import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { resolveRoleName } from "@/lib/roleUtils";

export interface StudentUser {
  id: number;
  department_id: number | null;
  year_id: number | null;
  name: string;
  email: string;
  is_active: number;
  student_number: string | null;
  admission_type: string | null;
  phone: string | null;
  address: string | null;
  /** سبب الحظر لو الحساب محظور */
  message?: string | null;
  created_at: string;
  updated_at: string;
}

interface LaravelErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

const extractError = (err: unknown, fallback: string): string => {
  const axiosError = err as AxiosError<LaravelErrorResponse>;
  const firstFieldError = axiosError.response?.data?.errors
    ? Object.values(axiosError.response.data.errors)[0]?.[0]
    : undefined;
  return firstFieldError || axiosError.response?.data?.message || fallback;
};

export const useStudentAdminActions = () => {
  const { user } = useAuth();
  const roleName = resolveRoleName(user as any);
  // نفس منطق الدكاترة بالضبط: Sub Admin عم يستخدم /sub/... والسوبر أدمن /admin/...
  const base = roleName === "university_admin" ? "/sub" : "/admin";
  const isSuperAdmin = roleName === "admin";

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async (): Promise<StudentUser[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: StudentUser[] }>(
        `${base}/users/students`,
      );
      return response.data.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب الطلاب."));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const blockStudent = async (id: number, reason: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`${base}/students/${id}/block`, { reason });
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء حظر الطالب."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unblockStudent = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`${base}/students/${id}/unblock`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء رفع الحظر."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // ما في مكافئ /sub لحذف مستخدم - حصرية للسوبر أدمن بالباك إند
      await apiClient.delete(`/admin/users/${id}`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء حذف الطالب."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchStudents,
    blockStudent,
    unblockStudent,
    deleteStudent,
    /** فقط السوبر أدمن يقدر يحذف طالب */
    canDelete: isSuperAdmin,
    loading,
    error,
  };
};
