import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { resolveRoleName } from "@/lib/roleUtils";

export interface PendingDoctor {
  id: number;
  role_id?: number;
  name: string;
  email: string;
  department_id: number | null;
  hospital_department_id: number | null;
  specialization: string | null;
  university: string | null;
  graduation_year: number | null;
  employment_year: number | null;
  work_history: string | null;
  is_active: number | boolean;
  /** سبب الحظر لو الحساب محظور */
  message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DoctorCreatePayload {
  name: string;
  email: string;
  password: string;
  /** لازمة بس للسوبر أدمن؛ السب أدمن بتنجبر تلقائياً على قسمه */
  department_id?: string;
  hospital_department_id?: string;
  specialization: string;
  university: string;
  graduation_year: string;
  employment_year: string;
  work_history?: string;
}

export interface DoctorUpdatePayload {
  name?: string;
  email?: string;
  password?: string;
  /** السوبر أدمن بس فيه ينقل الدكتور لقسم تاني */
  department_id?: string;
  hospital_department_id?: string;
  specialization?: string;
  university?: string;
  graduation_year?: string;
  employment_year?: string;
  work_history?: string;
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

export const useDoctorAdminActions = () => {
  const { user } = useAuth();
  const roleName = resolveRoleName(user as any);
  // نفس منطق الباك إند بالضبط: Sub Admin عم يستخدم /sub/... والسوبر أدمن /admin/...
  // (الكونترولر نفسو، بس بيقيّد النتائج تلقائياً بقسم الـ Sub Admin)
  const base = roleName === "university_admin" ? "/sub" : "/admin";
  const isSuperAdmin = roleName === "admin";

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingDoctors = async (): Promise<PendingDoctor[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: PendingDoctor[] }>(
        `${base}/doctors/pending`,
      );
      return response.data.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب طلبات الدكاترة  المدرسين."));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveDoctors = async (): Promise<PendingDoctor[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: PendingDoctor[] }>(
        `${base}/users/doctors`,
      );
      return response.data.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب الدكاترة  المدرسين."));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createDoctor = async (payload: DoctorCreatePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`${base}/doctors`, payload);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء إضافة الدكتور."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const acceptDoctor = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`${base}/doctors/${id}/accept`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء قبول الطلب."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectDoctor = async (id: number, reason: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`${base}/doctors/${id}/reject`, { reason });
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء رفض الطلب."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDoctor = async (id: number, payload: DoctorUpdatePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.put(`${base}/doctors/${id}`, payload);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء تعديل الدكتور."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const blockDoctor = async (id: number, reason: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`${base}/doctors/${id}/block`, { reason });
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء حظر الدكتور."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unblockDoctor = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`${base}/doctors/${id}/unblock`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء رفع الحظر."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // ما في مكافئ /sub لحذف مستخدم - حصرية للسوبر أدمن بالباك إند
      await apiClient.delete(`/admin/users/${id}`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء حذف المستخدم."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchPendingDoctors,
    fetchActiveDoctors,
    createDoctor,
    acceptDoctor,
    rejectDoctor,
    updateDoctor,
    blockDoctor,
    unblockDoctor,
    deleteUser,
    /** فقط السوبر أدمن يقدر يحذف المستخدم أو ينقلو لقسم تاني */
    canDelete: isSuperAdmin,
    canChangeDepartment: isSuperAdmin,
    loading,
    error,
  };
};
