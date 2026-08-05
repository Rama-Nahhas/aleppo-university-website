import { useState } from "react";
import apiClient from "@/lib/axios";
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

export const useScheduleAdminActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async (): Promise<AdminSchedule[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: AdminSchedule[] }>(
        "/admin/schedules",
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب الجداول.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (
    departmentId: number,
    yearId: number,
    image: File,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("department_id", String(departmentId));
      formData.append("year_id", String(yearId));
      formData.append("image", image);
      await apiClient.post("/admin/schedules", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء إضافة الجدول.");
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
      formData.append("_method", "PUT");
      formData.append("is_active", isActive ? "1" : "0");
      if (image) formData.append("image", image);
      await apiClient.patch(`/admin/schedules/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء تعديل الجدول.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/admin/schedules/${id}`);
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء حذف الجدول.");
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
    loading,
    error,
  };
};
