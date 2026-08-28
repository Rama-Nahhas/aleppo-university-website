import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookOpen, Loader2, Inbox, FlaskConical, Clock, Users, CheckCircle2, Paperclip, FileText, Download } from "lucide-react";
import {
  Subject,
  LabScheduleOption,
  useSubjectActions,
  useLabRegistrationActions,
} from "@/hooks/students/useApiActions";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

const PAGE_SIZE = 9;

const MyCoursesPage: React.FC = () => {
  const { lang } = useLanguage();
  const isArabic = lang === "ar";
  const { toast } = useToast();
  const { fetchStudentSubjects, loading } = useSubjectActions();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { page, setPage, totalPages, paginated } = usePagination(subjects, PAGE_SIZE);

  // نافذة التسجيل على مخبر
  const {
    fetchAvailableSchedules,
    registerForLab,
    cancelLabRegistration,
    loading: labLoading,
  } = useLabRegistrationActions();
  const [labDialogSubject, setLabDialogSubject] = useState<Subject | null>(null);
  const [schedules, setSchedules] = useState<LabScheduleOption[]>([]);
  const [myRegistrationId, setMyRegistrationId] = useState<number | null>(null);
  const [actingScheduleId, setActingScheduleId] = useState<number | null>(null);

  // نافذة الملفات المرفقة
  const [filesDialogSubject, setFilesDialogSubject] = useState<Subject | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStudentSubjects();
      setSubjects(data);
    };
    loadData();
  }, []);

  const openLabDialog = async (subject: Subject) => {
    setLabDialogSubject(subject);
    setSchedules([]);
    setMyRegistrationId(null);
    const result = await fetchAvailableSchedules(subject.subject_id);
    if (result) {
      setSchedules(result.schedules);
      setMyRegistrationId(result.my_registration_id);
    }
  };

  const closeLabDialog = () => {
    setLabDialogSubject(null);
    setSchedules([]);
    setMyRegistrationId(null);
  };

  const handleRegister = async (schedule: LabScheduleOption) => {
    setActingScheduleId(schedule.id);
    const message = await registerForLab(schedule.id);
    setActingScheduleId(null);

    if (message) {
      toast({
        title: isArabic ? "تم التسجيل بنجاح" : "Registered successfully",
        description: message,
        className: "bg-green-600 text-white font-semibold",
      });
      if (labDialogSubject) await openLabDialog(labDialogSubject);
    } else {
      toast({
        title: isArabic ? "تعذّر التسجيل" : "Registration failed",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async (registrationId: number) => {
    setActingScheduleId(registrationId);
    const ok = await cancelLabRegistration(registrationId);
    setActingScheduleId(null);

    if (ok) {
      toast({
        title: isArabic ? "تم إلغاء التسجيل" : "Registration cancelled",
        className: "bg-green-600 text-white font-semibold",
      });
      if (labDialogSubject) await openLabDialog(labDialogSubject);
    } else {
      toast({
        title: isArabic ? "تعذّر إلغاء التسجيل" : "Failed to cancel",
        variant: "destructive",
      });
    }
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isArabic ? "مقرراتي" : "My Courses"}
      </h1>
      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">
            {isArabic ? "لا توجد مقررات متاحة حالياً" : "No courses available yet"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {paginated.map((s) => (
            <Card key={s.subject_id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground">
                      {s.subject_name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isArabic ? "المدرس: " : "Instructor: "}
                      {s.doctor.name}
                    </p>
                    {s.mark != null && (
                      <p className="text-sm font-bold text-primary mt-2">
                        {isArabic ? "الدرجة: " : "Grade: "}
                        {s.mark}/100
                      </p>
                    )}
                    {s.note && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {s.note}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                        onClick={() => openLabDialog(s)}
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        {isArabic ? "تسجيل على مخبر" : "Register for Lab"}
                      </Button>
                      {s.files.length > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => setFilesDialogSubject(s)}
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          {isArabic ? "الملفات المرفقة" : "Attached Files"}
                          <Badge variant="secondary" className="ms-1 px-1.5">{s.files.length}</Badge>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* نافذة اختيار موعد المخبر */}
      <Dialog open={!!labDialogSubject} onOpenChange={(open) => !open && closeLabDialog()}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>
              {isArabic ? "التسجيل على مخبر" : "Register for Lab"}
            </DialogTitle>
            <DialogDescription>
              {labDialogSubject?.subject_name}
            </DialogDescription>
          </DialogHeader>

          {labLoading && schedules.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
              <Inbox className="w-8 h-8" />
              <p className="text-sm">
                {isArabic ? "لا توجد مواعيد مخبر متاحة لهذه المادة حالياً" : "No lab schedules available for this subject yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {myRegistrationId && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5">
                  {isArabic
                    ? "أنت مسجل بموعد لهذه المادة. لاختيار موعد آخر، ألغِ تسجيلك الحالي أولاً."
                    : "You're registered for a slot in this subject. To pick another, cancel your current registration first."}
                </p>
              )}

              {schedules.map((sch) => {
                const isActing = actingScheduleId === sch.id;
                return (
                  <div
                    key={sch.id}
                    className={
                      "flex items-center justify-between gap-3 p-3 rounded-lg border " +
                      (sch.is_mine
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted/30")
                    }
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {sch.lab_name || (isArabic ? "مخبر" : "Lab")}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {sch.day} {sch.start_time}–{sch.end_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {sch.registered_count}/{sch.capacity}
                        </span>
                      </div>
                    </div>

                    {sch.is_mine ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1.5 flex-shrink-0"
                        disabled={isActing}
                        onClick={() => myRegistrationId && handleCancel(myRegistrationId)}
                      >
                        {isActing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {isArabic ? "إلغاء التسجيل" : "Cancel"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="gap-1.5 flex-shrink-0"
                        disabled={isActing || sch.is_full || !!myRegistrationId}
                        onClick={() => handleRegister(sch)}
                      >
                        {isActing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {sch.is_full
                          ? (isArabic ? "ممتلئ" : "Full")
                          : (isArabic ? "تسجيل" : "Register")}
                      </Button>
                    )}

                    {sch.is_mine && (
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* نافذة الملفات المرفقة */}
      <Dialog open={!!filesDialogSubject} onOpenChange={(open) => !open && setFilesDialogSubject(null)}>
        <DialogContent className="max-w-md" dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              {isArabic ? "الملفات المرفقة" : "Attached Files"}
            </DialogTitle>
            <DialogDescription>{filesDialogSubject?.subject_name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {filesDialogSubject?.files.map((file) => (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                download={file.file_name}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Download className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default MyCoursesPage;
