import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { resolveRoleName } from "@/lib/roleUtils";

export interface AdminLab {
  id: number;
  name: string;
  department_id: number;
  lab_manager_id: number;
  created_at: string;
  updated_at: string;
}

export interface LabManagerOption {
  id: number;
  name: string;
  email: string;
  department_id: number | null;
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

export const useLabAdminActions = () => {
  const { user } = useAuth();
  const roleName = resolveRoleName(user as any);
  // نفس المنطق المتبع بكل صفحات الإدارة: Sub Admin عم يستخدم /sub/... والسوبر أدمن /admin/...
  const base = roleName === "university_admin" ? "/sub" : "/admin";
  const isSuperAdmin = roleName === "admin";

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLabs = async (): Promise<AdminLab[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<AdminLab[]>(`${base}/labs`);
      return response.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب المخابر."));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchLabDetails = async (id: number): Promise<AdminLab | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<AdminLab>(`${base}/labs/${id}`);
      return response.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب تفاصيل المخبر."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  /** لائحة مدراء المخابر (دور Lab Manager) لتعبئة سيليكت lab_manager_id - مسار عام بدون تحديد /admin أو /sub */
  const fetchLabManagers = async (): Promise<LabManagerOption[]> => {
    try {
      const response = await apiClient.get<LabManagerOption[]>("/lab-managers");
      return response.data;
    } catch {
      return [];
    }
  };

  const createLab = async (
    name: string,
    labManagerId: number,
    departmentId?: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`${base}/labs`, {
        name,
        lab_manager_id: labManagerId,
        // السب أدمن ما بيحتاج يبعتها - بتنحسب تلقائياً من قسمو بالباك إند
        ...(departmentId ? { department_id: departmentId } : {}),
      });
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء إضافة المخبر."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateLab = async (
    id: number,
    name: string,
    labManagerId: number,
    departmentId?: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.put(`${base}/labs/${id}`, {
        name,
        lab_manager_id: labManagerId,
        ...(departmentId ? { department_id: departmentId } : {}),
      });
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء تعديل المخبر."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLab = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`${base}/labs/${id}`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء حذف المخبر."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchLabs,
    fetchLabDetails,
    fetchLabManagers,
    createLab,
    updateLab,
    deleteLab,
    /** فقط السوبر أدمن يختار القسم يدوياً وينقل مخبر لقسم تاني */
    canChangeDepartment: isSuperAdmin,
    loading,
    error,
  };
};
