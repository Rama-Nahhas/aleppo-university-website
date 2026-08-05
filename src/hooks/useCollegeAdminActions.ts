import { useState } from "react";
import apiClient from "@/lib/axios";

export interface AdminCollege {
  id: number;
  name: string;
}

export interface CollegeSubItem {
  id: number;
  name: string;
  college_id: number;
  created_at: string;
  updated_at: string;
}

export interface CollegeDetails {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  departments: CollegeSubItem[];
  years: CollegeSubItem[];
}

export const useCollegeAdminActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchColleges = async (): Promise<AdminCollege[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: AdminCollege[] }>(
        "/admin/colleges",
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب الكليات.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchCollegeDetails = async (
    id: number,
  ): Promise<CollegeDetails | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: CollegeDetails }>(
        `/admin/colleges/${id}`,
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب تفاصيل الكلية.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCollege = async (name: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/admin/colleges", { name });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء إضافة الكلية.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCollege = async (id: number, name: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.put(`/admin/colleges/${id}`, { name });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء تعديل الكلية.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCollege = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/admin/colleges/${id}`);
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء حذف الكلية.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchColleges,
    fetchCollegeDetails,
    createCollege,
    updateCollege,
    deleteCollege,
    loading,
    error,
  };
};
