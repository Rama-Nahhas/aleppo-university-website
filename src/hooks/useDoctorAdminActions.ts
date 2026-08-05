import { useState } from "react";
import apiClient from "@/lib/axios";

export interface PendingDoctor {
  id: number;
  name: string;
  email: string;
  department_id: number | null;
  specialization: string | null;
  university: string | null;
  graduation_year: number | null;
  employment_year: number | null;
  work_history: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export const useDoctorAdminActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingDoctors = async (): Promise<PendingDoctor[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: PendingDoctor[] }>(
        "/admin/doctors/pending",
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب طلبات الدكاترة  المدرسين.");
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
        "/admin/users/doctors",
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب الدكاترة  المدرسين النشطين.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createDoctor = async (
    name: string,
    email: string,
    password: string,
    specialization: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/admin/doctors", {
        name,
        email,
        password,
        specialization,
      });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء إضافة الدكتور.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const acceptDoctor = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/admin/doctors/${id}/accept`);
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء قبول الطلب.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectDoctor = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/admin/doctors/${id}/reject`);
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء رفض الطلب.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDoctor = async (
    id: number,
    name: string,
    specialization: string,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.put(`/admin/doctors/${id}`, { name, specialization });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء تعديل الدكتور.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const blockDoctor = async (id: number, reason: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/admin/doctors/${id}/block`, { reason });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء حظر الدكتور.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/admin/users/${id}`);
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء حذف المستخدم.");
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
    deleteUser,
    loading,
    error,
  };
};
