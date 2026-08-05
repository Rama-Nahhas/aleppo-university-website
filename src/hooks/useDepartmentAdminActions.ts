import { useState } from "react";
import apiClient from "@/lib/axios";

export interface AdminDepartment {
  id: number;
  name: string;
  college_id: number;
  created_at: string;
  updated_at: string;
  college: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export const useDepartmentAdminActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async (): Promise<AdminDepartment[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: AdminDepartment[] }>(
        "/admin/departments",
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب الأقسام.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (
    name: string,
    collegeId: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/admin/departments", {
        name,
        college_id: collegeId,
      });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء إضافة القسم.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (
    id: number,
    name: string,
    collegeId: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.put(`/admin/departments/${id}`, {
        name,
        college_id: collegeId,
      });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء تعديل القسم.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/admin/departments/${id}`);
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء حذف القسم.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    loading,
    error,
  };
};
