import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Building2, Loader2, Inbox } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { AdminDepartment, useDepartmentAdminActions } from '@/hooks/useDepartmentAdminActions';
import { AdminCollege, useCollegeAdminActions } from '@/hooks/useCollegeAdminActions';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const PAGE_SIZE = 10;

const DepartmentsPage: React.FC = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const {
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    loading,
  } = useDepartmentAdminActions();
  const { fetchColleges } = useCollegeAdminActions();

  const [data, setData] = useState<AdminDepartment[]>([]);
  const [colleges, setColleges] = useState<AdminCollege[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminDepartment | null>(null);
  const [form, setForm] = useState({ name: '', college_id: '' });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminDepartment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { page, setPage, totalPages, paginated } = usePagination(data, PAGE_SIZE);

  const loadDepartments = async () => {
    const result = await fetchDepartments();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadDepartments();
    fetchColleges().then(setColleges);
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

  const openCreate = () => { setEditing(null); setForm({ name: '', college_id: '' }); setDialogOpen(true); };
  const openEdit = (d: AdminDepartment) => { setEditing(d); setForm({ name: d.name, college_id: String(d.college_id) }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.college_id) return;
    setSaving(true);
    const ok = editing
      ? await updateDepartment(editing.id, form.name, Number(form.college_id))
      : await createDepartment(form.name, Number(form.college_id));
    setSaving(false);
    if (ok) {
      setDialogOpen(false);
      notifySuccess(
        editing
          ? (lang === 'ar' ? 'تم تعديل القسم بنجاح' : 'Department updated successfully')
          : (lang === 'ar' ? 'تم إضافة القسم بنجاح' : 'Department added successfully'),
      );
      await loadDepartments();
    } else {
      notifyError(
        editing
          ? (lang === 'ar' ? 'حدث خطأ أثناء تعديل القسم' : 'Failed to update department')
          : (lang === 'ar' ? 'حدث خطأ أثناء إضافة القسم' : 'Failed to add department'),
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteDepartment(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(lang === 'ar' ? 'تم حذف القسم بنجاح' : 'Department deleted successfully');
      await loadDepartments();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء حذف القسم' : 'Failed to delete department');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          {lang === 'ar' ? 'إدارة الأقسام' : 'Manage Departments'}
        </h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 ml-1" />
          {lang === 'ar' ? 'إضافة قسم' : 'Add Department'}
        </Button>
      </div>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{lang === 'ar' ? 'لا توجد أقسام متاحة حالياً' : 'No departments available yet'}</p>
        </div>
      ) : (
        <Card className="border-0 shadow-sm"><CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{lang === 'ar' ? 'اسم القسم' : 'Department Name'}</TableHead>
                <TableHead>{lang === 'ar' ? 'الكلية' : 'College'}</TableHead>
                <TableHead>{lang === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(d => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.college?.name ?? '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(d)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(d)}><Trash2 className="w-4 h-4" /></Button>
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
                ? (lang === 'ar' ? 'تعديل قسم' : 'Edit Department')
                : (lang === 'ar' ? 'إضافة قسم' : 'Add Department')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{lang === 'ar' ? 'اسم القسم' : 'Department Name'}</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>{lang === 'ar' ? 'الكلية' : 'College'}</Label>
              <Select value={form.college_id} onValueChange={v => setForm(f => ({ ...f, college_id: v }))}>
                <SelectTrigger><SelectValue placeholder={lang === 'ar' ? 'اختر الكلية' : 'Select College'} /></SelectTrigger>
                <SelectContent>
                  {colleges.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
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

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{lang === 'ar' ? 'تأكيد حذف القسم' : 'Confirm Department Deletion'}</DialogTitle>
            <DialogDescription>
              {lang === 'ar'
                ? `هل أنت متأكد من رغبتك في حذف قسم "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting
                ? (lang === 'ar' ? 'جاري الحذف...' : 'Deleting...')
                : (lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentsPage;
