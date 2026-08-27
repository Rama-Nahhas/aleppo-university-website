import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/lib/axios";

export interface DoctorSubjectLookup {
  id: number;
  name: string;
  college_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DoctorSubject {
  id: number;
  department_id: number;
  year_id: number;
  user_id: number;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  department: DoctorSubjectLookup;
  year: DoctorSubjectLookup;
}

interface DoctorSubjectsResponse {
  status: string;
  data: DoctorSubject[];
}

interface DoctorSubjectResponse {
  status: string;
  message: string;
  data: DoctorSubject;
}

export interface StudentOption {
  id: number;
  name: string;
  email: string;
  student_number: string | null;
  department_id: number | null;
  year_id: number | null;
}

interface StudentsResponse {
  status: string;
  data: StudentOption[];
}

export interface CreateSubjectPayload {
  name: string;
  department_id: string;
  year_id: string;
  student_ids: number[];
  file?: File | null;
}

interface LaravelErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export const useDoctorSubjectActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctorSubjects = async (): Promise<DoctorSubject[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<DoctorSubjectsResponse>(
        "/doctor/subjects",
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب المواد.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForSelection = async (
    departmentId?: string,
    yearId?: string,
  ): Promise<StudentOption[]> => {
    try {
      const response = await apiClient.get<StudentsResponse>("/doctor/students", {
        params: {
          department_id: departmentId || undefined,
          year_id: yearId || undefined,
        },
      });
      return response.data.data;
    } catch {
      return [];
    }
  };

  const createSubject = async (
    payload: CreateSubjectPayload,
  ): Promise<DoctorSubject | null> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("department_id", payload.department_id);
      formData.append("year_id", payload.year_id);
      payload.student_ids.forEach((id, index) => {
        formData.append(`student_ids[${index}]`, String(id));
      });
      if (payload.file) {
        formData.append("file", payload.file);
      }

      const response = await apiClient.post<DoctorSubjectResponse>(
        "/doctor/subjects",
        formData,
        // منسيب axios يحدد Content-Type ونوع الـ boundary تلقائياً لملف الـ form-data
        { headers: { "Content-Type": undefined } },
      );
      return response.data.data;
    } catch (err) {
      const axiosError = err as AxiosError<LaravelErrorResponse>;
      const firstFieldError = axiosError.response?.data?.errors
        ? Object.values(axiosError.response.data.errors)[0]?.[0]
        : undefined;
      setError(
        firstFieldError ||
          axiosError.response?.data?.message ||
          "حدث خطأ أثناء إنشاء المادة.",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/doctor/subjects/${id}`);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<LaravelErrorResponse>;
      setError(axiosError.response?.data?.message || "حدث خطأ أثناء حذف المادة.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchDoctorSubjects,
    fetchStudentsForSelection,
    createSubject,
    deleteSubject,
    loading,
    error,
  };
};
