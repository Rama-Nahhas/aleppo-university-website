import { useState } from "react";
import apiClient from "@/lib/axios";
import type { CollegeYears, Year, YearsResponse } from "@/types";

/**
 * يجلب هيكل السنوات الدراسية من الـ backend عبر GET /years: كل كلية مع سنينها (id + name).
 * هي المصدر الوحيد لأي Select سنة بالمشروع - ما في أسماء/معرّفات سنوات ثابتة بالكود،
 * لأن نفس اسم السنة ("السنة الأولى" مثلاً) بيكون بمعرّف مختلف حسب الكلية.
 */
export const useYears = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchYears = async (): Promise<CollegeYears[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<YearsResponse>("/years");
      return response.data.data ?? [];
    } catch (err) {
      setError("حدث خطأ أثناء جلب السنوات الدراسية.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetchYears, loading, error };
};

/**
 * يرجع سنين كلية معيّنة من نتيجة fetchYears (مصفوفة فاضية إذا الكلية غير موجودة أو لسا ما انحملت).
 * لا تفترض أبداً أن معرّف السنة نفسه بكل الكليات - دايماً استخدم year.id/year.name المرجعة هون.
 */
export const getYearsForCollege = (
  colleges: CollegeYears[],
  collegeId: number | string | null | undefined,
): Year[] => {
  if (collegeId === null || collegeId === undefined || collegeId === "") return [];
  return colleges.find((c) => String(c.id) === String(collegeId))?.years ?? [];
};
