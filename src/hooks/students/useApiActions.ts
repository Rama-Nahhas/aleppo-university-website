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
