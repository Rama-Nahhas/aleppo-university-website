import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { ImageOff, Loader2 } from "lucide-react";
import {
  Schedule,
  NamedOption,
  useScheduleActions,
  useCollegeLookups,
} from "@/hooks/students/useApiActions";

const COLLEGE_ID = 1;

const formatDate = (value: string | null, lang: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
};

const MySchedulePage: React.FC = () => {
  const { lang } = useLanguage();
  const { fetchStudentSchedule, loading } = useScheduleActions();
  const { fetchYears, fetchDepartments } = useCollegeLookups();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [yearName, setYearName] = useState<string | null>(null);
  const [departmentName, setDepartmentName] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStudentSchedule();
      setSchedule(data);

      if (data) {
        const [years, departments] = await Promise.all([
          fetchYears(COLLEGE_ID),
          fetchDepartments(COLLEGE_ID),
        ]);
        setYearName(
          years.find((y: NamedOption) => y.id === data.year_id)?.name ?? null,
        );
        setDepartmentName(
          departments.find((d: NamedOption) => d.id === data.department_id)
            ?.name ?? null,
        );
      }
    };
    loadData();
  }, []);

  if (loading) return <Loader2 className="animate-spin" />;

  const rows = schedule
    ? [
        {
          label: lang === "ar" ? "السنة" : "Year",
          value: yearName ?? schedule.year_id,
        },
        {
          label: lang === "ar" ? "القسم" : "Department",
          value: departmentName ?? schedule.department_id,
        },
        {
          label: lang === "ar" ? "الحالة" : "Status",
          value:
            lang === "ar"
              ? schedule.is_active
                ? "نشط"
                : "غير نشط"
              : schedule.is_active
                ? "Active"
                : "Inactive",
        },
        {
          label: lang === "ar" ? "تاريخ النشر" : "Published At",
          value: formatDate(schedule.published_at, lang),
        },
        {
          label: lang === "ar" ? "تاريخ الإنشاء" : "Created At",
          value: formatDate(schedule.created_at, lang),
        },
        {
          label: lang === "ar" ? "آخر تحديث" : "Updated At",
          value: formatDate(schedule.updated_at, lang),
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        {lang === "ar" ? "جدولي الدراسي" : "My Schedule"}
      </h1>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-4">
          {schedule?.image ? (
            <img
              src={schedule.image}
              alt={lang === "ar" ? "الجدول الدراسي" : "Schedule"}
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <ImageOff className="w-10 h-10" />
            </div>
          )}
          {schedule && (
            <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-border">
              {rows.map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-foreground">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MySchedulePage;
