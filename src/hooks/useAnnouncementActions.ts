import { useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/lib/axios";

export interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
  department_id?: number;
  year_id?: number;
  created_by?: number;
}

export interface CreateDepartmentAnnouncementData {
  title: string;
  content: string;
  year_id: number;
}

export interface CreatePublicAnnouncementData {
  title: string;
  content: string;
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

export const useAnnouncementActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /** إعلانات القسم (غير عامة) - للطالب والدكتور */
  const fetchAnnouncements = async (): Promise<Announcement[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Announcement[] }>("/announcements");
      return response.data.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب الإعلانات."));
      return [];
    } finally {
      setLoading(false);
    }
  };

  /** الإعلانات العامة - للأدمن/السب أدمن (ولزوار الموقع العام) */
  const fetchPublicAnnouncements = async (): Promise<Announcement[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Announcement[] }>("/public-announcements");
      return response.data.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء جلب الإعلانات."));
      return [];
    } finally {
      setLoading(false);
    }
  };

  /** نشر إعلان لقسم الدكتور وسنة محددة - دكتور فقط */
  const createDepartmentAnnouncement = async (
    data: CreateDepartmentAnnouncementData,
  ): Promise<Announcement | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<{ data: Announcement }>("/announcements/create", data);
      return response.data.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء نشر الإعلان."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  /** نشر إعلان عام يشوفه الكل - سوبر أدمن/سب أدمن فقط */
  const createPublicAnnouncement = async (
    data: CreatePublicAnnouncementData,
  ): Promise<Announcement | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<{ data: Announcement }>(
        "/public-announcements/create",
        data,
      );
      return response.data.data;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء نشر الإعلان."));
      return null;
    } finally {
      setLoading(false);
    }
  };

  /** حذف إعلان - بيسمح الباك إند بس لصاحب الإعلان */
  const deleteAnnouncement = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/announcements/${id}`);
      return true;
    } catch (err) {
      setError(extractError(err, "حدث خطأ أثناء حذف الإعلان."));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAnnouncements,
    fetchPublicAnnouncements,
    createDepartmentAnnouncement,
    createPublicAnnouncement,
    deleteAnnouncement,
    loading,
    error,
  };
};
