import React, { useState, useEffect } from 'react';
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
import { AdminLab, useLabAdminActions } from '@/hooks/useLabAdminActions';
import { AdminDepartment, useDepartmentAdminActions } from '@/hooks/useDepartmentAdminActions';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 10;

const LaboratoriesPage: React.FC = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const { fetchLabs, fetchLabDetails, createLab, updateLab, deleteLab, loading } = useLabAdminActions();
  const { fetchDepartments } = useDepartmentAdminActions();

  const [data, setData] = useState<AdminLab[]>([]);
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminLab | null>(null);
  const [form, setForm] = useState({ name: '', department_id: '', technician_id: '' });
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
    fetchDepartments().then(setDepartments);
  }, []);

  const notifySuccess = (description: string) => {
    toast({
      title: lang === 'ar' ? 'تم بنجاح' : 'Success',
      description,
      className: 'bg-green-600 text-white font-semibold',
    });
  };

  const notifyError = (description: string) => {
    toast({
      title: lang === 'ar' ? 'حدث خطأ' : 'Error',
      description,
      variant: 'destructive',
    });
  };

  const getDeptName = (id: number) => departments.find(d => d.id === id)?.name ?? '-';

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', department_id: '', technician_id: '' });
    setDialogOpen(true);
  };
  const openEdit = (l: AdminLab) => {
    setEditing(l);
    setForm({ name: l.name, department_id: String(l.department_id), technician_id: String(l.technician_id) });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.department_id || !form.technician_id) return;
    setSaving(true);
    const ok = editing
      ? await updateLab(editing.id, form.name, Number(form.department_id), Number(form.technician_id))
      : await createLab(form.name, Number(form.department_id), Number(form.technician_id));
    setSaving(false);
    if (ok) {
      setDialogOpen(false);
      notifySuccess(
        editing
          ? (lang === 'ar' ? 'تم تعديل المخبر بنجاح' : 'Laboratory updated successfully')
          : (lang === 'ar' ? 'تم إضافة المخبر بنجاح' : 'Laboratory added successfully'),
      );
      await loadLabs();
    } else {
      notifyError(
        editing
          ? (lang === 'ar' ? 'حدث خطأ أثناء تعديل المخبر' : 'Failed to update laboratory')
          : (lang === 'ar' ? 'حدث خطأ أثناء إضافة المخبر' : 'Failed to add laboratory'),
      );
    }
  };

  const openDetails = async (l: AdminLab) => {
    setDetailsOpen(true);
    setDetails(null);
    const result = await fetchLabDetails(l.id);
    setDetails(result);
    if (!result) {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء جلب تفاصيل المخبر' : 'Failed to load laboratory details');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteLab(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(lang === 'ar' ? 'تم حذف المخبر بنجاح' : 'Laboratory deleted successfully');
      await loadLabs();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء حذف المخبر' : 'Failed to delete laboratory');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-primary" />
          {lang === 'ar' ? 'إدارة المخابر' : 'Laboratory Management'}
        </h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 ml-1" />
          {lang === 'ar' ? 'إضافة مخبر' : 'Add Laboratory'}
        </Button>
      </div>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{lang === 'ar' ? 'لا توجد مخابر متاحة حالياً' : 'No laboratories available'}</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{lang === 'ar' ? 'المخبر' : 'Laboratory'}</TableHead>
                <TableHead>{lang === 'ar' ? 'القسم' : 'Department'}</TableHead>
                <TableHead>{lang === 'ar' ? 'رقم الفني' : 'Technician ID'}</TableHead>
                <TableHead>{lang === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(l => (
                <TableRow key={l.id}>
                  <TableCell>{l.id}</TableCell>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell>{getDeptName(l.department_id)}</TableCell>
                  <TableCell>{l.technician_id}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openDetails(l)}><Eye className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(l)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(l)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>
              {editing
                ? (lang === 'ar' ? 'تعديل مخبر' : 'Edit Laboratory')
                : (lang === 'ar' ? 'إضافة مخبر' : 'Add Laboratory')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{lang === 'ar' ? 'اسم المخبر' : 'Laboratory Name'}</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>{lang === 'ar' ? 'القسم' : 'Department'}</Label>
              <Select value={form.department_id} onValueChange={v => setForm(f => ({ ...f, department_id: v }))}>
                <SelectTrigger><SelectValue placeholder={lang === 'ar' ? 'اختر القسم' : 'Select Department'} /></SelectTrigger>
                <SelectContent>
                  {departments.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{lang === 'ar' ? 'رقم الفني المسؤول' : 'Technician ID'}</Label>
              <Input type="number" value={form.technician_id} onChange={e => setForm(f => ({ ...f, technician_id: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={saving || loading}>
              {saving
                ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                : editing
                  ? (lang === 'ar' ? 'تحديث' : 'Update')
                  : (lang === 'ar' ? 'إضافة' : 'Add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader><DialogTitle>{details?.name ?? (lang === 'ar' ? 'تفاصيل المخبر' : 'Laboratory Details')}</DialogTitle></DialogHeader>
          {!details ? (
            <Loader2 className="animate-spin" />
          ) : (
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">{lang === 'ar' ? 'القسم: ' : 'Department: '}</span>{getDeptName(details.department_id)}</p>
              <p><span className="text-muted-foreground">{lang === 'ar' ? 'رقم الفني: ' : 'Technician ID: '}</span>{details.technician_id}</p>
              <p><span className="text-muted-foreground">{lang === 'ar' ? 'تاريخ الإنشاء: ' : 'Created: '}</span>{new Date(details.created_at).toLocaleString(lang === 'ar' ? 'ar-SY' : 'en-US')}</p>
              <p><span className="text-muted-foreground">{lang === 'ar' ? 'آخر تحديث: ' : 'Updated: '}</span>{new Date(details.updated_at).toLocaleString(lang === 'ar' ? 'ar-SY' : 'en-US')}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{lang === 'ar' ? 'تأكيد حذف المخبر' : 'Confirm Laboratory Deletion'}</DialogTitle>
            <DialogDescription>
              {lang === 'ar'
                ? `هل أنت متأكد من رغبتك في حذف مخبر "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? (lang === 'ar' ? 'جاري الحذف...' : 'Deleting...') : (lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaboratoriesPage;
