import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ImageOff, Inbox, Loader2 } from "lucide-react";
import {
  YearSchedule,
  useScheduleActions,
  useCollegeLookups,
} from "@/hooks/students/useApiActions";

const COLLEGE_ID = 1;

const ORDINAL_YEAR_NAMES: Record<number, string> = {
  1: "السنة الأولى",
  2: "السنة الثانية",
  3: "السنة الثالثة",
  4: "السنة الرابعة",
  5: "السنة الخامسة",
};

const formatDate = (value: string | null, lang: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
};

const ScheduleCard: React.FC<{ item: YearSchedule; lang: string }> = ({
  item: { year_name, schedule },
  lang,
}) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">{year_name}</h3>
        <span
          className={
            schedule.is_active
              ? "text-xs font-medium text-primary"
              : "text-xs font-medium text-muted-foreground"
          }
        >
          {lang === "ar"
            ? schedule.is_active
              ? "نشط"
              : "غير نشط"
            : schedule.is_active
              ? "Active"
              : "Inactive"}
        </span>
      </div>

      {schedule.image ? (
        <img
          src={schedule.image}
          alt={year_name}
          className="w-full h-auto rounded-lg"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
          <ImageOff className="w-8 h-8" />
        </div>
      )}

      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
        {lang === "ar" ? "تاريخ النشر: " : "Published: "}
        {formatDate(schedule.published_at, lang)}
      </div>
    </CardContent>
  </Card>
);

const MySchedulePage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { fetchStudentSchedule, loading } = useScheduleActions();
  const { fetchDepartments } = useCollegeLookups();
  const [schedules, setSchedules] = useState<YearSchedule[]>([]);
  const [departmentName, setDepartmentName] = useState<string | null>(null);
  const [showOthers, setShowOthers] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStudentSchedule();
      setSchedules(data?.schedules_by_year ?? []);

      if (data && data.schedules_by_year.length > 0) {
        const departments = await fetchDepartments(COLLEGE_ID);
        setDepartmentName(
          departments.find((d) => d.id === data.department_id)?.name ?? null,
        );
      }
    };
    loadData();
  }, []);

  if (loading) return <Loader2 className="animate-spin" />;

  const ownYearName = user?.year_id ? ORDINAL_YEAR_NAMES[user.year_id] : undefined;
  const ownSchedule = schedules.find((s) => s.year_name === ownYearName);
  const otherSchedules = schedules.filter((s) => s.year_name !== ownYearName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {lang === "ar" ? "جدولي الدراسي" : "My Schedule"}
        </h1>
        {departmentName && (
          <p className="text-sm text-muted-foreground mt-1">
            {lang === "ar" ? "القسم: " : "Department: "}
            {departmentName}
          </p>
        )}
      </div>

      {schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">
            {lang === "ar"
              ? "لا يوجد جدول متاح حالياً"
              : "No schedule available yet"}
          </p>
        </div>
      ) : (
        <>
          {ownSchedule ? (
            <ScheduleCard item={ownSchedule} lang={lang} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Inbox className="w-10 h-10" />
              <p className="text-sm">
                {lang === "ar"
                  ? "لا يوجد جدول لسنتك الدراسية حالياً"
                  : "No schedule available for your year yet"}
              </p>
            </div>
          )}

          {otherSchedules.length > 0 && (
            <div className="space-y-4">
              <button
                onClick={() => setShowOthers((prev) => !prev)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showOthers ? "rotate-180" : ""}`}
                />
                {lang === "ar"
                  ? "الذهاب لجداول باقي السنوات"
                  : "View other years' schedules"}
              </button>

              {showOthers && (
                <div className="grid md:grid-cols-2 gap-4">
                  {otherSchedules.map((item) => (
                    <ScheduleCard key={item.year_id} item={item} lang={lang} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MySchedulePage;
