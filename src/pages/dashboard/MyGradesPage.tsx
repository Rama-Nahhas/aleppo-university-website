import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Inbox, Loader2 } from "lucide-react";
import { Subject, useSubjectActions } from "@/hooks/students/useApiActions";

const MyGradesPage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { fetchStudentSubjects, loading } = useSubjectActions();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStudentSubjects(user?.year_id ?? undefined);
      setSubjects(data);
    };
    loadData();
  }, [user?.year_id]);

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        {lang === "ar" ? "علاماتي" : "My Grades"}
      </h1>
      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">
            {lang === "ar" ? "لا توجد علامات متاحة حالياً" : "No grades available yet"}
          </p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{lang === "ar" ? "المقرر" : "Course"}</TableHead>
                  <TableHead>{lang === "ar" ? "المدرس" : "Instructor"}</TableHead>
                  <TableHead>{lang === "ar" ? "الدرجة" : "Grade"}</TableHead>
                  <TableHead>{lang === "ar" ? "الحالة" : "Status"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((s) => (
                  <TableRow key={s.subject_id}>
                    <TableCell className="font-medium">
                      {s.subject_name}
                    </TableCell>
                    <TableCell>{s.doctor.name}</TableCell>
                    <TableCell>{s.mark != null ? `${s.mark}/100` : "-"}</TableCell>
                    <TableCell>
                      {s.is_success != null ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            s.is_success
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {s.is_success
                            ? lang === "ar"
                              ? "ناجح"
                              : "Pass"
                            : lang === "ar"
                              ? "راسب"
                              : "Fail"}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyGradesPage;
