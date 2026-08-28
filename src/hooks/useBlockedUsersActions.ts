import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import { resolveRoleName } from "@/lib/roleUtils";

export interface BlockedUser {
  id: number;
  name: string;
  email: string;
  role: string | null;
  department_id: number | null;
  department_name: string | null;
  is_active: number;
  block_reason: string | null;
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

export const useBlockedUsersActions = () => {
  const { user } = useAuth();
  const roleName = resolveRoleName(user as any);
  // نفس منطق باقي صفحات الإدارة: Sub Admin عم يستخدم /sub/... والسوبر أدمن /admin/...
  const base = roleName === "university_admin" ? "/sub" : "/admin";

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlockedUsers = async (): Promise<BlockedUser[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: BlockedUser[] }>(
        `${base}/blocked-users`,
      );
      return response.data.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب المستخدمين المحظورين."));
      return [];
    } finally {
      setLoading(false);
    }
  };

  /** الـ endpoint بيختلف حسب دور الشخص (طالب/دكتور) - نفس منطق الباك إند تماماً */
  const unblockUser = async (id: number, role: string | null): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const segment = role === "Doctor" ? "doctors" : "students";
      await apiClient.post(`${base}/${segment}/${id}/unblock`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء رفع الحظر."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchBlockedUsers,
    unblockUser,
    loading,
    error,
  };
};
