import { useState } from "react";
import apiClient from "@/lib/axios";

export interface OtherUser {
  id: number;
  role_id: number;
  department_id: number | null;
  name: string;
  email: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  role: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export const useOtherUsersAdminActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOtherUsers = async (): Promise<OtherUser[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: OtherUser[] }>(
        "/admin/users/others",
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب المستخدمين.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetchOtherUsers, loading, error };
};
