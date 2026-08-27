import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, ClipboardList, GraduationCap, Loader2 } from "lucide-react";
import { useExamEmployeeActions } from "@/hooks/examEmployee/useApiActions";

const ExamDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isArabic = lang === "ar";
  const { fetchSubjectsByYear } = useExamEmployeeActions();

  const [subjectsCount, setSubjectsCount] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      // كل مواد قسم الموظف (بدون تحديد سنة) - رقم بسيط وصحيح، بدون تخمين إحصائيات مكلفة
      const subjects = await fetchSubjectsByYear();
      setSubjectsCount(subjects.length);
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isArabic ? "لوحة موظف الامتحانات" : "Exam Employee Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {isArabic ? "مرحباً بك في لوحة إدارة العلامات" : "Welcome to the grades management panel"}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString(isArabic ? "ar-SY" : "en-US")}
        </div>
      </div>

      <Card className="border-0 shadow-sm max-w-xs">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">{isArabic ? "عدد المواد" : "Subjects"}</p>
            <p className="text-sm text-muted-foreground">
              {subjectsCount === null ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : subjectsCount}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-bold">{isArabic ? "العمليات السريعة" : "Quick Actions"}</h2>
        <div className="flex gap-2 flex-wrap">
          <Button className="gap-1.5" onClick={() => navigate("/dashboard/exam-employee/subjects")}>
            <ClipboardList className="w-4 h-4" />
            {isArabic ? "عرض المواد وإدخال العلامات" : "View Subjects & Enter Grades"}
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => navigate("/dashboard/exam-employee/promoted")}
          >
            <GraduationCap className="w-4 h-4" />
            {isArabic ? "الطلاب المترفعون" : "Promoted Students"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamDashboardPage;
