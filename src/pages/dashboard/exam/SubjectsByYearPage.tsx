import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Loader2, Inbox, Users, FileEdit, GraduationCap } from "lucide-react";
import {
  ExamSubject,
  YearOption,
  useExamEmployeeActions,
} from "@/hooks/examEmployee/useApiActions";

const SubjectsByYearPage: React.FC = () => {
  const { lang } = useLanguage();
  const isArabic = lang === "ar";
  const navigate = useNavigate();
  const { fetchYears, fetchSubjectsByYear, loading } = useExamEmployeeActions();

  const [years, setYears] = useState<YearOption[]>([]);
  const [yearId, setYearId] = useState<string>("");
  const [subjects, setSubjects] = useState<ExamSubject[]>([]);
  const [q, setQ] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const yrs = await fetchYears();
      setYears(yrs);
      const defaultYearId = yrs[0]?.id ? String(yrs[0].id) : "";
      setYearId(defaultYearId);
      const subs = await fetchSubjectsByYear(defaultYearId ? Number(defaultYearId) : undefined);
      setSubjects(subs);
      setInitialLoading(false);
    };
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleYearChange = async (value: string) => {
    setYearId(value);
    const subs = await fetchSubjectsByYear(value ? Number(value) : undefined);
    setSubjects(subs);
  };

  const filtered = useMemo(
    () => subjects.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())),
    [subjects, q],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {isArabic ? "المواد حسب السنة" : "Subjects by Year"}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? "اختر السنة الدراسية لعرض المواد المتاحة" : "Choose an academic year to view its subjects"}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <Select value={yearId} onValueChange={handleYearChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={isArabic ? "اختر السنة" : "Select year"} />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y.id} value={String(y.id)}>
                {y.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder={isArabic ? "بحث باسم المادة" : "Search by subject name"}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Card className="border-0 shadow-sm max-w-xs">
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-muted-foreground">
            {isArabic ? "عدد المواد الظاهرة" : "Subjects shown"}
          </p>
          <p className="text-lg font-bold text-foreground">{filtered.length}</p>
        </CardContent>
      </Card>

      {initialLoading || loading ? (
        <Loader2 className="animate-spin" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{isArabic ? "لا توجد مواد لعرضها" : "No subjects to show"}</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isArabic ? "اسم المادة" : "Subject"}</TableHead>
                    <TableHead>{isArabic ? "المدرس" : "Doctor"}</TableHead>
                    <TableHead>{isArabic ? "السنة" : "Year"}</TableHead>
                    <TableHead className="text-end">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.doctor?.name ?? "-"}</TableCell>
                      <TableCell>{s.year?.name ?? "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => navigate(`/dashboard/exam-employee/subjects/${s.id}/students`)}
                          >
                            <Users className="w-3.5 h-3.5" />
                            {isArabic ? "طلاب المادة" : "Students"}
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1.5"
                            onClick={() =>
                              navigate("/dashboard/exam-employee/enter-grades", {
                                state: { subjectId: s.id },
                              })
                            }
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                            {isArabic ? "إدخال العلامات" : "Enter Grades"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1.5"
                            onClick={() =>
                              navigate("/dashboard/exam-employee/promoted", {
                                state: { subjectId: s.id },
                              })
                            }
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                            {isArabic ? "المترفعون" : "Promoted"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubjectsByYearPage;
