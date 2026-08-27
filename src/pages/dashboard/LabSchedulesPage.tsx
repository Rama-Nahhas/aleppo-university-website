import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  FlaskConical,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  Inbox,
  Clock,
  Users,
  BookOpen,
  Building2,
} from "lucide-react";
import {
  LabScheduleItem,
  LabManagerSubject,
  useLabManagerActions,
} from "@/hooks/labManager/useApiActions";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

const PAGE_SIZE = 10;

const DAYS: { value: string; ar: string; en: string }[] = [
  { value: "Sunday", ar: "الأحد", en: "Sunday" },
  { value: "Monday", ar: "الاثنين", en: "Monday" },
  { value: "Tuesday", ar: "الثلاثاء", en: "Tuesday" },
  { value: "Wednesday", ar: "الأربعاء", en: "Wednesday" },
  { value: "Thursday", ar: "الخميس", en: "Thursday" },
  { value: "Friday", ar: "الجمعة", en: "Friday" },
  { value: "Saturday", ar: "السبت", en: "Saturday" },
];

interface ScheduleFormState {
  subject_id: string;
  day: string;
  start_time: string;
  end_time: string;
  capacity: string;
}

const emptyForm: ScheduleFormState = {
  subject_id: "",
  day: "",
  start_time: "",
  end_time: "",
  capacity: "",
};

// "12:00:00" -> "12:00" (Input type=time بياخد HH:MM بس)
const toTimeInputValue = (value?: string | null): string => (value ? value.slice(0, 5) : "");

const LabSchedulesPage: React.FC = () => {
  const { lang } = useLanguage();
  const isArabic = lang === "ar";
  const { toast } = useToast();

  const {
    fetchSchedules,
    fetchScheduleDetails,
    fetchSubjects,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    loading: isSaving,
  } = useLabManagerActions();

  const [schedules, setSchedules] = useState<LabScheduleItem[]>([]);
  const [subjects, setSubjects] = useState<LabManagerSubject[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const { page, setPage, totalPages, paginated } = usePagination(schedules, PAGE_SIZE);

  const subjectNameById = useMemo(() => {
    const map = new Map<number, string>();
    subjects.forEach((s) => map.set(s.id, s.name));
    return map;
  }, [subjects]);

  const dayLabel = (value: string) => {
    const d = DAYS.find((d) => d.value === value);
    return d ? (isArabic ? d.ar : d.en) : value;
  };

  // نموذج الإنشاء
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<ScheduleFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  // نموذج التعديل
  const [editingSchedule, setEditingSchedule] = useState<LabScheduleItem | null>(null);
  const [editForm, setEditForm] = useState<ScheduleFormState>(emptyForm);

  // نافذة التفاصيل
  const [viewSchedule, setViewSchedule] = useState<LabScheduleItem | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // تأكيد الحذف
  const [scheduleToDelete, setScheduleToDelete] = useState<LabScheduleItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAll = async () => {
    setPageLoading(true);
    const [sch, subs] = await Promise.all([fetchSchedules(), fetchSubjects()]);
    setSchedules(sch);
    setSubjects(subs);
    setPageLoading(false);
  };

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateDialog = () => {
    setCreateForm(emptyForm);
    setFormError(null);
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async () => {
    setFormError(null);
    if (!createForm.subject_id || !createForm.day || !createForm.start_time || !createForm.end_time || !createForm.capacity) {
      setFormError(isArabic ? "الرجاء تعبئة جميع الحقول" : "Please fill in all fields");
      return;
    }
    const created = await createSchedule(createForm);
    if (created) {
      toast({
        title: isArabic ? "تم إضافة الموعد بنجاح" : "Schedule added successfully",
        className: "bg-green-600 text-white font-semibold",
      });
      setIsCreateOpen(false);
      void loadAll();
    } else {
      setFormError(isArabic ? "حدث خطأ أثناء إضافة الموعد." : "Something went wrong.");
    }
  };

  const openEditDialog = (schedule: LabScheduleItem) => {
    setEditingSchedule(schedule);
    setEditForm({
      subject_id: String(schedule.subject_id),
      day: schedule.day,
      start_time: toTimeInputValue(schedule.start_time),
      end_time: toTimeInputValue(schedule.end_time),
      capacity: String(schedule.capacity),
    });
    setFormError(null);
  };

  const handleEditSubmit = async () => {
    if (!editingSchedule) return;
    setFormError(null);

    const updated = await updateSchedule(editingSchedule.id, {
      day: editForm.day,
      start_time: editForm.start_time,
      end_time: editForm.end_time,
      capacity: editForm.capacity,
    });

    if (updated) {
      toast({
        title: isArabic ? "تم تعديل الموعد بنجاح" : "Schedule updated successfully",
        className: "bg-green-600 text-white font-semibold",
      });
      setEditingSchedule(null);
      void loadAll();
    } else {
      setFormError(isArabic ? "حدث خطأ أثناء تعديل الموعد." : "Something went wrong.");
    }
  };

  const openViewDialog = async (schedule: LabScheduleItem) => {
    setViewSchedule(schedule);
    setViewLoading(true);
    const fresh = await fetchScheduleDetails(schedule.id);
    if (fresh) setViewSchedule(fresh);
    setViewLoading(false);
  };

  const confirmDelete = async () => {
    if (!scheduleToDelete) return;
    setIsDeleting(true);
    const ok = await deleteSchedule(scheduleToDelete.id);
    setIsDeleting(false);

    if (ok) {
      toast({
        title: isArabic ? "تم حذف الموعد بنجاح" : "Schedule deleted successfully",
        className: "bg-green-600 text-white font-semibold",
      });
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleToDelete.id));
      setScheduleToDelete(null);
    } else {
      toast({
        title: isArabic ? "تعذّر حذف الموعد" : "Failed to delete schedule",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">
          {isArabic ? "جداول المخبر" : "Lab Schedules"}
        </h1>
        <Button className="gap-1.5" onClick={openCreateDialog}>
          <Plus className="w-4 h-4" />
          {isArabic ? "إضافة موعد" : "Add Schedule"}
        </Button>
      </div>

      {pageLoading ? (
        <Loader2 className="animate-spin" />
      ) : schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">
            {isArabic ? "لا توجد مواعيد مضافة بعد" : "No schedules added yet"}
          </p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isArabic ? "المادة" : "Subject"}</TableHead>
                    <TableHead>{isArabic ? "المخبر" : "Lab"}</TableHead>
                    <TableHead>{isArabic ? "اليوم" : "Day"}</TableHead>
                    <TableHead>{isArabic ? "الوقت" : "Time"}</TableHead>
                    <TableHead>{isArabic ? "السعة" : "Capacity"}</TableHead>
                    <TableHead className="text-end">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((sch) => (
                    <TableRow key={sch.id}>
                      <TableCell className="font-medium">
                        {subjectNameById.get(sch.subject_id) ?? `#${sch.subject_id}`}
                      </TableCell>
                      <TableCell>{sch.lab?.name}</TableCell>
                      <TableCell>{dayLabel(sch.day)}</TableCell>
                      <TableCell>
                        {toTimeInputValue(sch.start_time)}–{toTimeInputValue(sch.end_time)}
                      </TableCell>
                      <TableCell>{sch.capacity}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openViewDialog(sch)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(sch)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setScheduleToDelete(sch)}
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
          </CardContent>
        </Card>
      )}

      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* نموذج إضافة موعد */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{isArabic ? "إضافة موعد مخبر" : "Add Lab Schedule"}</DialogTitle>
            <DialogDescription>
              {isArabic ? "حدد المادة والموعد وسعة الاستيعاب" : "Choose subject, time slot and capacity"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>{isArabic ? "المادة" : "Subject"}</Label>
              <Select value={createForm.subject_id} onValueChange={(v) => setCreateForm((p) => ({ ...p, subject_id: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder={isArabic ? "اختر المادة" : "Select subject"} />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{isArabic ? "اليوم" : "Day"}</Label>
              <Select value={createForm.day} onValueChange={(v) => setCreateForm((p) => ({ ...p, day: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder={isArabic ? "اختر اليوم" : "Select day"} />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {isArabic ? d.ar : d.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-start">{isArabic ? "من الساعة" : "Start Time"}</Label>
                <Input
                  id="create-start"
                  type="time"
                  value={createForm.start_time}
                  onChange={(e) => setCreateForm((p) => ({ ...p, start_time: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="create-end">{isArabic ? "حتى الساعة" : "End Time"}</Label>
                <Input
                  id="create-end"
                  type="time"
                  value={createForm.end_time}
                  onChange={(e) => setCreateForm((p) => ({ ...p, end_time: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-capacity">{isArabic ? "السعة (عدد الطلاب)" : "Capacity"}</Label>
              <Input
                id="create-capacity"
                type="number"
                min={1}
                value={createForm.capacity}
                onChange={(e) => setCreateForm((p) => ({ ...p, capacity: e.target.value }))}
              />
            </div>

            {formError && <p className="text-sm text-destructive font-medium">{formError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSaving}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleCreateSubmit} disabled={isSaving} className="gap-1.5">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? "إضافة" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نموذج تعديل موعد */}
      <Dialog open={!!editingSchedule} onOpenChange={(open) => !open && setEditingSchedule(null)}>
        <DialogContent dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{isArabic ? "تعديل الموعد" : "Edit Schedule"}</DialogTitle>
            <DialogDescription>
              {subjectNameById.get(editingSchedule?.subject_id ?? -1) ?? ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>{isArabic ? "اليوم" : "Day"}</Label>
              <Select value={editForm.day} onValueChange={(v) => setEditForm((p) => ({ ...p, day: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder={isArabic ? "اختر اليوم" : "Select day"} />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {isArabic ? d.ar : d.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-start">{isArabic ? "من الساعة" : "Start Time"}</Label>
                <Input
                  id="edit-start"
                  type="time"
                  value={editForm.start_time}
                  onChange={(e) => setEditForm((p) => ({ ...p, start_time: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-end">{isArabic ? "حتى الساعة" : "End Time"}</Label>
                <Input
                  id="edit-end"
                  type="time"
                  value={editForm.end_time}
                  onChange={(e) => setEditForm((p) => ({ ...p, end_time: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-capacity">{isArabic ? "السعة (عدد الطلاب)" : "Capacity"}</Label>
              <Input
                id="edit-capacity"
                type="number"
                min={1}
                value={editForm.capacity}
                onChange={(e) => setEditForm((p) => ({ ...p, capacity: e.target.value }))}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              {isArabic
                ? "لا يمكن تغيير المادة المرتبطة بالموعد بعد إنشائه."
                : "The subject linked to this schedule can't be changed after creation."}
            </p>

            {formError && <p className="text-sm text-destructive font-medium">{formError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSchedule(null)} disabled={isSaving}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSaving} className="gap-1.5">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? "حفظ التعديلات" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة عرض التفاصيل */}
      <Dialog open={!!viewSchedule} onOpenChange={(open) => !open && setViewSchedule(null)}>
        <DialogContent dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{isArabic ? "تفاصيل الموعد" : "Schedule Details"}</DialogTitle>
          </DialogHeader>

          {viewLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : viewSchedule ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">
                  {subjectNameById.get(viewSchedule.subject_id) ?? `#${viewSchedule.subject_id}`}
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50">
                <FlaskConical className="w-4 h-4 text-primary" />
                <span className="text-sm">{viewSchedule.lab?.name}</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  {dayLabel(viewSchedule.day)} · {toTimeInputValue(viewSchedule.start_time)}–{toTimeInputValue(viewSchedule.end_time)}
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  {isArabic ? "السعة: " : "Capacity: "}
                  {viewSchedule.capacity}
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50">
                <Building2 className="w-4 h-4 text-primary" />
                <Badge variant="secondary">{isArabic ? "قسم رقم" : "Department"} #{viewSchedule.lab?.department_id}</Badge>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* تأكيد الحذف */}
      <AlertDialog open={!!scheduleToDelete} onOpenChange={(open) => !open && setScheduleToDelete(null)}>
        <AlertDialogContent dir={isArabic ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArabic ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `سيتم حذف هذا الموعد نهائياً ولا يمكن التراجع عن هذا الإجراء.`
                : `This schedule will be permanently deleted. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {isArabic ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-1.5"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? "نعم، احذف" : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LabSchedulesPage;
