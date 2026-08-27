import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Loader2, Inbox, ArrowLeft } from "lucide-react";
import {
  PromotedStudent,
  useExamEmployeeActions,
} from "@/hooks/examEmployee/useApiActions";

const PromotedStudentsPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isArabic = lang === "ar";
  const { fetchPromotedStudents, loading } = useExamEmployeeActions();

  const subjectId: number | null = state?.subjectId ? Number(state.subjectId) : null;
  const [subjectName, setSubjectName] = useState("");
  const [students, setStudents] = useState<PromotedStudent[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!subjectId) {
        setInitialLoading(false);
        return;
      }
      const data = await fetchPromotedStudents(subjectId);
      if (data) {
        setSubjectName(data.subject.name);
        setStudents(data.promoted_students);
      }
      setInitialLoading(false);
    };
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  const dateFormatter = new Intl.DateTimeFormat(isArabic ? "ar-SY" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  if (!subjectId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          {isArabic ? "الطلاب المترفعون" : "Promoted Students"}
        </h1>
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">
            {isArabic ? "الرجاء اختيار مادة أولاً من صفحة المواد" : "Please select a subject first from the Subjects page"}
          </p>
          <Button variant="outline" className="gap-1.5" onClick={() => navigate("/dashboard/exam-employee/subjects")}>
            <ArrowLeft className="w-3.5 h-3.5" />
            {isArabic ? "المواد حسب السنة" : "Subjects by Year"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        {isArabic ? "الطلاب المترفعون" : "Promoted Students"}
      </h1>

      {initialLoading || loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm">
                {isArabic ? "المادة: " : "Subject: "}
                <strong>{subjectName}</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isArabic
                  ? "الطلاب الذين تحوّلت حالتهم من راسب إلى ناجح لهذه المادة"
                  : "Students whose status changed from fail to pass in this subject"}
              </p>
            </CardContent>
          </Card>

          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Inbox className="w-10 h-10" />
              <p className="text-sm">{isArabic ? "لا يوجد طلاب مترفعون لعرضهم" : "No promoted students to show"}</p>
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>{isArabic ? "الرقم" : "ID"}</TableHead>
                        <TableHead>{isArabic ? "الاسم" : "Name"}</TableHead>
                        <TableHead>{isArabic ? "العلامة القديمة" : "Old Mark"}</TableHead>
                        <TableHead>{isArabic ? "العلامة الجديدة" : "New Mark"}</TableHead>
                        <TableHead>{isArabic ? "بواسطة" : "Changed By"}</TableHead>
                        <TableHead>{isArabic ? "التاريخ" : "Date"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((s, idx) => (
                        <TableRow key={`${s.student_id}-${idx}`}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{s.student_id}</TableCell>
                          <TableCell className="font-medium">{s.student_name}</TableCell>
                          <TableCell>{s.old_mark ?? "-"}</TableCell>
                          <TableCell>{s.new_mark ?? "-"}</TableCell>
                          <TableCell>{s.changed_by?.name ?? "-"}</TableCell>
                          <TableCell dir="ltr" className="whitespace-nowrap">
                            {dateFormatter.format(new Date(s.history_created_at))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PromotedStudentsPage;
