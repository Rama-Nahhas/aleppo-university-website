import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  BookOpen,
  Loader2,
  Inbox,
  Building2,
  GraduationCap,
  Plus,
  Trash2,
  Paperclip,
} from "lucide-react";
import {
  DoctorSubject,
  StudentOption,
  useDoctorSubjectActions,
} from "@/hooks/doctor/useApiActions";
import { NamedOption, useCollegeLookups } from "@/hooks/students/useApiActions";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

const PAGE_SIZE = 9;
const COLLEGE_ID = 1;

interface CreateFormState {
  name: string;
  department_id: string;
  year_id: string;
}

const emptyCreateForm: CreateFormState = {
  name: "",
  department_id: "",
  year_id: "",
};

const MySubjectsPage: React.FC = () => {
  const { lang } = useLanguage();
  const isArabic = lang === "ar";
  const { toast } = useToast();

  const {
    fetchDoctorSubjects,
    fetchStudentsForSelection,
    createSubject,
    deleteSubject,
    loading: isSaving,
  } = useDoctorSubjectActions();
  const { fetchDepartments } = useCollegeLookups();

  const [subjects, setSubjects] = useState<DoctorSubject[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const { page, setPage, totalPages, paginated } = usePagination(subjects, PAGE_SIZE);

  // نموذج الإنشاء
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormState>(emptyCreateForm);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [departments, setDepartments] = useState<NamedOption[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // تأكيد الحذف
  const [subjectToDelete, setSubjectToDelete] = useState<DoctorSubject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadSubjects = async () => {
    setPageLoading(true);
    const data = await fetchDoctorSubjects();
    setSubjects(data);
    setPageLoading(false);
  };

  useEffect(() => {
    void loadSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // تحميل الأقسام أول ما نفتح نموذج الإنشاء
  useEffect(() => {
    if (!isCreateOpen || departments.length > 0) return;
    (async () => {
      const deps = await fetchDepartments(COLLEGE_ID);
      setDepartments(deps);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateOpen]);

  // تحميل الطلاب المتاحين لما نحدد القسم والسنة
  useEffect(() => {
    if (!createForm.department_id || !createForm.year_id) {
      setStudents([]);
      return;
    }
    setStudentsLoading(true);
    (async () => {
      const data = await fetchStudentsForSelection(
        createForm.department_id,
        createForm.year_id,
      );
      setStudents(data);
      setStudentsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createForm.department_id, createForm.year_id]);

  const openCreateDialog = () => {
    setCreateForm(emptyCreateForm);
    setSelectedStudentIds([]);
    setFile(null);
    setFormError(null);
    setIsCreateOpen(true);
  };

  const toggleStudent = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const handleCreateSubmit = async () => {
    setFormError(null);

    if (!createForm.name.trim()) {
      setFormError(isArabic ? "اسم المادة مطلوب" : "Subject name is required");
      return;
    }
    if (!createForm.department_id) {
      setFormError(isArabic ? "الرجاء اختيار القسم" : "Please select a department");
      return;
    }
    if (!createForm.year_id) {
      setFormError(isArabic ? "الرجاء اختيار السنة" : "Please select a year");
      return;
    }

    const created = await createSubject({
      name: createForm.name.trim(),
      department_id: createForm.department_id,
      year_id: createForm.year_id,
      student_ids: selectedStudentIds,
      file,
    });

    if (created) {
      toast({
        title: isArabic ? "تم إنشاء المادة بنجاح" : "Subject created successfully",
        className: "bg-green-600 text-white font-semibold",
      });
      setIsCreateOpen(false);
      void loadSubjects();
    } else {
      setFormError(isArabic ? "حدث خطأ أثناء إنشاء المادة." : "Something went wrong.");
    }
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;
    setIsDeleting(true);
    const ok = await deleteSubject(subjectToDelete.id);
    setIsDeleting(false);

    if (ok) {
      toast({
        title: isArabic ? "تم حذف المادة بنجاح" : "Subject deleted successfully",
        className: "bg-green-600 text-white font-semibold",
      });
      setSubjects((prev) => prev.filter((s) => s.id !== subjectToDelete.id));
      setSubjectToDelete(null);
    } else {
      toast({
        title: isArabic ? "تعذّر حذف المادة" : "Failed to delete subject",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">
          {isArabic ? "موادي" : "My Subjects"}
        </h1>
        <Button className="gap-1.5" onClick={openCreateDialog}>
          <Plus className="w-4 h-4" />
          {isArabic ? "إضافة مادة" : "Add Subject"}
        </Button>
      </div>

      {pageLoading ? (
        <Loader2 className="animate-spin" />
      ) : subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">
            {isArabic ? "لا توجد مواد متاحة حالياً" : "No subjects available yet"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((s) => (
            <Card key={s.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  {s.image_url ? (
                    <img
                      src={s.image_url}
                      alt={s.name}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground truncate">{s.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{s.department?.name}</span>
                    </div>
                    <Badge variant="secondary" className="gap-1 mt-2">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {s.year?.name}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={() => setSubjectToDelete(s)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* نموذج إضافة مادة */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{isArabic ? "إضافة مادة جديدة" : "Add New Subject"}</DialogTitle>
            <DialogDescription>
              {isArabic
                ? "عبّي بيانات المادة وحدد الطلاب المسجلين فيها (اختياري)"
                : "Fill in the subject details and select enrolled students (optional)"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="subject-name">{isArabic ? "اسم المادة" : "Subject Name"}</Label>
              <Input
                id="subject-name"
                value={createForm.name}
                onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                placeholder={isArabic ? "مثال: التشريح" : "e.g. Anatomy"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{isArabic ? "القسم" : "Department"}</Label>
                <Select
                  value={createForm.department_id}
                  onValueChange={(v) =>
                    setCreateForm((p) => ({ ...p, department_id: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? "اختر القسم" : "Select Department"} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dep) => (
                      <SelectItem key={dep.id} value={String(dep.id)}>
                        {dep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>{isArabic ? "السنة" : "Year"}</Label>
                <Select
                  value={createForm.year_id}
                  onValueChange={(v) => setCreateForm((p) => ({ ...p, year_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? "اختر السنة" : "Select Year"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{isArabic ? "السنة الأولى" : "First Year"}</SelectItem>
                    <SelectItem value="2">{isArabic ? "السنة الثانية" : "Second Year"}</SelectItem>
                    <SelectItem value="3">{isArabic ? "السنة الثالثة" : "Third Year"}</SelectItem>
                    <SelectItem value="4">{isArabic ? "السنة الرابعة" : "Fourth Year"}</SelectItem>
                    <SelectItem value="5">{isArabic ? "السنة الخامسة" : "Fifth Year"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{isArabic ? "الطلاب المسجلون (اختياري)" : "Enrolled Students (optional)"}</Label>
              {!createForm.department_id || !createForm.year_id ? (
                <p className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                  {isArabic
                    ? "اختر القسم والسنة أولاً لعرض الطلاب"
                    : "Select department and year first to show students"}
                </p>
              ) : studentsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isArabic ? "جاري تحميل الطلاب..." : "Loading students..."}
                </div>
              ) : students.length === 0 ? (
                <p className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                  {isArabic ? "لا يوجد طلاب بهذا القسم/السنة" : "No students in this department/year"}
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1 border border-border rounded-lg p-2">
                  {students.map((st) => (
                    <label
                      key={st.id}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-muted/60 cursor-pointer text-sm"
                    >
                      <Checkbox
                        checked={selectedStudentIds.includes(st.id)}
                        onCheckedChange={() => toggleStudent(st.id)}
                      />
                      <span className="truncate">
                        {st.name}
                        {st.student_number ? ` (${st.student_number})` : ""}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject-file" className="flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5" />
                {isArabic ? "ملف/صورة المادة (اختياري)" : "Subject File/Image (optional)"}
              </Label>
              <Input
                id="subject-file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
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
              {isArabic ? "إنشاء المادة" : "Create Subject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* تأكيد الحذف */}
      <AlertDialog open={!!subjectToDelete} onOpenChange={(open) => !open && setSubjectToDelete(null)}>
        <AlertDialogContent dir={isArabic ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArabic ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `سيتم حذف مادة "${subjectToDelete?.name}" نهائياً ولا يمكن التراجع عن هذا الإجراء.`
                : `"${subjectToDelete?.name}" will be permanently deleted. This action cannot be undone.`}
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

export default MySubjectsPage;
