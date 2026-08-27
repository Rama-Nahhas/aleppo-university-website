import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/lib/axios";

export interface LabInfo {
  id: number;
  name: string;
  department_id: number;
  lab_manager_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface LabScheduleItem {
  id: number;
  subject_id: number;
  lab_id: number;
  day: string;
  start_time: string;
  end_time: string;
  capacity: number;
  created_at: string;
  updated_at: string;
  lab: LabInfo;
}

export interface LabManagerSubject {
  id: number;
  name: string;
}

interface LabManagerSubjectsResponse {
  status: string;
  department_id: number;
  data: LabManagerSubject[];
}

export interface CreateSchedulePayload {
  subject_id: string;
  day: string;
  start_time: string;
  end_time: string;
  capacity: string;
}

export interface UpdateSchedulePayload {
  day?: string;
  start_time?: string;
  end_time?: string;
  capacity?: string;
}

export interface RegisteredStudent {
  registration_id: number;
  id: number;
  name: string;
  student_number: string | null;
  email: string;
  phone: string | null;
}

export interface LabStudentsSchedule {
  schedule_id: number;
  subject_id: number;
  subject_name: string | null;
  day: string;
  time: string;
  capacity: number;
  registered_count: number;
  students: RegisteredStudent[];
}

export interface LabStudentsResponse {
  lab_id: number;
  lab_name: string;
  schedules: LabStudentsSchedule[];
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

export const useLabManagerActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async (): Promise<LabScheduleItem[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<LabScheduleItem[]>("/lab-manager/schedules");
      return response.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب جدول المخبر."));
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleDetails = async (id: number): Promise<LabScheduleItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<LabScheduleItem>(`/lab-manager/schedules/${id}`);
      return response.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب تفاصيل الموعد."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (): Promise<LabManagerSubject[]> => {
    try {
      const response = await apiClient.get<LabManagerSubjectsResponse>("/lab-manager/subjects");
      return response.data.data;
    } catch {
      return [];
    }
  };

  const createSchedule = async (
    payload: CreateSchedulePayload,
  ): Promise<LabScheduleItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<{ message: string; schedule: LabScheduleItem }>(
        "/lab-manager/schedules",
        payload,
      );
      return response.data.schedule;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء إضافة الموعد."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (
    id: number,
    payload: UpdateSchedulePayload,
  ): Promise<LabScheduleItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.put<{ message: string; schedule: LabScheduleItem }>(
        `/lab-manager/schedules/${id}`,
        payload,
      );
      return response.data.schedule;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء تعديل الموعد."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/lab-manager/schedules/${id}`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء حذف الموعد."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLabId = async (myUserId: number): Promise<number | null> => {
    try {
      const response = await apiClient.get<LabInfo[]>("/labs");
      const myLab = response.data.find((lab) => lab.lab_manager_id === myUserId);
      return myLab?.id ?? null;
    } catch {
      return null;
    }
  };

  const fetchLabStudents = async (labId: number): Promise<LabStudentsResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<LabStudentsResponse>(
        `/lab-manager/labs/${labId}/students`,
      );
      return response.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب قائمة الطلاب."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const moveRegistration = async (
    registrationId: number,
    newLabScheduleId: number,
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.put<{ success: boolean; message: string }>(
        `/lab-manager/labs/register/${registrationId}`,
        { new_lab_schedule_id: newLabScheduleId },
      );
      return response.data.message;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء نقل الطالب."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeRegistration = async (registrationId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/lab-manager/labs/register/${registrationId}`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء إلغاء تسجيل الطالب."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchSchedules,
    fetchScheduleDetails,
    fetchSubjects,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    fetchMyLabId,
    fetchLabStudents,
    moveRegistration,
    removeRegistration,
    loading,
    error,
  };
};
