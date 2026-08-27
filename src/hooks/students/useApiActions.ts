import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/lib/axios";
import type { UserData } from "@/hooks/useAuthActions";

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

  const fetchStudentSubjects = async (yearId?: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<StudentSubjectsResponse>(
        "/student/subjects",
        { params: yearId ? { year_id: yearId } : undefined },
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

export interface UpdateStudentProfileData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  department_id?: string;
  year_id?: string;
  student_number?: string;
  admission_type?: string;
  birth_date?: string;
  phone?: string;
  address?: string;
}

interface UpdateStudentProfileResponse {
  success: boolean;
  message: string;
  user: UserData;
}

interface LaravelErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface LabScheduleOption {
  id: number;
  lab_id: number;
  lab_name: string | null;
  day: string;
  start_time: string;
  end_time: string;
  capacity: number;
  registered_count: number;
  is_full: boolean;
  is_mine: boolean;
}

interface AvailableSchedulesResponse {
  success: boolean;
  schedules: LabScheduleOption[];
  my_registration_id: number | null;
  my_lab_schedule_id: number | null;
}

interface RegisterLabResponse {
  success: boolean;
  message: string;
}

export const useLabRegistrationActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableSchedules = async (
    subjectId: number,
  ): Promise<AvailableSchedulesResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<AvailableSchedulesResponse>(
        "/student/labs/schedules",
        { params: { subject_id: subjectId } },
      );
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<LaravelErrorResponse>;
      setError(
        axiosError.response?.data?.message || "حدث خطأ أثناء جلب مواعيد المخبر.",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const registerForLab = async (labScheduleId: number): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<RegisterLabResponse>(
        "/student/labs/register",
        { lab_schedule_id: labScheduleId },
      );
      return response.data.message;
    } catch (err) {
      const axiosError = err as AxiosError<LaravelErrorResponse>;
      setError(
        axiosError.response?.data?.message || "حدث خطأ أثناء التسجيل في المخبر.",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelLabRegistration = async (registrationId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/student/labs/register/${registrationId}`);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<LaravelErrorResponse>;
      setError(
        axiosError.response?.data?.message || "حدث خطأ أثناء إلغاء التسجيل.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAvailableSchedules,
    registerForLab,
    cancelLabRegistration,
    loading,
    error,
  };
};

export const useUpdateStudentProfile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (
    data: UpdateStudentProfileData,
  ): Promise<UserData | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.patch<UpdateStudentProfileResponse>(
        "/student/updateProfile",
        data,
      );
      return response.data.user;
    } catch (err) {
      const axiosError = err as AxiosError<LaravelErrorResponse>;
      const firstFieldError = axiosError.response?.data?.errors
        ? Object.values(axiosError.response.data.errors)[0]?.[0]
        : undefined;
      setError(
        firstFieldError ||
          axiosError.response?.data?.message ||
          "حدث خطأ أثناء تحديث البيانات.",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
};
