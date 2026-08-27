import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
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
import { Loader2, Inbox, Save, ArrowLeft } from "lucide-react";
import {
  ExamStudent,
  PASSING_MARK,
  useExamEmployeeActions,
} from "@/hooks/examEmployee/useApiActions";

type SaveStatus = "not_entered" | "saved" | "modified" | "error";

interface StudentRow {
  student_id: number;
  name: string;
  mark: number | null;
  savedMark: number | null;
  is_success: boolean | null;
  status: SaveStatus;
}

const toRow = (s: ExamStudent): StudentRow => ({
  student_id: s.student_id,
  name: s.name,
  mark: s.mark,
  savedMark: s.mark,
  is_success: s.is_success,
  status: s.mark == null ? "not_entered" : "saved",
});

const EnterGradesPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isArabic = lang === "ar";
  const { toast } = useToast();
  const { fetchSubjectStudents, updateMark, loading } = useExamEmployeeActions();

  const subjectId: number | null = state?.subjectId ? Number(state.subjectId) : null;

  const [subjectName, setSubjectName] = useState<string>("");
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filterQ, setFilterQ] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [isSavingAll, setIsSavingAll] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{ studentId: number; name: string; oldMark: number | null; newMark: number } | null>(null);

  const loadData = async () => {
    if (!subjectId) return;
    const data = await fetchSubjectStudents(subjectId);
    if (data) {
      setSubjectName(data.subject.name);
      setRows(data.new_students.concat(data.failed_students).map(toRow));
    }
    setInitialLoading(false);
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId]);

  const studentsCount = rows.length;
  const enteredCount = rows.filter((r) => r.mark != null).length;
  const completionPercent = studentsCount ? Math.round((enteredCount / studentsCount) * 100) : 0;

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) => r.name.includes(filterQ) || String(r.student_id).includes(filterQ),
      ),
    [rows, filterQ],
  );

  const handleMarkChange = (studentId: number, value: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.student_id !== studentId) return r;
        const mark = value === "" ? null : Number(value);
        const status: SaveStatus =
          mark === r.savedMark ? (mark == null ? "not_entered" : "saved") : "modified";
        return { ...r, mark, status };
      }),
    );
  };

  const isInvalid = (mark: number | null) =>
    mark !== null && (Number.isNaN(mark) || mark < 0 || mark > 100);

  const persistMark = async (row: StudentRow): Promise<void> => {
    if (!subjectId || row.mark == null) return;
    const ok = await updateMark(subjectId, row.student_id, row.mark);
    setRows((prev) =>
      prev.map((r) =>
        r.student_id === row.student_id
          ? {
              ...r,
              savedMark: ok ? row.mark : r.savedMark,
              is_success: ok ? row.mark! >= PASSING_MARK : r.is_success,
              status: ok ? "saved" : "error",
            }
          : r,
      ),
    );
    if (!ok) {
      toast({
        title: isArabic ? "تعذّر حفظ العلامة" : "Failed to save mark",
        description: `${row.name}`,
        variant: "destructive",
      });
    }
  };

  const handleSaveSingle = async (row: StudentRow) => {
    if (isInvalid(row.mark)) {
      toast({ title: isArabic ? "قيمة غير صالحة (0-100)" : "Invalid value (0-100)", variant: "destructive" });
      return;
    }
    if (row.mark == null) return;

    // إذا كانت هناك علامة محفوظة مسبقاً وتم تغييرها، نطلب تأكيد قبل الاستبدال
    if (row.savedMark != null && row.savedMark !== row.mark) {
      setPendingEdit({ studentId: row.student_id, name: row.name, oldMark: row.savedMark, newMark: row.mark });
      setConfirmOpen(true);
      return;
    }

    setSavingId(row.student_id);
    await persistMark(row);
    setSavingId(null);
  };

  const confirmApplyEdit = async () => {
    if (!pendingEdit) return;
    const row = rows.find((r) => r.student_id === pendingEdit.studentId);
    setConfirmOpen(false);
    if (row) {
      setSavingId(row.student_id);
      await persistMark(row);
      setSavingId(null);
    }
    setPendingEdit(null);
  };

  const handleSaveAll = async () => {
    const toSave = rows.filter((r) => r.status === "modified" && r.mark != null && !isInvalid(r.mark));
    if (toSave.length === 0) {
      toast({ title: isArabic ? "لا توجد تعديلات لحفظها" : "No changes to save" });
      return;
    }
    setIsSavingAll(true);
    for (const row of toSave) {
      await persistMark(row);
    }
    setIsSavingAll(false);
    toast({
      title: isArabic ? "تم حفظ التعديلات" : "Changes saved",
      className: "bg-green-600 text-white font-semibold",
    });
  };

  if (!subjectId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          {isArabic ? "إدخال العلامات" : "Enter Grades"}
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
        {isArabic ? "إدخال العلامات" : "Enter Grades"}
      </h1>

      {initialLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 space-y-1">
              <p className="text-sm">
                {isArabic ? "المادة: " : "Subject: "}
                <strong>{subjectName}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                {isArabic ? "عدد الطلاب: " : "Students: "}
                {studentsCount} · {isArabic ? "المدخلة: " : "Entered: "}
                {enteredCount} · {isArabic ? "نسبة الإنجاز: " : "Completion: "}
                {completionPercent}%
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-2 flex-wrap items-center">
            <Input
              placeholder={isArabic ? "بحث باسم الطالب أو رقمه" : "Search by name or ID"}
              value={filterQ}
              onChange={(e) => setFilterQ(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleSaveAll} disabled={isSavingAll} className="gap-1.5">
              {isSavingAll && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              {isArabic ? "حفظ كل التعديلات" : "Save All Changes"}
            </Button>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Inbox className="w-10 h-10" />
              <p className="text-sm">{isArabic ? "لا يوجد طلاب" : "No students"}</p>
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
                        <TableHead>{isArabic ? "اسم الطالب" : "Student Name"}</TableHead>
                        <TableHead>{isArabic ? "العلامة" : "Mark"}</TableHead>
                        <TableHead>{isArabic ? "النتيجة" : "Result"}</TableHead>
                        <TableHead>{isArabic ? "الحالة" : "Status"}</TableHead>
                        <TableHead className="text-end">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((row, idx) => {
                        const invalid = isInvalid(row.mark);
                        const result =
                          row.mark == null
                            ? isArabic ? "غير مدخلة" : "Not entered"
                            : row.mark >= PASSING_MARK
                              ? isArabic ? "ناجح" : "Pass"
                              : isArabic ? "راسب" : "Fail";
                        return (
                          <TableRow key={row.student_id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{row.student_id}</TableCell>
                            <TableCell className="font-medium">{row.name}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={row.mark === null ? "" : String(row.mark)}
                                onChange={(e) => handleMarkChange(row.student_id, e.target.value)}
                                className="w-24"
                              />
                              {invalid && (
                                <p className="text-xs text-destructive mt-1">
                                  {isArabic ? "قيمة خارج النطاق (0-100)" : "Out of range (0-100)"}
                                </p>
                              )}
                            </TableCell>
                            <TableCell>{result}</TableCell>
                            <TableCell>
                              {row.status === "not_entered" && (
                                <Badge variant="secondary">{isArabic ? "غير مدخلة" : "Not entered"}</Badge>
                              )}
                              {row.status === "saved" && (
                                <Badge className="border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                  {isArabic ? "محفوظة" : "Saved"}
                                </Badge>
                              )}
                              {row.status === "modified" && (
                                <Badge className="border-transparent bg-amber-100 text-amber-700 hover:bg-amber-100">
                                  {isArabic ? "معدّلة ولم تُحفظ" : "Modified, unsaved"}
                                </Badge>
                              )}
                              {row.status === "error" && (
                                <Badge variant="destructive">{isArabic ? "خطأ بالحفظ" : "Save failed"}</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={savingId === row.student_id || invalid || row.mark == null}
                                  onClick={() => handleSaveSingle(row)}
                                  className="gap-1.5"
                                >
                                  {savingId === row.student_id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                  {isArabic ? "حفظ" : "Save"}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{isArabic ? "تأكيد تعديل العلامة" : "Confirm Mark Change"}</DialogTitle>
          </DialogHeader>
          {pendingEdit && (
            <div className="space-y-2 text-foreground">
              <p>
                {isArabic ? "الطالب: " : "Student: "}
                <strong>{pendingEdit.name}</strong>
              </p>
              <p>
                {isArabic ? "العلامة القديمة: " : "Old mark: "}
                <strong>{pendingEdit.oldMark ?? "-"}</strong>
              </p>
              <p>
                {isArabic ? "العلامة الجديدة: " : "New mark: "}
                <strong>{pendingEdit.newMark}</strong>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmOpen(false);
                setPendingEdit(null);
              }}
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="destructive" onClick={confirmApplyEdit} disabled={loading}>
              {isArabic ? "تأكيد التعديل" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnterGradesPage;
