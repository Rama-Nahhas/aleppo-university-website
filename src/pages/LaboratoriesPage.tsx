import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Eye, FlaskConical, Loader2, Inbox } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { AdminLab, LabManagerOption, useLabAdminActions } from '@/hooks/useLabAdminActions';
import { AdminDepartment, useDepartmentAdminActions } from '@/hooks/useDepartmentAdminActions';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 10;

interface LabFormState {
  name: string;
  department_id: string;
  lab_manager_id: string;
}

const emptyForm: LabFormState = { name: '', department_id: '', lab_manager_id: '' };

const LaboratoriesPage: React.FC = () => {
  const { lang } = useLanguage();
  const isArabic = lang === 'ar';
  const { toast } = useToast();
  const { fetchLabs, fetchLabDetails, fetchLabManagers, createLab, updateLab, deleteLab, canChangeDepartment, loading } = useLabAdminActions();
  const { fetchDepartments } = useDepartmentAdminActions();

  const [data, setData] = useState<AdminLab[]>([]);
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  const [labManagers, setLabManagers] = useState<LabManagerOption[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminLab | null>(null);
  const [form, setForm] = useState<LabFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [details, setDetails] = useState<AdminLab | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<AdminLab | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { page, setPage, totalPages, paginated } = usePagination(data, PAGE_SIZE);

  const loadLabs = async () => {
    const result = await fetchLabs();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadLabs();
    fetchLabManagers().then(setLabManagers);
    // السوبر أدمن بس فيه يشوف كل الأقسام وينقل مخبر بينها؛ السب أدمن قسمو محدد تلقائياً
    if (canChangeDepartment) {
      fetchDepartments().then(setDepartments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notifySuccess = (description: string) => {
    toast({ title: isArabic ? 'تم بنجاح' : 'Success', description, className: 'bg-green-600 text-white font-semibold' });
  };
  const notifyError = (description: string) => {
    toast({ title: isArabic ? 'حدث خطأ' : 'Error', description, variant: 'destructive' });
  };

  const departmentName = (id: number) => departments.find(d => d.id === id)?.name ?? `#${id}`;
  const labManagerName = (id: number) => labManagers.find(m => m.id === id)?.name ?? `#${id}`;

  const availableManagers = useMemo(() => labManagers, [labManagers]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setDialogOpen(true);
  };
  const openEdit = (l: AdminLab) => {
    setEditing(l);
    setForm({ name: l.name, department_id: String(l.department_id), lab_manager_id: String(l.lab_manager_id) });
    setFormError(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setFormError(null);
    if (!form.name.trim() || !form.lab_manager_id) {
      setFormError(isArabic ? 'الرجاء تعبئة اسم المخبر واختيار مدير المخبر' : 'Please enter a name and select a lab manager');
      return;
    }
    if (canChangeDepartment && !form.department_id) {
      setFormError(isArabic ? 'الرجاء اختيار القسم' : 'Please select a department');
      return;
    }
    setSaving(true);
    const departmentId = canChangeDepartment && form.department_id ? Number(form.department_id) : undefined;
    const ok = editing
      ? await updateLab(editing.id, form.name.trim(), Number(form.lab_manager_id), departmentId)
      : await createLab(form.name.trim(), Number(form.lab_manager_id), departmentId);
    setSaving(false);
    if (ok) {
      setDialogOpen(false);
      notifySuccess(
        editing
          ? (isArabic ? 'تم تعديل المخبر بنجاح' : 'Laboratory updated successfully')
          : (isArabic ? 'تم إضافة المخبر بنجاح' : 'Laboratory added successfully'),
      );
      await loadLabs();
    } else {
      setFormError(
        editing
          ? (isArabic ? 'حدث خطأ أثناء تعديل المخبر' : 'Failed to update laboratory')
          : (isArabic ? 'حدث خطأ أثناء إضافة المخبر' : 'Failed to add laboratory'),
      );
    }
  };

  const openDetails = async (l: AdminLab) => {
    setDetailsOpen(true);
    setDetails(null);
    const result = await fetchLabDetails(l.id);
    setDetails(result);
    if (!result) {
      notifyError(isArabic ? 'حدث خطأ أثناء جلب تفاصيل المخبر' : 'Failed to load laboratory details');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteLab(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(isArabic ? 'تم حذف المخبر بنجاح' : 'Laboratory deleted successfully');
      await loadLabs();
    } else {
      notifyError(isArabic ? 'حدث خطأ أثناء حذف المخبر' : 'Failed to delete laboratory');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-primary" />
          {isArabic ? 'إدارة المخابر' : 'Laboratory Management'}
        </h1>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="w-4 h-4" />
          {isArabic ? 'إضافة مخبر' : 'Add Laboratory'}
        </Button>
      </div>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{isArabic ? 'لا توجد مخابر متاحة حالياً' : 'No laboratories available'}</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm"><CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>{isArabic ? 'المخبر' : 'Laboratory'}</TableHead>
                  {canChangeDepartment && <TableHead>{isArabic ? 'القسم' : 'Department'}</TableHead>}
                  <TableHead>{isArabic ? 'مدير المخبر' : 'Lab Manager'}</TableHead>
                  <TableHead className="text-end">{isArabic ? 'إجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(l => (
                  <TableRow key={l.id}>
                    <TableCell>{l.id}</TableCell>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    {canChangeDepartment && <TableCell>{departmentName(l.department_id)}</TableCell>}
                    <TableCell>{labManagerName(l.lab_manager_id)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openDetails(l)} title={isArabic ? 'عرض التفاصيل' : 'View details'}><Eye className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => openEdit(l)} title={isArabic ? 'تعديل' : 'Edit'}><Pencil className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(l)} title={isArabic ? 'حذف' : 'Delete'}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent></Card>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* نموذج إضافة/تعديل */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>
              {editing
                ? (isArabic ? 'تعديل مخبر' : 'Edit Laboratory')
                : (isArabic ? 'إضافة مخبر' : 'Add Laboratory')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>{isArabic ? 'اسم المخبر' : 'Laboratory Name'}</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            {canChangeDepartment && (
              <div className="space-y-1.5">
                <Label>{isArabic ? 'القسم' : 'Department'}</Label>
                <Select value={form.department_id} onValueChange={v => setForm(f => ({ ...f, department_id: v }))}>
                  <SelectTrigger><SelectValue placeholder={isArabic ? 'اختر القسم' : 'Select Department'} /></SelectTrigger>
                  <SelectContent>
                    {departments.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>{isArabic ? 'مدير المخبر' : 'Lab Manager'}</Label>
              <Select value={form.lab_manager_id} onValueChange={v => setForm(f => ({ ...f, lab_manager_id: v }))}>
                <SelectTrigger><SelectValue placeholder={isArabic ? 'اختر مدير المخبر' : 'Select Lab Manager'} /></SelectTrigger>
                <SelectContent>
                  {availableManagers.map(m => (
                    <SelectItem key={m.id} value={String(m.id)}>{m.name} ({m.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableManagers.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'لا يوجد حسابات بدور "مدير مخبر" حالياً' : 'No "Lab Manager" accounts available yet'}
                </p>
              )}
            </div>
          </div>
          {formError && <p className="text-sm text-destructive font-medium">{formError}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
            <Button onClick={handleSave} disabled={saving || loading} className="gap-1.5">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? (isArabic ? 'تحديث' : 'Update') : (isArabic ? 'إضافة' : 'Add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة التفاصيل */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader><DialogTitle>{details?.name ?? (isArabic ? 'تفاصيل المخبر' : 'Laboratory Details')}</DialogTitle></DialogHeader>
          {!details ? (
            <Loader2 className="animate-spin" />
          ) : (
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">{isArabic ? 'القسم: ' : 'Department: '}</span>{canChangeDepartment ? departmentName(details.department_id) : `#${details.department_id}`}</p>
              <p><span className="text-muted-foreground">{isArabic ? 'مدير المخبر: ' : 'Lab Manager: '}</span>{labManagerName(details.lab_manager_id)}</p>
              <p><span className="text-muted-foreground">{isArabic ? 'تاريخ الإنشاء: ' : 'Created: '}</span>{new Date(details.created_at).toLocaleString(isArabic ? 'ar-SY' : 'en-US')}</p>
              <p><span className="text-muted-foreground">{isArabic ? 'آخر تحديث: ' : 'Updated: '}</span>{new Date(details.updated_at).toLocaleString(isArabic ? 'ar-SY' : 'en-US')}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* تأكيد الحذف */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent dir={isArabic ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{isArabic ? 'تأكيد حذف المخبر' : 'Confirm Laboratory Deletion'}</DialogTitle>
            <DialogDescription>
              {isArabic
                ? `هل أنت متأكد من رغبتك في حذف مخبر "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>{isArabic ? 'إلغاء' : 'Cancel'}</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting} className="gap-1.5">
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isArabic ? 'تأكيد الحذف' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaboratoriesPage;
