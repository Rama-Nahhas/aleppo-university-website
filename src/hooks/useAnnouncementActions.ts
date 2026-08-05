import { useState } from "react";
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

export interface CreateAnnouncementData {
  title: string;
  content: string;
  year_id: number;
  department_id: number;
}

export const useAnnouncementActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Announcement[] }>(
        "/announcements",
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء جلب الإعلانات.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async (
    data: CreateAnnouncementData,
  ): Promise<Announcement | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<{ data: Announcement }>(
        "/announcements/create",
        data,
      );
      return response.data.data;
    } catch (err) {
      setError("حدث خطأ أثناء نشر الإعلان.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchAnnouncements, createAnnouncement, loading, error };
};
