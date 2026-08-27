import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/lib/axios";

export const PASSING_MARK = 60;

export interface YearOption {
  id: number;
  name: string;
}

export interface ExamSubject {
  id: number;
  name: string;
  department_id: number;
  year_id: number;
  doctor?: { id: number; name: string } | null;
  year?: { id: number; name: string } | null;
}

export interface ExamStudent {
  subject_id: number;
  department_id: number;
  year_id: number;
  student_id: number;
  name: string;
  mark: number | null;
  is_success: boolean | null;
}

export interface SubjectStudentsData {
  subject: { id: number; name: string; year_id: number };
  new_students: ExamStudent[];
  failed_students: ExamStudent[];
}

export interface PromotedStudent {
  subject_id: number;
  student_id: number;
  student_name: string;
  department_id: number;
  year_id: number;
  old_mark: number | null;
  new_mark: number | null;
  old_is_success: boolean;
  new_is_success: boolean;
  changed_by: { id: number; name: string } | null;
  history_created_at: string;
  history_updated_at: string;
}

export interface PromotedStudentsData {
  subject: { id: number; name: string; year_id: number };
  promoted_students: PromotedStudent[];
}

export interface MarkHistoryEntry {
  old_mark: number | null;
  new_mark: number | null;
  old_is_success: boolean;
  new_is_success: boolean;
  changed_by: { id: number; name: string } | null;
  created_at: string;
}

export interface StudentHistoryData {
  subject: { id: number; name: string };
  student: { id: number; name: string };
  history: MarkHistoryEntry[];
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

export const useExamEmployeeActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchYears = async (): Promise<YearOption[]> => {
    try {
      // نفس اتفاقية باقي المشروع: كلية واحدة (id=1)، فبنجيب سنينها المسطّحة مباشرة
      const response = await apiClient.get<{
        data: { college: unknown; years: YearOption[] };
      }>("/years", { params: { college_id: 1 } });
      return response.data.data.years;
    } catch {
      return [];
    }
  };

  const fetchSubjectsByYear = async (yearId?: number): Promise<ExamSubject[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: ExamSubject[] }>("/exam-employee/subjects", {
        params: yearId ? { year_id: yearId } : undefined,
      });
      return response.data.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب المواد."));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectStudents = async (subjectId: number): Promise<SubjectStudentsData | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<SubjectStudentsData>(
        `/exam-employee/subjects/${subjectId}/students`,
      );
      return response.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب طلاب المادة."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMark = async (
    subjectId: number,
    studentId: number,
    mark: number,
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/exam-employee/subjects/${subjectId}/students/${studentId}/mark`, {
        mark,
      });
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء حفظ العلامة."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotedStudents = async (subjectId: number): Promise<PromotedStudentsData | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PromotedStudentsData>(
        `/exam-employee/subjects/${subjectId}/promoted`,
      );
      return response.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب الطلاب المترفعين."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentHistory = async (
    subjectId: number,
    studentId: number,
  ): Promise<StudentHistoryData | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<StudentHistoryData>(
        `/exam-employee/subjects/${subjectId}/students/${studentId}/history`,
      );
      return response.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب سجل التعديلات."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchYears,
    fetchSubjectsByYear,
    fetchSubjectStudents,
    updateMark,
    fetchPromotedStudents,
    fetchStudentHistory,
    loading,
    error,
  };
};
