import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Inbox, FileEdit, Eye, History } from "lucide-react";
import {
  ExamStudent,
  MarkHistoryEntry,
  SubjectStudentsData,
  useExamEmployeeActions,
} from "@/hooks/examEmployee/useApiActions";

const StudentsTable: React.FC<{
  title: string;
  students: ExamStudent[];
  isArabic: boolean;
  onView: (s: ExamStudent) => void;
}> = ({ title, students, isArabic, onView }) => (
  <div className="space-y-2">
    <h3 className="text-sm font-bold text-foreground">{title}</h3>
    {students.length === 0 ? (
      <p className="text-sm text-muted-foreground py-4 text-center bg-muted/30 rounded-lg">
        {isArabic ? "لا يوجد طلاب" : "No students"}
      </p>
    ) : (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>{isArabic ? "الرقم" : "ID"}</TableHead>
              <TableHead>{isArabic ? "الاسم" : "Name"}</TableHead>
              <TableHead>{isArabic ? "العلامة" : "Mark"}</TableHead>
              <TableHead>{isArabic ? "الحالة" : "Status"}</TableHead>
              <TableHead className="text-end">{isArabic ? "إجراءات" : "Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s, idx) => (
              <TableRow key={s.student_id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{s.student_id}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.mark == null ? (isArabic ? "غير مدخلة" : "Not entered") : s.mark}</TableCell>
                <TableCell>
                  {s.is_success === null ? (
                    <Badge variant="secondary">{isArabic ? "غير محددة" : "Pending"}</Badge>
                  ) : s.is_success ? (
                    <Badge className="border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      {isArabic ? "ناجح" : "Pass"}
                    </Badge>
                  ) : (
                    <Badge className="border-transparent bg-red-100 text-red-700 hover:bg-red-100">
                      {isArabic ? "راسب" : "Fail"}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => onView(s)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </div>
);

const SubjectStudentsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isArabic = lang === "ar";
  const { fetchSubjectStudents, fetchStudentHistory, loading } = useExamEmployeeActions();

  const subjectId = Number(id);
  const [data, setData] = useState<SubjectStudentsData | null>(null);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<ExamStudent | null>(null);
  const [history, setHistory] = useState<MarkHistoryEntry[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const openDetails = async (s: ExamStudent) => {
    setSelected(s);
    setHistory(null);
    setHistoryLoading(true);
    const result = await fetchStudentHistory(subjectId, s.student_id);
    setHistory(result?.history ?? []);
    setHistoryLoading(false);
  };

  useEffect(() => {
    const load = async () => {
      const result = await fetchSubjectStudents(subjectId);
      setData(result);
    };
    if (subjectId) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  const rawNew = useMemo(() => data?.new_students ?? [], [data]);
  const rawFailed = useMemo(() => data?.failed_students ?? [], [data]);

  const filteredNew = useMemo(
    () => rawNew.filter((r) => r.name.includes(q) || String(r.student_id).includes(q)),
    [q, rawNew],
  );
  const filteredFailed = useMemo(
    () => rawFailed.filter((r) => r.name.includes(q) || String(r.student_id).includes(q)),
    [q, rawFailed],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">
          {isArabic ? "طلاب المادة" : "Subject Students"}
        </h1>
        {data && (
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() =>
              navigate("/dashboard/exam-employee/enter-grades", { state: { subjectId } })
            }
          >
            <FileEdit className="w-3.5 h-3.5" />
            {isArabic ? "إدخال العلامات" : "Enter Grades"}
          </Button>
        )}
      </div>

      {loading && !data ? (
        <Loader2 className="animate-spin" />
      ) : !data ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{isArabic ? "تعذّر إيجاد هذه المادة" : "Subject not found"}</p>
        </div>
      ) : (
        <>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 space-y-1">
              <p className="text-sm">
                {isArabic ? "المادة: " : "Subject: "}
                <strong>{data.subject.name}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                {isArabic ? "عدد الطلاب: " : "Students: "}
                {rawNew.length + rawFailed.length}
              </p>
            </CardContent>
          </Card>

          <Input
            placeholder={isArabic ? "بحث بالاسم أو الرقم" : "Search by name or ID"}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 space-y-6">
              <StudentsTable
                title={isArabic ? "طلاب جدد" : "New Students"}
                students={filteredNew}
                isArabic={isArabic}
                onView={openDetails}
              />
              <StudentsTable
                title={isArabic ? "طلاب راسبون سابقاً" : "Previously Failed"}
                students={filteredFailed}
                isArabic={isArabic}
                onView={openDetails}
              />
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent dir={isArabic ? "rtl" : "ltr"} className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isArabic ? "تفاصيل الطالب" : "Student Details"}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="space-y-2 text-foreground">
                <p>
                  {isArabic ? "الاسم: " : "Name: "}
                  <strong>{selected.name}</strong>
                </p>
                <p>
                  {isArabic ? "العلامة: " : "Mark: "}
                  {selected.mark == null ? "-" : selected.mark}
                </p>
                <p>
                  {isArabic ? "النتيجة: " : "Result: "}
                  {selected.is_success === null
                    ? isArabic
                      ? "غير محددة"
                      : "Pending"
                    : selected.is_success
                      ? isArabic
                        ? "ناجح"
                        : "Pass"
                      : isArabic
                        ? "راسب"
                        : "Fail"}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  {isArabic ? "سجل تعديلات العلامة" : "Mark Change History"}
                </h4>
                {historyLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : !history || history.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? "لا يوجد سجل تعديلات بعد" : "No history yet"}
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {history.map((h, idx) => (
                      <div key={idx} className="text-xs p-2 rounded-lg bg-muted/50">
                        <span dir="ltr">{new Date(h.created_at).toLocaleString(isArabic ? "ar-SY" : "en-US")}</span>
                        {" · "}
                        {h.old_mark ?? "-"} → {h.new_mark ?? "-"}
                        {h.changed_by && (
                          <>
                            {" · "}
                            {isArabic ? "بواسطة" : "by"} {h.changed_by.name}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelected(null)}>{isArabic ? "إغلاق" : "Close"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectStudentsPage;
