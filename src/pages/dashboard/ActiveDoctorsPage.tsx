import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, UserCog, Loader2, Inbox, Pencil, Ban, Trash2, Eye, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PendingDoctor, useDoctorAdminActions, DoctorCreatePayload, DoctorUpdatePayload } from "@/hooks/useDoctorAdminActions";
import { NamedOption, useCollegeLookups } from "@/hooks/students/useApiActions";
import apiClient from "@/lib/axios";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

const PAGE_SIZE = 10;
const COLLEGE_ID = 1;

interface DoctorFormState {
  name: string;
  email: string;
  password: string;
  department_id: string;
  hospital_department_id: string;
  specialization: string;
  university: string;
  graduation_year: string;
  employment_year: string;
  work_history: string;
}

const emptyForm: DoctorFormState = {
  name: "",
  email: "",
  password: "",
  department_id: "",
  hospital_department_id: "",
  specialization: "",
  university: "",
  graduation_year: "",
  employment_year: "",
  work_history: "",
};

const ActiveDoctorsPage: React.FC = () => {
  const { lang } = useLanguage();
  const isArabic = lang === "ar";
  const { toast } = useToast();
  const {
    fetchActiveDoctors,
    createDoctor,
    updateDoctor,
    blockDoctor,
    unblockDoctor,
    deleteUser,
    canDelete,
    canChangeDepartment,
    loading,
  } = useDoctorAdminActions();
  const { fetchDepartments } = useCollegeLookups();

  const [data, setData] = useState<PendingDoctor[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [departments, setDepartments] = useState<NamedOption[]>([]);
  const [hospitalDepartments, setHospitalDepartments] = useState<NamedOption[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<DoctorFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editTarget, setEditTarget] = useState<PendingDoctor | null>(null);
  const [editForm, setEditForm] = useState<DoctorFormState>(emptyForm);
  const [editSaving, setEditSaving] = useState(false);

  const [viewTarget, setViewTarget] = useState<PendingDoctor | null>(null);

  const [blockTarget, setBlockTarget] = useState<PendingDoctor | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [blocking, setBlocking] = useState(false);

  const [unblockTarget, setUnblockTarget] = useState<PendingDoctor | null>(null);
  const [unblocking, setUnblocking] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<PendingDoctor | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = data.filter((d) => d.name.includes(search) || d.email.includes(search));
  const { page, setPage, totalPages, paginated } = usePagination(filtered, PAGE_SIZE);

  const loadDoctors = async () => {
    const result = await fetchActiveDoctors();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadDoctors();
    (async () => {
      const [deps, hospitalDeps] = await Promise.all([
        fetchDepartments(COLLEGE_ID),
        apiClient.get<{ data: NamedOption[] }>("/hospital/departments").then((r) => r.data.data).catch(() => []),
      ]);
      setDepartments(deps);
      setHospitalDepartments(hospitalDeps);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notifySuccess = (description: string) => {
    toast({ title: isArabic ? "تم بنجاح" : "Success", description, className: "bg-green-600 text-white font-semibold" });
  };
  const notifyError = (description: string) => {
    toast({ title: isArabic ? "حدث خطأ" : "Error", description, variant: "destructive" });
  };

  const openAdd = () => {
    setForm(emptyForm);
    setFormError(null);
    setDialogOpen(true);
  };

  const buildCreatePayload = (f: DoctorFormState): DoctorCreatePayload => ({
    name: f.name.trim(),
    email: f.email.trim(),
    password: f.password,
    ...(canChangeDepartment && f.department_id ? { department_id: f.department_id } : {}),
    ...(f.hospital_department_id ? { hospital_department_id: f.hospital_department_id } : {}),
    specialization: f.specialization.trim(),
    university: f.university.trim(),
    graduation_year: f.graduation_year,
    employment_year: f.employment_year,
    ...(f.work_history.trim() ? { work_history: f.work_history.trim() } : {}),
  });

  const handleSave = async () => {
    setFormError(null);
    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.specialization.trim() || !form.university.trim() || !form.graduation_year || !form.employment_year) {
      setFormError(isArabic ? "الرجاء تعبئة كل الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }
    if (canChangeDepartment && !form.department_id) {
      setFormError(isArabic ? "الرجاء اختيار القسم" : "Please select a department");
      return;
    }
    setSaving(true);
    const ok = await createDoctor(buildCreatePayload(form));
    setSaving(false);
    if (ok) {
      setDialogOpen(false);
      notifySuccess(isArabic ? "تم إضافة الدكتور بنجاح" : "Doctor added successfully");
      await loadDoctors();
    } else {
      setFormError(isArabic ? "حدث خطأ أثناء إضافة الدكتور." : "Failed to add doctor");
    }
  };

  const openEdit = (d: PendingDoctor) => {
    setEditTarget(d);
    setEditForm({
      name: d.name,
      email: d.email,
      password: "",
      department_id: d.department_id != null ? String(d.department_id) : "",
      hospital_department_id: d.hospital_department_id != null ? String(d.hospital_department_id) : "",
      specialization: d.specialization ?? "",
      university: d.university ?? "",
      graduation_year: d.graduation_year != null ? String(d.graduation_year) : "",
      employment_year: d.employment_year != null ? String(d.employment_year) : "",
      work_history: d.work_history ?? "",
    });
    setFormError(null);
  };

  const handleEditSave = async () => {
    if (!editTarget || !editForm.name.trim()) return;
    setFormError(null);
    setEditSaving(true);
    const payload: DoctorUpdatePayload = {
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      specialization: editForm.specialization.trim(),
      university: editForm.university.trim(),
      graduation_year: editForm.graduation_year,
      employment_year: editForm.employment_year,
      work_history: editForm.work_history.trim(),
      hospital_department_id: editForm.hospital_department_id || undefined,
      ...(canChangeDepartment && editForm.department_id ? { department_id: editForm.department_id } : {}),
      ...(editForm.password.trim() ? { password: editForm.password.trim() } : {}),
    };
    const ok = await updateDoctor(editTarget.id, payload);
    setEditSaving(false);
    if (ok) {
      setEditTarget(null);
      notifySuccess(isArabic ? "تم تعديل بيانات الدكتور بنجاح" : "Doctor updated successfully");
      await loadDoctors();
    } else {
      setFormError(isArabic ? "حدث خطأ أثناء تعديل الدكتور." : "Failed to update doctor");
    }
  };

  const handleBlock = async () => {
    if (!blockTarget || blockReason.trim().length < 5) return;
    setBlocking(true);
    const ok = await blockDoctor(blockTarget.id, blockReason.trim());
    setBlocking(false);
    if (ok) {
      setBlockTarget(null);
      setBlockReason("");
      notifySuccess(isArabic ? "تم حظر الدكتور بنجاح" : "Doctor blocked successfully");
      await loadDoctors();
    } else {
      notifyError(isArabic ? "حدث خطأ أثناء حظر الدكتور" : "Failed to block doctor");
    }
  };

  const handleUnblock = async () => {
    if (!unblockTarget) return;
    setUnblocking(true);
    const ok = await unblockDoctor(unblockTarget.id);
    setUnblocking(false);
    if (ok) {
      setUnblockTarget(null);
      notifySuccess(isArabic ? "تم رفع الحظر بنجاح" : "Doctor unblocked successfully");
      await loadDoctors();
    } else {
      notifyError(isArabic ? "حدث خطأ أثناء رفع الحظر" : "Failed to unblock doctor");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteUser(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(isArabic ? "تم حذف المستخدم بنجاح" : "User deleted successfully");
      await loadDoctors();
    } else {
      notifyError(isArabic ? "حدث خطأ أثناء حذف المستخدم" : "Failed to delete user");
    }
  };

  const departmentName = (id: number | null) => departments.find((d) => d.id === id)?.name ?? (id ? `#${id}` : "-");
  const hospitalDepartmentName = (id: number | null) => hospitalDepartments.find((d) => d.id === id)?.name ?? (id ? `#${id}` : "-");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCog className="w-6 h-6 text-primary" />
          {isArabic ? "الدكاترة  المدرسين" : "Doctors"}
        </h1>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="w-4 h-4" />
          {isArabic ? "إضافة دكتور" : "Add Doctor"}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pr-9" placeholder={isArabic ? "بحث..." : "Search..."} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{isArabic ? "لا يوجد دكاترة حالياً" : "No doctors"}</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isArabic ? "الاسم" : "Name"}</TableHead>
                    <TableHead>{isArabic ? "البريد" : "Email"}</TableHead>
                    <TableHead>{isArabic ? "التخصص" : "Specialization"}</TableHead>
                    <TableHead>{isArabic ? "الحالة" : "Status"}</TableHead>
                    <TableHead className="text-end">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((d) => {
                    const isActive = Number(d.is_active) === 1;
                    return (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.name}</TableCell>
                        <TableCell>{d.email}</TableCell>
                        <TableCell>{d.specialization ?? "-"}</TableCell>
                        <TableCell>
                          {isActive ? (
                            <Badge className="border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                              {isArabic ? "نشط" : "Active"}
                            </Badge>
                          ) : (
                            <Badge className="border-transparent bg-red-100 text-red-700 hover:bg-red-100">
                              {isArabic ? "محظور" : "Blocked"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button size="icon" variant="ghost" onClick={() => setViewTarget(d)} title={isArabic ? "عرض التفاصيل" : "View details"}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => openEdit(d)} title={isArabic ? "تعديل" : "Edit"}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            {isActive ? (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-amber-500"
                                onClick={() => {
                                  setBlockTarget(d);
                                  setBlockReason("");
                                }}
                                title={isArabic ? "حظر" : "Block"}
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-emerald-600"
                                onClick={() => setUnblockTarget(d)}
                                title={isArabic ? "رفع الحظر" : "Unblock"}
                              >
                                <ShieldCheck className="w-4 h-4" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(d)} title={isArabic ? "حذف" : "Delete"}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
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
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* نموذج إضافة دكتور */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir={isArabic ? "rtl" : "ltr"} className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isArabic ? "إضافة دكتور" : "Add Doctor"}</DialogTitle>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{isArabic ? "الاسم" : "Name"}</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "البريد الإلكتروني" : "Email"}</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "كلمة المرور" : "Password"}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
            </div>
            {canChangeDepartment && (
              <div className="space-y-1.5">
                <Label>{isArabic ? "القسم" : "Department"}</Label>
                <Select value={form.department_id} onValueChange={(v) => setForm((f) => ({ ...f, department_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? "اختر القسم" : "Select department"} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>{isArabic ? "قسم المستشفى (اختياري)" : "Hospital Department (optional)"}</Label>
              <Select value={form.hospital_department_id} onValueChange={(v) => setForm((f) => ({ ...f, hospital_department_id: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder={isArabic ? "اختر القسم" : "Select department"} />
                </SelectTrigger>
                <SelectContent>
                  {hospitalDepartments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "الاختصاص" : "Specialization"}</Label>
              <Input value={form.specialization} onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "الجامعة" : "University"}</Label>
              <Input value={form.university} onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "سنة التخرج" : "Graduation Year"}</Label>
              <Input type="number" value={form.graduation_year} onChange={(e) => setForm((f) => ({ ...f, graduation_year: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "سنة التعيين" : "Employment Year"}</Label>
              <Input type="number" value={form.employment_year} onChange={(e) => setForm((f) => ({ ...f, employment_year: e.target.value }))} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{isArabic ? "الخبرة العملية (اختياري)" : "Work History (optional)"}</Label>
              <Textarea value={form.work_history} onChange={(e) => setForm((f) => ({ ...f, work_history: e.target.value }))} />
            </div>
          </div>
          {formError && <p className="text-sm text-destructive font-medium">{formError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{isArabic ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={handleSave} disabled={saving || loading} className="gap-1.5">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نموذج التعديل */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent dir={isArabic ? "rtl" : "ltr"} className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isArabic ? "تعديل الدكتور" : "Edit Doctor"}</DialogTitle>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{isArabic ? "الاسم" : "Name"}</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "البريد الإلكتروني" : "Email"}</Label>
              <Input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "كلمة مرور جديدة (اختياري)" : "New Password (optional)"}</Label>
              <Input type="password" value={editForm.password} onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
            </div>
            {canChangeDepartment && (
              <div className="space-y-1.5">
                <Label>{isArabic ? "القسم" : "Department"}</Label>
                <Select value={editForm.department_id} onValueChange={(v) => setEditForm((f) => ({ ...f, department_id: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? "اختر القسم" : "Select department"} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>{isArabic ? "قسم المستشفى" : "Hospital Department"}</Label>
              <Select value={editForm.hospital_department_id} onValueChange={(v) => setEditForm((f) => ({ ...f, hospital_department_id: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder={isArabic ? "اختر القسم" : "Select department"} />
                </SelectTrigger>
                <SelectContent>
                  {hospitalDepartments.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "الاختصاص" : "Specialization"}</Label>
              <Input value={editForm.specialization} onChange={(e) => setEditForm((f) => ({ ...f, specialization: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "الجامعة" : "University"}</Label>
              <Input value={editForm.university} onChange={(e) => setEditForm((f) => ({ ...f, university: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "سنة التخرج" : "Graduation Year"}</Label>
              <Input type="number" value={editForm.graduation_year} onChange={(e) => setEditForm((f) => ({ ...f, graduation_year: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>{isArabic ? "سنة التعيين" : "Employment Year"}</Label>
              <Input type="number" value={editForm.employment_year} onChange={(e) => setEditForm((f) => ({ ...f, employment_year: e.target.value }))} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>{isArabic ? "الخبرة العملية" : "Work History"}</Label>
              <Textarea value={editForm.work_history} onChange={(e) => setEditForm((f) => ({ ...f, work_history: e.target.value }))} />
            </div>
          </div>
          {formError && <p className="text-sm text-destructive font-medium">{formError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>{isArabic ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={handleEditSave} disabled={editSaving || loading} className="gap-1.5">
              {editSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة عرض التفاصيل */}
      <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{isArabic ? "تفاصيل الدكتور" : "Doctor Details"}</DialogTitle>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-2 text-sm">
              <p>{isArabic ? "الاسم: " : "Name: "}<strong>{viewTarget.name}</strong></p>
              <p>{isArabic ? "البريد: " : "Email: "}{viewTarget.email}</p>
              <p>{isArabic ? "القسم: " : "Department: "}{departmentName(viewTarget.department_id)}</p>
              <p>{isArabic ? "قسم المستشفى: " : "Hospital Dept: "}{hospitalDepartmentName(viewTarget.hospital_department_id)}</p>
              <p>{isArabic ? "الاختصاص: " : "Specialization: "}{viewTarget.specialization ?? "-"}</p>
              <p>{isArabic ? "الجامعة: " : "University: "}{viewTarget.university ?? "-"}</p>
              <p>{isArabic ? "سنة التخرج: " : "Graduation Year: "}{viewTarget.graduation_year ?? "-"}</p>
              <p>{isArabic ? "سنة التعيين: " : "Employment Year: "}{viewTarget.employment_year ?? "-"}</p>
              <p>{isArabic ? "الخبرة العملية: " : "Work History: "}{viewTarget.work_history ?? "-"}</p>
              <p>
                {isArabic ? "الحالة: " : "Status: "}
                {Number(viewTarget.is_active) === 1 ? (isArabic ? "نشط" : "Active") : (isArabic ? "محظور" : "Blocked")}
              </p>
              {Number(viewTarget.is_active) !== 1 && viewTarget.message && (
                <p className="text-destructive">{isArabic ? "سبب الحظر: " : "Block reason: "}{viewTarget.message}</p>
              )}
              <p className="text-muted-foreground text-xs">
                {isArabic ? "تاريخ الإنشاء: " : "Created: "}
                {new Date(viewTarget.created_at).toLocaleDateString(isArabic ? "ar-SY" : "en-US")}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewTarget(null)}>{isArabic ? "إغلاق" : "Close"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة الحظر */}
      <Dialog open={!!blockTarget} onOpenChange={(open) => !open && setBlockTarget(null)}>
        <DialogContent dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{isArabic ? "حظر الدكتور" : "Block Doctor"}</DialogTitle>
            <DialogDescription>
              {isArabic ? `أدخل سبب حظر "${blockTarget?.name}"` : `Enter the reason for blocking "${blockTarget?.name}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label>{isArabic ? "سبب الحظر" : "Block Reason"}</Label>
            <Textarea value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder={isArabic ? "5 أحرف على الأقل" : "Min 5 characters"} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockTarget(null)}>{isArabic ? "إلغاء" : "Cancel"}</Button>
            <Button variant="destructive" onClick={handleBlock} disabled={blocking || blockReason.trim().length < 5} className="gap-1.5">
              {blocking && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? "تأكيد الحظر" : "Confirm Block"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* تأكيد رفع الحظر */}
      <AlertDialog open={!!unblockTarget} onOpenChange={(open) => !open && setUnblockTarget(null)}>
        <AlertDialogContent dir={isArabic ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{isArabic ? "رفع الحظر عن الدكتور؟" : "Unblock this doctor?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic
                ? `سيتمكن "${unblockTarget?.name}" من تسجيل الدخول مجدداً.`
                : `"${unblockTarget?.name}" will be able to log in again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={unblocking}>{isArabic ? "إلغاء" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleUnblock();
              }}
              disabled={unblocking}
              className="gap-1.5"
            >
              {unblocking && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? "نعم، ارفع الحظر" : "Yes, unblock"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* تأكيد الحذف */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle>{isArabic ? "تأكيد الحذف" : "Confirm Deletion"}</DialogTitle>
            <DialogDescription>
              {isArabic
                ? `هل أنت متأكد بدك تحذف اليوزر "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>{isArabic ? "إلغاء" : "Cancel"}</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting} className="gap-1.5">
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? "تأكيد الحذف" : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveDoctorsPage;
