import { useState } from "react";
import apiClient from "@/lib/axios";

export interface Subject {
  id: number;
  name: string;
  doctor: { id: number; name: string };
}

export const useSubjectActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: { subjects: Subject[] } }>(
        "/student/subjects",
      );
      return response.data.data.subjects;
    } catch (err) {
      setError("حدث خطأ أثناء جلب المقررات.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetchStudentSubjects, loading, error };
};

export interface Schedule {
  id: number;
  year_id: number;
  department_id: number;
  image: string;
  is_active: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useScheduleActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Schedule }>(
        "/student/schedule",
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب الجدول.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchStudentSchedule, loading, error };
};

export interface NamedOption {
  id: number;
  name: string;
}

export const useCollegeLookups = () => {
  const fetchYears = async (collegeId: number) => {
    const response = await apiClient.get<{ data: NamedOption[] }>(
      `/colleges/${collegeId}/years`,
    );
    return response.data.data;
  };

  const fetchDepartments = async (collegeId: number) => {
    const response = await apiClient.get<{ data: NamedOption[] }>(
      `/colleges/${collegeId}/departments`,
    );
    return response.data.data;
  };

  return { fetchYears, fetchDepartments };
};
