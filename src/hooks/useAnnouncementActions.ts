import { useState } from "react";
import apiClient from "@/lib/axios";

export interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
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

  return { fetchAnnouncements, loading, error };
};
