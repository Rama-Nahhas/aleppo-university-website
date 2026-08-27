import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Inbox,
  Users,
  Clock,
  ArrowLeftRight,
  Trash2,
  BookOpen,
} from "lucide-react";
import {
  LabStudentsSchedule,
  RegisteredStudent,
  useLabManagerActions,
} from "@/hooks/labManager/useApiActions";

const LabStudentsPage: React.FC = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const isArabic = lang === "ar";
  const { toast } = useToast();

  const {
    fetchMyLabId,
    fetchLabStudents,
    moveRegistration,
    removeRegistration,
    loading: isActing,
  } = useLabManagerActions();

  const [labId, setLabId] = useState<number | null>(null);
  const [labName, setLabName] = useState<string>("");
  const [schedules, setSchedules] = useState<LabStudentsSchedule[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // نافذة نقل الطالب
  const [moveTarget, setMoveTarget] = useState<{
    student: RegisteredStudent;
    fromSchedule: LabStudentsSchedule;
  } | null>(null);
  const [newScheduleId, setNewScheduleId] = useState<string>("");
  const [moveError, setMoveError] = useState<string | null>(null);

  // تأكيد الحذف
  const [studentToRemove, setStudentToRemove] = useState<RegisteredStudent | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const loadStudents = async (targetLabId: number) => {
    const data = await fetchLabStudents(targetLabId);
    if (data) {
      setLabName(data.lab_name);
      setSchedules(data.schedules);
    }
  };

  useEffect(() => {
    const init = async () => {
      setPageLoading(true);
      if (!user?.id) {
        setPageLoading(false);
        return;
      }
      const myLabId = await fetchMyLabId(user.id);
      if (!myLabId) {
        setNotFound(true);
        setPageLoading(false);
        return;
      }
      setLabId(myLabId);
      await loadStudents(myLabId);
      setPageLoading(false);
    };
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const openMoveDialog = (student: RegisteredStudent, fromSchedule: LabStudentsSchedule) => {
    setMoveTarget({ student, fromSchedule });
    setNewScheduleId("");
    setMoveError(null);
  };

  // مواعيد نفس المادة (غير الموعد الحالي) يقدر ينتقل إلها الطالب
  const sameSubjectOtherSchedules = moveTarget
    ? schedules.filter(
        (s) => s.subject_id === moveTarget.fromSchedule.subject_id && s.schedule_id !== moveTarget.fromSchedule.schedule_id,
      )
    : [];

  const handleMoveSubmit = async () => {
    if (!moveTarget || !newScheduleId) {
      setMoveError(isArabic ? "الرجاء اختيار الموعد الجديد" : "Please select the new schedule");
      return;
    }
    setMoveError(null);
    const message = await moveRegistration(moveTarget.student.registration_id, Number(newScheduleId));
    if (message) {
      toast({
        title: isArabic ? "تم نقل الطالب بنجاح" : "Student moved successfully",
        description: message,
        className: "bg-green-600 text-white font-semibold",
      });
      setMoveTarget(null);
      if (labId) await loadStudents(labId);
    } else {
      setMoveError(isArabic ? "حدث خطأ أثناء النقل." : "Something went wrong.");
    }
  };

  const confirmRemove = async () => {
    if (!studentToRemove) return;
    setIsRemoving(true);
    const ok = await removeRegistration(studentToRemove.registration_id);
    setIsRemoving(false);

    if (ok) {
      toast({
        title: isArabic ? "تم إلغاء تسجيل الطالب" : "Student unregistered",
        className: "bg-green-600 text-white font-semibold",
      });
      setStudentToRemove(null);
      if (labId) await loadStudents(labId);
    } else {
      toast({
        title: isArabic ? "تعذّر إلغاء التسجيل" : "Failed to unregister",
        variant: "destructive",
      });
    }
  };

  if (pageLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          {isArabic ? "طلاب المخبر" : "Lab Students"}
        </h1>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          {isArabic ? "طلاب المخبر" : "Lab Students"}
        </h1>
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">
            {isArabic ? "حسابك غير مرتبط بأي مخبر حالياً" : "Your account isn't linked to a lab yet"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {isArabic ? "طلاب المخبر" : "Lab Students"}
        </h1>
        {labName && <p className="text-sm text-muted-foreground mt-1">{labName}</p>}
      </div>

      {schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">
            {isArabic ? "لا توجد مواعيد مضافة لهذا المخبر بعد" : "No schedules added for this lab yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {schedules.map((sch) => (
            <Card key={sch.schedule_id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        {sch.subject_name ?? (isArabic ? "مادة غير معروفة" : "Unknown subject")}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {sch.day} · {sch.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {sch.registered_count}/{sch.capacity}
                  </Badge>
                </div>

                {sch.students.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    {isArabic ? "لا يوجد طلاب مسجلين بهذا الموعد" : "No students registered for this slot"}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{isArabic ? "الاسم" : "Name"}</TableHead>
                          <TableHead>{isArabic ? "الرقم الجامعي" : "Student #"}</TableHead>
                          <TableHead>{isArabic ? "البريد الإلكتروني" : "Email"}</TableHead>
                          <TableHead>{isArabic ? "الهاتف" : "Phone"}</TableHead>
                          <TableHead className="text-end">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sch.students.map((st) => (
                          <TableRow key={st.registration_id}>
                            <TableCell className="font-medium">{st.name}</TableCell>
                            <TableCell>{st.student_number ?? "-"}</TableCell>
                            <TableCell>{st.email}</TableCell>
                            <TableCell>{st.phone ?? "-"}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title={isArabic ? "نقل لموعد آخر" : "Move to another slot"}
                                  onClick={() => openMoveDialog(st, sch)}
                                >
                                  <ArrowLeftRight className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  title={isArabic ? "إلغاء التسجيل" : "Unregister"}
                                  onClick={() => setStudentToRemove(st)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* نافذة نقل طالب لموعد آخر */}
      <Dialog open={!!moveTarget} onOpenChange={(open) => !open && setMoveTarget(null)}>
        <DialogContent dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{isArabic ? "نقل الطالب لموعد آخر" : "Move Student to Another Slot"}</DialogTitle>
            <DialogDescription>
              {moveTarget?.student.name} — {moveTarget?.fromSchedule.subject_name}
            </DialogDescription>
          </DialogHeader>

          {sameSubjectOtherSchedules.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              {isArabic
                ? "لا يوجد مواعيد أخرى لهذه المادة حالياً."
                : "No other slots available for this subject."}
            </p>
          ) : (
            <div className="space-y-4">
              <Select value={newScheduleId} onValueChange={setNewScheduleId}>
                <SelectTrigger>
                  <SelectValue placeholder={isArabic ? "اختر الموعد الجديد" : "Select new slot"} />
                </SelectTrigger>
                <SelectContent>
                  {sameSubjectOtherSchedules.map((s) => (
                    <SelectItem key={s.schedule_id} value={String(s.schedule_id)}>
                      {s.day} · {s.time} ({s.registered_count}/{s.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {moveError && <p className="text-sm text-destructive font-medium">{moveError}</p>}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveTarget(null)} disabled={isActing}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleMoveSubmit}
              disabled={isActing || sameSubjectOtherSchedules.length === 0}
              className="gap-1.5"
            >
              {isActing && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? "نقل" : "Move"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* تأكيد إلغاء التسجيل */}
      <AlertDialog open={!!studentToRemove} onOpenChange={(open) => !open && setStudentToRemove(null)}>
        <AlertDialogContent dir={isArabic ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArabic ? "هل أنت متأكد من إلغاء التسجيل؟" : "Are you sure you want to unregister this student?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `سيتم إلغاء تسجيل "${studentToRemove?.name}" من هذا الموعد نهائياً.`
                : `"${studentToRemove?.name}" will be permanently unregistered from this slot.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>
              {isArabic ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmRemove();
              }}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5"
            >
              {isRemoving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? "نعم، ألغِ التسجيل" : "Yes, unregister"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LabStudentsPage;
