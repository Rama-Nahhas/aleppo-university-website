import { useState } from "react";
import apiClient from "@/lib/axios";

export interface Subject {
  subject_id: number;
  subject_name: string;
  doctor: { id: number; name: string };
  mark: number | null;
  is_success: boolean | null;
  note: string | null;
}

interface StudentSubjectsResponse {
  success: boolean;
  year_id: number;
  department_id: number;
  subjects: Subject[];
}

export const useSubjectActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<StudentSubjectsResponse>(
        "/student/subjects",
      );
      return response.data.subjects;
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
  image: string;
  is_active: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface YearSchedule {
  year_id: number;
  year_name: string;
  schedule: Schedule;
}

interface StudentScheduleResponse {
  department_id: number;
  schedules_by_year: YearSchedule[];
}

export const useScheduleActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<StudentScheduleResponse>(
        "/student/schedule",
      );
      return response.data;
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
