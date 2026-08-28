import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/lib/axios";

export interface SubAdmin {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  department_id: number | null;
  department: { id: number; name: string } | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSubAdminPayload {
  name: string;
  email: string;
  password: string;
  department_id: string;
  phone?: string;
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

export const useSubAdminActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubAdmins = async (): Promise<SubAdmin[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: SubAdmin[] }>(
        "/admin/sub-admins",
      );
      return response.data.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب المشرفين."));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createSubAdmin = async (payload: CreateSubAdminPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/admin/sub-admins", payload);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء إضافة المشرف."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubAdmin = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // مسار حذف عام لكل المستخدمين - حصري للسوبر أدمن بالباك إند
      await apiClient.delete(`/admin/users/${id}`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء حذف المشرف."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchSubAdmins,
    createSubAdmin,
    deleteSubAdmin,
    loading,
    error,
  };
};
