import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { resolveRoleName } from "@/lib/roleUtils";
import { UserData } from "@/hooks/useAuthActions";

export interface ScheduleYear {
  id: number;
  name: string;
  college_id: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleDepartment {
  id: number;
  name: string;
  college_id: number;
  created_at: string;
  updated_at: string;
}

export interface AdminSchedule {
  id: number;
  year_id: number;
  department_id: number;
  is_active: boolean;
  user_id: number | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  year: ScheduleYear;
  department: ScheduleDepartment;
  user: UserData | null;
  media: unknown[];
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

export const useScheduleAdminActions = () => {
  const { user } = useAuth();
  const roleName = resolveRoleName(user as any);
  // نفس منطق باقي صفحات الإدارة: Sub Admin عم يستخدم /sub/... والسوبر أدمن /admin/...
  const base = roleName === "university_admin" ? "/sub" : "/admin";
  const isSuperAdmin = roleName === "admin";

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async (): Promise<AdminSchedule[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: AdminSchedule[] }>(
        `${base}/schedules`,
      );
      return response.data.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب الجداول."));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (
    yearId: number,
    image: File,
    departmentId?: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("year_id", String(yearId));
      // السب أدمن ما بيحتاج يبعتا - بتنحسب تلقائياً من قسمو بالباك إند
      if (departmentId) formData.append("department_id", String(departmentId));
      formData.append("image", image);
      await apiClient.post(`${base}/schedules`, formData, {
        // منسيب axios يحدد Content-Type والـ boundary تلقائياً - تحديدها يدوياً بيكسر الـ body
        headers: { "Content-Type": undefined },
      });
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء إضافة الجدول."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (
    id: number,
    isActive: boolean,
    image?: File,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      // PHP ما بيحلل بودي multipart/form-data إلا لطلب POST حقيقي، حتى لو الميثود
      // المطلوب فعلياً PUT - فلازم نبعت POST حقيقي مع _method=PUT (طريقة Laravel القياسية)
      formData.append("_method", "PUT");
      formData.append("is_active", isActive ? "1" : "0");
      if (image) formData.append("image", image);
      await apiClient.post(`${base}/schedules/${id}`, formData, {
        headers: { "Content-Type": undefined },
      });
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء تعديل الجدول."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`${base}/schedules/${id}`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء حذف الجدول."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    /** فقط السوبر أدمن يختار القسم يدوياً؛ السب أدمن بينحسب تلقائياً من حسابو */
    canChangeDepartment: isSuperAdmin,
    loading,
    error,
  };
};
