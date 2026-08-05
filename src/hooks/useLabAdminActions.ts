import { useState } from "react";
import apiClient from "@/lib/axios";

export interface AdminLab {
  id: number;
  name: string;
  department_id: number;
  technician_id: number;
  created_at: string;
  updated_at: string;
}

export const useLabAdminActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLabs = async (): Promise<AdminLab[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<AdminLab[]>("/admin/labs");
      return response.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب المخابر.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchLabDetails = async (id: number): Promise<AdminLab | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<AdminLab>(`/admin/labs/${id}`);
      return response.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب تفاصيل المخبر.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createLab = async (
    name: string,
    departmentId: number,
    technicianId: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/admin/labs", {
        name,
        department_id: departmentId,
        technician_id: technicianId,
      });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء إضافة المخبر.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateLab = async (
    id: number,
    name: string,
    departmentId: number,
    technicianId: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.put(`/admin/labs/${id}`, {
        name,
        department_id: departmentId,
        technician_id: technicianId,
      });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء تعديل المخبر.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLab = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/admin/labs/${id}`);
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء حذف المخبر.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchLabs,
    fetchLabDetails,
    createLab,
    updateLab,
    deleteLab,
    loading,
    error,
  };
};
