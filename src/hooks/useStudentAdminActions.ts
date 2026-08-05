import { useState } from "react";
import apiClient from "@/lib/axios";

export interface StudentUser {
  id: number;
  department_id: number | null;
  year_id: number | null;
  name: string;
  email: string;
  is_active: number;
  student_number: string | null;
  admission_type: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export const useStudentAdminActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async (): Promise<StudentUser[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: StudentUser[] }>(
        "/admin/users/students",
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب الطلاب.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const blockStudent = async (id: number, reason: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/admin/students/${id}/block`, { reason });
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء حظر الطالب.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/admin/users/${id}`);
      return true;
    } catch (err) {
      setError("حدث خطأ أثناء حذف الطالب.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchStudents,
    blockStudent,
    deleteStudent,
    loading,
    error,
  };
};
