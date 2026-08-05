import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Calendar, Loader2, Inbox, ImageOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { AdminSchedule, useScheduleAdminActions } from '@/hooks/useScheduleAdminActions';
import { NamedOption, useCollegeLookups } from '@/hooks/students/useApiActions';
import { STUDY_YEARS } from '@/lib/constants';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';

const COLLEGE_ID = 1;
const PAGE_SIZE = 9;

const DoctorSchedulesPage: React.FC = () => {
  const { lang } = useLanguage();
  const { toast } = useToast();
  const {
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    loading,
  } = useScheduleAdminActions();
  const { fetchDepartments } = useCollegeLookups();

  const [data, setData] = useState<AdminSchedule[]>([]);
  const [departments, setDepartments] = useState<NamedOption[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ department_id: '', year_id: '' });
  const [createImage, setCreateImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<AdminSchedule | null>(null);
  const [editActive, setEditActive] = useState(true);
  const [editImage, setEditImage] = useState<File | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<AdminSchedule | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { page, setPage, totalPages, paginated } = usePagination(data, PAGE_SIZE);

  const loadSchedules = async () => {
    const result = await fetchSchedules();
    setData(result);
    setLoaded(true);
  };

  useEffect(() => {
    loadSchedules();
    fetchDepartments(COLLEGE_ID).then(setDepartments);
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

  const openCreate = () => {
    setCreateForm({ department_id: '', year_id: '' });
    setCreateImage(null);
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    if (!createForm.department_id || !createForm.year_id || !createImage) return;
    setSaving(true);
    const ok = await createSchedule(
      Number(createForm.department_id),
      Number(createForm.year_id),
      createImage,
    );
    setSaving(false);
    if (ok) {
      setCreateOpen(false);
      notifySuccess(lang === 'ar' ? 'تم إضافة الجدول بنجاح' : 'Schedule added successfully');
      await loadSchedules();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء إضافة الجدول' : 'Failed to add schedule');
    }
  };

  const openEdit = (s: AdminSchedule) => {
    setEditing(s);
    setEditActive(s.is_active);
    setEditImage(null);
  };

  const handleEditSave = async () => {
    if (!editing) return;
    setSaving(true);
    const ok = await updateSchedule(editing.id, editActive, editImage ?? undefined);
    setSaving(false);
    if (ok) {
      setEditing(null);
      notifySuccess(lang === 'ar' ? 'تم تعديل الجدول بنجاح' : 'Schedule updated successfully');
      await loadSchedules();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء تعديل الجدول' : 'Failed to update schedule');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const ok = await deleteSchedule(deleteTarget.id);
    setDeleting(false);
    if (ok) {
      setDeleteTarget(null);
      notifySuccess(lang === 'ar' ? 'تم حذف الجدول بنجاح' : 'Schedule deleted successfully');
      await loadSchedules();
    } else {
      notifyError(lang === 'ar' ? 'حدث خطأ أثناء حذف الجدول' : 'Failed to delete schedule');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          {lang === 'ar' ? 'جدولي' : 'My Schedules'}
        </h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 ml-1" />
          {lang === 'ar' ? 'إضافة جدول' : 'Add Schedule'}
        </Button>
      </div>

      {!loaded ? (
        <Loader2 className="animate-spin" />
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-10 h-10" />
          <p className="text-sm">{lang === 'ar' ? 'لا توجد جداول متاحة حالياً' : 'No schedules available yet'}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map(s => (
            <Card key={s.id} className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">{s.department.name}</h3>
                  <span className={s.is_active ? 'text-xs font-medium text-primary' : 'text-xs font-medium text-muted-foreground'}>
                    {s.is_active ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{s.year.name}</p>
                {s.image_url ? (
                  <img src={s.image_url} alt={s.department.name} className="w-full h-auto rounded-lg" />
                ) : (
                  <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground bg-muted/30 rounded-lg">
                    <ImageOff className="w-6 h-6" />
                  </div>
                )}
                <div className="flex gap-1 justify-end pt-1 border-t border-border">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(s)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader><DialogTitle>{lang === 'ar' ? 'إضافة جدول' : 'Add Schedule'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{lang === 'ar' ? 'القسم' : 'Department'}</Label>
              <Select value={createForm.department_id} onValueChange={v => setCreateForm(f => ({ ...f, department_id: v }))}>
                <SelectTrigger><SelectValue placeholder={lang === 'ar' ? 'اختر القسم' : 'Select Department'} /></SelectTrigger>
                <SelectContent>
                  {departments.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{lang === 'ar' ? 'السنة' : 'Year'}</Label>
              <Select value={createForm.year_id} onValueChange={v => setCreateForm(f => ({ ...f, year_id: v }))}>
                <SelectTrigger><SelectValue placeholder={lang === 'ar' ? 'اختر السنة' : 'Select Year'} /></SelectTrigger>
                <SelectContent>
                  {STUDY_YEARS.map(y => <SelectItem key={y.id} value={String(y.id)}>{y.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{lang === 'ar' ? 'صورة الجدول' : 'Schedule Image'}</Label>
              <Input type="file" accept="image/*" onChange={e => setCreateImage(e.target.files?.[0] ?? null)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={saving || loading}>
              {saving ? (lang === 'ar' ? 'جاري الإضافة...' : 'Adding...') : (lang === 'ar' ? 'إضافة' : 'Add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader><DialogTitle>{lang === 'ar' ? 'تعديل الجدول' : 'Edit Schedule'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{lang === 'ar' ? 'الحالة' : 'Status'}</Label>
              <Select value={editActive ? '1' : '0'} onValueChange={v => setEditActive(v === '1')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{lang === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                  <SelectItem value="0">{lang === 'ar' ? 'غير نشط' : 'Inactive'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{lang === 'ar' ? 'صورة جديدة (اختياري)' : 'New Image (optional)'}</Label>
              <Input type="file" accept="image/*" onChange={e => setEditImage(e.target.files?.[0] ?? null)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditSave} disabled={saving || loading}>
              {saving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'تحديث' : 'Update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>{lang === 'ar' ? 'تأكيد حذف الجدول' : 'Confirm Schedule Deletion'}</DialogTitle>
            <DialogDescription>
              {lang === 'ar'
                ? `هل أنت متأكد من رغبتك في حذف جدول "${deleteTarget?.department.name} - ${deleteTarget?.year.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deleteTarget?.department.name} - ${deleteTarget?.year.name}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? (lang === 'ar' ? 'جاري الحذف...' : 'Deleting...') : (lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorSchedulesPage;
